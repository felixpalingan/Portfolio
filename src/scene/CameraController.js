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
    this.target = new THREE.Vector3(0, 1.15, -0.35);
    this.basePosition = new THREE.Vector3(0, 1.95, 3.65);
    this.baseTarget = new THREE.Vector3(0, 1.15, -0.35);

    // Mouse coordinates (-1 to 1)
    this.mouse = new THREE.Vector2(0, 0);

    // Reduced motion accessibility check
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Anchor definitions for each apartment section
    this.anchors = {
      HOME: {
        name: 'HOME',
        label: 'OVERVIEW // MEGABUILDING H10',
        // Brought forward to 3.65m so the extreme outer wall edges are cropped naturally
        position: new THREE.Vector3(0, 1.95, 3.65),
        target: new THREE.Vector3(0, 1.15, -0.35),
        duration: 1.8,
        ease: 'power2.inOut'
      },
      PROJECTS: {
        name: 'PROJECTS',
        label: 'NETRUNNER WORKSTATION // PROJECTS',
        // Moved back slightly (Z = 1.28m, ~79cm from screens) for optimal framing of screens, action links, and desk pad
        position: new THREE.Vector3(3.00, 1.22, 1.28),
        target: new THREE.Vector3(3.00, 1.16, 2.068),
        duration: 1.9,
        ease: 'power2.inOut'
      },
      STATS: {
        name: 'STATS',
        label: 'SUNKEN LOUNGE // BRAINDANCE & STATS',
        // Seated on lounge couch directly at Braindance station, facing coffee table & 360 display
        position: new THREE.Vector3(2.70, 0.72, -2.80),
        target: new THREE.Vector3(2.95, 0.48, -1.80),
        duration: 1.8,
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

    // Precompute orientation quaternions and store base vectors for all anchors
    const m = new THREE.Matrix4();
    for (const key of Object.keys(this.anchors)) {
      const a = this.anchors[key];
      a.basePosition = a.position.clone();
      a.baseTarget = a.target.clone();
      const up = a.name === 'TOPDOWN' ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);
      m.lookAt(a.position, a.target, up);
      a.quaternion = new THREE.Quaternion().setFromRotationMatrix(m);
    }

    // Active tween reference for safe cancellation
    this.activeTween = null;
    this.targetTween = null;
    this.isTrackingTarget = false;

    // Callback handlers for UI integration
    this.onTransitionStart = null;
    this.onTransitionComplete = null;

    // Set initial camera position & orientation dynamically adapted to screen aspect ratio
    const initialHome = this.getAdjustedAnchor('HOME');
    this.camera.position.copy(initialHome.position);
    this.camera.quaternion.copy(initialHome.quaternion);
    this.camera.lookAt(initialHome.target);
    this.basePosition.copy(initialHome.position);
    this.baseTarget.copy(initialHome.target);
  }

  /**
   * Calculates aspect ratio distance multiplier.
   * On narrower screens (laptops, tablets, mobile portrait), pushes camera back
   * proportionally to preserve horizontal framing and keep all monitors in view.
   */
  getAspectScale(anchorName) {
    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    const baseAspect = 16 / 9; // ~1.778
    if (aspect >= baseAspect) {
      return 1.0;
    }
    const rawRatio = baseAspect / aspect;
    if (anchorName === 'PROJECTS') {
      // Allows camera to smoothly pull back on narrower viewports up to 2.1x distance
      return Math.min(2.1, Math.max(1.0, rawRatio));
    }
    return Math.min(1.5, Math.max(1.0, rawRatio));
  }

  /**
   * Returns anchor with camera position dynamically adjusted for current aspect ratio
   */
  getAdjustedAnchor(anchorName) {
    let key = anchorName.toUpperCase();
    if (key === 'CONTACT') key = 'COMM';
    const a = this.anchors[key];
    if (!a) return null;

    if (a.name === 'TOPDOWN') return a;

    const scale = this.getAspectScale(a.name);
    const dir = new THREE.Vector3().subVectors(a.basePosition, a.baseTarget);
    const pos = new THREE.Vector3().copy(a.baseTarget).addScaledVector(dir, scale);

    const m = new THREE.Matrix4();
    m.lookAt(pos, a.baseTarget, new THREE.Vector3(0, 1, 0));
    const quat = new THREE.Quaternion().setFromRotationMatrix(m);

    return {
      ...a,
      position: pos,
      target: a.baseTarget.clone(),
      quaternion: quat
    };
  }

  /**
   * Called on window resize to immediately adapt camera distance to new screen aspect ratio
   */
  handleResize() {
    if (this.isTransitioning) return;
    const adjusted = this.getAdjustedAnchor(this.currentAnchor);
    if (!adjusted) return;

    this.basePosition.copy(adjusted.position);
    this.baseTarget.copy(adjusted.target);
    this.camera.position.copy(adjusted.position);
    this.camera.quaternion.copy(adjusted.quaternion);
    this.target.copy(adjusted.target);
    this.camera.lookAt(this.target);
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
      mid.set(1.9, 1.65, 2.2);
    } else if (key === 'HOME->COMM' || key === 'COMM->HOME') {
      // Arc through left aisle into the open-concept bathroom
      mid.set(-1.6, 1.75, 2.1);
    } else if (key === 'HOME->STATS' || key === 'STATS->HOME') {
      // Descend gently into the sunken lounge
      mid.set(0.8, 1.55, 1.4);
    } else if (key === 'PROJECTS->STATS' || key === 'STATS->PROJECTS') {
      // Short hop between right workstation and sunken lounge
      mid.set(2.4, 1.45, 0.4);
    } else if (key === 'PROJECTS->COMM' || key === 'COMM->PROJECTS') {
      // Traverse across the wide room aisle between workstation and bathroom
      mid.set(0.0, 1.65, 0.9);
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

    const anchor = this.getAdjustedAnchor(key);
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
    if (this.targetTween) {
      this.targetTween.kill();
      this.targetTween = null;
      this.isTrackingTarget = false;
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
   * Smoothly animates the camera lookAt target (e.g. tracking descending VR headset)
   */
  animateTarget(newTarget, duration = 1.0, ease = 'power2.inOut', onComplete = null) {
    if (this.targetTween) {
      this.targetTween.kill();
      this.targetTween = null;
    }
    this.isTrackingTarget = true;
    this.targetTween = gsap.to(this.baseTarget, {
      x: newTarget.x,
      y: newTarget.y,
      z: newTarget.z,
      duration: this.prefersReducedMotion ? 0.1 : duration,
      ease,
      onUpdate: () => {
        this.target.copy(this.baseTarget);
        this.camera.lookAt(this.target);
      },
      onComplete: () => {
        this.targetTween = null;
        this.isTrackingTarget = false;
        if (onComplete) onComplete();
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

    if (this.isTrackingTarget) {
      this.camera.lookAt(this.target);
      return;
    }

    // Subtle parallax responsive to mouse movement (higher in PROJECTS to look across triple screens)
    const parallaxIntensity = this.currentAnchor === 'HOME' ? 0.18 : (this.currentAnchor === 'PROJECTS' ? 0.16 : 0.05);
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
