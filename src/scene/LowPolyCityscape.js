import * as THREE from 'three';

/**
 * LowPolyCityscape
 * Generates an authentic 3D low-poly Cyberpunk 2077 Night City skyline inspired by Wenay_Anime.jpg.
 * Includes tiered megastructures, cylindrical towers, animated neon billboards, glowing window matrices,
 * highway AV traffic with light trails, and blinking aviation warning beacons.
 */
export class LowPolyCityscape {
  constructor() {
    this.group = new THREE.Group();
    this.avs = [];
    this.beacons = [];
    this.materialsToDispose = [];
    this.texturesToDispose = [];

    this.initSharedMaterials();
    this.buildNightSkyDome();
    this.buildCityscape();
    this.buildHighwayTraffic();
    this.buildAtmosphere();
  }

  initSharedMaterials() {
    // Shared building facade palettes (Dark brutalist / corporate matte & metallic)
    this.facadeMats = [
      new THREE.MeshStandardMaterial({ color: 0x090c14, roughness: 0.85, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x0e1320, roughness: 0.7, metalness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0x131929, roughness: 0.65, metalness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x1c121e, roughness: 0.75, metalness: 0.2 }), // Purple-tinted mega-block
      new THREE.MeshStandardMaterial({ color: 0x071b24, roughness: 0.7, metalness: 0.3 })   // Cyan-tinted tower
    ];

    this.trimMat = new THREE.MeshStandardMaterial({
      color: 0x04060a,
      roughness: 0.5,
      metalness: 0.8
    });

    this.beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
  }

  // Create a canvas texture for neon signs / kanji / billboards
  createSignTexture(config) {
    const canvas = document.createElement('canvas');
    canvas.width = config.width || 512;
    canvas.height = config.height || 256;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = config.bg || '#03050a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (config.border) {
      ctx.strokeStyle = config.borderColor || config.color;
      ctx.lineWidth = config.borderWidth || 6;
      ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    }

    if (config.type === 'anime_lucy') {
      // Stylized Cyberpunk anime portrait billboard (Night City Legends / Lucy tribute)
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#091026');
      grad.addColorStop(0.5, '#2b1055');
      grad.addColorStop(1, '#050510');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber glow frame
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 8;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      // Character silhouette & hair strokes
      ctx.fillStyle = '#e2f6ff';
      ctx.beginPath();
      // White/cyan bob hair
      ctx.arc(canvas.width * 0.5, canvas.height * 0.38, canvas.width * 0.26, Math.PI * 0.8, Math.PI * 0.2, true);
      ctx.fill();

      // Face silhouette
      ctx.fillStyle = '#ffdfd3';
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.35, canvas.height * 0.35);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.58);
      ctx.lineTo(canvas.width * 0.65, canvas.height * 0.35);
      ctx.fill();

      // Cyber netrunner eyes
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 15;
      ctx.fillRect(canvas.width * 0.40, canvas.height * 0.40, 18, 6);
      ctx.fillRect(canvas.width * 0.54, canvas.height * 0.40, 18, 6);
      ctx.shadowBlur = 0;

      // Text legend
      ctx.fillStyle = '#FCEE09';
      ctx.font = 'bold 28px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FCEE09';
      ctx.shadowBlur = 10;
      ctx.fillText('NIGHT CITY LEGENDS', canvas.width * 0.5, canvas.height * 0.82);
      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('EDGERUNNER // DEEP NET', canvas.width * 0.5, canvas.height * 0.92);
    } else if (config.verticalKanji) {
      // Vertical illuminated Kanji sign (e.g., テラガテレンタス / アラサカ)
      ctx.fillStyle = config.color;
      ctx.shadowColor = config.glowColor || config.color;
      ctx.shadowBlur = 20;
      ctx.font = `bold ${config.fontSize || 38}px "Hiragino Sans", "Meiryo", "Noto Sans JP", sans-serif`;
      ctx.textAlign = 'center';

      const chars = config.text.split('');
      const charSpacing = canvas.height / (chars.length + 1);
      chars.forEach((char, idx) => {
        ctx.fillText(char, canvas.width * 0.5, charSpacing * (idx + 1) + 10);
      });
    } else {
      // Horizontal corporate / street signage
      ctx.textAlign = 'center';
      ctx.shadowColor = config.glowColor || config.color;
      ctx.shadowBlur = config.blur || 18;
      ctx.fillStyle = config.color;
      ctx.font = `900 ${config.fontSize || 42}px "Segoe UI", Arial, sans-serif`;
      ctx.fillText(config.text, canvas.width * 0.5, canvas.height * 0.52);

      if (config.subtext) {
        ctx.font = `bold ${Math.round((config.fontSize || 42) * 0.4)}px "Segoe UI", Arial, sans-serif`;
        ctx.fillStyle = config.subcolor || '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillText(config.subtext, canvas.width * 0.5, canvas.height * 0.78);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    this.texturesToDispose.push(texture);
    return texture;
  }

  // Procedural lit window texture matrix for skyscrapers
  createWindowMatrixTexture(cols, rows, litProb, baseColor, litColor) {
    const canvas = document.createElement('canvas');
    canvas.width = cols * 8;
    canvas.height = rows * 12;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < litProb) {
          const colorVariance = Math.random();
          if (colorVariance > 0.85) {
            ctx.fillStyle = '#00F0FF'; // Netrunner Cyan
          } else if (colorVariance > 0.7) {
            ctx.fillStyle = '#FF003C'; // Arasaka Crimson
          } else if (colorVariance > 0.45) {
            ctx.fillStyle = '#FFE699'; // Warm residential amber
          } else {
            ctx.fillStyle = litColor || '#9CE6FF'; // Cold corporate blue
          }
          ctx.fillRect(c * 8 + 2, r * 12 + 2, 4, 7);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.texturesToDispose.push(texture);
    return texture;
  }

  buildNightSkyDome() {
    // Atmospheric dark gradient sky backdrop in the far horizon
    const skyGeo = new THREE.PlaneGeometry(35, 20);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#02040a');
    grad.addColorStop(0.5, '#050d1a');
    grad.addColorStop(0.85, '#0a1628');
    grad.addColorStop(1, '#0e0b1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);

    const skyTex = new THREE.CanvasTexture(canvas);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, depthWrite: false });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 4.0, -18.0);
    this.group.add(skyMesh);
  }

  buildCityscape() {
    // -------------------------------------------------------------
    // LAYER A (PRIMARY / NEAR BUILDINGS, Z: -4.8 to -7.5)
    // -------------------------------------------------------------

    // 1. Central Iconic Cylindrical Megabuilding with Tiered Rings & Vertical Neon
    // (Direct match for the iconic round tower right outside the window in Wenay_Anime.jpg)
    const towerRadius = 0.85;
    const towerHeight = 11.0;
    const towerSegments = 24;
    const roundTowerGeo = new THREE.CylinderGeometry(towerRadius, towerRadius * 1.05, towerHeight, towerSegments);
    const roundTowerMat = new THREE.MeshStandardMaterial({
      color: 0x0c1018,
      roughness: 0.6,
      metalness: 0.5
    });
    const roundTower = new THREE.Mesh(roundTowerGeo, roundTowerMat);
    roundTower.position.set(-0.1, towerHeight / 2 - 4.2, -5.8);
    this.group.add(roundTower);

    // Architectural circular ribbed balconies/collars along the cylindrical tower
    const ringCount = 14;
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x05070c, roughness: 0.4, metalness: 0.8 });
    const ringLightMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    for (let i = 0; i < ringCount; i++) {
      const ringY = -3.5 + i * 0.78;
      const ringGeo = new THREE.CylinderGeometry(towerRadius * 1.08, towerRadius * 1.08, 0.12, towerSegments);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(-0.1, ringY, -5.8);
      this.group.add(ringMesh);

      // Cyan neon ring lights on select floors
      if (i % 2 === 0) {
        const ringGlowGeo = new THREE.TorusGeometry(towerRadius * 1.1, 0.015, 8, 24);
        ringGlowGeo.rotateX(Math.PI / 2);
        const ringGlow = new THREE.Mesh(ringGlowGeo, ringLightMat);
        ringGlow.position.set(-0.1, ringY, -5.8);
        this.group.add(ringGlow);
      }
    }

    // Huge Vertical Teal Kanji Sign on Cylindrical Tower ("テラガテレンタス")
    const kanjiTex = this.createSignTexture({
      text: 'テラガテレンタス',
      verticalKanji: true,
      color: '#00F0FF',
      glowColor: '#00F0FF',
      bg: '#040d14',
      width: 128,
      height: 640,
      fontSize: 44
    });
    const kanjiSignGeo = new THREE.PlaneGeometry(0.55, 3.2);
    const kanjiSignMat = new THREE.MeshBasicMaterial({ map: kanjiTex });
    const kanjiSignMesh = new THREE.Mesh(kanjiSignGeo, kanjiSignMat);
    kanjiSignMesh.position.set(-0.1, 1.35, -5.8 + towerRadius * 1.09);
    this.group.add(kanjiSignMesh);

    // Giant anime billboard right above it ("NIGHT CITY LEGENDS" / Lucy)
    const animeTex = this.createSignTexture({ type: 'anime_lucy', width: 384, height: 512 });
    const animeSignGeo = new THREE.PlaneGeometry(1.6, 2.3);
    const animeSignMat = new THREE.MeshBasicMaterial({ map: animeTex });
    const animeSignMesh = new THREE.Mesh(animeSignGeo, animeSignMat);
    animeSignMesh.position.set(0.65, 3.6, -5.7);
    this.group.add(animeSignMesh);

    // 2. Left Monolithic ARASAKA Skyscraper (Tiered Brutalist with Red Kanji & Logo)
    const arasakaWidth = 2.2;
    const arasakaHeight = 14.0;
    const arasakaDepth = 2.4;
    const arasakaGeo = new THREE.BoxGeometry(arasakaWidth, arasakaHeight, arasakaDepth);
    const arasakaMat = new THREE.MeshStandardMaterial({
      color: 0x090a10,
      roughness: 0.5,
      metalness: 0.6
    });
    const arasakaTower = new THREE.Mesh(arasakaGeo, arasakaMat);
    arasakaTower.position.set(-3.2, arasakaHeight / 2 - 4.5, -6.2);
    this.group.add(arasakaTower);

    // Arasaka stepped top
    const arasakaTopGeo = new THREE.BoxGeometry(1.4, 3.5, 1.6);
    const arasakaTop = new THREE.Mesh(arasakaTopGeo, arasakaMat);
    arasakaTop.position.set(-3.2, 5.2, -6.2);
    this.group.add(arasakaTop);

    // Arasaka Spire with glowing red beacon
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.12, 3.0, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(-3.2, 8.2, -6.2);
    this.group.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const beacon = new THREE.Mesh(beaconGeo, this.beaconMat);
    beacon.position.set(-3.2, 9.7, -6.2);
    this.group.add(beacon);
    this.beacons.push(beacon);

    // Arasaka Vertical Crimson Neon Sign
    const arasakaTex = this.createSignTexture({
      text: 'ARASAKA',
      verticalKanji: true,
      color: '#FF003C',
      glowColor: '#FF003C',
      bg: '#140005',
      width: 128,
      height: 512,
      fontSize: 48
    });
    const arasakaSignGeo = new THREE.PlaneGeometry(0.5, 2.6);
    const arasakaSignMat = new THREE.MeshBasicMaterial({ map: arasakaTex });
    const arasakaSignMesh = new THREE.Mesh(arasakaSignGeo, arasakaSignMat);
    arasakaSignMesh.position.set(-2.08, 2.2, -6.2 + arasakaDepth / 2 + 0.02);
    this.group.add(arasakaSignMesh);

    // Arasaka Window Matrix Texture
    const windowMatArasaka = new THREE.MeshBasicMaterial({
      map: this.createWindowMatrixTexture(16, 40, 0.45, '#05070d', '#6edeff')
    });
    const arasakaFacadeWindowGeo = new THREE.PlaneGeometry(1.6, 4.0);
    const arasakaWindowMesh = new THREE.Mesh(arasakaFacadeWindowGeo, windowMatArasaka);
    arasakaWindowMesh.position.set(-3.2, -0.4, -6.2 + arasakaDepth / 2 + 0.02);
    this.group.add(arasakaWindowMesh);

    // 3. Right Tower: High-tech Media Arcology with TYGER CLAWS RAMEN & SYNTH-SKIN
    const rightTowerWidth = 2.4;
    const rightTowerHeight = 13.0;
    const rightTowerDepth = 2.0;
    const rightTowerGeo = new THREE.BoxGeometry(rightTowerWidth, rightTowerHeight, rightTowerDepth);
    const rightTowerMat = new THREE.MeshStandardMaterial({
      color: 0x0d121c,
      roughness: 0.6,
      metalness: 0.45
    });
    const rightTower = new THREE.Mesh(rightTowerGeo, rightTowerMat);
    rightTower.position.set(3.4, rightTowerHeight / 2 - 4.5, -6.5);
    this.group.add(rightTower);

    // Tyger Claws Ramen Neon Billboard
    const ramenTex = this.createSignTexture({
      text: 'TYGER CLAWS',
      subtext: 'RAMEN 24H 🍜',
      color: '#FF0055',
      glowColor: '#FF0055',
      subcolor: '#FFE600',
      bg: '#12040a',
      width: 384,
      height: 192,
      fontSize: 38,
      border: true
    });
    const ramenSignGeo = new THREE.PlaneGeometry(1.4, 0.7);
    const ramenSignMat = new THREE.MeshBasicMaterial({ map: ramenTex });
    const ramenSignMesh = new THREE.Mesh(ramenSignGeo, ramenSignMat);
    ramenSignMesh.position.set(2.8, 3.2, -6.5 + rightTowerDepth / 2 + 0.02);
    this.group.add(ramenSignMesh);

    // BLADE RUNNER SYNTH-SKIN Billboard (Right lower, mounted on tower)
    const synthTex = this.createSignTexture({
      text: 'BLADE RUNNER',
      subtext: 'SYNTH - SKIN BIO-TECH',
      color: '#FF4081',
      glowColor: '#FF4081',
      subcolor: '#00F0FF',
      bg: '#08000f',
      width: 440,
      height: 180,
      fontSize: 36,
      border: true
    });
    const synthSignGeo = new THREE.PlaneGeometry(1.5, 0.6);
    const synthSignMat = new THREE.MeshBasicMaterial({ map: synthTex });
    const synthSignMesh = new THREE.Mesh(synthSignGeo, synthSignMat);
    synthSignMesh.position.set(2.4, 0.8, -6.5 + rightTowerDepth / 2 + 0.02);
    this.group.add(synthSignMesh);

    // NETWATCH SECURITY Billboard (Right elevated structure)
    const netwatchTex = this.createSignTexture({
      text: 'NETWATCH',
      subtext: 'GLOBAL GRID SECURITY',
      color: '#00F0FF',
      glowColor: '#00F0FF',
      subcolor: '#FCEE09',
      bg: '#021017',
      width: 480,
      height: 160,
      fontSize: 42,
      border: true
    });
    const netwatchSignGeo = new THREE.PlaneGeometry(1.8, 0.6);
    const netwatchSignMat = new THREE.MeshBasicMaterial({ map: netwatchTex });
    const netwatchSignMesh = new THREE.Mesh(netwatchSignGeo, netwatchSignMat);
    netwatchSignMesh.position.set(3.2, 0.15, -6.5 + rightTowerDepth / 2 + 0.02);
    this.group.add(netwatchSignMesh);

    // Distant Skybridge connecting towers across the urban canyon
    const gantryGeo = new THREE.BoxGeometry(3.6, 0.3, 0.7);
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x05080f, roughness: 0.5, metalness: 0.8 });
    const gantryMesh = new THREE.Mesh(gantryGeo, gantryMat);
    gantryMesh.position.set(1.5, -0.9, -7.2);
    this.group.add(gantryMesh);

    // Gantry illuminated edge line (Cyan LED strip)
    const gantryEdgeGeo = new THREE.BoxGeometry(3.6, 0.04, 0.04);
    const gantryEdgeMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    const gantryEdge = new THREE.Mesh(gantryEdgeGeo, gantryEdgeMat);
    gantryEdge.position.set(1.5, -0.74, -6.84);
    this.group.add(gantryEdge);

    // -------------------------------------------------------------
    // LAYER B (MID-GROUND CITY BLOCKS, Z: -7.5 to -11.5)
    // -------------------------------------------------------------
    const midBuildings = [
      { x: -5.2, z: -8.8, w: 2.2, h: 10.5, d: 2.0, color: 0x080e18, sign: 'KANG TAO' },
      { x: -2.2, z: -9.5, w: 1.8, h: 12.0, d: 1.8, color: 0x100a18, sign: 'MILITECH' },
      { x: 1.6,  z: -8.2, w: 1.9, h: 11.0, d: 2.1, color: 0x061219, sign: 'ORBITAL AIR' },
      { x: 5.5,  z: -9.2, w: 2.5, h: 13.5, d: 2.2, color: 0x0c0b16, sign: 'TRAUMA TEAM' },
      { x: -0.6, z: -10.5, w: 2.6, h: 15.0, d: 2.4, color: 0x070912, spire: true },
      { x: 3.8,  z: -10.8, w: 2.0, h: 9.8,  d: 1.9, color: 0x0d1322, sign: 'BIOTECHNICA' }
    ];

    midBuildings.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.7,
        metalness: 0.35
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, b.h / 2 - 4.5, b.z);
      this.group.add(mesh);

      // Window grid texture on mid buildings
      const winGeo = new THREE.PlaneGeometry(b.w * 0.85, b.h * 0.6);
      const winMat = new THREE.MeshBasicMaterial({
        map: this.createWindowMatrixTexture(12, 32, 0.35, '#04060c', '#89d7ff')
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(b.x, (b.h * 0.6) / 2 - 3.5, b.z + b.d / 2 + 0.02);
      this.group.add(winMesh);

      // Signage if specified
      if (b.sign) {
        const signTex = this.createSignTexture({
          text: b.sign,
          color: b.sign === 'TRAUMA TEAM' ? '#FF003C' : '#00F0FF',
          glowColor: b.sign === 'TRAUMA TEAM' ? '#FF003C' : '#00F0FF',
          bg: '#040710',
          width: 256,
          height: 96,
          fontSize: 32,
          border: true
        });
        const signMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.2, 0.45),
          new THREE.MeshBasicMaterial({ map: signTex })
        );
        signMesh.position.set(b.x, b.h - 5.8, b.z + b.d / 2 + 0.03);
        this.group.add(signMesh);
      }

      if (b.spire) {
        const bSpire = new THREE.Mesh(spireGeo, spireMat);
        bSpire.position.set(b.x, b.h - 4.5 + 1.5, b.z);
        this.group.add(bSpire);

        const bBeacon = new THREE.Mesh(beaconGeo, this.beaconMat);
        bBeacon.position.set(b.x, b.h - 4.5 + 3.0, b.z);
        this.group.add(bBeacon);
        this.beacons.push(bBeacon);
      }
    });

    // -------------------------------------------------------------
    // LAYER C (FAR HORIZON DENSE SKYSCRAPERS, Z: -12.0 to -16.0)
    // -------------------------------------------------------------
    const farXs = [-8.5, -6.8, -4.5, -2.8, -0.5, 1.4, 3.2, 5.0, 7.2, 9.0];
    farXs.forEach((fx, idx) => {
      const fh = 8.0 + (idx % 4) * 3.2;
      const fw = 1.6 + Math.random() * 0.8;
      const fd = 1.6 + Math.random() * 0.8;
      const fz = -13.0 - (idx % 3) * 1.5;

      const fGeo = new THREE.BoxGeometry(fw, fh, fd);
      const fMat = new THREE.MeshStandardMaterial({
        color: 0x05070e,
        roughness: 0.9,
        metalness: 0.2
      });
      const fMesh = new THREE.Mesh(fGeo, fMat);
      fMesh.position.set(fx, fh / 2 - 4.5, fz);
      this.group.add(fMesh);

      // Light dot clusters on top of far buildings
      if (idx % 2 === 0) {
        const dotGeo = new THREE.SphereGeometry(0.06, 6, 6);
        const dot = new THREE.Mesh(dotGeo, this.beaconMat);
        dot.position.set(fx, fh - 4.5 + 0.1, fz);
        this.group.add(dot);
        this.beacons.push(dot);
      }
    });
  }

  buildHighwayTraffic() {
    // -------------------------------------------------------------
    // 3D Flying Aerodynes (AVs) with Light Trails & Speed Variance
    // -------------------------------------------------------------
    const avConfigs = [
      { y: 2.8, z: -5.3, speed: 0.012, color: 0x00F0FF, minX: -7.0, maxX: 7.0, startX: -2.5, scale: 1.0 },
      { y: 1.9, z: -6.1, speed: -0.009, color: 0xFF003C, minX: -7.0, maxX: 7.0, startX: 3.2, scale: 0.85 },
      { y: 3.4, z: -7.4, speed: 0.007, color: 0xFCEE09, minX: -8.0, maxX: 8.0, startX: -4.0, scale: 0.75 },
      { y: 0.8, z: -4.9, speed: -0.015, color: 0x00F0FF, minX: -6.5, maxX: 6.5, startX: 1.8, scale: 1.1 },
      { y: 4.2, z: -9.8, speed: 0.006, color: 0xFF5500, minX: -9.0, maxX: 9.0, startX: -1.0, scale: 0.6 }
    ];

    avConfigs.forEach((cfg) => {
      const avGroup = new THREE.Group();

      // AV Hull (Futuristic geometric wedge)
      const hullMat = new THREE.MeshBasicMaterial({ color: 0x111622 });
      const hullGeo = new THREE.BoxGeometry(0.24 * cfg.scale, 0.06 * cfg.scale, 0.12 * cfg.scale);
      const hull = new THREE.Mesh(hullGeo, hullMat);
      avGroup.add(hull);

      // Cabin / windshield glow
      const cabinMat = new THREE.MeshBasicMaterial({ color: 0x8fe7ff });
      const cabinGeo = new THREE.BoxGeometry(0.1 * cfg.scale, 0.03 * cfg.scale, 0.08 * cfg.scale);
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(cfg.speed > 0 ? 0.04 * cfg.scale : -0.04 * cfg.scale, 0.03 * cfg.scale, 0);
      avGroup.add(cabin);

      // Neon Thruster Trail (Long luminous stream)
      const trailLen = 0.9 * cfg.scale;
      const trailGeo = new THREE.BoxGeometry(trailLen, 0.02 * cfg.scale, 0.02 * cfg.scale);
      const trailMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85
      });
      const trailMesh = new THREE.Mesh(trailGeo, trailMat);
      trailMesh.position.x = cfg.speed > 0 ? -trailLen / 2 : trailLen / 2;
      avGroup.add(trailMesh);

      // Headlight glow
      const headLightGeo = new THREE.SphereGeometry(0.02 * cfg.scale, 6, 6);
      const headLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const headLight = new THREE.Mesh(headLightGeo, headLightMat);
      headLight.position.set(cfg.speed > 0 ? 0.13 * cfg.scale : -0.13 * cfg.scale, 0, 0);
      avGroup.add(headLight);

      avGroup.position.set(cfg.startX, cfg.y, cfg.z);
      this.group.add(avGroup);

      this.avs.push({
        mesh: avGroup,
        speed: cfg.speed,
        minX: cfg.minX,
        maxX: cfg.maxX
      });
    });

    // Elevated Skyway Highway lower light strip (Stream of distant ground traffic)
    const highwayGeo = new THREE.BoxGeometry(22.0, 0.15, 0.8);
    const highwayMat = new THREE.MeshStandardMaterial({ color: 0x05070c, roughness: 0.8 });
    const highway = new THREE.Mesh(highwayGeo, highwayMat);
    highway.position.set(0, -1.8, -5.6);
    this.group.add(highway);

    // Glowing traffic lines on highway (Red rear lights & white headlights streak)
    const redStreamGeo = new THREE.BoxGeometry(22.0, 0.02, 0.08);
    const redStreamMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const redStream = new THREE.Mesh(redStreamGeo, redStreamMat);
    redStream.position.set(0, -1.71, -5.75);
    this.group.add(redStream);

    const cyanStreamGeo = new THREE.BoxGeometry(22.0, 0.02, 0.08);
    const cyanStreamMat = new THREE.MeshBasicMaterial({ color: 0xffeebb });
    const cyanStream = new THREE.Mesh(cyanStreamGeo, cyanStreamMat);
    cyanStream.position.set(0, -1.71, -5.45);
    this.group.add(cyanStream);
  }

  buildAtmosphere() {
    // -------------------------------------------------------------
    // Dynamic Colored Neon Ambient & Volumetric Glow for the City
    // -------------------------------------------------------------
    // 1. Central Cyber Cyan Ambient glow from cylindrical tower & billboards
    const cyanLight = new THREE.PointLight(0x00F0FF, 1.8, 9.0, 1.4);
    cyanLight.position.set(0.2, 2.2, -4.8);
    this.group.add(cyanLight);

    // 2. Arasaka Tower Crimson Ambient Glow on Left
    const arasakaLight = new THREE.PointLight(0xFF003C, 1.4, 8.5, 1.3);
    arasakaLight.position.set(-2.5, 2.5, -5.4);
    this.group.add(arasakaLight);

    // 3. Tyger Claws / Synth-Skin Magenta Glow on Right
    const magentaLight = new THREE.PointLight(0xFF0055, 1.5, 8.5, 1.3);
    magentaLight.position.set(2.8, 2.6, -5.2);
    this.group.add(magentaLight);

    // 4. Ground amber reflection from highway
    const groundAmber = new THREE.PointLight(0xFFA834, 0.9, 6.0, 1.6);
    groundAmber.position.set(0.0, -1.2, -4.5);
    this.group.add(groundAmber);
  }

  update(time) {
    // Animate Flying AVs across the skyway lanes
    if (this.avs && this.avs.length > 0) {
      this.avs.forEach((av) => {
        av.mesh.position.x += av.speed;
        if (av.speed > 0 && av.mesh.position.x > av.maxX) {
          av.mesh.position.x = av.minX;
        } else if (av.speed < 0 && av.mesh.position.x < av.minX) {
          av.mesh.position.x = av.maxX;
        }
      });
    }

    // Blink aviation warning beacons on top of skyscrapers
    if (this.beacons && this.beacons.length > 0) {
      const blink = Math.sin(time * 3.5) > 0.2;
      this.beaconMat.opacity = blink ? 1.0 : 0.15;
      this.beaconMat.transparent = true;
    }
  }

  dispose() {
    this.texturesToDispose.forEach((t) => t.dispose());
    this.materialsToDispose.forEach((m) => m.dispose());
  }
}
