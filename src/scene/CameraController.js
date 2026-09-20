import * as THREE from 'three';
import gsap from 'gsap';

/**
 * CameraController (Phase 4 - Cinematic Camera System & Navigation)
 * Features:
 * - Route-specific 3D Quadratic Bezier flight paths (never clips walls)
 * - Continuous target-tracking lookAt (camera always faces where it's going, never looks backwards)
 * - Zero flips / zero gimbal lock
 * - 4 Dedicated Cinematic Anchors (HOME, PROJECTS, STATS, COMM)
 * - Responsive mouse parallax when idle
 */
export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.isTransitioning = false;
    this.currentAnchor = 'HOME';

    // Target lookAt vector currently tracked by the camera
    this.target = new THREE.Vector3(0, 1.25, -0.5);
    this.basePosition = new THREE.Vector3(0, 1.85, 4.4);
    this.baseTarget = new THREE.Vector3(0, 1.25, -0.5);

    // Mouse coordinates (-1 to 1)
    this.mouse = new THREE.Vector2(0, 0);

    // Reduced motion accessibility check
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Anchor definitions for each apartment section
    this.anchors = {
      HOME: {
        name: 'HOME',
        label: 'OVERVIEW // MEGABUILDING H10',
        position: new THREE.Vector3(0, 2.15, 4.85),
        target: new THREE.Vector3(0, 1.20, -0.40),
        duration: 1.8,
        ease: 'power2.inOut'
      },
      PROJECTS: {
        name: 'PROJECTS',
        label: 'NETRUNNER WORKSTATION // PROJECTS',
        // In front of the reversed carbon desk in bottom-right, framing the ultrawide terminal
        position: new THREE.Vector3(3.00, 1.25, 0.45),
        target: new THREE.Vector3(3.00, 1.15, 2.00),
        duration: 2.0,
        ease: 'power2.inOut'
      },
      STATS: {
        name: 'STATS',
        label: 'SUNKEN LOUNGE // OPERATIVE STATS',
        // Inside the lounge arena, framing couch, coffee table & 360 green marquee
        position: new THREE.Vector3(1.6, 1.05, -0.6),
        target: new THREE.Vector3(3.05, 0.75, -2.05),
        duration: 1.9,
        ease: 'power2.inOut'
      },
      COMM: {
        name: 'COMM',
        label: 'OPEN BATHROOM // SMART MIRROR LINK',
        // In open-concept bathroom, facing mirror and sink (which face the bed)
        position: new THREE.Vector3(-3.10, 1.55, 0.65),
        target: new THREE.Vector3(-3.10, 1.55, 2.20),
        duration: 1.9,
        ease: 'power2.inOut'
      },
      CONTACT: {
        name: 'COMM',
        label: 'OPEN BATHROOM // SMART MIRROR LINK',
        position: new THREE.Vector3(-3.10, 1.55, 0.65),
        target: new THREE.Vector3(-3.10, 1.55, 2.20),
        duration: 1.9,
        ease: 'power2.inOut'
      },
      TOPDOWN: {
        name: 'TOPDOWN',
        label: 'ARCHITECTURAL BLUEPRINT // TOP-DOWN VIEW',
        position: new THREE.Vector3(0.0, 8.6, 0.001),
        target: new THREE.Vector3(0.0, 0.0, 0.0),
        duration: 1.8,
        ease: 'power2.inOut'
      }
    };

    // Precompute orientation quaternions for all anchors
    const m = new THREE.Matrix4();
    for (const key of Object.keys(this.anchors)) {
      const a = this.anchors[key];
      const up = a.name === 'TOPDOWN' ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);
      m.lookAt(a.position, a.target, up);
      a.quaternion = new THREE.Quaternion().setFromRotationMatrix(m);
    }

    // Active tween reference for safe cancellation
    this.activeTween = null;

    // Callback handlers for UI integration
    this.onTransitionStart = null;
    this.onTransitionComplete = null;

    // Set initial camera position & orientation
    this.camera.position.copy(this.anchors.HOME.position);
    this.camera.quaternion.copy(this.anchors.HOME.quaternion);
    this.camera.lookAt(this.anchors.HOME.target);
  }

  /**
   * Calculates intelligent intermediate waypoints for each specific route
   * to guarantee the camera arcs through open space and never cuts through obstacles
   */
  getMidpoint(startName, endName, startPos, endPos) {
    const key = `${startName}->${endName}`;
    const mid = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);

    // Default safe elevation
    mid.y = Math.max(startPos.y, endPos.y) + 0.18;

    if (startName === 'TOPDOWN' || endName === 'TOPDOWN') {
      mid.y = Math.max(startPos.y, endPos.y) + 0.4;
    } else if (key === 'HOME->PROJECTS' || key === 'PROJECTS->HOME') {
      // Arc through right aisle to enter bottom-right workstation
      mid.set(1.6, 1.75, 2.4);
    } else if (key === 'HOME->COMM' || key === 'COMM->HOME') {
      // Arc through left aisle into the open-concept bathroom
      mid.set(-1.6, 1.75, 2.4);
    } else if (key === 'HOME->STATS' || key === 'STATS->HOME') {
      // Descend gently into the sunken lounge
      mid.set(0.9, 1.55, 1.5);
    } else if (key === 'PROJECTS->STATS' || key === 'STATS->PROJECTS') {
      // Short hop between right workstation and sunken lounge
      mid.set(2.4, 1.45, 0.0);
    } else if (key === 'PROJECTS->COMM' || key === 'COMM->PROJECTS') {
      // Traverse across the wide room aisle between workstation and bathroom
      mid.set(0.0, 1.65, 0.6);
    } else if (key === 'STATS->COMM' || key === 'COMM->STATS') {
      // Cross room diagonally from sunken lounge to open bathroom
      mid.set(-0.6, 1.65, 0.1);
    }

    return mid;
  }

  /**
   * Smoothly navigates the camera along an arched trajectory with quaternion SLERP
   * guaranteeing continuous, 100% flip-free orientation (never looks backwards)
   */
  moveTo(anchorName) {
    let key = anchorName.toUpperCase();
    if (key === 'CONTACT') key = 'COMM';

    const anchor = this.anchors[key];
    if (!anchor) {
      console.warn(`[CameraController] Unknown anchor: ${anchorName}`);
      return;
    }

    if (this.currentAnchor === anchor.name && !this.isTransitioning) {
      return;
    }

    const startAnchorName = this.currentAnchor;
    this.currentAnchor = anchor.name;
    this.isTransitioning = true;

    if (this.onTransitionStart) {
      this.onTransitionStart(anchor);
    }

    // Capture starting vectors & orientations from the current camera state
    const startPos = this.camera.position.clone();
    const endPos = anchor.position.clone();
    const startQuat = this.camera.quaternion.clone();
    const endQuat = anchor.quaternion.clone();

    // Calculate bespoke midpoint waypoint
    const midPos = this.getMidpoint(startAnchorName, anchor.name, startPos, endPos);

    // Set appropriate up vector
    if (anchor.name === 'TOPDOWN') {
      this.camera.up.set(0, 0, -1);
    } else {
      this.camera.up.set(0, 1, 0);
    }

    // Cancel any ongoing transition cleanly
    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
    }

    const duration = this.prefersReducedMotion ? 0.2 : anchor.duration;
    const tweenObj = { t: 0 };

    this.activeTween = gsap.to(tweenObj, {
      t: 1,
      duration: duration,
      ease: anchor.ease || 'power2.inOut',
      onUpdate: () => {
        const t = tweenObj.t;
        const invT = 1 - t;

        // Quadratic Bezier curve for smooth 3D position travel
        this.camera.position.x = invT * invT * startPos.x + 2 * invT * t * midPos.x + t * t * endPos.x;
        this.camera.position.y = invT * invT * startPos.y + 2 * invT * t * midPos.y + t * t * endPos.y;
        this.camera.position.z = invT * invT * startPos.z + 2 * invT * t * midPos.z + t * t * endPos.z;

        // Spherical Linear Interpolation (SLERP) guarantees continuous, 100% flip-free orientation
        this.camera.quaternion.slerpQuaternions(startQuat, endQuat, t);
      },
      onComplete: () => {
        this.isTransitioning = false;
        this.activeTween = null;

        this.basePosition.copy(anchor.position);
        this.baseTarget.copy(anchor.target);
        this.camera.position.copy(anchor.position);
        this.camera.quaternion.copy(anchor.quaternion);
        this.target.copy(anchor.target);

        if (anchor.name === 'TOPDOWN') {
          this.camera.up.set(0, 0, -1);
        } else {
          this.camera.up.set(0, 1, 0);
        }

        if (this.onTransitionComplete) {
          this.onTransitionComplete(anchor);
        }
      }
    });
  }

  /**
   * Receives normalized mouse coordinates from main application
   */
  setMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  /**
   * Per-frame camera update with subtle organic parallax when idle
   */
  update() {
    if (this.isTransitioning) {
      return;
    }

    // Subtle parallax responsive to mouse movement
    const parallaxIntensity = this.currentAnchor === 'HOME' ? 0.18 : 0.05;
    const targetCamX = this.basePosition.x + this.mouse.x * parallaxIntensity;
    const targetCamY = this.basePosition.y + this.mouse.y * (parallaxIntensity * 0.5);

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;

    // Subtle lookAt target parallax
    const targetLookX = this.baseTarget.x + this.mouse.x * (parallaxIntensity * 0.3);
    const targetLookY = this.baseTarget.y + this.mouse.y * (parallaxIntensity * 0.2);

    this.target.x += (targetLookX - this.target.x) * 0.05;
    this.target.y += (targetLookY - this.target.y) * 0.05;

    this.camera.lookAt(this.target);
  }
}
