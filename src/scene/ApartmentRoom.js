import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { ApartmentFurniture } from './ApartmentFurniture.js';

/**
 * ApartmentRoom (Room Shell & Interior - Phase 1 & 2)
 * Builds the architectural geometry and integrated interior furniture of V's Megabuilding H10 apartment.
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

    // Window glass material (tinted, semi-reflective with realistic micro-imperfections)
    const glassRoughnessMap = TextureGenerator.createGlassRoughnessTexture();
    this.glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x77b8d8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.25,
      roughnessMap: glassRoughnessMap,
      metalness: 0.3
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
    skyGrad.addColorStop(0.0, '#020409');
    skyGrad.addColorStop(0.35, '#070c1b');
    skyGrad.addColorStop(0.65, '#160d22');
    skyGrad.addColorStop(0.85, '#2e1215');
    skyGrad.addColorStop(1.0, '#461c10');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Distant Megabuilding monolithic pyramids (Deep Background Layer)
    ctx.fillStyle = '#050711';
    ctx.beginPath();
    ctx.moveTo(80, 1024);
    ctx.lineTo(80, 240);
    ctx.lineTo(240, 150);
    ctx.lineTo(400, 240);
    ctx.lineTo(400, 1024);
    ctx.fill();

    // Towering Communications Spire on Megabuilding H8
    ctx.strokeStyle = '#090e1c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(240, 150);
    ctx.lineTo(240, 35);
    ctx.stroke();

    // Red warning beacon at antenna peak
    ctx.fillStyle = '#FF003C';
    ctx.shadowColor = '#FF003C';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(240, 35, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Arasaka Tower Obelisk silhouette in center
    ctx.fillStyle = '#060914';
    ctx.beginPath();
    ctx.moveTo(920, 1024);
    ctx.lineTo(920, 160);
    ctx.lineTo(980, 60);
    ctx.lineTo(1040, 160);
    ctx.lineTo(1040, 1024);
    ctx.fill();

    // Midground & Foreground Skyscraper Matrix with completely unique facade styles
    const towers = [
      { id: 1, x: 20, w: 150, h: 680, style: 'ribbon', baseColor: '#090d1c' },
      { id: 2, x: 190, w: 170, h: 590, style: 'residential-pod', baseColor: '#0c1122' },
      { id: 3, x: 380, w: 130, h: 760, style: 'vertical-fin', baseColor: '#0a0e20' },
      { id: 4, x: 530, w: 200, h: 630, style: 'ribbon', baseColor: '#0d1326' },
      { id: 5, x: 750, w: 140, h: 710, style: 'residential-pod', baseColor: '#0a0f22' },
      { id: 6, x: 1080, w: 190, h: 650, style: 'stepped-corp', baseColor: '#0d1326' },
      { id: 7, x: 1290, w: 150, h: 730, style: 'vertical-fin', baseColor: '#0b1024' },
      { id: 8, x: 1460, w: 220, h: 570, style: 'residential-pod', baseColor: '#0c1125' },
      { id: 9, x: 1700, w: 160, h: 760, style: 'ribbon', baseColor: '#090e1f' },
      { id: 10, x: 1880, w: 155, h: 620, style: 'stepped-corp', baseColor: '#0a0d1e' }
    ];

    towers.forEach((t) => {
      const topY = 1024 - t.h;
      ctx.fillStyle = t.baseColor;

      // Silhouette Shape
      if (t.style === 'vertical-fin') {
        // Angled architectural crown
        ctx.beginPath();
        ctx.moveTo(t.x, 1024);
        ctx.lineTo(t.x, topY + 45);
        ctx.lineTo(t.x + t.w, topY);
        ctx.lineTo(t.x + t.w, 1024);
        ctx.fill();
      } else if (t.style === 'stepped-corp') {
        ctx.fillRect(t.x, topY + 60, t.w, t.h - 60);
        ctx.fillRect(t.x + 25, topY, t.w - 50, 60);
      } else {
        ctx.fillRect(t.x, topY, t.w, t.h);
      }

      // Rooftop Helipad / Antennas
      if (t.h > 650) {
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x + t.w / 2, topY - 12, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // -----------------------------------------------------------------------
      // NATURAL, HIGHLY DIVERSE WINDOW ARCHITECTURES:
      // -----------------------------------------------------------------------

      if (t.style === 'ribbon') {
        // 1. Sleek corporate tower with continuous horizontal glass ribbons
        const floorHeight = 26;
        for (let y = topY + 35; y < 960; y += floorHeight) {
          const floorSeed = Math.sin(t.x * 3.1 + y * 7.9);
          // Realistic office floor logic: some floors full, some half, some dark
          if (floorSeed > 0.1) {
            const isWarm = floorSeed > 0.6;
            ctx.fillStyle = isWarm ? 'rgba(255, 215, 140, 0.65)' : 'rgba(120, 220, 255, 0.55)';

            // Draw segmented ribbon window strip
            const segCount = 6;
            const segWidth = (t.w - 24) / segCount;
            for (let s = 0; s < segCount; s++) {
              if (Math.sin(s * 5.3 + y) > -0.3) {
                ctx.fillRect(t.x + 12 + s * segWidth, y, segWidth - 3, 9);
              }
            }
          } else {
            // Dark floor with subtle ambient reflection
            ctx.fillStyle = 'rgba(10, 25, 45, 0.4)';
            ctx.fillRect(t.x + 12, y, t.w - 24, 6);
          }
        }
      } else if (t.style === 'residential-pod') {
        // 2. Megabuilding / residential arcology: irregular mosaic of living units
        const podH = 14;
        const podW = 12;
        for (let y = topY + 25; y < 960; y += 22) {
          // Horizontal balcony slab every 4 floors
          if (Math.floor(y / 22) % 4 === 0) {
            ctx.fillStyle = 'rgba(30, 20, 16, 0.9)';
            ctx.fillRect(t.x + 8, y - 4, t.w - 16, 3);
          }

          for (let x = t.x + 10; x < t.x + t.w - 10; x += podW + 6) {
            const unitRandom = Math.sin(x * 11.3 + y * 19.7);
            if (unitRandom > 0.45) {
              if (unitRandom > 0.85) {
                ctx.fillStyle = 'rgba(252, 238, 9, 0.75)'; // Warm cyberpunk yellow
              } else if (unitRandom > 0.7) {
                ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';  // TV cyan glow
              } else if (unitRandom > 0.58) {
                ctx.fillStyle = 'rgba(255, 100, 60, 0.6)'; // Amber lamp
              } else {
                ctx.fillStyle = 'rgba(180, 200, 240, 0.35)'; // Dim white
              }
              ctx.fillRect(x, y, podW, podH);
            }
          }
        }
      } else if (t.style === 'vertical-fin') {
        // 3. High-tech tower with vertical illuminated structural neon fins
        const finCount = 5;
        const finSpacing = t.w / (finCount + 1);

        // Lit vertical structural fins
        for (let f = 1; f <= finCount; f++) {
          const finX = t.x + f * finSpacing;
          ctx.strokeStyle = (f % 2 === 0) ? 'rgba(0, 240, 255, 0.8)' : 'rgba(252, 238, 9, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(finX, topY + 50);
          ctx.lineTo(finX, 960);
          ctx.stroke();
        }

        // Structural diagonal cross-braces (giant X-trusses)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        for (let y = topY + 60; y < 900; y += 120) {
          ctx.beginPath();
          ctx.moveTo(t.x + 10, y);
          ctx.lineTo(t.x + t.w - 10, y + 120);
          ctx.moveTo(t.x + t.w - 10, y);
          ctx.lineTo(t.x + 10, y + 120);
          ctx.stroke();
        }

        // Floor-to-ceiling corner glass suites
        for (let y = topY + 70; y < 940; y += 28) {
          if (Math.sin(y * 3.3) > 0.1) {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.fillRect(t.x + 8, y, 14, 16);
            ctx.fillRect(t.x + t.w - 22, y, 14, 16);
          }
        }
      } else if (t.style === 'stepped-corp') {
        // 4. Stepped commercial complex with large panoramic bay windows
        for (let y = topY + 40; y < 950; y += 32) {
          const isFloorLit = Math.sin(t.x * 2 + y * 5) > 0.0;
          if (isFloorLit) {
            ctx.fillStyle = 'rgba(255, 230, 170, 0.6)';
            ctx.fillRect(t.x + 14, y, t.w - 28, 16);
            // Window frame mullions
            ctx.fillStyle = t.baseColor;
            for (let mx = t.x + 35; mx < t.x + t.w - 20; mx += 28) {
              ctx.fillRect(mx, y, 3, 16);
            }
          }
        }
      }
    });

    // Skybridges between towers with vehicle headlights & taillights
    function drawSkybridge(x1, y1, x2, y2) {
      ctx.fillStyle = '#060914';
      ctx.fillRect(x1, y1, x2 - x1, 16);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.fillRect(x1, y1 + 3, x2 - x1, 2.5);
      ctx.fillStyle = 'rgba(255, 0, 60, 0.8)';
      ctx.fillRect(x1, y1 + 10, x2 - x1, 2.5);
    }
    drawSkybridge(320, 560, 530, 560);
    drawSkybridge(1230, 500, 1460, 500);

    // =========================================================================
    // FLYING AERODYNES (AVs / HOVER CARS) WITH LIGHT TRAILS IN SKY
    // =========================================================================
    const avs = [
      { x: 340, y: 320, dir: 1, color: '#00F0FF', len: 140 },
      { x: 1200, y: 260, dir: -1, color: '#FF003C', len: 180 },
      { x: 720, y: 440, dir: 1, color: '#FCEE09', len: 90 },
      { x: 1650, y: 370, dir: -1, color: '#00F0FF', len: 150 }
    ];

    avs.forEach((av) => {
      // Light trail streak
      const trailGrad = ctx.createLinearGradient(
        av.x, av.y,
        av.x - av.dir * av.len, av.y + 4
      );
      trailGrad.addColorStop(0, av.color);
      trailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(av.x, av.y);
      ctx.lineTo(av.x - av.dir * av.len, av.y + 4);
      ctx.stroke();

      // AV Vehicle head/cabin dot
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = av.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(av.x, av.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

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

  createFurniture() {
    this.furniture = new ApartmentFurniture();
    this.group.add(this.furniture.group);
  }

  update() {
    if (this.furniture) {
      this.furniture.update();
    }
  }
}

