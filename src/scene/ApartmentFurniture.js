import * as THREE from 'three';
import gsap from 'gsap';
import { TextureGenerator } from './TextureGenerator.js';
import { portfolioData } from '../data/portfolioData.js';

/**
 * ApartmentFurniture (Phase 2 - Complete Apartment Furniture & Interior Elements)
 * Implements:
 * 2A: Top-Left Sleeping Pod & Vending Machine
 * 2B: Left Toilet + Mirror Area
 * 2C: Bottom-Left Netrunner Workstation (Curved Ultrawide Monitor, Server Rack, Swivel Chair, Samurai Jacket)
 * 2E: Top-Right Sunken Lounge (L-Sofa, Coffee Table, Turntable, Braindance Unit, Wall TV)
 * 2F: Bottom-Right Wardrobe
 * 2G: Ceiling Fan (with rotation animation update) and Industrial Cables
 */
export class ApartmentFurniture {
  constructor() {
    this.group = new THREE.Group();
    this.animatedObjects = []; // Stores objects that require RAF animation (e.g., ceiling fan)

    // Interactive Netrunner Project Repository Terminal State (Curved Triple Monitor Setup)
    this.projects = portfolioData.projects || [];
    this.currentProjectIndex = 0;
    this.currentProjectHover = null;
    this.hoveredProjectIndex = null;
    this.projectControlButtons = [];

    // Triple Monitor Battlestation references
    this.projectMonitorCenter = null;
    this.projectMonitorLeft = null;
    this.projectMonitorRight = null;
    this.projectMonitorScreen = null; // backward compatibility
    this.projectMonitors = [];

    this.projectCenterCanvas = null;
    this.projectCenterTexture = null;
    this.projectLeftCanvas = null;
    this.projectLeftTexture = null;
    this.projectRightCanvas = null;
    this.projectRightTexture = null;

    // Braindance (BD) Headset & Holographic Playback State
    this.loungeGroup = null;
    this.bdWreathGroup = null;
    this.bdClickableMeshes = [];
    this.bdHoloEmitter = null;
    this.bdHoloSpotLight = null;
    this.bdHoloRings = [];
    this.bdLedMesh = null;
    this.bdCord = null;
    this.isDockedToCamera = false;
    this.bdIsEngaged = false;
    this.bdRestPosition = { x: -0.275, y: 2.25, z: -0.447 };
    this.bdRestRotation = { x: 0, y: Math.PI, z: 0 };
    this.bdEngagedPosition = { x: -0.275, y: 1.012, z: -0.447 };

    this.initMaterials();
    this.buildSleepingPod();
    this.buildOpenBathroom();
    this.buildNetrunnerWorkstation();
    this.buildSunkenLounge();
    this.buildWardrobe();
    this.buildCeilingFan();
    this.buildEnvironmentalClutter();
  }

  initMaterials() {
    // Industrial metal dark
    this.darkMetal = new THREE.MeshStandardMaterial({
      color: 0x16181f,
      roughness: 0.45,
      metalness: 0.8
    });

    // Bronze / warm tan metal
    this.tanMetal = new THREE.MeshStandardMaterial({
      color: 0x2e241c,
      roughness: 0.5,
      metalness: 0.6
    });

    // Workstation desk surface (Authentic 2x2 Twill Weave Carbon Fiber)
    const carbonTexture = TextureGenerator.createCarbonFiberTexture();
    this.deskMaterial = new THREE.MeshStandardMaterial({
      map: carbonTexture,
      color: 0x242730,
      roughness: 0.28,
      metalness: 0.55
    });

    // Fabric / Sofa cushion material
    this.cushionMaterial = new THREE.MeshStandardMaterial({
      color: 0x181b24,
      roughness: 0.9,
      metalness: 0.05
    });

    // Yellow accent fabric / hazard trim
    this.yellowAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xFCEE09,
      roughness: 0.6,
      metalness: 0.2
    });

    // Bed mattress & duvet
    this.bedSheetMaterial = new THREE.MeshStandardMaterial({
      color: 0x232734,
      roughness: 0.95,
      metalness: 0.0
    });

    this.bedPillowMaterial = new THREE.MeshStandardMaterial({
      color: 0x363d50,
      roughness: 0.9,
      metalness: 0.0
    });

    // Neon Emissives
    this.warmOrangeEmissive = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff4400,
      emissiveIntensity: 2.2,
      roughness: 0.2
    });

    this.cyanEmissive = new THREE.MeshStandardMaterial({
      color: 0x00F0FF,
      emissive: 0x00F0FF,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });

    this.whiteEmissive = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xddf0ff,
      emissiveIntensity: 1.5,
      roughness: 0.2
    });

    // Soft dimmed emissives for mirror (reduced 80%)
    this.dimCyanEmissive = new THREE.MeshStandardMaterial({
      color: 0x00F0FF,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.36,
      roughness: 0.3
    });

    this.dimWhiteEmissive = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xddf0ff,
      emissiveIntensity: 0.30,
      roughness: 0.3
    });

    // Chrome Silver Mirror Material (gleaming metallic reflection with procedural chrome environment map)
    const chromeTexture = TextureGenerator.createChromeSilverTexture();
    this.chromeMirrorMaterial = new THREE.MeshStandardMaterial({
      map: chromeTexture,
      color: 0xf5f8ff,
      roughness: 0.08,
      metalness: 0.92,
      bumpScale: 0.02
    });

    // Mirror Bevel & Outer Frame (Polished chrome silver alloy)
    this.chromeFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8e4f2,
      roughness: 0.18,
      metalness: 0.88
    });
  }

  // ===========================================================================
  // 2A: SLEEPING POD WITH FULL-LENGTH NIGHTSTAND (Top-Left)
  // Kasur mepet dari dinding belakang (atas) sampai sekat shower (bawah).
  // Di sebelah kiri antara kasur dan tembok kiri terdapat nightstand runner panjang.
  // ===========================================================================
  buildSleepingPod() {
    const podGroup = new THREE.Group();
    podGroup.position.set(0, 0, 0);

    // =========================================================================
    // 1. FULL-LENGTH BEDSIDE NIGHTSTAND (Antara kasur dan tembok kiri)
    // Tembok kiri: X = -4.40m | Kasur mulai: X = -3.90m | Panjang Z: -3.38 ke -1.02
    // =========================================================================
    const nightstandGroup = new THREE.Group();
    nightstandGroup.position.set(-4.15, 0, -2.20);

    // Nightstand main cabinet body (2.36m panjang sepanjang kasur)
    const nsBodyGeo = new THREE.BoxGeometry(0.48, 0.48, 2.36);
    const nsBody = new THREE.Mesh(nsBodyGeo, this.darkMetal);
    nsBody.position.y = 0.24;
    nsBody.castShadow = true;
    nsBody.receiveShadow = true;
    nightstandGroup.add(nsBody);

    // Top console countertop surface (matte carbon finish)
    const nsTopGeo = new THREE.BoxGeometry(0.50, 0.035, 2.38);
    const nsTop = new THREE.Mesh(nsTopGeo, this.deskMaterial);
    nsTop.position.y = 0.49;
    nightstandGroup.add(nsTop);

    // Luminous warm amber LED runner strip along the entire inside edge
    const nsLedGeo = new THREE.BoxGeometry(0.02, 0.02, 2.34);
    const nsLed = new THREE.Mesh(nsLedGeo, this.warmOrangeEmissive);
    nsLed.position.set(0.24, 0.50, 0);
    nightstandGroup.add(nsLed);

    // Horizontal cyber cabinet panel division lines
    const panelLine1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.44, 0.02), this.trimMaterial || this.darkMetal);
    panelLine1.position.set(0.245, 0.24, -0.4);
    nightstandGroup.add(panelLine1);

    const panelLine2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.44, 0.02), this.trimMaterial || this.darkMetal);
    panelLine2.position.set(0.245, 0.24, 0.4);
    nightstandGroup.add(panelLine2);

    // Bedside Clutter / Props on the nightstand:
    // A. Netrunner Datapad / Cyberpunk Tablet (illuminated screen)
    const tabletGeo = new THREE.BoxGeometry(0.22, 0.015, 0.32);
    const tabletMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0.0, 0.515, -0.65);
    tablet.rotation.y = 0.15;
    nightstandGroup.add(tablet);

    // B. Neural Interface Shard Dock / Charger Station
    const dockGeo = new THREE.BoxGeometry(0.14, 0.04, 0.18);
    const dock = new THREE.Mesh(dockGeo, this.darkMetal);
    dock.position.set(0.02, 0.525, -0.15);
    nightstandGroup.add(dock);

    const shardLed = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.02), this.cyanEmissive);
    shardLed.position.set(0.02, 0.548, -0.15);
    nightstandGroup.add(shardLed);

    // C. Chrome Water Flask / Cyber Decanter + Tumbler
    const flaskGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.22, 12);
    const flask = new THREE.Mesh(flaskGeo, this.chromeFrameMaterial);
    flask.position.set(-0.05, 0.615, 0.45);
    nightstandGroup.add(flask);

    const glassGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.09, 12);
    const glass = new THREE.Mesh(glassGeo, new THREE.MeshStandardMaterial({
      color: 0x335577,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1
    }));
    glass.position.set(0.08, 0.555, 0.52);
    nightstandGroup.add(glass);

    // Warm ambient point light softly illuminating the nightstand runner
    const nightstandLight = new THREE.PointLight(0xff6622, 1.6, 2.8, 1.4);
    nightstandLight.position.set(0.0, 0.85, -0.3);
    nightstandGroup.add(nightstandLight);

    podGroup.add(nightstandGroup);

    // =========================================================================
    // 2. KASUR (BED) MEPET ATAS (Dinding Belakang) SAMPAI BAWAH (Sekat Shower)
    // Z: -3.39m (dinding belakang) s/d -1.01m (sekat shower) -> Panjang Z: 2.38m
    // X: -3.90m (sebelah nightstand) s/d -2.05m -> Lebar X: 1.85m
    // Center: X = -2.975m, Z = -2.20m
    // =========================================================================
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-2.975, 0, -2.20);

    // Bed Platform Base (mepet atas sampe bawah)
    const baseGeo = new THREE.BoxGeometry(1.85, 0.32, 2.38);
    const base = new THREE.Mesh(baseGeo, this.darkMetal);
    base.position.y = 0.16;
    base.castShadow = true;
    base.receiveShadow = true;
    bedGroup.add(base);

    // Mattress (Kasur tebal & empuk membentang dari dinding belakang ke sekat shower)
    const matGeo = new THREE.BoxGeometry(1.80, 0.26, 2.34);
    const mat = new THREE.Mesh(matGeo, this.bedSheetMaterial);
    mat.position.y = 0.44;
    mat.castShadow = true;
    mat.receiveShadow = true;
    bedGroup.add(mat);

    // Bed Headboard Panel (Flush at back wall, Z = -3.36 -> relative Z = -1.16)
    const headboardGeo = new THREE.BoxGeometry(1.85, 0.95, 0.08);
    const headboard = new THREE.Mesh(headboardGeo, this.darkMetal);
    headboard.position.set(0, 0.85, -1.15);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Luminous warm orange headboard runner strip
    const headboardLightGeo = new THREE.BoxGeometry(1.85, 0.035, 0.035);
    const headboardLight = new THREE.Mesh(headboardLightGeo, this.warmOrangeEmissive);
    headboardLight.position.set(0, 1.30, -1.13);
    bedGroup.add(headboardLight);

    // 2 Pillows at the head of the bed
    const pillowGeo = new THREE.BoxGeometry(0.68, 0.14, 0.42);
    const pillow1 = new THREE.Mesh(pillowGeo, this.bedPillowMaterial);
    pillow1.position.set(-0.45, 0.62, -0.85);
    pillow1.rotation.y = 0.04;
    bedGroup.add(pillow1);

    const pillow2 = new THREE.Mesh(pillowGeo, this.bedPillowMaterial);
    pillow2.position.set(0.45, 0.62, -0.85);
    pillow2.rotation.y = -0.04;
    bedGroup.add(pillow2);

    // Rumpled duvet blanket covering lower portion of bed up to shower divider
    const duvetGeo = new THREE.BoxGeometry(1.78, 0.16, 1.55);
    const duvet = new THREE.Mesh(duvetGeo, this.bedSheetMaterial);
    duvet.position.set(0.0, 0.58, 0.35);
    duvet.rotation.z = -0.015;
    bedGroup.add(duvet);

    // Subtle edge rim hazard strip along bottom edge near shower divider
    const footTrim = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.02, 0.02), this.yellowAccentMaterial);
    footTrim.position.set(0, 0.32, 1.18);
    bedGroup.add(footTrim);

    // Ambient warm headboard point light
    const bedPointLight = new THREE.PointLight(0xff5511, 2.2, 4.0, 1.3);
    bedPointLight.position.set(0.0, 1.1, -0.9);
    bedGroup.add(bedPointLight);

    podGroup.add(bedGroup);

    this.group.add(podGroup);
  }

  // ===========================================================================
  // 2B: OPEN-CONCEPT CYBERPUNK BATHROOM (Left-Bottom - Focus for COMM)
  // Features:
  // - Divider wall near bed (Z = -0.95) with industrial chrome shower head & column
  // - Open walk-in wet room shower floor drain
  // - Vanity console + 3D Chrome Mirror facing the bed (Z = 2.20, normal faces -Z)
  // - Diegetic Smart Mirror HUD & 4 interactive 3D buttons facing -Z (towards bed)
  // - Compact futuristic toilet module along left wall
  // ===========================================================================
  buildOpenBathroom() {
    const bathGroup = new THREE.Group();
    bathGroup.position.set(-3.1, 0, 0.0);

    // 1. DIVIDER WALL NEAR BED (at Z = -0.95, separating sleeping pod from open bathroom)
    const dividerGeo = new THREE.BoxGeometry(2.5, 2.4, 0.12);
    const dividerWall = new THREE.Mesh(dividerGeo, this.darkMetal);
    dividerWall.position.set(0, 1.2, -0.95);
    bathGroup.add(dividerWall);

    // Warm accent trim on bed side of divider wall
    const bedTrim = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.03, 0.02), this.warmOrangeEmissive);
    bedTrim.position.set(0, 1.8, -1.02);
    bathGroup.add(bedTrim);

    // 2. INDUSTRIAL CHROME SHOWER COLUMN & HEAD (Mounted on bathroom face of divider, facing South +Z towards sink)
    // Chrome vertical supply pipe
    const showerPipeGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.4, 8);
    const showerPipe = new THREE.Mesh(showerPipeGeo, this.chromeFrameMaterial);
    showerPipe.position.set(0, 1.4, -0.86);
    bathGroup.add(showerPipe);

    // Dual cyber mixer valves (hot/cold)
    const valveGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12);
    const valve1 = new THREE.Mesh(valveGeo, this.chromeFrameMaterial);
    valve1.rotation.x = Math.PI / 2;
    valve1.position.set(-0.08, 0.95, -0.84);
    bathGroup.add(valve1);

    const valve2 = new THREE.Mesh(valveGeo, this.chromeFrameMaterial);
    valve2.rotation.x = Math.PI / 2;
    valve2.position.set(0.08, 0.95, -0.84);
    bathGroup.add(valve2);

    // Shower arm extending out into the bathroom along +Z
    const showerArmGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.55, 8);
    const showerArm = new THREE.Mesh(showerArmGeo, this.chromeFrameMaterial);
    showerArm.rotation.x = Math.PI / 2;
    showerArm.position.set(0, 2.15, -0.58);
    bathGroup.add(showerArm);

    // Wide Cyberpunk Rain Shower Head disc (facing down towards sink)
    const showerDiscGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 24);
    const showerDisc = new THREE.Mesh(showerDiscGeo, this.chromeFrameMaterial);
    showerDisc.position.set(0, 2.12, -0.32);
    bathGroup.add(showerDisc);

    // Cyan glowing nozzle rim
    const nozzleRim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.008, 8, 24), this.cyanEmissive);
    nozzleRim.rotation.x = Math.PI / 2;
    nozzleRim.position.set(0, 2.10, -0.32);
    bathGroup.add(nozzleRim);

    // Dedicated cool blue shower spotlight
    const showerSpot = new THREE.SpotLight(0x00F0FF, 3.5, 4.0, Math.PI / 4, 0.35, 1.2);
    showerSpot.position.set(0, 2.3, -0.32);
    showerSpot.target.position.set(0, 0, -0.32);
    bathGroup.add(showerSpot);
    bathGroup.add(showerSpot.target);

    // Shower wet-room floor drain plate & grate
    const slatePlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.008, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x141822, roughness: 0.85, metalness: 0.3 })
    );
    slatePlate.position.set(0, 0.004, -0.30);
    slatePlate.receiveShadow = true;
    bathGroup.add(slatePlate);

    const drainGrate = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.012, 0.24),
      this.darkMetal
    );
    drainGrate.position.set(0, 0.01, -0.30);
    bathGroup.add(drainGrate);

    // 3. COMPACT TOILET MODULE (Along Left Wall at X = -4.40)
    const toiletBowl = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.52),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.1 })
    );
    // Relative to bathGroup (-3.1), x = -0.95 -> world x = -4.05
    toiletBowl.position.set(-0.95, 0.225, 0.65);
    bathGroup.add(toiletBowl);

    const toiletTank = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.5, 0.45),
      this.darkMetal
    );
    toiletTank.position.set(-1.18, 0.65, 0.65);
    bathGroup.add(toiletTank);

    // 4. VANITY CONSOLE + 3D CHROME MIRROR (Facing the Bed, normal along -Z)
    // Vanity back partition screen
    const vanityBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.5, 0.08),
      this.darkMetal
    );
    vanityBack.position.set(0, 1.25, 2.30);
    bathGroup.add(vanityBack);

    // Materials for clearly visible sanitary vanity console
    const whiteCeramicMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7fb,
      roughness: 0.12,
      metalness: 0.06
    });

    const vanityCabinetMat = new THREE.MeshStandardMaterial({
      color: 0x424a5b,
      roughness: 0.35,
      metalness: 0.4
    });

    // Vanity main cabinet body (modern architectural slate gray, NOT pitch black)
    const cabinetGeo = new THREE.BoxGeometry(1.50, 0.66, 0.50);
    const vanityCabinet = new THREE.Mesh(cabinetGeo, vanityCabinetMat);
    vanityCabinet.position.set(0, 0.33, 2.02);
    vanityCabinet.castShadow = true;
    vanityCabinet.receiveShadow = true;
    bathGroup.add(vanityCabinet);

    // Cabinet door vertical division seam
    const cabinetSeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.60, 0.015),
      this.darkMetal
    );
    cabinetSeam.position.set(0, 0.33, 1.765);
    bathGroup.add(cabinetSeam);

    // Chrome cabinet door handles
    const handleGeo = new THREE.BoxGeometry(0.02, 0.12, 0.02);
    const handleL = new THREE.Mesh(handleGeo, this.chromeFrameMaterial);
    handleL.position.set(-0.06, 0.42, 1.76);
    bathGroup.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, this.chromeFrameMaterial);
    handleR.position.set(0.06, 0.42, 1.76);
    bathGroup.add(handleR);

    // Visible bright white ceramic countertop slab
    const counterGeo = new THREE.BoxGeometry(1.54, 0.05, 0.54);
    const counterTop = new THREE.Mesh(counterGeo, whiteCeramicMat);
    counterTop.position.set(0, 0.685, 2.02);
    counterTop.castShadow = true;
    counterTop.receiveShadow = true;
    bathGroup.add(counterTop);

    // =========================================================================
    // TRUE HOLLOWED-OUT WASHBASIN (Wastafel Cuci Muka dengan Bowl Cekung/Bolong)
    // =========================================================================
    const innerCeramicMat = new THREE.MeshStandardMaterial({
      color: 0xeef3f8,
      roughness: 0.18,
      metalness: 0.05
    });

    // 1. Bottom Floor of the Basin (sitting flush on counter at Y = 0.71)
    const basinFloorGeo = new THREE.BoxGeometry(0.66, 0.02, 0.38);
    const basinFloor = new THREE.Mesh(basinFloorGeo, innerCeramicMat);
    basinFloor.position.set(0, 0.72, 1.96);
    basinFloor.castShadow = true;
    basinFloor.receiveShadow = true;
    bathGroup.add(basinFloor);

    // 2. Perimeter Walls creating the hollow interior cavity (Height: 0.14m -> Top Rim Y = 0.85m)
    // Front Wall (nearest to camera in COMM)
    const frontWallGeo = new THREE.BoxGeometry(0.66, 0.14, 0.04);
    const frontWall = new THREE.Mesh(frontWallGeo, whiteCeramicMat);
    frontWall.position.set(0, 0.78, 1.77);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    bathGroup.add(frontWall);

    // Back Wall (near mirror & faucet)
    const backWallGeo = new THREE.BoxGeometry(0.66, 0.14, 0.04);
    const backWall = new THREE.Mesh(backWallGeo, whiteCeramicMat);
    backWall.position.set(0, 0.78, 2.15);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    bathGroup.add(backWall);

    // Left Wall
    const leftWallGeo = new THREE.BoxGeometry(0.04, 0.14, 0.34);
    const leftWall = new THREE.Mesh(leftWallGeo, whiteCeramicMat);
    leftWall.position.set(-0.31, 0.78, 1.96);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    bathGroup.add(leftWall);

    // Right Wall
    const rightWallGeo = new THREE.BoxGeometry(0.04, 0.14, 0.34);
    const rightWall = new THREE.Mesh(rightWallGeo, whiteCeramicMat);
    rightWall.position.set(0.31, 0.78, 1.96);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    bathGroup.add(rightWall);

    // 3. Smooth Radiused Outer Corners
    const cornerGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.14, 16);
    const corners = [
      { x: -0.31, z: 1.77 },
      { x: 0.31, z: 1.77 },
      { x: -0.31, z: 2.15 },
      { x: 0.31, z: 2.15 }
    ];
    corners.forEach(c => {
      const cornerMesh = new THREE.Mesh(cornerGeo, whiteCeramicMat);
      cornerMesh.position.set(c.x, 0.78, c.z);
      bathGroup.add(cornerMesh);
    });

    // 4. Chrome Drain Assembly at the bottom of the hollow cavity
    // Metallic drain flange ring
    const drainFlangeGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.006, 24);
    const drainFlange = new THREE.Mesh(drainFlangeGeo, this.chromeFrameMaterial);
    drainFlange.position.set(0, 0.732, 1.96);
    bathGroup.add(drainFlange);

    // Dark drain hole cavity (lubang pembuangan bolong hitam di tengah)
    const drainHoleGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.014, 24);
    const drainHoleMat = new THREE.MeshBasicMaterial({ color: 0x05080e });
    const drainHole = new THREE.Mesh(drainHoleGeo, drainHoleMat);
    drainHole.position.set(0, 0.734, 1.96);
    bathGroup.add(drainHole);

    // Chrome cross strainer grate inside the drain hole
    const crossPin1 = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.004, 0.005), this.chromeFrameMaterial);
    crossPin1.position.set(0, 0.736, 1.96);
    bathGroup.add(crossPin1);

    const crossPin2 = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.004, 0.038), this.chromeFrameMaterial);
    crossPin2.position.set(0, 0.736, 1.96);
    bathGroup.add(crossPin2);

    // 5. Subtle Translucent Water Surface inside the bowl
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x90d5ec,
      transmission: 0.82,
      roughness: 0.05,
      transparent: true,
      opacity: 0.42,
      ior: 1.33
    });
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.28), waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 0.738, 1.96);
    bathGroup.add(waterMesh);

    // 6. Sleek Chrome Cyber Faucet / Tap (Overhanging into the bowl)
    const tapStandGeo = new THREE.CylinderGeometry(0.018, 0.020, 0.22, 14);
    const tapStand = new THREE.Mesh(tapStandGeo, this.chromeFrameMaterial);
    tapStand.position.set(0, 0.82, 2.22);
    bathGroup.add(tapStand);

    const tapSpoutGeo = new THREE.BoxGeometry(0.024, 0.020, 0.16);
    const tapSpout = new THREE.Mesh(tapSpoutGeo, this.chromeFrameMaterial);
    tapSpout.position.set(0, 0.92, 2.13);
    bathGroup.add(tapSpout);

    const tapNozzleGeo = new THREE.CylinderGeometry(0.010, 0.010, 0.025, 12);
    const tapNozzle = new THREE.Mesh(tapNozzleGeo, this.chromeFrameMaterial);
    tapNozzle.position.set(0, 0.90, 2.06);
    bathGroup.add(tapNozzle);

    // Mixer control valves (cyan & red indicator)
    const coldRing = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.04, 0.032), this.cyanEmissive);
    coldRing.position.set(-0.08, 0.81, 2.22);
    bathGroup.add(coldRing);

    const hotRing = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.04, 0.032), this.pinkEmissive || this.warmOrangeEmissive);
    hotRing.position.set(0.08, 0.81, 2.22);
    bathGroup.add(hotRing);

    // 7. Dedicated Downlight Spot Illuminating the Hollow Bowl
    const sinkSpot = new THREE.SpotLight(0xfffaed, 2.5, 3.0, Math.PI / 4, 0.35, 1.2);
    sinkSpot.position.set(0, 1.70, 1.96);
    sinkSpot.target.position.set(0, 0.72, 1.96);
    bathGroup.add(sinkSpot);
    bathGroup.add(sinkSpot.target);

    // Under-counter subtle glow runner strip (highlights the vanity edge)
    const underGlow = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.015, 0.015), this.dimCyanEmissive);
    underGlow.position.set(0, 0.655, 1.76);
    bathGroup.add(underGlow);

    // Vanity accessories: Soap dispenser & rolled hand towel
    const dispenserGeo = new THREE.CylinderGeometry(0.024, 0.028, 0.13, 12);
    const dispenser = new THREE.Mesh(dispenserGeo, this.chromeFrameMaterial);
    dispenser.position.set(0.50, 0.775, 1.96);
    bathGroup.add(dispenser);

    const towelGeo = new THREE.BoxGeometry(0.18, 0.04, 0.22);
    const towel = new THREE.Mesh(towelGeo, whiteCeramicMat);
    towel.position.set(-0.50, 0.73, 1.96);
    bathGroup.add(towel);

    // Wall Mirror Frame (sleek beveled chrome silver chassis facing bed)
    const mirrorFrameGeo = new THREE.BoxGeometry(1.30, 1.54, 0.06);
    const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, this.chromeFrameMaterial);
    mirrorFrame.position.set(0, 1.55, 2.22);
    bathGroup.add(mirrorFrame);

    // Base highly-reflective Chrome Silver Mirror Glass (facing bed)
    const mirrorGeo = new THREE.BoxGeometry(1.24, 1.48, 0.015);
    const mirror = new THREE.Mesh(mirrorGeo, this.chromeMirrorMaterial);
    mirror.position.set(0, 1.55, 2.20);
    bathGroup.add(mirror);

    // Perimeter LED backlight strip framing the chrome mirror (dimmed 80%)
    const perimeterH = new THREE.BoxGeometry(1.26, 0.02, 0.018);
    const ledTop = new THREE.Mesh(perimeterH, this.dimCyanEmissive);
    ledTop.position.set(0, 1.55 + 0.74, 2.185);
    bathGroup.add(ledTop);

    const ledBottom = new THREE.Mesh(perimeterH, this.dimCyanEmissive);
    ledBottom.position.set(0, 1.55 - 0.74, 2.185);
    bathGroup.add(ledBottom);

    const perimeterV = new THREE.BoxGeometry(0.02, 1.48, 0.018);
    const ledLeft = new THREE.Mesh(perimeterV, this.dimCyanEmissive);
    ledLeft.position.set(-0.62, 1.55, 2.185);
    bathGroup.add(ledLeft);

    const ledRight = new THREE.Mesh(perimeterV, this.dimCyanEmissive);
    ledRight.position.set(0.62, 1.55, 2.185);
    bathGroup.add(ledRight);

    // 5. DIEGETIC SMART CYBERPUNK MIRROR DISPLAY (Facing Bed & Camera)
    const smartMirrorGeo = new THREE.PlaneGeometry(1.22, 1.46);
    const smartMirrorTexture = TextureGenerator.createSmartMirrorTexture();
    const smartMirrorMat = new THREE.MeshBasicMaterial({
      map: smartMirrorTexture,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.smartMirrorDisplay = new THREE.Mesh(smartMirrorGeo, smartMirrorMat);
    // Properly oriented facing -Z (towards bed and COMM camera) so text reads forwards
    this.smartMirrorDisplay.rotation.y = Math.PI;
    this.smartMirrorDisplay.position.set(0, 1.55, 2.180);
    bathGroup.add(this.smartMirrorDisplay);

    // 6. 3D INTERACTIVE BUTTONS ON MIRROR FACE (Facing Bed & Camera)
    this.mirrorButtons = [];

    // Note: When camera looks along +Z at the mirror, world +X is on the viewer's LEFT, -X is on the RIGHT
    const buttonConfigs = [
      {
        id: 'email',
        icon: '✉',
        title: 'EMAIL COMMS',
        subtitle: 'felixbariq@gmail.com',
        color: '#00F0FF',
        pos: { x: 0.28, y: 1.15 } // Screen Left (under photo)
      },
      {
        id: 'github',
        icon: '◈',
        title: 'GITHUB ARCHIVE',
        subtitle: 'github.com/felixpalingan',
        color: '#00F0FF',
        pos: { x: -0.28, y: 1.15 } // Screen Right (under telemetry)
      },
      {
        id: 'linkedin',
        icon: '◆',
        title: 'LINKEDIN NET',
        subtitle: 'in/almakius-felix-bariq-hekopung',
        color: '#00F0FF',
        pos: { x: 0.28, y: 0.97 } // Screen Left
      },
      {
        id: 'return',
        icon: '◄',
        title: 'DISENGAGE',
        subtitle: 'RETURN TO ROOM',
        color: '#FF003C',
        pos: { x: -0.28, y: 0.97 } // Screen Right
      }
    ];

    const btnGeo = new THREE.PlaneGeometry(0.52, 0.14);
    const chassisGeo = new THREE.BoxGeometry(0.524, 0.144, 0.02);

    buttonConfigs.forEach(cfg => {
      const normalTex = TextureGenerator.createMirrorButtonTexture(cfg);
      const hoverTex = TextureGenerator.createMirrorButtonTexture({ ...cfg, isHovered: true });
      const successTex = TextureGenerator.createMirrorButtonTexture({ ...cfg, isSuccess: true });

      const mat = new THREE.MeshBasicMaterial({
        map: normalTex,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x101622,
        roughness: 0.4,
        metalness: 0.8,
        transparent: true,
        opacity: 0.0
      });

      const btnMesh = new THREE.Mesh(btnGeo, mat);
      // Properly oriented facing -Z (towards bed and COMM camera)
      btnMesh.rotation.y = Math.PI;
      btnMesh.position.set(cfg.pos.x, cfg.pos.y, 2.165);

      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.position.set(cfg.pos.x, cfg.pos.y, 2.176);

      btnMesh.userData = {
        id: cfg.id,
        cfg: cfg,
        normalTex: normalTex,
        hoverTex: hoverTex,
        successTex: successTex,
        baseZ: 2.165,
        chassis: chassisMesh,
        isHovered: false
      };

      bathGroup.add(chassisMesh);
      bathGroup.add(btnMesh);
      this.mirrorButtons.push(btnMesh);
    });

    // Dedicated overhead vanity light bar (dimmed 80%)
    const mirrorLightGeo = new THREE.BoxGeometry(1.26, 0.05, 0.08);
    const mirrorLightMesh = new THREE.Mesh(mirrorLightGeo, this.dimWhiteEmissive);
    mirrorLightMesh.position.set(0, 2.34, 2.15);
    bathGroup.add(mirrorLightMesh);

    // Specular spotlight aimed at mirror surface from in front (dimmed 80%: 5.0 -> 1.0)
    const mirrorSpot = new THREE.SpotLight(0xf0f6ff, 1.0, 4.5, Math.PI / 3, 0.25, 1.1);
    mirrorSpot.position.set(0, 2.25, 1.1);
    mirrorSpot.target.position.set(0, 1.55, 2.20);
    bathGroup.add(mirrorSpot);
    bathGroup.add(mirrorSpot.target);

    // Soft cool ambient point light in front of vanity (dimmed 80%: 2.2 -> 0.44)
    this.mirrorAmbient = new THREE.PointLight(0x00F0FF, 0.44, 3.5, 1.3);
    this.mirrorAmbient.position.set(0, 1.7, 1.6);
    bathGroup.add(this.mirrorAmbient);

    this.group.add(bathGroup);
  }

  /**
   * Activates or deactivates the Cyberpunk Smart Mirror biometric HUD with fade-in effect
   */
  setMirrorActive(active) {
    if (!this.smartMirrorDisplay) return;
    gsap.killTweensOf(this.smartMirrorDisplay.material);

    if (this.mirrorButtons) {
      this.mirrorButtons.forEach(b => {
        gsap.killTweensOf(b.material);
        if (b.userData.chassis) gsap.killTweensOf(b.userData.chassis.material);
      });
    }

    if (active) {
      // Cyberpunk 2077 digital glitch flicker fade-in
      this.smartMirrorDisplay.material.opacity = 0;
      gsap.timeline()
        .to(this.smartMirrorDisplay.material, { opacity: 0.85, duration: 0.12, ease: 'steps(2)' })
        .to(this.smartMirrorDisplay.material, { opacity: 0.3, duration: 0.08 })
        .to(this.smartMirrorDisplay.material, { opacity: 0.98, duration: 0.35, ease: 'power2.out' });

      // Stagger fade-in for 3D buttons on the mirror
      if (this.mirrorButtons) {
        this.mirrorButtons.forEach((b, i) => {
          b.material.opacity = 0;
          if (b.userData.chassis) b.userData.chassis.material.opacity = 0;
          gsap.to(b.material, {
            opacity: 0.98,
            duration: 0.35,
            delay: 0.18 + i * 0.06,
            ease: 'power2.out'
          });
          if (b.userData.chassis) {
            gsap.to(b.userData.chassis.material, {
              opacity: 0.92,
              duration: 0.35,
              delay: 0.18 + i * 0.06,
              ease: 'power2.out'
            });
          }
        });
      }
    } else {
      gsap.to(this.smartMirrorDisplay.material, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      });

      if (this.mirrorButtons) {
        this.mirrorButtons.forEach(b => {
          gsap.to(b.material, { opacity: 0, duration: 0.25, ease: 'power2.in' });
          if (b.userData.chassis) {
            gsap.to(b.userData.chassis.material, { opacity: 0, duration: 0.25, ease: 'power2.in' });
          }
        });
      }
    }
  }

  // ===========================================================================
  // 2C: NETRUNNER WORKSTATION (Bottom-Left - Focus for PROJECTS)
  // ===========================================================================
  buildNetrunnerWorkstation() {
    const deskGroup = new THREE.Group();
    // Positioned in bottom-right (mirrored), facing monitor with back to room
    deskGroup.position.set(3.0, 0, 1.85);
    deskGroup.rotation.y = Math.PI;

    // Main Desk Tabletop (Matte Carbon Fiber weave)
    const topGeo = new THREE.BoxGeometry(2.1, 0.08, 1.0);
    const deskTop = new THREE.Mesh(topGeo, this.deskMaterial);
    deskTop.position.set(0, 0.72, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Front edge cyan neon trim strip (facing bed/room)
    const deskFrontEdge = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.025, 0.025), this.cyanEmissive);
    deskFrontEdge.position.set(0, 0.74, 0.51);
    deskGroup.add(deskFrontEdge);

    // Rear edge neon accent strip (facing camera)
    const deskRearEdge = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.02, 0.02), this.cyanEmissive);
    deskRearEdge.position.set(0, 0.74, -0.51);
    deskGroup.add(deskRearEdge);

    // Sturdy industrial metal frame legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.72, 0.9);
    const legL = new THREE.Mesh(legGeo, this.darkMetal);
    legL.position.set(-0.95, 0.36, 0);
    deskGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, this.darkMetal);
    legR.position.set(0.95, 0.36, 0);
    deskGroup.add(legR);

    // =========================================================================
    // INTERACTIVE CURVED TRIPLE MONITOR BATTLESTATION (PROJECTS Showcase Terminal)
    // Left Screen: Shard Directory / Project Selector (720x540)
    // Center Screen: Main Project Dossier, Tech Stack, & Action Buttons (1024x576)
    // Right Screen: Live Radar Telemetry, Nav Deck, & Control Manual (720x540)
    // =========================================================================

    // 1. Canvases & Textures
    this.projectLeftCanvas = document.createElement('canvas');
    this.projectLeftCanvas.width = 720;
    this.projectLeftCanvas.height = 540;
    this.projectLeftTexture = new THREE.CanvasTexture(this.projectLeftCanvas);
    this.projectLeftTexture.minFilter = THREE.LinearFilter;
    this.projectLeftTexture.magFilter = THREE.LinearFilter;
    this.projectLeftCanvas._ownerTexture = this.projectLeftTexture;
    this.projectLeftCanvas._redrawCallback = () => this.updateAllMonitors();

    this.projectCenterCanvas = document.createElement('canvas');
    this.projectCenterCanvas.width = 1024;
    this.projectCenterCanvas.height = 576;
    this.projectCenterTexture = new THREE.CanvasTexture(this.projectCenterCanvas);
    this.projectCenterTexture.minFilter = THREE.LinearFilter;
    this.projectCenterTexture.magFilter = THREE.LinearFilter;
    this.projectCenterCanvas._ownerTexture = this.projectCenterTexture;
    this.projectCenterCanvas._redrawCallback = () => this.updateAllMonitors();

    this.projectRightCanvas = document.createElement('canvas');
    this.projectRightCanvas.width = 720;
    this.projectRightCanvas.height = 540;
    this.projectRightTexture = new THREE.CanvasTexture(this.projectRightCanvas);
    this.projectRightTexture.minFilter = THREE.LinearFilter;
    this.projectRightTexture.magFilter = THREE.LinearFilter;
    this.projectRightCanvas._ownerTexture = this.projectRightTexture;
    this.projectRightCanvas._redrawCallback = () => this.updateAllMonitors();

    // Initial renders
    TextureGenerator.renderProjectLeftMonitorCanvas(
      this.projectLeftCanvas,
      this.projects,
      this.currentProjectIndex,
      null
    );
    this.projectLeftTexture.needsUpdate = true;

    TextureGenerator.renderProjectCenterMonitorCanvas(
      this.projectCenterCanvas,
      this.getCurrentProject(),
      this.currentProjectIndex,
      this.projects.length,
      null
    );
    this.projectCenterTexture.needsUpdate = true;

    TextureGenerator.renderProjectRightMonitorCanvas(
      this.projectRightCanvas,
      this.getCurrentProject(),
      this.currentProjectIndex,
      this.projects.length,
      null
    );
    this.projectRightTexture.needsUpdate = true;

    // 2. CENTER MONITOR (16:9 Aspect Ratio)
    // Width 0.88m, Height 0.50m
    const centerScreenGeo = new THREE.PlaneGeometry(0.88, 0.50);
    const centerScreenMat = new THREE.MeshBasicMaterial({
      map: this.projectCenterTexture,
      side: THREE.DoubleSide
    });
    this.projectMonitorCenter = new THREE.Mesh(centerScreenGeo, centerScreenMat);
    this.projectMonitorCenter.position.set(0, 1.18, -0.218);
    this.projectMonitorCenter.userData = {
      isProjectMonitor: true,
      monitorType: 'center'
    };
    deskGroup.add(this.projectMonitorCenter);
    this.projectMonitorScreen = this.projectMonitorCenter; // backward compatibility

    const centerBezelGeo = new THREE.BoxGeometry(0.92, 0.54, 0.035);
    const centerBezel = new THREE.Mesh(centerBezelGeo, this.darkMetal);
    centerBezel.position.set(0, 1.18, -0.236);
    deskGroup.add(centerBezel);

    const centerTopRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.012, 0.02),
      this.cyanEmissive
    );
    centerTopRim.position.set(0, 1.455, -0.23);
    deskGroup.add(centerTopRim);

    // 3. LEFT MONITOR (4:3 Aspect Ratio, Angled inward towards pilot at local +X)
    // Width 0.64m, Height 0.48m, rotated inward by -0.38 rad
    const leftMonitorGroup = new THREE.Group();
    leftMonitorGroup.position.set(0.74, 1.18, -0.13);
    leftMonitorGroup.rotation.y = -0.38;

    const leftScreenGeo = new THREE.PlaneGeometry(0.64, 0.48);
    const leftScreenMat = new THREE.MeshBasicMaterial({
      map: this.projectLeftTexture,
      side: THREE.DoubleSide
    });
    this.projectMonitorLeft = new THREE.Mesh(leftScreenGeo, leftScreenMat);
    this.projectMonitorLeft.position.set(0, 0, 0.002);
    this.projectMonitorLeft.userData = {
      isProjectMonitor: true,
      monitorType: 'left'
    };
    leftMonitorGroup.add(this.projectMonitorLeft);

    const leftBezelGeo = new THREE.BoxGeometry(0.68, 0.52, 0.035);
    const leftBezel = new THREE.Mesh(leftBezelGeo, this.darkMetal);
    leftBezel.position.set(0, 0, -0.018);
    leftMonitorGroup.add(leftBezel);

    const leftTopRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.69, 0.012, 0.02),
      this.cyanEmissive
    );
    leftTopRim.position.set(0, 0.262, -0.01);
    leftMonitorGroup.add(leftTopRim);
    deskGroup.add(leftMonitorGroup);

    // 4. RIGHT MONITOR (4:3 Aspect Ratio, Angled inward towards pilot at local -X)
    // Width 0.64m, Height 0.48m, rotated inward by +0.38 rad
    const rightMonitorGroup = new THREE.Group();
    rightMonitorGroup.position.set(-0.74, 1.18, -0.13);
    rightMonitorGroup.rotation.y = 0.38;

    const rightScreenGeo = new THREE.PlaneGeometry(0.64, 0.48);
    const rightScreenMat = new THREE.MeshBasicMaterial({
      map: this.projectRightTexture,
      side: THREE.DoubleSide
    });
    this.projectMonitorRight = new THREE.Mesh(rightScreenGeo, rightScreenMat);
    this.projectMonitorRight.position.set(0, 0, 0.002);
    this.projectMonitorRight.userData = {
      isProjectMonitor: true,
      monitorType: 'right'
    };
    rightMonitorGroup.add(this.projectMonitorRight);

    const rightBezelGeo = new THREE.BoxGeometry(0.68, 0.52, 0.035);
    const rightBezel = new THREE.Mesh(rightBezelGeo, this.darkMetal);
    rightBezel.position.set(0, 0, -0.018);
    rightMonitorGroup.add(rightBezel);

    const rightTopRim = new THREE.Mesh(
      new THREE.BoxGeometry(0.69, 0.012, 0.02),
      this.cyanEmissive
    );
    rightTopRim.position.set(0, 0.262, -0.01);
    rightMonitorGroup.add(rightTopRim);
    deskGroup.add(rightMonitorGroup);

    // Master array of interactive monitors
    this.projectMonitors = [
      this.projectMonitorCenter,
      this.projectMonitorLeft,
      this.projectMonitorRight
    ];

    // Rear monitor chassis accent stripe (visible from apartment room)
    const rearMonitorEmblem = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.025, 0.02),
      this.cyanEmissive
    );
    rearMonitorEmblem.position.set(0, 1.25, -0.26);
    deskGroup.add(rearMonitorEmblem);

    // Heavy duty triple monitor desk clamp stand & articulating arms
    const standPoleGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.52, 10);
    const standPole = new THREE.Mesh(standPoleGeo, this.darkMetal);
    standPole.position.set(0, 0.98, -0.28);
    deskGroup.add(standPole);

    const standBaseGeo = new THREE.BoxGeometry(0.36, 0.025, 0.26);
    const standBase = new THREE.Mesh(standBaseGeo, this.darkMetal);
    standBase.position.set(0, 0.74, -0.26);
    deskGroup.add(standBase);

    // Clean triple monitor mount (arms removed to prevent clipping through screens)

    // Dedicated Overhead Workstation Desk Task Light
    const deskTaskSpot = new THREE.SpotLight(0xffecd0, 3.8, 4.5, Math.PI / 3, 0.35, 1.2);
    deskTaskSpot.position.set(0, 2.1, 0.3);
    deskTaskSpot.target.position.set(0, 0.72, 0.1);
    deskGroup.add(deskTaskSpot);
    deskGroup.add(deskTaskSpot.target);

    // Warm ambient point light directly over the desk
    const deskWarmGlow = new THREE.PointLight(0xffa855, 2.2, 3.2, 1.2);
    deskWarmGlow.position.set(0, 1.4, 0.35);
    deskGroup.add(deskWarmGlow);

    // Monitor glow casting on the desk
    const monitorLight = new THREE.PointLight(0x00F0FF, 2.4, 2.8, 1.3);
    monitorLight.position.set(0, 1.18, 0.25);
    deskGroup.add(monitorLight);

    // Backlit Mechanical Keyboard
    const kbGeo = new THREE.BoxGeometry(0.48, 0.02, 0.16);
    const kbMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.25,
      roughness: 0.5
    });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0.1, 0.77, 0.15);
    deskGroup.add(kb);

    // Mouse & Mousepad
    const mousepadGeo = new THREE.BoxGeometry(0.24, 0.005, 0.22);
    const mousepad = new THREE.Mesh(mousepadGeo, this.cushionMaterial);
    mousepad.position.set(-0.36, 0.765, 0.15);
    deskGroup.add(mousepad);

    // =========================================================================
    // TACTILE DESK CONTROL MACROPAD (Physical 3D buttons on desk to browse projects)
    // =========================================================================
    this.projectControlButtons = [];
    const macroPadBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.018, 0.09),
      this.darkMetal
    );
    macroPadBase.position.set(0, 0.762, -0.02);
    deskGroup.add(macroPadBase);

    const deskBtnConfigs = [
      {
        id: 'prev',
        label: '◄ PREV',
        color: 0x00F0FF,
        x: -0.22,
        action: 'prev',
        toast: 'SWITCHING TO PREVIOUS PROJECT'
      },
      {
        id: 'next',
        label: 'NEXT ►',
        color: 0x00F0FF,
        x: 0.0,
        action: 'next',
        toast: 'SWITCHING TO NEXT PROJECT'
      },
      {
        id: 'repo',
        label: '◈ GITHUB',
        color: 0xFCEE09,
        x: 0.22,
        action: 'repo',
        toast: 'OPENING GITHUB REPOSITORY'
      }
    ];

    deskBtnConfigs.forEach(btnCfg => {
      const btnMat = new THREE.MeshStandardMaterial({
        color: 0x101726,
        roughness: 0.3,
        metalness: 0.7,
        emissive: btnCfg.color,
        emissiveIntensity: 0.35
      });
      const btnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.016, 0.07), btnMat);
      btnMesh.position.set(btnCfg.x, 0.776, -0.02);
      btnMesh.userData = {
        isDeskButton: true,
        action: btnCfg.action,
        cfg: btnCfg,
        baseY: 0.776
      };
      deskGroup.add(btnMesh);
      this.projectControlButtons.push(btnMesh);
    });

    // PC Server Tower / Rack beside desk (mirrored towards right wall)
    const towerGeo = new THREE.BoxGeometry(0.26, 0.55, 0.6);
    const tower = new THREE.Mesh(towerGeo, this.darkMetal);
    tower.position.set(-0.68, 0.28, 0.05);
    deskGroup.add(tower);

    // Glowing RGB strip on PC tower
    const rgbStripGeo = new THREE.BoxGeometry(0.02, 0.48, 0.02);
    const rgbStrip = new THREE.Mesh(rgbStripGeo, this.cyanEmissive);
    rgbStrip.position.set(-0.55, 0.28, 0.35);
    deskGroup.add(rgbStrip);

    // Dynamic Netrunner Server Rack Activity LEDs
    const ledColors = [0x00FF66, 0xFFB400, 0x00F0FF, 0xFF003C];
    const ledMeshes = [];
    for (let i = 0; i < 4; i++) {
      const ledGeo = new THREE.BoxGeometry(0.018, 0.018, 0.01);
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColors[i] });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(-0.58 - i * 0.05, 0.51, 0.355);
      deskGroup.add(ledMesh);
      ledMeshes.push({ mesh: ledMesh, color: ledColors[i], phase: i * 1.7 });
    }

    this.animatedObjects.push({
      update: () => {
        const t = Date.now() * 0.005;
        for (let i = 0; i < ledMeshes.length; i++) {
          const item = ledMeshes[i];
          const blink = Math.sin(t * (1.5 + i * 0.7) + item.phase) > 0.2;
          item.mesh.material.color.setHex(blink ? item.color : 0x050505);
        }
      }
    });

    // Shelves mounted along RIGHT apartment wall beside desk (x = -1.25 in deskGroup -> world X = +4.25)
    const shelfGeo = new THREE.BoxGeometry(0.35, 0.05, 1.6);
    const shelf1 = new THREE.Mesh(shelfGeo, this.darkMetal);
    shelf1.position.set(-1.25, 1.8, 0);
    deskGroup.add(shelf1);

    const shelf2 = new THREE.Mesh(shelfGeo, this.darkMetal);
    shelf2.position.set(-1.25, 2.25, 0);
    deskGroup.add(shelf2);

    // Warm shelf strip light
    const shelfLightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 1.4), this.warmOrangeEmissive);
    shelfLightMesh.position.set(-1.22, 1.76, 0);
    deskGroup.add(shelfLightMesh);

    const shelfPoint = new THREE.PointLight(0xff7722, 1.4, 2.2);
    shelfPoint.position.set(-1.0, 1.7, 0);
    deskGroup.add(shelfPoint);

    // Props on shelves: server drive arrays & datashards
    for (let s = -0.5; s <= 0.5; s += 0.25) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), this.darkMetal);
      box.position.set(-1.25, 1.92, s);
      deskGroup.add(box);
    }

    // =========================================================================
    // SWIVEL CHAIR — PUSHED TO THE SIDE (Never blocks camera line-of-sight!)
    // Geser ke arah lorong kamar (x = 0.68), posisi tucked ke samping meja.
    // =========================================================================
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0.68, 0, 0.35); // Geser 68cm ke kiri viewer, pandangan monitor 100% plong!
    chairGroup.rotation.y = 0.55; // Mengarah natural ke sudut meja

    // Chair base star & piston
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), this.darkMetal);
    piston.position.y = 0.2;
    chairGroup.add(piston);

    // Seat cushion
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.32, 0.1, 16), this.cushionMaterial);
    seat.position.y = 0.45;
    chairGroup.add(seat);

    // Curved backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.1), this.cushionMaterial);
    backrest.position.set(0, 0.8, 0.25);
    backrest.rotation.x = 0.1;
    chairGroup.add(backrest);

    deskGroup.add(chairGroup);

    // Samurai Bomber Jacket hanging on the right wall
    const jacketGroup = new THREE.Group();
    jacketGroup.position.set(-1.25, 1.6, 0.85);

    const jacketHook = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), this.darkMetal);
    jacketHook.rotation.z = -Math.PI / 2;
    jacketGroup.add(jacketHook);

    // Leather jacket silhouette (dark leather with yellow Samurai collar)
    const jacketBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.28), new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.6,
      metalness: 0.15
    }));
    jacketBody.position.set(0, -0.35, 0);
    jacketGroup.add(jacketBody);

    // Glowing Samurai collar neon rim
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.24), this.yellowAccentMaterial);
    collar.position.set(0, -0.05, 0);
    jacketGroup.add(collar);

    deskGroup.add(jacketGroup);
    this.group.add(deskGroup);
  }

  /**
   * Updates active project across the Triple Monitor Battlestation
   */
  setProjectIndex(newIndex, hoveredAction = null) {
    if (!this.projects || this.projects.length === 0) return null;
    this.currentProjectIndex = ((newIndex % this.projects.length) + this.projects.length) % this.projects.length;
    this.currentProjectHover = hoveredAction;
    this.updateAllMonitors();
    return this.getCurrentProject();
  }

  /**
   * Updates hover state highlights across the Triple Monitor Battlestation
   */
  setProjectHover(hoveredAction, hoveredIndex = null) {
    if (this.currentProjectHover === hoveredAction && this.hoveredProjectIndex === hoveredIndex) return;
    this.currentProjectHover = hoveredAction;
    this.hoveredProjectIndex = hoveredIndex;
    this.updateAllMonitors();
  }

  /**
   * Redraws canvases and marks textures for all three monitors
   */
  updateAllMonitors() {
    const currentProj = this.getCurrentProject();
    if (!currentProj) return;

    // Center Monitor: Project dossier
    if (this.projectCenterCanvas && this.projectCenterTexture) {
      TextureGenerator.renderProjectCenterMonitorCanvas(
        this.projectCenterCanvas,
        currentProj,
        this.currentProjectIndex,
        this.projects.length,
        this.currentProjectHover
      );
      this.projectCenterTexture.needsUpdate = true;
    }

    // Left Monitor: Shard directory list
    if (this.projectLeftCanvas && this.projectLeftTexture) {
      TextureGenerator.renderProjectLeftMonitorCanvas(
        this.projectLeftCanvas,
        this.projects,
        this.currentProjectIndex,
        this.hoveredProjectIndex
      );
      this.projectLeftTexture.needsUpdate = true;
    }

    // Right Monitor: Telemetry & nav controls
    if (this.projectRightCanvas && this.projectRightTexture) {
      TextureGenerator.renderProjectRightMonitorCanvas(
        this.projectRightCanvas,
        currentProj,
        this.currentProjectIndex,
        this.projects.length,
        this.currentProjectHover
      );
      this.projectRightTexture.needsUpdate = true;
    }
  }

  getCurrentProject() {
    return this.projects[this.currentProjectIndex] || null;
  }

  // ===========================================================================
  // 2E: SUNKEN LOUNGE AREA (Top-Right - Focus for STATS)
  // ===========================================================================
  buildSunkenLounge() {
    const loungeGroup = new THREE.Group();
    this.loungeGroup = loungeGroup;
    // Positioned down inside the deepened sunken arena (y = -0.38)
    loungeGroup.position.set(3.05, -0.38, -2.05);

    // Carpet rug (patterned dark cyber fabric)
    const rugGeo = new THREE.PlaneGeometry(2.7, 2.7);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x18141f,
      roughness: 0.95
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0);
    rug.receiveShadow = true;
    loungeGroup.add(rug);

    // =========================================================================
    // COUCH FLUSH TO WALLS (Back wall at z = -1.45, Right wall at x = +1.45)
    // =========================================================================
    // 1. Main back sofa seat (flush to back wall)
    const sofaBackSeatGeo = new THREE.BoxGeometry(2.4, 0.42, 0.85);
    const sofaBackSeat = new THREE.Mesh(sofaBackSeatGeo, this.cushionMaterial);
    sofaBackSeat.position.set(-0.25, 0.21, -1.025);
    sofaBackSeat.castShadow = true;
    sofaBackSeat.receiveShadow = true;
    loungeGroup.add(sofaBackSeat);

    // Backrest along back wall (touching wall at z = -1.45)
    const backRestWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.46, 0.16), this.cushionMaterial);
    backRestWall.position.set(-0.25, 0.58, -1.37);
    loungeGroup.add(backRestWall);

    // 2. Side sofa seat (flush to right wall)
    const sofaSideSeatGeo = new THREE.BoxGeometry(0.85, 0.42, 1.8);
    const sofaSideSeat = new THREE.Mesh(sofaSideSeatGeo, this.cushionMaterial);
    sofaSideSeat.position.set(1.025, 0.21, 0.2);
    sofaSideSeat.castShadow = true;
    sofaSideSeat.receiveShadow = true;
    loungeGroup.add(sofaSideSeat);

    // Side backrest along right wall (touching wall at x = +1.45)
    const sideRestWall = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.46, 1.8), this.cushionMaterial);
    sideRestWall.position.set(1.37, 0.58, 0.2);
    loungeGroup.add(sideRestWall);

    // Pillows NESTLED AGAINST BACKRESTS (fixed position and natural angle)
    // Pillow 1: Cyber Yellow nestled on backrest
    const pillowY = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.12), this.yellowAccentMaterial);
    pillowY.position.set(-0.7, 0.52, -1.24);
    pillowY.rotation.x = -0.12;
    pillowY.rotation.z = 0.08;
    loungeGroup.add(pillowY);

    // Pillow 2: Crimson red nestled on side backrest
    const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.38), new THREE.MeshStandardMaterial({
      color: 0xd4083a,
      roughness: 0.75
    }));
    pillowR.position.set(1.24, 0.52, 0.4);
    pillowR.rotation.z = 0.12;
    pillowR.rotation.y = 0.05;
    loungeGroup.add(pillowR);

    // Pillow 3: Corner cushion resting in the L-corner
    const pillowCorner = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 0.12), new THREE.MeshStandardMaterial({
      color: 0x2e3547,
      roughness: 0.85
    }));
    pillowCorner.position.set(0.75, 0.52, -1.18);
    pillowCorner.rotation.y = -0.78; // 45 degree angle into corner
    pillowCorner.rotation.x = -0.1;
    loungeGroup.add(pillowCorner);

    // Modern Low Coffee Table
    const tableGeo = new THREE.CylinderGeometry(0.55, 0.5, 0.26, 24);
    const table = new THREE.Mesh(tableGeo, this.tanMetal);
    table.position.set(-0.15, 0.13, 0.1);
    table.castShadow = true;
    loungeGroup.add(table);

    // Props on Coffee Table: Vinyl Record Player Turntable
    const ttBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.32), this.darkMetal);
    ttBase.position.set(-0.15, 0.28, 0.1);
    loungeGroup.add(ttBase);

    // Spinning Vinyl Record
    const vinylGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.005, 24);
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.2,
      metalness: 0.8
    });
    this.vinyl = new THREE.Mesh(vinylGeo, vinylMat);
    this.vinyl.position.set(-0.15, 0.305, 0.1);
    loungeGroup.add(this.vinyl);
    this.animatedObjects.push({
      update: () => {
        this.vinyl.rotation.y += 0.02; // Slow vinyl rotation
      }
    });

    // =========================================================================
    // 360-DEGREE CYLINDRICAL RUNNING TEXT MONITOR & NEON GREEN EMITTER
    // =========================================================================
    const tickerCanvas = document.createElement('canvas');
    tickerCanvas.width = 2048;
    tickerCanvas.height = 256;
    const tctx = tickerCanvas.getContext('2d');

    // Cyberpunk semi-transparent glowing holographic background
    tctx.fillStyle = '#030d06';
    tctx.fillRect(0, 0, 2048, 256);

    // Electric Neon Green borders top and bottom
    tctx.fillStyle = '#00FF66';
    tctx.fillRect(0, 0, 2048, 8);
    tctx.fillRect(0, 248, 2048, 8);
    tctx.fillStyle = '#39FF14';
    tctx.fillRect(0, 8, 2048, 3);
    tctx.fillRect(0, 245, 2048, 3);

    // Running text marquee pattern in Electric Neon Green
    tctx.shadowColor = '#00FF66';
    tctx.shadowBlur = 22;
    tctx.fillStyle = '#00FF66';
    tctx.font = 'bold 44px monospace';
    const marqueeText = "⚡ PORTO ALMAKIUS FELIX BARIQ HEKOPUNG ⚡ PORTO ALMAKIUS FELIX BARIQ HEKOPUNG ⚡ PORTO ALMAKIUS FELIX BARIQ HEKOPUNG ⚡ ";
    tctx.fillText(marqueeText, 30, 145);

    const tickerTexture = new THREE.CanvasTexture(tickerCanvas);
    tickerTexture.wrapS = THREE.RepeatWrapping;
    tickerTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 360 Cylindrical Screen Geometry (open-ended cylinder visible from all 360 degrees)
    const cylGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.38, 48, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      map: tickerTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    this.cylScreen = new THREE.Mesh(cylGeo, cylMat);
    this.cylScreen.position.set(-0.15, 1.45, 0.1);
    loungeGroup.add(this.cylScreen);

    // Screen top & bottom metallic mounting rings
    const ringGeo = new THREE.CylinderGeometry(0.73, 0.73, 0.03, 48, 1, true);
    const ringTop = new THREE.Mesh(ringGeo, this.darkMetal);
    ringTop.position.set(-0.15, 1.64, 0.1);
    loungeGroup.add(ringTop);

    const ringBot = new THREE.Mesh(ringGeo, this.darkMetal);
    ringBot.position.set(-0.15, 1.26, 0.1);
    loungeGroup.add(ringBot);

    // Suspension ceiling rod for 360 monitor
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8);
    const rod = new THREE.Mesh(rodGeo, this.darkMetal);
    rod.position.set(-0.15, 2.34, 0.1);
    loungeGroup.add(rod);

    // =========================================================================
    // DYNAMIC NEON GREEN LIGHT EMANATING DIRECTLY FROM THE 360 MONITOR
    // =========================================================================
    this.loungeNeonLight = new THREE.PointLight(0x00FF66, 4.2, 6.5, 1.1);
    this.loungeNeonLight.position.set(-0.15, 1.45, 0.1);
    loungeGroup.add(this.loungeNeonLight);

    // Register animation loop: Continuous 360 text scroll and gentle neon green pulsing
    let tickerOffset = 0;
    this.animatedObjects.push({
      update: () => {
        // Slow, readable running text around 360 degrees
        tickerOffset += 0.00045;
        tickerTexture.offset.x = tickerOffset;
        this.cylScreen.rotation.y += 0.0008;

        // Subtle electric neon green breathing pulse
        const time = Date.now() * 0.002;
        this.loungeNeonLight.intensity = 4.0 + Math.sin(time) * 0.7;
      }
    });

    // =========================================================================
    // BRAINDANCE (BD) HEADSET UNIT (AUTHENTIC CYBERPUNK 2077 BD WREATH)
    // Modeled precisely after the reference image: curved forehead arch,
    // temple housing blocks with illuminated blue neural crystals, dual cranial
    // electrode suction discs, articulated downward ocular arms & optic diodes.
    // =========================================================================
    // Ceiling mount socket in sunken lounge ceiling (y = 3.18)
    const socketGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.06, 12);
    const socket = new THREE.Mesh(socketGeo, this.darkMetal);
    socket.position.set(this.bdRestPosition.x, 3.15, this.bdRestPosition.z);
    loungeGroup.add(socket);

    // Dynamic suspension cord spanning from ceiling downwards to wreath
    const cordGeo = new THREE.CylinderGeometry(0.005, 0.005, 1.0, 8);
    cordGeo.translate(0, -0.5, 0); // pivot at top of cylinder
    const cord = new THREE.Mesh(cordGeo, this.darkMetal);
    cord.position.set(this.bdRestPosition.x, 3.18, this.bdRestPosition.z);
    loungeGroup.add(cord);
    this.bdCord = cord;

    const bdGroup = new THREE.Group();
    bdGroup.position.set(this.bdRestPosition.x, this.bdRestPosition.y, this.bdRestPosition.z);
    bdGroup.rotation.set(this.bdRestRotation.x, this.bdRestRotation.y, this.bdRestRotation.z);

    const frameMat = this.darkMetal;
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x14171d,
      roughness: 0.38,
      metalness: 0.82
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x8a94a6,
      roughness: 0.22,
      metalness: 0.96
    });
    const blueCrystalMat = new THREE.MeshBasicMaterial({
      color: 0x00D9FF
    });
    const lensEmissiveMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF
    });

    // 1. Central Forehead Brow Arch
    const browCenter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.026), carbonMat);
    browCenter.position.set(0, 0.04, -0.01);
    bdGroup.add(browCenter);

    const browLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.024), frameMat);
    browLeft.position.set(-0.085, 0.038, 0.02);
    browLeft.rotation.y = 0.35;
    bdGroup.add(browLeft);

    const browRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.024), frameMat);
    browRight.position.set(0.085, 0.038, 0.02);
    browRight.rotation.y = -0.35;
    bdGroup.add(browRight);

    // 2. Temple Side Housing Blocks & Cranial Suction Discs
    [-1, 1].forEach(side => {
      const isL = side === -1;
      const xSign = side;

      // Temple module body
      const templeGeo = new THREE.BoxGeometry(0.028, 0.048, 0.16);
      const temple = new THREE.Mesh(templeGeo, carbonMat);
      temple.position.set(xSign * 0.135, 0.025, 0.09);
      temple.rotation.y = xSign * -0.08;
      bdGroup.add(temple);

      // Metallic reinforcement trim
      const trimGeo = new THREE.BoxGeometry(0.008, 0.018, 0.14);
      const trim = new THREE.Mesh(trimGeo, chromeMat);
      trim.position.set(xSign * 0.148, 0.035, 0.09);
      trim.rotation.y = xSign * -0.08;
      bdGroup.add(trim);

      // Glowing Blue/Cyan Neural Crystal on upper-rear (exact reference feature)
      const crystalGeo = new THREE.BoxGeometry(0.018, 0.024, 0.035);
      const crystal = new THREE.Mesh(crystalGeo, blueCrystalMat);
      crystal.position.set(xSign * 0.138, 0.054, 0.155);
      crystal.rotation.x = 0.25;
      bdGroup.add(crystal);

      // 3. Dual Cranial Neural Electrodes / Suction Discs (Upper & Lower)
      // Upper suction electrode stalk & pad
      const stalkUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.045, 8), chromeMat);
      stalkUpper.position.set(xSign * 0.11, 0.02, 0.06);
      stalkUpper.rotation.z = xSign * (Math.PI / 2 + 0.2);
      bdGroup.add(stalkUpper);

      const discUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.005, 24), frameMat);
      discUpper.position.set(xSign * 0.088, 0.028, 0.06);
      discUpper.rotation.z = Math.PI / 2;
      bdGroup.add(discUpper);

      const padUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.003, 16), chromeMat);
      padUpper.position.set(xSign * 0.085, 0.028, 0.06);
      padUpper.rotation.z = Math.PI / 2;
      bdGroup.add(padUpper);

      // Lower suction electrode stalk & pad
      const stalkLower = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.038, 8), chromeMat);
      stalkLower.position.set(xSign * 0.115, -0.015, 0.10);
      stalkLower.rotation.z = xSign * (Math.PI / 2 - 0.2);
      bdGroup.add(stalkLower);

      const discLower = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.005, 24), frameMat);
      discLower.position.set(xSign * 0.096, -0.022, 0.10);
      discLower.rotation.z = Math.PI / 2;
      bdGroup.add(discLower);

      // 4. Downward / Forward Ocular Projector Arms
      const ocularArmGeo = new THREE.BoxGeometry(0.014, 0.018, 0.11);
      const ocularArm = new THREE.Mesh(ocularArmGeo, frameMat);
      ocularArm.position.set(xSign * 0.115, -0.015, -0.025);
      ocularArm.rotation.x = -0.45;
      ocularArm.rotation.y = xSign * 0.2;
      bdGroup.add(ocularArm);

      // Micro Cyber-Wiring Conduit along the arm
      const wireGeo = new THREE.CylinderGeometry(0.0018, 0.0018, 0.095, 6);
      const wireMat = new THREE.MeshBasicMaterial({ color: isL ? 0x00F0FF : 0xFF003C });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.position.set(xSign * 0.124, -0.012, -0.025);
      wire.rotation.x = -0.45;
      wire.rotation.y = xSign * 0.2;
      bdGroup.add(wire);

      // Optic Diode Projector Tip
      const tipGeo = new THREE.BoxGeometry(0.02, 0.016, 0.03);
      const tip = new THREE.Mesh(tipGeo, carbonMat);
      tip.position.set(xSign * 0.095, -0.05, -0.065);
      bdGroup.add(tip);

      // Glowing Optic Lens Face (where holographic rays project forward)
      const lensGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.006, 16);
      lensGeo.rotateX(Math.PI / 2);
      const lens = new THREE.Mesh(lensGeo, lensEmissiveMat);
      lens.position.set(xSign * 0.095, -0.05, -0.08);
      bdGroup.add(lens);

      // Status indicator mini-LED on temple
      const ledGeo = new THREE.SphereGeometry(0.006, 8, 8);
      const bdLed = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0x00FF66 }));
      bdLed.position.set(xSign * 0.146, 0.02, 0.03);
      bdGroup.add(bdLed);
      if (isL) this.bdLedMesh = bdLed;
    });

    // 5. Holographic AR Projection System (emanating directly from BD glasses!)
    const holoProjGroup = new THREE.Group();
    holoProjGroup.visible = false;
    holoProjGroup.position.set(0, -0.05, -0.08);

    // Dual volumetric light projection cones (beaming forward from each lens)
    this.bdHoloRings = [];
    [-0.095, 0.095].forEach(xOff => {
      // Forward volumetric conical light cone
      const coneGeo = new THREE.CylinderGeometry(0.38, 0.015, 1.1, 24, 1, true);
      coneGeo.rotateX(-Math.PI / 2); // point forward along -Z
      coneGeo.translate(0, 0, -0.55); // base at lens, tip expanding forward

      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(xOff, 0, 0);
      holoProjGroup.add(cone);

      // Holographic focal rings inside each beam
      const ringGeo = new THREE.RingGeometry(0.06, 0.065, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xFCEE09,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(xOff, 0, -0.35);
      holoProjGroup.add(ring);
      this.bdHoloRings.push(ring);
    });

    // Forward Spotlight casting dynamic cyan holographic light
    const holoSpotLight = new THREE.SpotLight(0x00F0FF, 5.0, 3.5, Math.PI / 3, 0.5, 1.2);
    holoSpotLight.position.set(0, 0, 0);
    holoSpotLight.target.position.set(0, 0, -2.5);
    holoProjGroup.add(holoSpotLight);
    holoProjGroup.add(holoSpotLight.target);
    this.bdHoloSpotLight = holoSpotLight;

    // Ambient cyan glow right at the glasses
    const holoGlow = new THREE.PointLight(0x00F0FF, 3.0, 1.5);
    holoGlow.position.set(0, 0, -0.05);
    holoProjGroup.add(holoGlow);

    bdGroup.add(holoProjGroup);
    this.bdHoloEmitter = holoProjGroup;

    // Invisible Hit Box for 3D mouse click
    const hitBoxGeo = new THREE.BoxGeometry(0.42, 0.35, 0.35);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    hitBox.userData = { isBDWreath: true };
    bdGroup.add(hitBox);

    loungeGroup.add(bdGroup);
    this.bdWreathGroup = bdGroup;
    this.bdClickableMeshes = [hitBox, browCenter];

    this.group.add(loungeGroup);
    this.updateBDCord();

    // Register holographic projection shimmer loop
    this.animatedObjects.push({
      update: () => {
        if (this.bdHoloEmitter && this.bdHoloEmitter.visible) {
          const time = Date.now() * 0.003;
          if (this.bdHoloSpotLight) {
            this.bdHoloSpotLight.intensity = 4.2 + Math.sin(time * 3) * 0.6;
          }
          if (this.bdHoloRings) {
            this.bdHoloRings.forEach((r, i) => {
              r.rotation.z += (i % 2 === 0 ? 0.02 : -0.02);
            });
          }
        }
      }
    });
  }

  updateBDCord() {
    if (!this.bdCord || !this.bdWreathGroup) return;
    const len = Math.max(0.05, 3.18 - (this.bdWreathGroup.position.y + 0.045));
    this.bdCord.scale.set(1, len, 1);
  }

  dockBDToCamera(camera) {
    if (!this.bdWreathGroup || !camera || this.isDockedToCamera) return;
    this.isDockedToCamera = true;

    // Reparent from loungeGroup to camera
    camera.add(this.bdWreathGroup);
    // Position directly around the camera view (peripheral frame)
    this.bdWreathGroup.position.set(0, -0.042, -0.26);
    this.bdWreathGroup.rotation.set(0, 0, 0);

    // Hide ceiling cord while wearing wreath
    if (this.bdCord) this.bdCord.visible = false;

    // Turn on the glasses' forward holographic projection beam & cyan status LED
    if (this.bdHoloEmitter) this.bdHoloEmitter.visible = true;
    if (this.bdLedMesh) this.bdLedMesh.material.color.setHex(0x00F0FF);
  }

  undockBDFromCamera(camera) {
    if (!this.bdWreathGroup || !this.isDockedToCamera) return;
    this.isDockedToCamera = false;

    // Turn off holographic projection beam
    if (this.bdHoloEmitter) this.bdHoloEmitter.visible = false;
    if (this.bdLedMesh) this.bdLedMesh.material.color.setHex(0x00FF66);

    // Reparent back to loungeGroup at seated eye position
    if (this.loungeGroup) {
      this.loungeGroup.add(this.bdWreathGroup);
      this.bdWreathGroup.position.set(this.bdEngagedPosition.x, this.bdEngagedPosition.y, this.bdEngagedPosition.z);
      this.bdWreathGroup.rotation.set(0, Math.PI, 0);
    }

    // Make suspension cord visible again
    if (this.bdCord) {
      this.bdCord.visible = true;
      this.updateBDCord();
    }
  }

  engageBD(camera, onComplete) {
    if (!this.bdWreathGroup || !this.loungeGroup) return;
    this.bdIsEngaged = true;

    gsap.killTweensOf(this.bdWreathGroup.position);
    gsap.killTweensOf(this.bdWreathGroup.rotation);

    // Smooth descent from high ceiling to seated eye level
    gsap.to(this.bdWreathGroup.position, {
      x: this.bdEngagedPosition.x,
      y: this.bdEngagedPosition.y,
      z: this.bdEngagedPosition.z,
      duration: 1.25,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.updateBDCord();
      },
      onComplete: () => {
        // Dock directly onto camera for diegetic peripheral view and holographic projection
        this.dockBDToCamera(camera);
        if (onComplete) onComplete();
      }
    });

    gsap.to(this.bdWreathGroup.rotation, {
      x: 0,
      y: Math.PI,
      z: 0,
      duration: 1.25,
      ease: 'power2.inOut'
    });
  }

  disengageBD(camera, onComplete) {
    if (!this.bdWreathGroup) return;
    this.bdIsEngaged = false;

    // Undock from camera and place back in room
    this.undockBDFromCamera(camera);

    gsap.killTweensOf(this.bdWreathGroup.position);
    gsap.killTweensOf(this.bdWreathGroup.rotation);

    gsap.to(this.bdWreathGroup.position, {
      x: this.bdRestPosition.x,
      y: this.bdRestPosition.y,
      z: this.bdRestPosition.z,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        this.updateBDCord();
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    gsap.to(this.bdWreathGroup.rotation, {
      x: this.bdRestRotation.x,
      y: this.bdRestRotation.y,
      z: this.bdRestRotation.z,
      duration: 1.0,
      ease: 'power2.out'
    });
  }

  // ===========================================================================
  // 2F: WARDROBE (Bottom-Right)
  // ===========================================================================
  buildWardrobe() {
    const wGroup = new THREE.Group();
    // Tucked neatly in far front-right corner against right wall
    wGroup.position.set(3.95, 0, 2.95);

    // Main wardrobe cabinet
    const bodyGeo = new THREE.BoxGeometry(0.85, 2.4, 0.7);
    const body = new THREE.Mesh(bodyGeo, this.darkMetal);
    body.position.y = 1.2;
    body.castShadow = true;
    wGroup.add(body);

    // Sliding door panel with vertical recess seam
    const door1 = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.25, 0.04), this.tanMetal);
    door1.position.set(0, 1.2, -0.36);
    wGroup.add(door1);

    // Long vertical industrial handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6), this.yellowAccentMaterial);
    handle.position.set(-0.25, 1.2, -0.38);
    wGroup.add(handle);

    // Status indicator LED (standby green)
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), new THREE.MeshStandardMaterial({
      color: 0x00FF88,
      emissive: 0x00FF88,
      emissiveIntensity: 2.0
    }));
    led.position.set(0.25, 2.25, -0.38);
    wGroup.add(led);

    this.group.add(wGroup);
  }

  // ===========================================================================
  // 2G: CEILING FAN & CABLES
  // ===========================================================================
  buildCeilingFan() {
    this.fanGroup = new THREE.Group();
    this.fanGroup.position.set(0, 3.05, 0);

    // Downrod tube
    const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
    const rod = new THREE.Mesh(rodGeo, this.darkMetal);
    rod.position.y = -0.175;
    this.fanGroup.add(rod);

    // Rotor hub
    this.rotorGroup = new THREE.Group();
    this.rotorGroup.position.y = -0.35;

    const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const hub = new THREE.Mesh(hubGeo, this.darkMetal);
    this.rotorGroup.add(hub);

    // 4 Industrial Fan Blades
    const bladeGeo = new THREE.BoxGeometry(0.85, 0.015, 0.16);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeo, this.tanMetal);
      const angle = (Math.PI / 2) * i;
      blade.position.set(Math.cos(angle) * 0.48, 0, Math.sin(angle) * 0.48);
      blade.rotation.y = -angle;
      // Slight pitch tilt
      blade.rotation.x = 0.12;
      this.rotorGroup.add(blade);
    }

    this.fanGroup.add(this.rotorGroup);
    this.group.add(this.fanGroup);

    // Register ceiling fan rotation update in RAF loop
    this.animatedObjects.push({
      update: () => {
        this.rotorGroup.rotation.y += 0.018; // Smooth ambient rotation
      }
    });
  }

  buildEnvironmentalClutter() {
    // Hanging conduit pipes / wires across ceiling
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.0, 3.0, 1.5),
      new THREE.Vector3(-1.8, 2.7, 1.0),
      new THREE.Vector3(0.0, 2.9, 0.5),
      new THREE.Vector3(2.5, 2.65, -1.0),
      new THREE.Vector3(4.2, 2.9, -1.5)
    ]);
    const wireGeo = new THREE.TubeGeometry(curve, 32, 0.018, 6, false);
    this.conduitMesh = new THREE.Mesh(wireGeo, this.darkMetal);
    this.group.add(this.conduitMesh);
  }

  setCeilingVisible(visible) {
    if (this.fanGroup) this.fanGroup.visible = visible;
    if (this.conduitMesh) this.conduitMesh.visible = visible;
  }

  update() {
    this.animatedObjects.forEach((obj) => obj.update());
  }
}
