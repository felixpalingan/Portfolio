import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { portfolioData } from './data/portfolioData.js';
import { ApartmentRoom } from './scene/ApartmentRoom.js';
import { CameraController } from './scene/CameraController.js';
import { TextureGenerator } from './scene/TextureGenerator.js';

class App {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.loadingScreen = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('progress-bar');
    this.loadingStatus = document.getElementById('loading-status');

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.hoveredMirrorBtn = null;
    this.hoveredProjectAction = null;
    this.hoveredDeskBtn = null;

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
    this.camera = new THREE.PerspectiveCamera(80, aspect, 0.1, 100);
    this.cameraController = new CameraController(this.camera);
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

    // Mousemove for parallax & 3D mirror button hover detection
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (this.cameraController) {
        this.cameraController.setMouse(this.mouse.x, this.mouse.y);
      }

      // 3D Mirror Button Hover Detection (when viewing COMM)
      if (
        this.cameraController && 
        this.cameraController.currentAnchor === 'COMM' && 
        this.room?.furniture?.mirrorButtons
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.room.furniture.mirrorButtons);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (this.hoveredMirrorBtn !== hit) {
            if (this.hoveredMirrorBtn) this.resetMirrorButton(this.hoveredMirrorBtn);
            this.hoveredMirrorBtn = hit;
            this.highlightMirrorButton(hit);
          }
          document.body.style.cursor = 'pointer';
        } else {
          if (this.hoveredMirrorBtn) {
            this.resetMirrorButton(this.hoveredMirrorBtn);
            this.hoveredMirrorBtn = null;
          }
          document.body.style.cursor = 'default';
        }
      } else if (this.hoveredMirrorBtn) {
        this.resetMirrorButton(this.hoveredMirrorBtn);
        this.hoveredMirrorBtn = null;
        document.body.style.cursor = 'default';
      }

      // 3D Workstation Monitor & Desk Buttons Hover Detection (when viewing PROJECTS)
      if (
        this.cameraController &&
        this.cameraController.currentAnchor === 'PROJECTS' &&
        this.room?.furniture
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const interactiveObjs = [];
        if (this.room.furniture.projectMonitorScreen) {
          interactiveObjs.push(this.room.furniture.projectMonitorScreen);
        }
        if (this.room.furniture.projectControlButtons) {
          interactiveObjs.push(...this.room.furniture.projectControlButtons);
        }

        const intersects = this.raycaster.intersectObjects(interactiveObjs);
        if (intersects.length > 0) {
          const hit = intersects[0];
          if (hit.object.userData?.isProjectMonitor && hit.uv) {
            const actionObj = TextureGenerator.getProjectActionAtUV(hit.uv.x, hit.uv.y);
            if (actionObj) {
              document.body.style.cursor = 'pointer';
              const actionKey = actionObj.action === 'tab' ? `tab_${actionObj.index}` : actionObj.action;
              this.room.furniture.setProjectHover(actionKey);
            } else {
              document.body.style.cursor = 'default';
              this.room.furniture.setProjectHover(null);
            }
          } else if (hit.object.userData?.isDeskButton) {
            document.body.style.cursor = 'pointer';
            hit.object.material.emissiveIntensity = 0.9;
            this.hoveredDeskBtn = hit.object;
          }
        } else {
          document.body.style.cursor = 'default';
          this.room.furniture.setProjectHover(null);
          if (this.hoveredDeskBtn) {
            this.hoveredDeskBtn.material.emissiveIntensity = 0.35;
            this.hoveredDeskBtn = null;
          }
        }
      }
    });

    // 3D Interactive Clicks (Mirror Buttons in COMM & Workstation Monitor in PROJECTS)
    window.addEventListener('click', (e) => {
      // Ignore click if clicking 2D navigation bar buttons
      if (e.target.closest('.hud-nav-btn') || e.target.closest('.hud-header')) {
        return;
      }

      // COMM Mirror Buttons Click
      if (
        this.cameraController && 
        this.cameraController.currentAnchor === 'COMM' && 
        this.room?.furniture?.mirrorButtons
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.room.furniture.mirrorButtons);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const id = hit.userData?.id;

          if (id === 'email') {
            navigator.clipboard.writeText('felixbariq@gmail.com').then(() => {
              hit.material.map = hit.userData.successTex;
              hit.material.needsUpdate = true;
              this.showCopyToast('⚡ DIRECT EMAIL felixbariq@gmail.com COPIED TO CLIPBOARD');
              setTimeout(() => {
                hit.material.map = hit.userData.normalTex;
                hit.material.needsUpdate = true;
              }, 2500);
            });
          } else if (id === 'github') {
            window.open('https://github.com/felixpalingan', '_blank');
          } else if (id === 'linkedin') {
            window.open('https://linkedin.com/in/felixpalingan', '_blank');
          } else if (id === 'return') {
            document.getElementById('nav-btn-home')?.click();
          }
        }
      }

      // PROJECTS Workstation Monitor & Desk Buttons Click
      if (
        this.cameraController &&
        this.cameraController.currentAnchor === 'PROJECTS' &&
        this.room?.furniture
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const interactiveObjs = [];
        if (this.room.furniture.projectMonitorScreen) {
          interactiveObjs.push(this.room.furniture.projectMonitorScreen);
        }
        if (this.room.furniture.projectControlButtons) {
          interactiveObjs.push(...this.room.furniture.projectControlButtons);
        }

        const intersects = this.raycaster.intersectObjects(interactiveObjs);
        if (intersects.length > 0) {
          const hit = intersects[0];
          if (hit.object.userData?.isProjectMonitor && hit.uv) {
            const actionObj = TextureGenerator.getProjectActionAtUV(hit.uv.x, hit.uv.y);
            if (actionObj) {
              if (actionObj.action === 'tab') {
                const p = this.room.furniture.setProjectIndex(actionObj.index);
                if (p) this.showCopyToast(`⚡ PROJECT LOADED: ${p.title}`);
              } else if (actionObj.action === 'prev') {
                const p = this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
                if (p) this.showCopyToast(`⚡ PREVIOUS PROJECT: ${p.title}`);
              } else if (actionObj.action === 'next') {
                const p = this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
                if (p) this.showCopyToast(`⚡ NEXT PROJECT: ${p.title}`);
              } else if (actionObj.action === 'repo') {
                const p = this.room.furniture.getCurrentProject();
                if (p?.repoUrl) {
                  window.open(p.repoUrl, '_blank');
                  this.showCopyToast(`⚡ OPENING GITHUB: ${p.title}`);
                }
              } else if (actionObj.action === 'live') {
                const p = this.room.furniture.getCurrentProject();
                if (p?.liveUrl) {
                  window.open(p.liveUrl, '_blank');
                  this.showCopyToast(`⚡ LAUNCHING DEMO: ${p.title}`);
                }
              }
            }
          } else if (hit.object.userData?.isDeskButton) {
            const btn = hit.object;
            const action = btn.userData.action;
            // Press tactile button animation
            gsap.to(btn.position, {
              y: btn.userData.baseY - 0.007,
              duration: 0.08,
              yoyo: true,
              repeat: 1
            });

            if (action === 'prev') {
              const p = this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
              if (p) this.showCopyToast(`⚡ PREVIOUS PROJECT: ${p.title}`);
            } else if (action === 'next') {
              const p = this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
              if (p) this.showCopyToast(`⚡ NEXT PROJECT: ${p.title}`);
            } else if (action === 'repo') {
              const p = this.room.furniture.getCurrentProject();
              if (p?.repoUrl) {
                window.open(p.repoUrl, '_blank');
                this.showCopyToast(`⚡ OPENING GITHUB: ${p.title}`);
              }
            }
          }
        }
      }
    });

    // Navigation buttons (Controls Cinematic Camera Anchors)
    const navButtons = document.querySelectorAll('.hud-nav-btn');
    const locationText = document.getElementById('current-location-text');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        let anchor = btn.getAttribute('data-nav');
        if (anchor === 'CONTACT') anchor = 'COMM';

        if (this.cameraController) {
          this.cameraController.moveTo(anchor);
        }
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (locationText && this.cameraController.anchors[anchor]) {
          locationText.textContent = this.cameraController.anchors[anchor].label;
        }
      });
    });

    // Camera transition lifecycle hooks for 3D Wall Mirror & Top-Down Blueprint
    if (this.cameraController) {
      this.cameraController.onTransitionStart = (anchor) => {
        // While camera is in flight, mirror remains clean chrome silver
        if (this.room) this.room.setMirrorActive(false);

        // Temporarily lift the ceiling during TOP-DOWN blueprint view
        const isTop = anchor?.name === 'TOPDOWN';
        if (this.room) this.room.setCeilingVisible(!isTop);
      };

      this.cameraController.onTransitionComplete = (anchor) => {
        // Only once camera stops and aims directly at the wall mirror:
        // fade in image, info, and 3D buttons right on the mirror face
        if (anchor.name === 'COMM') {
          if (this.room) this.room.setMirrorActive(true);
        }

        const isTop = anchor.name === 'TOPDOWN';
        if (this.room) this.room.setCeilingVisible(!isTop);
      };
    }

    // Quick Keyboard Shortcuts (1: HOME, 2: PROJECTS, 3: STATS, 4: COMM, 5/T: TOP-DOWN, Escape: HOME)
    // In PROJECTS view: ◄ / ► arrow keys or A / D browse projects, O opens repo
    window.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === 'Escape') {
        document.getElementById('nav-btn-home')?.click();
      } else if (e.key === '2') {
        document.getElementById('nav-btn-projects')?.click();
      } else if (e.key === '3') {
        document.getElementById('nav-btn-stats')?.click();
      } else if (e.key === '4') {
        document.getElementById('nav-btn-contact')?.click();
      } else if (e.key === '5' || e.key.toLowerCase() === 't') {
        document.getElementById('nav-btn-topdown')?.click();
      }

      // Keyboard browsing while at Netrunner Workstation
      if (this.cameraController && this.cameraController.currentAnchor === 'PROJECTS') {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          const p = this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
          if (p) this.showCopyToast(`⚡ PREVIOUS PROJECT: ${p.title}`);
        } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
          const p = this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
          if (p) this.showCopyToast(`⚡ NEXT PROJECT: ${p.title}`);
        } else if (e.key.toLowerCase() === 'o') {
          const p = this.room?.furniture?.getCurrentProject();
          if (p?.repoUrl) {
            window.open(p.repoUrl, '_blank');
            this.showCopyToast(`⚡ OPENING GITHUB: ${p.title}`);
          }
        }
      }
    });
  }

  highlightMirrorButton(btn) {
    if (!btn || !btn.userData) return;
    btn.material.map = btn.userData.hoverTex;
    btn.material.needsUpdate = true;
    if (btn.userData.baseZ !== undefined) {
      gsap.to(btn.position, { z: btn.userData.baseZ - 0.015, duration: 0.15 });
    } else if (btn.userData.baseX !== undefined) {
      gsap.to(btn.position, { x: btn.userData.baseX + 0.012, duration: 0.15 });
    }
  }

  resetMirrorButton(btn) {
    if (!btn || !btn.userData) return;
    btn.material.map = btn.userData.normalTex;
    btn.material.needsUpdate = true;
    if (btn.userData.baseZ !== undefined) {
      gsap.to(btn.position, { z: btn.userData.baseZ, duration: 0.15 });
    } else if (btn.userData.baseX !== undefined) {
      gsap.to(btn.position, { x: btn.userData.baseX, duration: 0.15 });
    }
  }

  showCopyToast(text) {
    const toast = document.getElementById('copy-toast');
    if (toast) {
      toast.textContent = text;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
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

    // Update animated room elements (ceiling fan, 360 ticker, vinyl turntable, server LEDs)
    if (this.room) {
      this.room.update();
    }

    // Update camera controller (GSAP transitions & smooth parallax)
    if (this.cameraController) {
      this.cameraController.update();
    }

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
