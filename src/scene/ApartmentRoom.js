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
    const windowWidth = 3.6;
    const windowHeight = 1.6;
    const windowCenterY = 1.8;
    const windowZ = -this.depth / 2;

    // Window Frame outer border (sleek industrial frame without middle mullions)
    const frameThickness = 0.06;
    const frameDepth = 0.22;

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

    // Left outer jamb
    const leftJamb = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, windowHeight, frameDepth),
      this.windowFrameMaterial
    );
    leftJamb.position.set(0.15 - windowWidth / 2, windowCenterY, windowZ);
    this.group.add(leftJamb);

    // Right outer jamb
    const rightJamb = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, windowHeight, frameDepth),
      this.windowFrameMaterial
    );
    rightJamb.position.set(0.15 + windowWidth / 2, windowCenterY, windowZ);
    this.group.add(rightJamb);

    // Seamless Full Glass Panoramic Pane (no middle dividers)
    const glassGeo = new THREE.PlaneGeometry(windowWidth, windowHeight);
    const glass = new THREE.Mesh(glassGeo, this.glassMaterial);
    glass.position.set(0.15, windowCenterY, windowZ + 0.02);
    this.group.add(glass);

    // Outside Night City Backdrop
    this.createNightCitySkyline(windowZ - 1.8, windowCenterY);
  }

  createNightCitySkyline(backdropZ, centerY) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep atmospheric Night City sky with toxic smog gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    skyGrad.addColorStop(0.0, '#03050a');
    skyGrad.addColorStop(0.4, '#080d1d');
    skyGrad.addColorStop(0.7, '#1a0d24');
    skyGrad.addColorStop(0.9, '#301314');
    skyGrad.addColorStop(1.0, '#4a1e12');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Distant Megabuilding monolithic silhouettes (Layer 1 - deep background)
    ctx.fillStyle = '#060812';
    // Colossal Megabuilding H8 / H10 silhouette
    ctx.beginPath();
    ctx.moveTo(100, 1024);
    ctx.lineTo(100, 220);
    ctx.lineTo(260, 140);
    ctx.lineTo(420, 220);
    ctx.lineTo(420, 1024);
    ctx.fill();

    // Antenna on mega structure with flashing beacon
    ctx.strokeStyle = '#0b0f1e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(260, 140);
    ctx.lineTo(260, 40);
    ctx.stroke();

    // Red warning beacon at antenna peak
    ctx.fillStyle = '#FF003C';
    ctx.shadowColor = '#FF003C';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(260, 40, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Arasaka Tower silhouette in center
    ctx.fillStyle = '#070a16';
    ctx.beginPath();
    ctx.moveTo(900, 1024);
    ctx.lineTo(900, 180);
    ctx.lineTo(970, 70);
    ctx.lineTo(1040, 180);
    ctx.lineTo(1040, 1024);
    ctx.fill();

    // Midground & Foreground Skyscraper Matrix with varied architecture
    const towers = [
      { x: 20, w: 140, h: 680, type: 'stepped', color: '#090d1c' },
      { x: 190, w: 160, h: 580, type: 'slanted', color: '#0c1224' },
      { x: 380, w: 120, h: 740, type: 'twin', color: '#0a0e20' },
      { x: 530, w: 190, h: 620, type: 'angled', color: '#0d1326' },
      { x: 740, w: 130, h: 700, type: 'spire', color: '#0b1022' },
      { x: 1100, w: 180, h: 640, type: 'stepped', color: '#0d1326' },
      { x: 1310, w: 140, h: 720, type: 'cylinder', color: '#0a0f22' },
      { x: 1480, w: 200, h: 560, type: 'blocks', color: '#0c1125' },
      { x: 1710, w: 150, h: 750, type: 'slanted', color: '#090e1f' },
      { x: 1890, w: 150, h: 610, type: 'spire', color: '#0a0d1e' }
    ];

    towers.forEach((t) => {
      ctx.fillStyle = t.color;
      const topY = 1024 - t.h;

      if (t.type === 'slanted') {
        ctx.beginPath();
        ctx.moveTo(t.x, 1024);
        ctx.lineTo(t.x, topY + 40);
        ctx.lineTo(t.x + t.w, topY);
        ctx.lineTo(t.x + t.w, 1024);
        ctx.fill();
      } else if (t.type === 'stepped') {
        ctx.fillRect(t.x, topY + 60, t.w, t.h - 60);
        ctx.fillRect(t.x + 20, topY, t.w - 40, 60);
      } else {
        ctx.fillRect(t.x, topY, t.w, t.h);
      }

      // Tower Windows Matrix (cyber yellow, cyan, soft white)
      for (let wy = topY + 30; wy < 950; wy += 18) {
        for (let wx = t.x + 12; wx < t.x + t.w - 12; wx += 16) {
          const rand = Math.sin(wx * 4.3 + wy * 8.7);
          if (rand > 0.25) {
            if (rand > 0.8) {
              ctx.fillStyle = 'rgba(0, 240, 255, 0.7)'; // Cyan
            } else if (rand > 0.5) {
              ctx.fillStyle = 'rgba(252, 238, 9, 0.65)'; // Cyber Yellow
            } else {
              ctx.fillStyle = 'rgba(255, 180, 120, 0.45)'; // Amber
            }
            ctx.fillRect(wx, wy, 6, 8);
          }
        }
      }
    });

    // Skybridges between towers with vehicle headlight streams
    function drawSkybridge(x1, y1, x2, y2) {
      ctx.fillStyle = '#080c18';
      ctx.fillRect(x1, y1, x2 - x1, 14);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.fillRect(x1, y1 + 3, x2 - x1, 2);
      ctx.fillStyle = 'rgba(255, 0, 60, 0.7)';
      ctx.fillRect(x1, y1 + 9, x2 - x1, 2);
    }
    drawSkybridge(310, 540, 530, 540);
    drawSkybridge(1240, 480, 1480, 480);

    // =========================================================================
    // HOLOGRAPHIC NEON BILLBOARDS & ADVERTISEMENTS
    // =========================================================================

    // 1. KIROSHI OPTICS (Cyan holographic eye & banner)
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('KIROSHI OPTICS', 550, 440);
    // Eye icon
    ctx.beginPath();
    ctx.arc(510, 428, 16, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00F0FF';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(510, 428, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FCEE09';
    ctx.fill();

    // 2. ARASAKA (Crimson Red Kanji & Corporate Logo)
    ctx.shadowColor = '#FF003C';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#FF003C';
    ctx.font = '900 44px sans-serif';
    ctx.fillText('ARASAKA  荒 坂', 910, 310);
    ctx.font = 'bold 16px monospace';
    ctx.fillText('// SECURITY & DEFENSE SYSTEMS', 915, 335);

    // 3. BROOKLYN BARISTA (Warm Amber Coffee Neon)
    ctx.shadowColor = '#FF9900';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#FFAA22';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('BROOKLYN BARISTA', 1330, 390);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ブルックリン バリスタ ☕ 24H', 1335, 420);

    // 4. TRAUMA TEAM (Emergency White / Red Cross)
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px monospace';
    ctx.fillText('TRAUMA TEAM', 210, 480);
    ctx.fillStyle = '#FF003C';
    ctx.shadowColor = '#FF003C';
    ctx.fillText('+ MEDICAL EVAC +', 210, 510);

    // 5. KANG TAO (Emerald Neon High-Tech)
    ctx.shadowColor = '#00FF88';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#00FF88';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('康 陶 // KANG TAO', 1520, 520);
    ctx.font = '14px monospace';
    ctx.fillText('SMART WEAPONRY SYSTEMS', 1520, 545);

    // 6. Vertical Cyberpunk Kanji Strips (hanging on skyscraper flanks)
    function drawVerticalKanji(text, x, startY, color, blur) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.fillStyle = color;
      ctx.font = 'bold 26px sans-serif';
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, startY + i * 36);
      }
    }
    drawVerticalKanji('ナイトシティ', 750, 420, '#FCEE09', 20); // "Night City" in Cyber Yellow
    drawVerticalKanji('電脳空間', 1270, 520, '#00F0FF', 22);     // "Cyber Space" in Cyan
    drawVerticalKanji('サイバー', 400, 530, '#FF003C', 20);     // "Cyber" in Neon Pink
    drawVerticalKanji('２０７７', 1730, 460, '#FCEE09', 20);     // "2077"

    // Toxic Smog & Low Fog at base of skyline
    ctx.shadowBlur = 0;
    const smogGrad = ctx.createLinearGradient(0, 750, 0, 1024);
    smogGrad.addColorStop(0, 'rgba(30, 14, 10, 0)');
    smogGrad.addColorStop(0.5, 'rgba(60, 20, 12, 0.6)');
    smogGrad.addColorStop(1, 'rgba(20, 8, 5, 0.95)');
    ctx.fillStyle = smogGrad;
    ctx.fillRect(0, 750, 2048, 274);

    const skylineTexture = new THREE.CanvasTexture(canvas);
    const skylineGeo = new THREE.PlaneGeometry(12.0, 6.0);
    const skylineMat = new THREE.MeshBasicMaterial({
      map: skylineTexture,
      fog: false
    });
    const skylineMesh = new THREE.Mesh(skylineGeo, skylineMat);
    skylineMesh.position.set(0.15, centerY + 0.3, backdropZ);
    this.group.add(skylineMesh);

    // Cool neon rim light from the window
    const windowZ = -this.depth / 2;
    const windowLight = new THREE.SpotLight(0x00F0FF, 3.5, 9, Math.PI / 3, 0.4, 1.2);
    windowLight.position.set(0.15, centerY + 0.5, windowZ - 0.2);
    windowLight.target.position.set(0.15, 1.0, 0);
    this.group.add(windowLight);
    this.group.add(windowLight.target);

    // Warm neon bounce from the bottom smog/amber billboards
    const cityAmberLight = new THREE.PointLight(0xff4411, 2.0, 6);
    cityAmberLight.position.set(0.15, centerY - 0.4, windowZ - 0.5);
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

    // Architectural partition beam separating sleeping pod and main space
    const partitionGeo = new THREE.BoxGeometry(0.12, this.height, 1.6);
    const partition = new THREE.Mesh(partitionGeo, colMat);
    partition.position.set(-1.5, this.height / 2, -2.7);
    this.group.add(partition);
  }
}
