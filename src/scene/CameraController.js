import * as THREE from 'three';
import gsap from 'gsap';

/**
 * CameraController (Phase 4 - Cinematic Camera System & Navigation)
 * Manages camera anchors, smooth GSAP transitions, lookAt interpolation,
 * and responsive mouse parallax.
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
        ease: 'power3.inOut'
      },
      PROJECTS: {
        name: 'PROJECTS',
        label: 'NETRUNNER WORKSTATION // PROJECTS',
        // Positioned in front of the reversed desk, looking straight into the ultrawide terminal
        position: new THREE.Vector3(-3.1, 1.25, 0.45),
        target: new THREE.Vector3(-3.1, 1.15, 1.5),
        duration: 2.0,
        ease: 'power3.inOut'
      },
      STATS: {
        name: 'STATS',
        label: 'SUNKEN LOUNGE // OPERATIVE STATS',
        // Inside the lounge arena, framing the couch, coffee table & 360 green marquee
        position: new THREE.Vector3(1.6, 1.05, -0.6),
        target: new THREE.Vector3(3.05, 0.75, -2.05),
        duration: 1.9,
        ease: 'power3.inOut'
      },
      CONTACT: {
        name: 'CONTACT',
        label: 'PANORAMIC APEX // NIGHT CITY COMMS',
        // Frameless panoramic window overlooking the Night City skyline
        position: new THREE.Vector3(0.15, 1.65, -1.0),
        target: new THREE.Vector3(0.15, 1.8, -4.5),
        duration: 1.8,
        ease: 'power3.inOut'
      }
    };

    // Callback handlers for UI integration
    this.onTransitionStart = null;
    this.onTransitionComplete = null;
  }

  /**
   * Smoothly navigates the camera to a named anchor
   */
  moveTo(anchorName) {
    const anchor = this.anchors[anchorName.toUpperCase()];
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

    // Kill any running camera tweens
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.target);

    const duration = this.prefersReducedMotion ? 0.2 : anchor.duration;

    // Transition target lookAt point
    gsap.to(this.target, {
      x: anchor.target.x,
      y: anchor.target.y,
      z: anchor.target.z,
      duration: duration,
      ease: anchor.ease
    });

    // Transition camera position
    gsap.to(this.camera.position, {
      x: anchor.position.x,
      y: anchor.position.y,
      z: anchor.position.z,
      duration: duration,
      ease: anchor.ease,
      onUpdate: () => {
        this.camera.lookAt(this.target);
      },
      onComplete: () => {
        this.isTransitioning = false;
        this.basePosition.copy(anchor.position);
        this.baseTarget.copy(anchor.target);
        this.camera.lookAt(this.target);

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
   * Per-frame camera update with subtle organic parallax
   */
  update() {
    if (this.isTransitioning) {
      // During active tween, gsap controls lookAt directly
      this.camera.lookAt(this.target);
      return;
    }

    // Subtle parallax responsive to mouse movement
    const parallaxIntensity = this.currentAnchor === 'HOME' ? 0.25 : 0.08;
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
