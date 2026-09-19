import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { portfolioData } from './data/portfolioData.js';

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
    this.initPhase0Placeholder();
    this.initEvents();
    this.initLoadingSequence();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Cyberpunk ambient fog
    this.scene.background = new THREE.Color(0x07080c);
    this.scene.fog = new THREE.FogExp2(0x07080c, 0.045);
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    // Initial camera position for Phase 0 (Wide establishing view)
    this.camera.position.set(0, 2.2, 5.5);
    this.camera.lookAt(0, 1.0, 0);
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
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initLights() {
    // Ambient light - dim cyberpunk atmosphere
    const ambientLight = new THREE.AmbientLight(0x181a26, 1.2);
    this.scene.add(ambientLight);

    // Directional light - simulating cool Night City skyline light
    const dirLight = new THREE.DirectionalLight(0x00F0FF, 1.5);
    dirLight.position.set(5, 8, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    // Warm accent light - warm neon orange
    const orangeLight = new THREE.PointLight(0xFCEE09, 3.0, 15);
    orangeLight.position.set(-3, 2, 2);
    this.scene.add(orangeLight);
  }

  initPhase0Placeholder() {
    // Phase 0 visual test: holographic tech grid and placeholder core
    this.placeholderGroup = new THREE.Group();

    // Floor grid
    const gridHelper = new THREE.GridHelper(16, 16, 0x00F0FF, 0x1f263b);
    gridHelper.position.y = 0;
    this.placeholderGroup.add(gridHelper);

    // Center holographic monolith
    const geometry = new THREE.BoxGeometry(1.2, 1.8, 1.2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a101d,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.2
    });
    this.centerMesh = new THREE.Mesh(geometry, material);
    this.centerMesh.position.y = 1.0;
    this.centerMesh.castShadow = true;
    this.placeholderGroup.add(this.centerMesh);

    // Glowing wireframe cage
    const wireframeGeo = new THREE.BoxGeometry(1.4, 2.0, 1.4);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xFCEE09,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.wireMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    this.wireMesh.position.y = 1.0;
    this.placeholderGroup.add(this.wireMesh);

    this.scene.add(this.placeholderGroup);
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
    // Simulated asset load progress
    let progress = 0;
    const steps = [
      { p: 25, label: "MOUNTING NEURAL INTERFACE [25%]" },
      { p: 60, label: "INITIALIZING THREE.JS WEBGL PIPELINE [60%]" },
      { p: 90, label: "LOADING APARTMENT MATRIX // WATSON DISTRICT [90%]" },
      { p: 100, label: "NEURAL LINK ESTABLISHED [100%]" }
    ];

    let currentStep = 0;
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
        }, 300);
      }
    }, 180);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Subtle idle animation on placeholder
    if (this.centerMesh) {
      this.centerMesh.rotation.y = elapsedTime * 0.3;
      this.wireMesh.rotation.y = -elapsedTime * 0.2;
      this.centerMesh.position.y = 1.0 + Math.sin(elapsedTime * 1.5) * 0.05;
      this.wireMesh.position.y = 1.0 + Math.sin(elapsedTime * 1.5) * 0.05;
    }

    // Gentle camera parallax from mouse movement
    this.camera.position.x += (this.mouse.x * 0.4 - this.camera.position.x) * 0.05;
    this.camera.position.y += (2.2 + this.mouse.y * 0.2 - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 1.0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
