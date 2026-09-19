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

    try {
      console.log("[CYBERPUNK] Booting Megabuilding H10 matrix...");
      this.updateProgress(20, "INITIALIZING WEBGL 3D PIPELINE [20%]");
      
      this.initScene();
      this.initCamera();
      this.initRenderer();
      this.initLights();

      this.updateProgress(60, "GENERATING APARTMENT GEOMETRY [60%]");
      this.initRoom();

      this.updateProgress(85, "CONNECTING NIGHT CITY SKYLINE [85%]");
      this.initEvents();

      this.updateProgress(100, "NEURAL LINK ESTABLISHED [100%]");
      this.finishLoading();

      this.animate();
    } catch (err) {
      console.error("[CYBERPUNK CRITICAL ERROR]", err);
      if (this.loadingStatus) {
        this.loadingStatus.innerHTML = `<span style="color:#FF003C;font-weight:bold;">SYSTEM FAULT: ${err.message}</span>`;
      }
    }
  }

  updateProgress(percent, label) {
    if (this.progressBar) this.progressBar.style.width = `${percent}%`;
    if (this.loadingStatus) this.loadingStatus.textContent = label;
  }

  finishLoading() {
    setTimeout(() => {
      if (this.loadingScreen) {
        gsap.to(this.loadingScreen, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            this.loadingScreen.classList.add('fade-out');
            this.loadingScreen.style.display = 'none';
          }
        });
      }
    }, 350);
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
    // Dim atmospheric Cyberpunk base ambient
    const ambientLight = new THREE.AmbientLight(0x0e1322, 1.1);
    this.scene.add(ambientLight);

    // Primary apartment light source: Cool neon inward stream (balanced, 30% brighter)
    const windowStreamLight = new THREE.DirectionalLight(0xdcf0ff, 0.18);
    windowStreamLight.position.set(0.15, 2.4, -4.6);
    windowStreamLight.target.position.set(0.15, 0.5, 0.5);
    this.scene.add(windowStreamLight);
    this.scene.add(windowStreamLight.target);

    // Window neon spill onto the apartment floor
    const windowSpillLight = new THREE.PointLight(0xcde6fc, 0.18, 10, 1.2);
    windowSpillLight.position.set(0.15, 1.8, -3.2);
    this.scene.add(windowSpillLight);
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

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update animated room elements
    if (this.room) {
      this.room.update();
    }

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
function boot() {
  try {
    new App();
  } catch (err) {
    console.error("[FATAL BOOT ERROR]", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
