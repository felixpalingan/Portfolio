import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { ApartmentFurniture } from './ApartmentFurniture.js';

/**
 * ApartmentRoom (Room Shell & Interior)
 * Builds the architectural geometry and integrated interior furniture of V's Megabuilding H10 apartment.
 */
export class ApartmentRoom {
  constructor() {
    this.group = new THREE.Group();

    // Dimensions
    this.width = 9.0;    // X: -4.5 to +4.5
    this.depth = 7.0;    // Z: -3.5 to +3.5
    this.height = 3.2;   // Y: 0 to 3.2

    this.cityAVs = [];

    this.initMaterials();
    this.createFloor();
    this.createWalls();
    this.createCeiling();
    this.createPanoramicWindow();
    this.createStructuralBeams();
    this.createFurniture();
  }

  initMaterials() {
    // Floor: Megabuilding H10 Hex Tiles (reflective amber-terracotta)
    const hexTexture = TextureGenerator.createHexFloorTexture();
    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: hexTexture,
      roughness: 0.35,
      metalness: 0.25,
      bumpScale: 0.05
    });

    // Sunken Lounge carpet/floor material
    this.sunkenFloorMaterial = new THREE.MeshStandardMaterial({
      color: 0x14161d,
      roughness: 0.85,
      metalness: 0.1
    });

    // Walls: Dark industrial panels
    const wallTexture = TextureGenerator.createWallTexture();
    this.wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      color: 0x221c18,
      roughness: 0.75,
      metalness: 0.2
    });

    // Dark trim / pillars / metal beams
    this.trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x120f0d,
      roughness: 0.4,
      metalness: 0.6
    });

    // Window frame material
    this.windowFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1614,
      roughness: 0.3,
      metalness: 0.7
    });

    // Window glass material (30% less dark, clear tinted glass with reflections)
    const glassRoughnessMap = TextureGenerator.createGlassRoughnessTexture();
    this.glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x33485c,
      transparent: true,
      opacity: 0.22,
      roughness: 0.28,
      roughnessMap: glassRoughnessMap,
      metalness: 0.25
    });
  }

  createFloor() {
    // MAIN APARTMENT FLOOR (Precisely cut with open recess for the Sunken Lounge)
    // Piece 1: Left area covering full depth (x: -4.5 to 1.6, z: -3.5 to +3.5)
    const floorLeftGeo = new THREE.BoxGeometry(6.1, 0.2, 7.0);
    const floorLeftMesh = new THREE.Mesh(floorLeftGeo, this.floorMaterial);
    floorLeftMesh.position.set(-1.45, -0.1, 0);
    floorLeftMesh.receiveShadow = true;
    this.group.add(floorLeftMesh);

    // Piece 2: Front-Right area in front of the lounge (x: 1.6 to 4.5, z: -0.6 to +3.5)
    const floorFrontRightGeo = new THREE.BoxGeometry(2.9, 0.2, 4.1);
    const floorFrontRightMesh = new THREE.Mesh(floorFrontRightGeo, this.floorMaterial);
    floorFrontRightMesh.position.set(3.05, -0.1, 1.45);
    floorFrontRightMesh.receiveShadow = true;
    this.group.add(floorFrontRightMesh);

    // Sunken Lounge Pit (Lowered arena floor at y = -0.38)
    const sunkenGeo = new THREE.BoxGeometry(2.9, 0.1, 2.9);
    const sunkenMesh = new THREE.Mesh(sunkenGeo, this.sunkenFloorMaterial);
    sunkenMesh.position.set(3.05, -0.38, -2.05);
    sunkenMesh.receiveShadow = true;
    this.group.add(sunkenMesh);

    // Sunken pit step riser walls (vertical walls dropping down from main floor to sunken floor)
    const riserMat = this.trimMaterial;
    // Front riser wall (z = -0.6)
    const frontRiser = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.38, 0.06), riserMat);
    frontRiser.position.set(3.05, -0.19, -0.6);
    this.group.add(frontRiser);

    // Left riser wall (x = 1.6)
    const leftRiser = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 2.9), riserMat);
    leftRiser.position.set(1.6, -0.19, -2.05);
    this.group.add(leftRiser);

    // 2 Distinct Entrance Steps leading down into the sunken lounge arena (x: 1.9 to 2.8, z: -0.6)
    // Step 1 (Upper stair: y = -0.13)
    const step1Geo = new THREE.BoxGeometry(0.9, 0.13, 0.32);
    const step1Mesh = new THREE.Mesh(step1Geo, this.sunkenFloorMaterial);
    step1Mesh.position.set(2.35, -0.13, -0.66);
    step1Mesh.receiveShadow = true;
    this.group.add(step1Mesh);

    // Step 1 LED edge trim
    const step1Trim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.04), new THREE.MeshStandardMaterial({
      color: 0xFCEE09,
      emissive: 0xFCEE09,
      emissiveIntensity: 1.2
    }));
    step1Trim.position.set(2.35, -0.065, -0.5);
    this.group.add(step1Trim);

    // Step 2 (Lower stair: y = -0.26)
    const step2Geo = new THREE.BoxGeometry(0.9, 0.13, 0.32);
    const step2Mesh = new THREE.Mesh(step2Geo, this.sunkenFloorMaterial);
    step2Mesh.position.set(2.35, -0.26, -0.98);
    step2Mesh.receiveShadow = true;
    this.group.add(step2Mesh);

    // Step 2 LED edge trim
    const step2Trim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.04), new THREE.MeshStandardMaterial({
      color: 0xFCEE09,
      emissive: 0xFCEE09,
      emissiveIntensity: 1.2
    }));
    step2Trim.position.set(2.35, -0.195, -0.82);
    this.group.add(step2Trim);

    // Illuminated step edge hazard trim along the top pit boundary
    const stepTrimGeo = new THREE.BoxGeometry(2.9, 0.04, 0.06);
    const stepTrimMat = new THREE.MeshStandardMaterial({
      color: 0xFCEE09,
      emissive: 0xFCEE09,
      emissiveIntensity: 1.2
    });
    const stepTrimZ = new THREE.Mesh(stepTrimGeo, stepTrimMat);
    stepTrimZ.position.set(3.05, 0.01, -0.6);
    this.group.add(stepTrimZ);

    const stepTrimXGeo = new THREE.BoxGeometry(0.06, 0.04, 2.9);
    const stepTrimX = new THREE.Mesh(stepTrimXGeo, stepTrimMat);
    stepTrimX.position.set(1.6, 0.01, -2.05);
    this.group.add(stepTrimX);
  }

  createWalls() {
    const wallThickness = 0.2;

    // 1. LEFT WALL (X = -4.5, runs from z: -3.5 to +3.5)
    // Houses: Top = Sleeping pod alcove, Middle = Toilet, Bottom = Workstation
    const leftWallGeo = new THREE.BoxGeometry(wallThickness, this.height, this.depth);
    const leftWall = new THREE.Mesh(leftWallGeo, this.wallMaterial);
    leftWall.position.set(-this.width / 2, this.height / 2, 0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Sleeping pod alcove inset frame (recess in top-left)
    const podAlcoveWallGeo = new THREE.BoxGeometry(0.15, this.height * 0.7, 2.2);
    const podAlcoveWall = new THREE.Mesh(podAlcoveWallGeo, this.trimMaterial);
    podAlcoveWall.position.set(-this.width / 2 + 0.1, this.height * 0.35, -2.4);
    this.group.add(podAlcoveWall);

    // 2. RIGHT WALL (X = +4.5, runs from z: -3.5 to +3.5)
    // Houses: Top = Sunken lounge wall, Bottom = Wardrobe
    const rightWallGeo = new THREE.BoxGeometry(wallThickness, this.height, this.depth);
    const rightWall = new THREE.Mesh(rightWallGeo, this.wallMaterial);
    rightWall.position.set(this.width / 2, this.height / 2, 0);
    rightWall.receiveShadow = true;
    this.group.add(rightWall);

    // 3. BACK WALL (Z = -3.5, with opening in the middle for Panoramic Window)
    // Left segment (behind sleeping pod): x from -4.5 to -1.5 (width: 3.0)
    const backLeftGeo = new THREE.BoxGeometry(3.0, this.height, wallThickness);
    const backLeft = new THREE.Mesh(backLeftGeo, this.wallMaterial);
    backLeft.position.set(-3.0, this.height / 2, -this.depth / 2);
    backLeft.receiveShadow = true;
    this.group.add(backLeft);

    // Right segment (behind sunken lounge): x from +1.8 to +4.5 (width: 2.7)
    const backRightGeo = new THREE.BoxGeometry(2.7, this.height, wallThickness);
    const backRight = new THREE.Mesh(backRightGeo, this.wallMaterial);
    backRight.position.set(3.15, this.height / 2, -this.depth / 2);
    backRight.receiveShadow = true;
    this.group.add(backRight);

    // Bottom sill under window: x from -1.5 to +1.8 (width: 3.3, height: 1.0)
    const windowSillWallGeo = new THREE.BoxGeometry(3.3, 1.0, wallThickness);
    const windowSillWall = new THREE.Mesh(windowSillWallGeo, this.wallMaterial);
    windowSillWall.position.set(0.15, 0.5, -this.depth / 2);
    windowSillWall.receiveShadow = true;
    this.group.add(windowSillWall);

    // Top lintel above window: x from -1.5 to +1.8 (width: 3.3, height: 0.6)
    const windowTopWallGeo = new THREE.BoxGeometry(3.3, 0.6, wallThickness);
    const windowTopWall = new THREE.Mesh(windowTopWallGeo, this.wallMaterial);
    windowTopWall.position.set(0.15, this.height - 0.3, -this.depth / 2);
    windowTopWall.receiveShadow = true;
    this.group.add(windowTopWall);

    // Baseboards along the perimeter
    this.createBaseboards();
  }

  createBaseboards() {
    const bbMat = this.trimMaterial;
    // Back left baseboard
    const bbBL = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 0.08), bbMat);
    bbBL.position.set(-3.0, 0.075, -this.depth / 2 + 0.08);
    this.group.add(bbBL);

    // Back right baseboard
    const bbBR = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.15, 0.08), bbMat);
    bbBR.position.set(3.15, 0.075, -this.depth / 2 + 0.08);
    this.group.add(bbBR);

    // Left baseboard
    const bbL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, this.depth), bbMat);
    bbL.position.set(-this.width / 2 + 0.08, 0.075, 0);
    this.group.add(bbL);

    // Right baseboard
    const bbR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, this.depth), bbMat);
    bbR.position.set(this.width / 2 - 0.08, 0.075, 0);
    this.group.add(bbR);
  }

  createCeiling() {
    this.ceilingGroup = new THREE.Group();

    // Ceiling slab
    const ceilingGeo = new THREE.BoxGeometry(this.width, 0.2, this.depth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x13110f,
      roughness: 0.85,
      metalness: 0.2
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.position.set(0, this.height + 0.1, 0);
    this.ceilingGroup.add(ceilingMesh);

    // Industrial exposed ceiling beams running front-to-back (Z)
    const beamGeo = new THREE.BoxGeometry(0.15, 0.25, this.depth);
    const beamPositionsX = [-2.8, -0.8, 1.2, 3.2];

    beamPositionsX.forEach((x) => {
      const beam = new THREE.Mesh(beamGeo, this.trimMaterial);
      beam.position.set(x, this.height - 0.125, 0);
      beam.castShadow = true;
      this.ceilingGroup.add(beam);
    });

    // Central fan mount junction box
    const fanBoxGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
    const fanBox = new THREE.Mesh(fanBoxGeo, this.trimMaterial);
    fanBox.position.set(0, this.height - 0.075, 0);
    this.ceilingGroup.add(fanBox);

    this.group.add(this.ceilingGroup);
  }

  setCeilingVisible(visible) {
    if (this.ceilingGroup) {
      this.ceilingGroup.visible = visible;
    }
    if (this.furniture) {
      this.furniture.setCeilingVisible(visible);
    }
  }

  createPanoramicWindow() {
    const windowWidth = 3.6;
    const windowHeight = 1.6;
    const windowCenterY = 1.8;
    const windowZ = -this.depth / 2;

    // Pure Frameless Panoramic Glass Window (no surrounding borders or frames)
    const glassGeo = new THREE.PlaneGeometry(windowWidth, windowHeight);
    const glass = new THREE.Mesh(glassGeo, this.glassMaterial);
    glass.position.set(0.15, windowCenterY, windowZ + 0.02);
    this.group.add(glass);

    // Outside Night City Backdrop
    this.createNightCitySkyline(windowZ - 1.8, windowCenterY);
  }

  createNightCitySkyline(backdropZ, centerY) {
    // 1. Initial fallback canvas while high-resolution anime panorama loads
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 64;
    fallbackCanvas.height = 36;
    const fCtx = fallbackCanvas.getContext('2d');
    const fGrad = fCtx.createLinearGradient(0, 0, 0, 36);
    fGrad.addColorStop(0, '#030814');
    fGrad.addColorStop(0.5, '#071629');
    fGrad.addColorStop(1, '#02050b');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 64, 36);
    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

    // 2. Curved Panorama Geometry (16:9 widescreen, wrapping around the apartment horizon)
    // Width 11.2m, Height 6.3m, with smooth backwards curvature at the edges for immersive depth
    const skylineGeo = new THREE.PlaneGeometry(11.2, 6.3, 40, 1);
    const pos = skylineGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const zOffset = -(x * x) * 0.024;
      pos.setZ(i, zOffset);
    }
    skylineGeo.computeVertexNormals();

    const skylineMat = new THREE.MeshBasicMaterial({
      map: fallbackTexture,
      fog: false,
      side: THREE.FrontSide
    });

    // 3. Load High-Definition Night City Skyline (Faithful to Wenay_Anime.jpg)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/night_city_panoramic.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        skylineMat.map = texture;
        skylineMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('[ApartmentRoom] Loading /night_city_panoramic.jpg failed, fallback to /wenay_city_skyline.jpg', err);
        textureLoader.load('/wenay_city_skyline.jpg', (altTex) => {
          altTex.colorSpace = THREE.SRGBColorSpace;
          skylineMat.map = altTex;
          skylineMat.needsUpdate = true;
        });
      }
    );

    const skylineMesh = new THREE.Mesh(skylineGeo, skylineMat);
    // Positioned at X = 0.15 (matching window center), Y = 2.05 (framing the central Lucy billboard & Arasaka towers), Z = backdropZ
    skylineMesh.position.set(0.15, 2.05, backdropZ);
    this.group.add(skylineMesh);

    // 4. Live 3D Flying Aerodynes (AVs) with neon engine trails gliding in the sky
    this.cityAVs = [];
    const avConfigs = [
      { y: 2.75, z: backdropZ + 0.45, speed: 0.008, color: 0x00F0FF, minX: -5.0, maxX: 5.0, startX: -1.2 },
      { y: 2.45, z: backdropZ + 0.65, speed: -0.006, color: 0xFF003C, minX: -5.0, maxX: 5.0, startX: 2.8 },
      { y: 3.10, z: backdropZ + 0.35, speed: 0.005, color: 0xFCEE09, minX: -5.0, maxX: 5.0, startX: -3.5 }
    ];

    avConfigs.forEach((cfg) => {
      const avGroup = new THREE.Group();
      // Vehicle chassis
      const avMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const avMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.045, 0.09), avMat);
      avGroup.add(avMesh);

      // Glowing engine trail
      const trailMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85
      });
      const trailLen = 0.65;
      const trailGeo = new THREE.BoxGeometry(trailLen, 0.02, 0.02);
      const trailMesh = new THREE.Mesh(trailGeo, trailMat);
      trailMesh.position.x = cfg.speed > 0 ? -trailLen / 2 : trailLen / 2;
      avGroup.add(trailMesh);

      avGroup.position.set(cfg.startX, cfg.y, cfg.z);
      this.group.add(avGroup);
      this.cityAVs.push({
        mesh: avGroup,
        speed: cfg.speed,
        minX: cfg.minX,
        maxX: cfg.maxX
      });
    });

    // 5. Authentic Atmospheric Neon Glow pouring into the room through the window
    const windowZ = -this.depth / 2;

    // Cool cyan volumetric skyline ambient spot
    const windowLight = new THREE.SpotLight(0x00F0FF, 0.38, 10, Math.PI / 3, 0.45, 1.2);
    windowLight.position.set(0.15, centerY + 0.4, windowZ - 0.2);
    windowLight.target.position.set(0.15, 1.0, 0);
    this.group.add(windowLight);
    this.group.add(windowLight.target);

    // Arasaka Tower Crimson Neon Glow on the left
    const arasakaNeonLight = new THREE.PointLight(0xFF003C, 0.32, 6.5, 1.2);
    arasakaNeonLight.position.set(-1.2, centerY + 0.3, windowZ - 0.4);
    this.group.add(arasakaNeonLight);

    // Warm street/billboard gold bounce on the window sill
    const cityAmberLight = new THREE.PointLight(0xFFA834, 0.28, 6, 1.2);
    cityAmberLight.position.set(0.8, centerY - 0.4, windowZ - 0.4);
    this.group.add(cityAmberLight);
  }

  createStructuralBeams() {
    // Corner support columns / conduit columns in room corners
    const colGeo = new THREE.BoxGeometry(0.35, this.height, 0.35);
    const colMat = this.trimMaterial;

    // Back-Left column (beside sleeping pod)
    const colBL = new THREE.Mesh(colGeo, colMat);
    colBL.position.set(-this.width / 2 + 0.175, this.height / 2, -this.depth / 2 + 0.175);
    this.group.add(colBL);

    // Back-Right column (in sunken lounge corner)
    const colBR = new THREE.Mesh(colGeo, colMat);
    colBR.position.set(this.width / 2 - 0.175, this.height / 2, -this.depth / 2 + 0.175);
    this.group.add(colBR);
  }

  createFurniture() {
    this.furniture = new ApartmentFurniture();
    this.group.add(this.furniture.group);
  }

  setMirrorActive(active) {
    if (this.furniture) {
      this.furniture.setMirrorActive(active);
    }
  }

  update() {
    if (this.furniture) {
      this.furniture.update();
    }
    // Update outside flying aerodynes (AVs)
    if (this.cityAVs && this.cityAVs.length > 0) {
      this.cityAVs.forEach(av => {
        av.mesh.position.x += av.speed;
        if (av.speed > 0 && av.mesh.position.x > av.maxX) {
          av.mesh.position.x = av.minX;
        } else if (av.speed < 0 && av.mesh.position.x < av.minX) {
          av.mesh.position.x = av.maxX;
        }
      });
    }
  }
}

