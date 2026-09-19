import * as THREE from 'three';
import gsap from 'gsap';

/**
 * CameraController (Phase 4 - Cinematic Camera System & Navigation)
 * Features:
 * - Arched 3D Quadratic Bezier flight paths for spatial clearance
 * - Quaternion SLERP for 100% flip-free, gimbal-lock-free cinematic rotations
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
        position: new THREE.Vector3(0, 1.85, 4.4),
        target: new THREE.Vector3(0, 1.25, -0.5),
        duration: 1.8,
        ease: 'power2.inOut'
      },
      PROJECTS: {
        name: 'PROJECTS',
        label: 'NETRUNNER WORKSTATION // PROJECTS',
        // In front of the reversed carbon desk on the bed side, framing the ultrawide terminal
        position: new THREE.Vector3(-3.1, 1.25, 0.45),
        target: new THREE.Vector3(-3.1, 1.15, 1.5),
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
        label: 'SMART MIRROR // BIOMETRIC COMM LINK',
        // In front of the bathroom smart mirror, eye-level facing the mirror on left wall
        position: new THREE.Vector3(-3.25, 1.48, 0.0),
        target: new THREE.Vector3(-4.45, 1.48, 0.0),
        duration: 1.9,
        ease: 'power2.inOut'
      },
      // Alias CONTACT to COMM for backwards compatibility
      CONTACT: {
        name: 'COMM',
        label: 'SMART MIRROR // BIOMETRIC COMM LINK',
        position: new THREE.Vector3(-3.25, 1.48, 0.0),
        target: new THREE.Vector3(-4.45, 1.48, 0.0),
        duration: 1.9,
        ease: 'power2.inOut'
      }
    };

    // Callback handlers for UI integration
    this.onTransitionStart = null;
    this.onTransitionComplete = null;

    // Set initial camera position & orientation
    this.camera.position.copy(this.anchors.HOME.position);
    this.camera.lookAt(this.anchors.HOME.target);
  }

  /**
   * Smoothly navigates the camera along an arched trajectory with Quaternion SLERP
   * (Guaranteed zero gimbal flips, zero sudden swivels)
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

    this.currentAnchor = anchor.name;
    this.isTransitioning = true;

    if (this.onTransitionStart) {
      this.onTransitionStart(anchor);
    }

    // Capture starting state
    const startPos = this.camera.position.clone();
    const endPos = anchor.position.clone();
    const startRot = this.camera.quaternion.clone();

    // Compute target end orientation via dummy object
    const dummy = new THREE.Object3D();
    dummy.position.copy(endPos);
    dummy.lookAt(anchor.target);
    const endRot = dummy.quaternion.clone();

    // Target lookAt interpolation
    const startTarget = this.target.clone();
    const endTarget = anchor.target.clone();

    // Calculate smart clearance waypoint (midPos) for arched cinematic flight
    const midPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
    
    // Elevate slightly above furniture so camera glides gracefully over obstacles
    const maxElevation = Math.max(startPos.y, endPos.y, 1.75);
    midPos.y = maxElevation + 0.2;

    // If moving into/out of corner areas (workstation / toilet / lounge),
    // arc through the central open room aisle to prevent clipping partitions
    if (startPos.x < -1.8 || endPos.x < -1.8) {
      midPos.x = Math.max(midPos.x, -1.4);
    }
    if (startPos.z < -1.0 || endPos.z < -1.0) {
      midPos.z = Math.max(midPos.z, 0.4);
    }

    // Kill previous camera tweens
    gsap.killTweensOf(this);

    const duration = this.prefersReducedMotion ? 0.2 : anchor.duration;
    const tweenData = { t: 0 };

    gsap.to(tweenData, {
      t: 1,
      duration: duration,
      ease: anchor.ease,
      onUpdate: () => {
        const t = tweenData.t;
        const invT = 1 - t;

        // Quadratic Bezier curve for position: B(t) = (1-t)^2 * P0 + 2(1-t)t * Pmid + t^2 * P1
        this.camera.position.x = invT * invT * startPos.x + 2 * invT * t * midPos.x + t * t * endPos.x;
        this.camera.position.y = invT * invT * startPos.y + 2 * invT * t * midPos.y + t * t * endPos.y;
        this.camera.position.z = invT * invT * startPos.z + 2 * invT * t * midPos.z + t * t * endPos.z;

        // Quaternion SLERP: Guaranteed continuous, shortest-arc spherical rotation (NEVER FLIPS)
        this.camera.quaternion.slerpQuaternions(startRot, endRot, t);

        // Interpolate target point alongside for seamless parallax handoff
        this.target.lerpVectors(startTarget, endTarget, t);
      },
      onComplete: () => {
        this.isTransitioning = false;
        this.basePosition.copy(anchor.position);
        this.baseTarget.copy(anchor.target);
        this.camera.position.copy(anchor.position);
        this.camera.quaternion.copy(endRot);
        this.target.copy(anchor.target);

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
      // During active tween, GSAP controls position & quaternion directly
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
