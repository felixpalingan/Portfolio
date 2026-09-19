import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * ApartmentRoom (Room Shell - Phase 1)
 * Builds the architectural geometry of V's Megabuilding H10 apartment:
 * - Hexagonal tiled floor with reflective finish
 * - Industrial panel walls with cutouts (Panoramic window, Sleeping pod alcove)
 * - Industrial ceiling with structural girders
 * - Panoramic window frame and distant Night City skyline backdrop
 */
export class ApartmentRoom {
  constructor() {
    this.group = new THREE.Group();

    // Dimensions
    this.width = 9.0;    // X: -4.5 to +4.5
    this.depth = 7.0;    // Z: -3.5 to +3.5
    this.height = 3.2;   // Y: 0 to 3.2

    this.initMaterials();
    this.createFloor();
    this.createWalls();
    this.createCeiling();
    this.createPanoramicWindow();
    this.createStructuralBeams();
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

    // Window glass material (tinted, semi-reflective)
    this.glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.4
    });
  }

  createFloor() {
    // Main apartment floor
    // Sunken lounge is in top-right (x: 1.5 to 4.5, z: -3.5 to -0.5)
    // We create the main floor slab and a stepped sunken pit
    const floorGeo = new THREE.BoxGeometry(this.width, 0.2, this.depth);
    const floorMesh = new THREE.Mesh(floorGeo, this.floorMaterial);
    floorMesh.position.set(0, -0.1, 0);
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // Sunken Lounge Pit Border / Steps in top-right (x: 1.6 to 4.4, z: -3.4 to -0.6)
    // Step platform inside sunken area (lowered by 0.18 units)
    const sunkenGeo = new THREE.BoxGeometry(2.8, 0.1, 2.8);
    const sunkenMesh = new THREE.Mesh(sunkenGeo, this.sunkenFloorMaterial);
    sunkenMesh.position.set(3.0, -0.05, -2.0);
    sunkenMesh.receiveShadow = true;
    this.group.add(sunkenMesh);

    // Step edge trim (industrial yellow/black hazard trim accent)
    const stepTrimGeo = new THREE.BoxGeometry(2.9, 0.04, 0.08);
    const stepTrimMat = new THREE.MeshStandardMaterial({
      color: 0x2a221a,
      roughness: 0.5,
      metalness: 0.5
    });
    const stepTrimZ = new THREE.Mesh(stepTrimGeo, stepTrimMat);
    stepTrimZ.position.set(3.0, 0.02, -0.6);
    this.group.add(stepTrimZ);

    const stepTrimXGeo = new THREE.BoxGeometry(0.08, 0.04, 2.9);
    const stepTrimX = new THREE.Mesh(stepTrimXGeo, stepTrimMat);
    stepTrimX.position.set(1.56, 0.02, -2.0);
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
    // Ceiling slab
    const ceilingGeo = new THREE.BoxGeometry(this.width, 0.2, this.depth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x13110f,
      roughness: 0.85,
      metalness: 0.2
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.position.set(0, this.height + 0.1, 0);
    this.group.add(ceilingMesh);

    // Industrial exposed ceiling beams running front-to-back (Z)
    const beamGeo = new THREE.BoxGeometry(0.15, 0.25, this.depth);
    const beamPositionsX = [-2.8, -0.8, 1.2, 3.2];

    beamPositionsX.forEach((x) => {
      const beam = new THREE.Mesh(beamGeo, this.trimMaterial);
      beam.position.set(x, this.height - 0.125, 0);
      beam.castShadow = true;
      this.group.add(beam);
    });

    // Central fan mount junction box
    const fanBoxGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
    const fanBox = new THREE.Mesh(fanBoxGeo, this.trimMaterial);
    fanBox.position.set(0, this.height - 0.075, 0);
    this.group.add(fanBox);
  }

  createPanoramicWindow() {
    const windowWidth = 3.3;
    const windowHeight = 1.6;
    const windowCenterY = 1.8;
    const windowZ = -this.depth / 2;

    // Window Frame outer border
    const frameThickness = 0.08;
    const frameDepth = 0.25;

    // Sill (bottom ledge)
    const sillGeo = new THREE.BoxGeometry(windowWidth + 0.2, frameThickness * 1.5, frameDepth + 0.1);
    const sill = new THREE.Mesh(sillGeo, this.windowFrameMaterial);
    sill.position.set(0.15, windowCenterY - windowHeight / 2, windowZ);
    this.group.add(sill);

    // Top lintel frame
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(windowWidth + 0.2, frameThickness, frameDepth),
      this.windowFrameMaterial
    );
    topFrame.position.set(0.15, windowCenterY + windowHeight / 2, windowZ);
    this.group.add(topFrame);

    // Vertical window mullions (split into 3 horizontal panoramic panes)
    const mullionGeo = new THREE.BoxGeometry(frameThickness, windowHeight, frameDepth);
    const leftMullion = new THREE.Mesh(mullionGeo, this.windowFrameMaterial);
    leftMullion.position.set(0.15 - windowWidth / 3 / 2, windowCenterY, windowZ);
    this.group.add(leftMullion);

    const rightMullion = new THREE.Mesh(mullionGeo, this.windowFrameMaterial);
    rightMullion.position.set(0.15 + windowWidth / 3 / 2, windowCenterY, windowZ);
    this.group.add(rightMullion);

    // Window Glass Pane
    const glassGeo = new THREE.PlaneGeometry(windowWidth, windowHeight);
    const glass = new THREE.Mesh(glassGeo, this.glassMaterial);
    glass.position.set(0.15, windowCenterY, windowZ + 0.02);
    this.group.add(glass);

    // Outside Night City Backdrop
    this.createNightCitySkyline(windowZ - 1.5, windowCenterY);
  }

  createNightCitySkyline(backdropZ, centerY) {
    // Procedural canvas skyline with distant towering megastructures and neon billboards
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep dark night sky gradient (cyber navy to smog amber)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#04060d');
    skyGrad.addColorStop(0.5, '#0a1024');
    skyGrad.addColorStop(0.85, '#1e1124');
    skyGrad.addColorStop(1, '#2c1410');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Distant Megabuildings / Skyscrapers (silhouettes with window grids)
    const buildings = [
      { x: 30, w: 90, h: 420 },
      { x: 140, w: 120, h: 360 },
      { x: 280, w: 80, h: 480 },
      { x: 380, w: 140, h: 320 },
      { x: 540, w: 100, h: 440 },
      { x: 660, w: 150, h: 380 },
      { x: 830, w: 160, h: 460 }
    ];

    buildings.forEach((b) => {
      // Silhouette
      ctx.fillStyle = '#060812';
      ctx.fillRect(b.x, 512 - b.h, b.w, b.h);

      // Lit window dots
      ctx.fillStyle = 'rgba(252, 238, 9, 0.4)';
      for (let wy = 512 - b.h + 20; wy < 500; wy += 14) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 12) {
          if (Math.sin(wx * 3 + wy * 7) > 0.3) {
            ctx.fillStyle = (wx % 2 === 0) ? 'rgba(0, 240, 255, 0.45)' : 'rgba(252, 238, 9, 0.45)';
            ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
    });

    // Holographic Billboards (Kiroshi Optics & Brooklyn Barista)
    // Kiroshi (Cyan glow)
    ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 18;
    ctx.font = 'bold 24px monospace';
    ctx.fillText('KIROSHI OPTICS', 300, 180);

    // Brooklyn Barista / Cyberpunk Kanji
    ctx.fillStyle = 'rgba(255, 0, 60, 0.85)';
    ctx.shadowColor = '#FF003C';
    ctx.shadowBlur = 18;
    ctx.fillText('BROOKLYN BARISTA // ブルックリン', 560, 240);

    // Reset shadow
    ctx.shadowBlur = 0;

    const skylineTexture = new THREE.CanvasTexture(canvas);
    const skylineGeo = new THREE.PlaneGeometry(10.0, 5.0);
    const skylineMat = new THREE.MeshBasicMaterial({
      map: skylineTexture,
      fog: false
    });
    const skylineMesh = new THREE.Mesh(skylineGeo, skylineMat);
    skylineMesh.position.set(0.15, centerY + 0.2, backdropZ);
    this.group.add(skylineMesh);

    // Cool neon rim light from the window
    const windowZ = -this.depth / 2;
    const windowLight = new THREE.SpotLight(0x00F0FF, 3.5, 9, Math.PI / 3, 0.4, 1.2);
    windowLight.position.set(0.15, centerY + 0.5, windowZ - 0.2);
    windowLight.target.position.set(0.15, 1.0, 0);
    this.group.add(windowLight);
    this.group.add(windowLight.target);
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

    // Architectural partition beam separating sleeping pod and main space
    const partitionGeo = new THREE.BoxGeometry(0.12, this.height, 1.6);
    const partition = new THREE.Mesh(partitionGeo, colMat);
    partition.position.set(-1.5, this.height / 2, -2.7);
    this.group.add(partition);
  }
}
