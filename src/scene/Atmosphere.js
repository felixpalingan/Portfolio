import * as THREE from 'three';

/**
 * Atmosphere System for Cyberpunk Apartment (Phase 3)
 * Handles floating dust motes/particles, subtle volumetric window light beams,
 * and ambient atmospheric micro-animations.
 */
export class Atmosphere {
  constructor() {
    this.group = new THREE.Group();
    this.animatedObjects = [];

    this.createDustParticles();
    this.createVolumetricWindowLight();
  }

  /**
   * Generates a circular glowing particle texture via Canvas
   */
  createParticleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.3, 'rgba(220, 240, 255, 0.8)');
    grad.addColorStop(0.6, 'rgba(120, 180, 255, 0.25)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Creates 380 subtle luminous dust particles drifting through the apartment air
   */
  createDustParticles() {
    const count = 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count * 3);

    // Room boundaries: X [-4.2, 4.2], Y [0.15, 2.75], Z [-3.2, 3.2]
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const px = (Math.random() - 0.5) * 8.0;
      const py = 0.15 + Math.random() * 2.5;
      const pz = (Math.random() - 0.5) * 6.0;

      positions[idx] = px;
      positions[idx + 1] = py;
      positions[idx + 2] = pz;

      // Color tints based on room zone:
      // Near lounge (X > 1.0, Z < 0): Slight neon green / warm tint
      // Near window (Z < -1.5): Cool cyan / ice white
      // Near bed / desk: Warm amber / soft cyan
      let c = new THREE.Color();
      if (px > 1.2 && pz < -0.4) {
        c.setHSL(0.35 + Math.random() * 0.05, 0.8, 0.75); // Neon green tint
      } else if (pz < -1.5) {
        c.setHSL(0.55 + Math.random() * 0.05, 0.6, 0.85); // Window cool cyan/white
      } else if (px < -1.5 && pz < -1.0) {
        c.setHSL(0.08 + Math.random() * 0.04, 0.8, 0.7); // Sleeping pod warm amber
      } else {
        c.setHSL(0.52 + Math.random() * 0.1, 0.4, 0.8); // Neutral cool cyan
      }

      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[idx] = (Math.random() - 0.5) * 0.003;
      speeds[idx + 1] = 0.0008 + Math.random() * 0.0015; // Gentle upward thermal drift
      speeds[idx + 2] = (Math.random() - 0.5) * 0.003;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      map: this.createParticleTexture(),
      transparent: true,
      opacity: 0.55,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    this.group.add(particles);

    // Update loop for dust particle physics
    this.animatedObjects.push({
      update: (time) => {
        const posAttr = geometry.attributes.position;
        const array = posAttr.array;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const phase = phases[i];

          // Gentle thermal drift + sinusoidal floating motion
          array[idx] += speeds[idx] + Math.sin(time * 0.8 + phase) * 0.0006;
          array[idx + 1] += speeds[idx + 1] + Math.cos(time * 0.6 + phase) * 0.0004;
          array[idx + 2] += speeds[idx + 2] + Math.sin(time * 0.7 + phase * 1.5) * 0.0006;

          // Wrap bounds when particles rise to ceiling or drift past walls
          if (array[idx + 1] > 2.8) {
            array[idx + 1] = 0.15;
            array[idx] = (Math.random() - 0.5) * 8.0;
            array[idx + 2] = (Math.random() - 0.5) * 6.0;
          }
          if (array[idx] < -4.2) array[idx] = 4.2;
          if (array[idx] > 4.2) array[idx] = -4.2;
          if (array[idx + 2] < -3.2) array[idx + 2] = 3.2;
          if (array[idx + 2] > 3.2) array[idx + 2] = -3.2;
        }

        posAttr.needsUpdate = true;
      }
    });
  }

  /**
   * Subtle volumetric light shaft streaming inward from the frameless panoramic window
   */
  createVolumetricWindowLight() {
    // Volumetric gradient canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, 'rgba(160, 220, 255, 0.45)');
    grad.addColorStop(0.25, 'rgba(100, 190, 255, 0.22)');
    grad.addColorStop(0.7, 'rgba(40, 120, 220, 0.06)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    const shaftTexture = new THREE.CanvasTexture(canvas);

    // Trapezoidal beam angled from window downwards across the apartment floor
    const beamGeo = new THREE.PlaneGeometry(3.6, 4.8);
    const beamMat = new THREE.MeshBasicMaterial({
      map: shaftTexture,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Angle the beam from the window (z = -3.5, y = 1.8) down towards the floor (z = 0.5, y = 0.2)
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0.15, 1.25, -1.6);
    beam.rotation.x = Math.PI * 0.36; // Angled down towards room center
    this.group.add(beam);

    // Cross beam for realistic 3D volumetric feel from oblique angles
    const beam2 = new THREE.Mesh(beamGeo, beamMat);
    beam2.position.set(0.15, 1.25, -1.6);
    beam2.rotation.x = Math.PI * 0.36;
    beam2.rotation.y = 0.12;
    this.group.add(beam2);

    // Gentle pulsing of the window light beam
    this.animatedObjects.push({
      update: (time) => {
        const pulse = 0.16 + Math.sin(time * 0.7) * 0.03;
        beamMat.opacity = pulse;
      }
    });
  }

  /**
   * Main animation tick
   */
  update(time) {
    for (let i = 0; i < this.animatedObjects.length; i++) {
      this.animatedObjects[i].update(time);
    }
  }
}
