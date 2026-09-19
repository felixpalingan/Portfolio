import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { portfolioData } from './data/portfolioData.js';
import { ApartmentRoom } from './scene/ApartmentRoom.js';

class App {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.loadingScreen = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('progress-bar');
    this.loadingStatus = document.getElementById('loading-status');

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initRoom();
    this.initEvents();
    this.initLoadingSequence();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07080c);
    this.scene.fog = new THREE.FogExp2(0x07080c, 0.035);
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 100);
    // HOME Anchor: Wide establishing shot looking into the apartment
    this.camera.position.set(0, 1.85, 4.4);
    this.camera.lookAt(0, 1.25, -0.5);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initLights() {
    // Ambient light - dark cyberpunk base
    const ambientLight = new THREE.AmbientLight(0x1a1622, 1.4);
    this.scene.add(ambientLight);

    // Warm ceiling interior bounce light (simulating apartment lamps)
    const interiorLight = new THREE.PointLight(0xffa24c, 2.2, 10, 1.2);
    interiorLight.position.set(-1.0, 2.8, 0.5);
    interiorLight.castShadow = true;
    this.scene.add(interiorLight);

    // Subtle cool fill from opposite side
    const fillLight = new THREE.PointLight(0x00d4ff, 1.2, 8, 1.4);
    fillLight.position.set(2.5, 2.2, 1.0);
    this.scene.add(fillLight);
  }

  initRoom() {
    this.room = new ApartmentRoom();
    this.scene.add(this.room.group);
  }

  initEvents() {
    window.addEventListener('resize', () => this.onResize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  initLoadingSequence() {
    let currentStep = 0;
    const steps = [
      { p: 25, label: "CALIBRATING ROOM SHELL MATRIX [25%]" },
      { p: 60, label: "COMPUTING HEXAGONAL TILE SHADERS [60%]" },
      { p: 85, label: "SYNCHRONIZING NIGHT CITY SKYLINE [85%]" },
      { p: 100, label: "MEGABUILDING H10 INITIALIZED [100%]" }
    ];

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        this.progressBar.style.width = `${step.p}%`;
        this.loadingStatus.textContent = step.label;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              this.loadingScreen.classList.add('fade-out');
            }
          });
        }, 250);
      }
    }, 150);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Subtle responsive camera parallax
    const targetX = this.mouse.x * 0.35;
    const targetY = 1.85 + this.mouse.y * 0.15;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.04;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 1.25, -0.5);

    this.renderer.render(this.scene, this.camera);
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
