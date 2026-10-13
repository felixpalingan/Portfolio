import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { portfolioData } from './data/portfolioData.js';
import { ApartmentRoom } from './scene/ApartmentRoom.js';
import { CameraController } from './scene/CameraController.js';
import { TextureGenerator } from './scene/TextureGenerator.js';
import { BDPlaybackOverlay } from './scene/BDPlaybackOverlay.js';
import { cyberAudio } from './scene/CyberAudio.js';

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
    this.hoveredBDWreath = false;

    // Braindance (BD) State
    this.isBDActive = false;
    this.isBDEntrancePlaying = false;
    this.bdOverlay = null;
    this.bdLaunchPrompt = null;

    this.init();
  }

  async init() {
    try {
      console.log("[CYBERPUNK] Booting Megabuilding H10 matrix...");
      this.updateProgress(15, "INITIALIZING WEBGL 3D PIPELINE [15%]");
      
      this.initScene();
      this.initCamera();
      this.initRenderer();
      this.initLights();

      this.updateProgress(35, "PRELOADING NEURAL SHARD MEDIA [35%]");
      await TextureGenerator.preloadAllAssets((progress, url) => {
        const pct = Math.round(35 + progress * 35);
        const shortName = url.replace('/', '');
        this.updateProgress(pct, `BUFFERING SHARD: ${shortName} [${pct}%]`);
      });

      this.updateProgress(75, "GENERATING APARTMENT GEOMETRY [75%]");
      this.initRoom();

      this.updateProgress(90, "CONNECTING NIGHT CITY SKYLINE [90%]");
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
    this.scene.fog = new THREE.FogExp2(0x07080c, 0.018);
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(80, aspect, 0.05, 100);
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
    this.initBraindance();
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
        if (this.room.furniture.projectMonitors) {
          interactiveObjs.push(...this.room.furniture.projectMonitors);
        } else if (this.room.furniture.projectMonitorScreen) {
          interactiveObjs.push(this.room.furniture.projectMonitorScreen);
        }
        if (this.room.furniture.projectControlButtons) {
          interactiveObjs.push(...this.room.furniture.projectControlButtons);
        }

        const intersects = this.raycaster.intersectObjects(interactiveObjs);
        if (intersects.length > 0) {
          const hit = intersects[0];
          if (hit.object.userData?.isProjectMonitor && hit.uv) {
            const mType = hit.object.userData.monitorType || 'center';
            if (mType === 'center') {
              const actionObj = TextureGenerator.getCenterMonitorActionAtUV(hit.uv.x, hit.uv.y);
              if (actionObj) {
                document.body.style.cursor = 'pointer';
                this.room.furniture.setProjectHover(actionObj.action, null);
              } else {
                document.body.style.cursor = 'default';
                this.room.furniture.setProjectHover(null, null);
              }
            } else if (mType === 'left') {
              const totalP = this.room?.furniture?.projects?.length || 2;
              const actionObj = TextureGenerator.getLeftMonitorActionAtUV(hit.uv.x, hit.uv.y, totalP);
              if (actionObj && actionObj.action === 'select') {
                document.body.style.cursor = 'pointer';
                this.room.furniture.setProjectHover('select', actionObj.index);
              } else {
                document.body.style.cursor = 'default';
                this.room.furniture.setProjectHover(null, null);
              }
            } else if (mType === 'right') {
              const actionObj = TextureGenerator.getRightMonitorActionAtUV(hit.uv.x, hit.uv.y);
              if (actionObj) {
                document.body.style.cursor = 'pointer';
                this.room.furniture.setProjectHover(actionObj.action, null);
              } else {
                document.body.style.cursor = 'default';
                this.room.furniture.setProjectHover(null, null);
              }
            }
          } else if (hit.object.userData?.isDeskButton) {
            document.body.style.cursor = 'pointer';
            hit.object.material.emissiveIntensity = 0.9;
            this.hoveredDeskBtn = hit.object;
          }
        } else {
          document.body.style.cursor = 'default';
          this.room.furniture.setProjectHover(null, null);
          if (this.hoveredDeskBtn) {
            this.hoveredDeskBtn.material.emissiveIntensity = 0.35;
            this.hoveredDeskBtn = null;
          }
        }
      }

      // BD Headset Hover Detection in STATS view
      if (
        this.cameraController &&
        this.cameraController.currentAnchor === 'STATS' &&
        this.room?.furniture?.bdClickableMeshes &&
        !this.isBDActive
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.room.furniture.bdClickableMeshes);
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
          this.hoveredBDWreath = true;
          if (this.room.furniture.bdLedMesh) {
            this.room.furniture.bdLedMesh.material.color.setHex(0xFCEE09);
          }
        } else {
          if (this.hoveredBDWreath) {
            document.body.style.cursor = 'default';
            this.hoveredBDWreath = false;
            if (this.room.furniture.bdLedMesh) {
              this.room.furniture.bdLedMesh.material.color.setHex(0x00FF66);
            }
          }
        }
      }
    });

    // 3D Interactive Clicks (Mirror Buttons in COMM, Workstation Monitor in PROJECTS, BD Headset in STATS)
    window.addEventListener('click', (e) => {
      // Ignore click if clicking 2D navigation bar buttons or BD overlay controls
      if (e.target.closest('.hud-nav-btn') || e.target.closest('.hud-header') || e.target.closest('#bd-playback-overlay') || e.target.closest('#bd-launch-prompt')) {
        return;
      }

      // STATS Sunken Lounge BD Headset Click
      if (
        this.cameraController &&
        this.cameraController.currentAnchor === 'STATS' &&
        this.room?.furniture?.bdClickableMeshes &&
        !this.isBDActive
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.room.furniture.bdClickableMeshes);
        if (intersects.length > 0) {
          if (!this.isBDActive && !this.isBDEntrancePlaying) {
            this.playBraindanceEntrance();
          }
          return;
        }
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
            window.open('https://www.linkedin.com/in/almakius-felix-bariq-hekopung/', '_blank');
          } else if (id === 'return') {
            document.getElementById('nav-btn-home')?.click();
          }
        }
      }

      // PROJECTS Workstation Triple Monitor & Desk Buttons Click
      if (
        this.cameraController &&
        this.cameraController.currentAnchor === 'PROJECTS' &&
        this.room?.furniture
      ) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const interactiveObjs = [];
        if (this.room.furniture.projectMonitors) {
          interactiveObjs.push(...this.room.furniture.projectMonitors);
        } else if (this.room.furniture.projectMonitorScreen) {
          interactiveObjs.push(this.room.furniture.projectMonitorScreen);
        }
        if (this.room.furniture.projectControlButtons) {
          interactiveObjs.push(...this.room.furniture.projectControlButtons);
        }

        const intersects = this.raycaster.intersectObjects(interactiveObjs);
        if (intersects.length > 0) {
          const hit = intersects[0];
          if (hit.object.userData?.isProjectMonitor && hit.uv) {
            const mType = hit.object.userData.monitorType || 'center';
            if (mType === 'center') {
              const actionObj = TextureGenerator.getCenterMonitorActionAtUV(hit.uv.x, hit.uv.y);
              if (actionObj?.action === 'repo') {
                const p = this.room.furniture.getCurrentProject();
                if (p?.repoUrl) {
                  window.open(p.repoUrl, '_blank');
                  this.showCopyToast(`⚡ OPENING GITHUB: ${p.title}`);
                }
              } else if (actionObj?.action === 'live') {
                const p = this.room.furniture.getCurrentProject();
                if (p?.liveUrl) {
                  window.open(p.liveUrl, '_blank');
                  this.showCopyToast(`⚡ LAUNCHING DEMO: ${p.title}`);
                }
              }
            } else if (mType === 'left') {
              const totalP = this.room?.furniture?.projects?.length || 2;
              const actionObj = TextureGenerator.getLeftMonitorActionAtUV(hit.uv.x, hit.uv.y, totalP);
              if (actionObj && actionObj.action === 'select') {
                this.room.furniture.setProjectIndex(actionObj.index);
              }
            } else if (mType === 'right') {
              const actionObj = TextureGenerator.getRightMonitorActionAtUV(hit.uv.x, hit.uv.y);
              if (actionObj?.action === 'prev') {
                this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
              } else if (actionObj?.action === 'next') {
                this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
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
              this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
            } else if (action === 'next') {
              this.room.furniture.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
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
        cyberAudio.playClick();
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

    // Camera transition lifecycle hooks for 3D Wall Mirror, Sunken Lounge BD, & Top-Down Blueprint
    if (this.cameraController) {
      this.cameraController.onTransitionStart = (anchor) => {
        // While camera is in flight, mirror remains clean chrome silver
        if (this.room) this.room.setMirrorActive(false);

        // If navigating away from STATS, disengage BD
        if (anchor?.name !== 'STATS') {
          if (this.isBDActive || this.isBDEntrancePlaying) {
            this.disengageBraindance();
          }
        }

        // Temporarily lift the ceiling during TOP-DOWN blueprint view
        const isTop = anchor?.name === 'TOPDOWN';
        if (this.room) this.room.setCeilingVisible(!isTop);
      };

      this.cameraController.onTransitionComplete = (anchor) => {
        // Only once camera stops and aims directly at the wall mirror:
        if (anchor.name === 'COMM') {
          if (this.room) this.room.setMirrorActive(true);
        }

        // Camera is now seated on the couch at STATS!
        // Start headset descent and camera tracking animation
        if (anchor.name === 'STATS') {
          if (!this.isBDActive && !this.isBDEntrancePlaying) {
            this.playBraindanceEntrance();
          }
        }

        const isTop = anchor.name === 'TOPDOWN';
        if (this.room) this.room.setCeilingVisible(!isTop);
      };
    }

    // Quick Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // While in active Braindance playback session
      if (this.isBDActive) {
        if (e.key === 'Escape') {
          this.disengageBraindance();
          document.getElementById('nav-btn-home')?.click();
          return;
        } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          cyberAudio.playTick();
          this.bdOverlay?.prevShard();
        } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
          cyberAudio.playTick();
          this.bdOverlay?.nextShard();
        } else if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
        } else if (e.key === '1') {
          cyberAudio.playClick();
          if (this.bdOverlay) {
            this.bdOverlay.currentMode = 'EXPERIENCES';
            this.bdOverlay.render();
          }
        } else if (e.key === '2') {
          cyberAudio.playClick();
          if (this.bdOverlay) {
            this.bdOverlay.currentMode = 'STATS';
            this.bdOverlay.render();
          }
        }
        return; // Don't trigger room navigation while inside BD session
      }

      if (e.key === '1' || e.key === 'Escape') {
        document.getElementById('nav-btn-home')?.click();
      } else if (e.key === '2') {
        document.getElementById('nav-btn-projects')?.click();
      } else if (e.key === '3') {
        if (this.cameraController?.currentAnchor === 'STATS') {
          if (!this.isBDActive && !this.isBDEntrancePlaying) {
            this.playBraindanceEntrance();
          }
        } else {
          document.getElementById('nav-btn-stats')?.click();
        }
      } else if (e.key === '4') {
        document.getElementById('nav-btn-contact')?.click();
      }

      // Keyboard browsing while at Netrunner Workstation (no toasts)
      if (this.cameraController && this.cameraController.currentAnchor === 'PROJECTS') {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
        } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
          this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
        } else if (e.key.toLowerCase() === 'o') {
          const p = this.room?.furniture?.getCurrentProject();
          if (p?.repoUrl) {
            window.open(p.repoUrl, '_blank');
            this.showCopyToast(`⚡ OPENING GITHUB: ${p.title}`);
          }
        }
      }
    });

    // Mouse wheel scrolling for projects at Netrunner Workstation (no toasts)
    window.addEventListener('wheel', (e) => {
      if (this.cameraController && this.cameraController.currentAnchor === 'PROJECTS') {
        if (Math.abs(e.deltaY) > 20) {
          if (e.deltaY > 0) {
            this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex + 1);
          } else {
            this.room?.furniture?.setProjectIndex(this.room.furniture.currentProjectIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  initBraindance() {
    this.bdOverlay = new BDPlaybackOverlay({
      onDisengage: () => {
        this.disengageBraindance();
        document.getElementById('nav-btn-home')?.click();
      }
    });
  }

  playBraindanceEntrance() {
    if (this.isBDActive || this.isBDEntrancePlaying) return;
    this.isBDEntrancePlaying = true;

    // Resting headset position in world coordinates: (2.775, 1.87, -2.497)
    // Seated camera position: (2.70, 0.72, -2.80)
    // Resting camera look target: (2.95, 0.48, -1.80)
    const lookUpTarget = new THREE.Vector3(2.775, 1.87, -2.497);
    const lookDownTarget = new THREE.Vector3(2.95, 0.48, -1.80);

    // Step 1: Camera tilts UP to look at the suspended VR visor & cord
    this.cameraController?.animateTarget(lookUpTarget, 0.45, 'power2.out', () => {
      // Step 2: Cable unclamp tick / descending sound
      cyberAudio.playTick();

      // Step 3: Camera smoothly follows the VR headset downwards while it lowers to our eyes
      this.cameraController?.animateTarget(lookDownTarget, 1.25, 'power2.inOut');

      // Headset lowers from ceiling down in front of our eyes
      this.room?.engageBD(this.camera, () => {
        // Step 4: Visor reaches face & docks to camera with holographic projection beam
        this.isBDEntrancePlaying = false;
        this.isBDActive = true;

        cyberAudio.playBDEngage();
        this.flashBDScreen();

        if (this.bdOverlay) {
          this.bdOverlay.show();
        }
      });
    });
  }

  flashBDScreen() {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.zIndex = '70';
    flash.style.background = 'rgba(0, 240, 255, 0.45)';
    flash.style.mixBlendMode = 'screen';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    gsap.to(flash, {
      opacity: 0,
      duration: 0.35,
      onComplete: () => flash.remove()
    });
  }

  disengageBraindance() {
    this.isBDEntrancePlaying = false;
    if (!this.isBDActive) {
      if (this.room) this.room.disengageBD(this.camera);
      return;
    }
    this.isBDActive = false;

    if (this.bdOverlay) {
      this.bdOverlay.hide();
    }

    cyberAudio.playBDDisengage();
    if (this.room) {
      this.room.disengageBD(this.camera);
    }
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

    if (this.cameraController) {
      this.cameraController.handleResize();
    }

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update animated room elements (ceiling fan, 360 ticker, vinyl turntable, server LEDs, 3D cityscape)
    if (this.room) {
      this.room.update(this.clock.getElapsedTime());
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
