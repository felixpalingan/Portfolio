import * as THREE from 'three';

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

    this.initMaterials();
    this.buildSleepingPod();
    this.buildToiletAndMirror();
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

    // Workstation desk surface
    this.deskMaterial = new THREE.MeshStandardMaterial({
      color: 0x241d18,
      roughness: 0.35,
      metalness: 0.4
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

    // Mirror material (highly reflective)
    this.mirrorMaterial = new THREE.MeshStandardMaterial({
      color: 0x99bbcc,
      roughness: 0.05,
      metalness: 0.95
    });
  }

  // ===========================================================================
  // 2A: SLEEPING POD & VENDING MACHINE (Top-Left)
  // ===========================================================================
  buildSleepingPod() {
    const podGroup = new THREE.Group();
    podGroup.position.set(-3.2, 0, -2.6);

    // Bed platform box (recessed base)
    const baseGeo = new THREE.BoxGeometry(1.8, 0.4, 1.5);
    const base = new THREE.Mesh(baseGeo, this.darkMetal);
    base.position.y = 0.2;
    base.receiveShadow = true;
    podGroup.add(base);

    // Mattress
    const mattressGeo = new THREE.BoxGeometry(1.65, 0.22, 1.35);
    const mattress = new THREE.Mesh(mattressGeo, this.bedSheetMaterial);
    mattress.position.y = 0.51;
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    podGroup.add(mattress);

    // Pillows
    const pillowGeo = new THREE.BoxGeometry(0.45, 0.12, 0.35);
    const pillow1 = new THREE.Mesh(pillowGeo, this.bedPillowMaterial);
    pillow1.position.set(-0.4, 0.65, -0.45);
    pillow1.rotation.y = 0.1;
    podGroup.add(pillow1);

    const pillow2 = new THREE.Mesh(pillowGeo, this.bedPillowMaterial);
    pillow2.position.set(0.2, 0.65, -0.42);
    pillow2.rotation.y = -0.05;
    podGroup.add(pillow2);

    // Rumpled duvet blanket at foot of bed
    const duvetGeo = new THREE.BoxGeometry(1.68, 0.18, 0.85);
    const duvet = new THREE.Mesh(duvetGeo, this.bedSheetMaterial);
    duvet.position.set(0.0, 0.62, 0.25);
    duvet.rotation.z = -0.02;
    podGroup.add(duvet);

    // Warm headboard neon strip
    const headboardLightGeo = new THREE.BoxGeometry(1.7, 0.06, 0.06);
    const headboardLight = new THREE.Mesh(headboardLightGeo, this.warmOrangeEmissive);
    headboardLight.position.set(0.0, 0.75, -0.7);
    podGroup.add(headboardLight);

    // Headboard point light (ambient warm glow over bed)
    const bedPointLight = new THREE.PointLight(0xff5511, 2.0, 3.5, 1.4);
    bedPointLight.position.set(0.0, 0.9, -0.5);
    podGroup.add(bedPointLight);

    this.group.add(podGroup);
  }

  // ===========================================================================
  // 2B: TOILET + MIRROR AREA (Left - between pod and desk)
  // ===========================================================================
  buildToiletAndMirror() {
    const toiletGroup = new THREE.Group();
    toiletGroup.position.set(-4.0, 0, -0.5);

    // Partition divider wall
    const partWallGeo = new THREE.BoxGeometry(0.12, 2.4, 1.8);
    const partWall = new THREE.Mesh(partWallGeo, this.darkMetal);
    partWall.position.set(1.0, 1.2, 0.0);
    toiletGroup.add(partWall);

    // Toilet Bowl & Tank (futuristic compact Megabuilding module)
    const toiletBowlGeo = new THREE.BoxGeometry(0.45, 0.45, 0.55);
    const toiletBowl = new THREE.Mesh(toiletBowlGeo, new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.1
    }));
    toiletBowl.position.set(0.3, 0.225, -0.4);
    toiletBowl.castShadow = true;
    toiletGroup.add(toiletBowl);

    const toiletTankGeo = new THREE.BoxGeometry(0.45, 0.5, 0.25);
    const toiletTank = new THREE.Mesh(toiletTankGeo, this.darkMetal);
    toiletTank.position.set(0.3, 0.65, -0.65);
    toiletGroup.add(toiletTank);

    // Sink counter
    const sinkGeo = new THREE.BoxGeometry(0.45, 0.75, 0.55);
    const sink = new THREE.Mesh(sinkGeo, this.darkMetal);
    sink.position.set(0.3, 0.375, 0.45);
    toiletGroup.add(sink);

    // Wall Mirror (glossy, reflective plastic mirror)
    const mirrorGeo = new THREE.BoxGeometry(0.04, 0.9, 0.5);
    const mirror = new THREE.Mesh(mirrorGeo, this.mirrorMaterial);
    mirror.position.set(-0.4, 1.45, 0.45);
    toiletGroup.add(mirror);

    // Cool white overhead LED strip for mirror
    const mirrorLightGeo = new THREE.BoxGeometry(0.06, 0.05, 0.5);
    const mirrorLightMesh = new THREE.Mesh(mirrorLightGeo, this.whiteEmissive);
    mirrorLightMesh.position.set(-0.38, 1.95, 0.45);
    toiletGroup.add(mirrorLightMesh);

    const mirrorSpot = new THREE.PointLight(0xddeeff, 1.5, 3.0);
    mirrorSpot.position.set(0.1, 1.8, 0.45);
    toiletGroup.add(mirrorSpot);

    this.group.add(toiletGroup);
  }

  // ===========================================================================
  // 2C: NETRUNNER WORKSTATION (Bottom-Left - Focus for PROJECTS)
  // ===========================================================================
  buildNetrunnerWorkstation() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-3.2, 0, 1.9);

    // Main Desk Tabletop (tan/dark wood laminate)
    const topGeo = new THREE.BoxGeometry(2.1, 0.08, 1.0);
    const deskTop = new THREE.Mesh(topGeo, this.deskMaterial);
    deskTop.position.set(0, 0.72, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Sturdy industrial metal frame legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.72, 0.9);
    const legL = new THREE.Mesh(legGeo, this.darkMetal);
    legL.position.set(-0.95, 0.36, 0);
    deskGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, this.darkMetal);
    legR.position.set(0.95, 0.36, 0);
    deskGroup.add(legR);

    // =========================================================================
    // CURVED ULTRAWIDE DIEGETIC MONITOR (Centerpiece of PROJECTS section)
    // =========================================================================
    // Generates procedural terminal canvas texture for monitor
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 1024;
    monitorCanvas.height = 400;
    const mctx = monitorCanvas.getContext('2d');

    // Terminal dark background
    mctx.fillStyle = '#060810';
    mctx.fillRect(0, 0, 1024, 400);

    // Subtle cyan matrix grid lines
    mctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    mctx.lineWidth = 1;
    for (let y = 0; y < 400; y += 20) {
      mctx.beginPath();
      mctx.moveTo(0, y);
      mctx.lineTo(1024, y);
      mctx.stroke();
    }

    // Header bar
    mctx.fillStyle = '#00F0FF';
    mctx.fillRect(0, 0, 1024, 34);
    mctx.fillStyle = '#060810';
    mctx.font = 'bold 18px monospace';
    mctx.fillText('NETRUNNER TERMINAL // OS v4.81 // ARASAKA BREACH SECURE', 20, 24);

    // Left pane: System telemetry
    mctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
    mctx.font = '14px monospace';
    mctx.fillText('> MEMORY: 64TB / 128TB NEURAL RAM', 24, 80);
    mctx.fillText('> ICE STATUS: BYPASSED // WATSON SUBNET', 24, 110);
    mctx.fillText('> REPO LOADED: FELIX PALINGAN // PORTFOLIO', 24, 140);
    mctx.fillText('> ACTIVE THREADS: 128 WORKER DAEMONS', 24, 170);

    // Center pane: Cyberpunk waveform graph
    mctx.strokeStyle = '#FCEE09';
    mctx.lineWidth = 2.5;
    mctx.beginPath();
    for (let x = 400; x < 850; x += 10) {
      const wave = Math.sin(x * 0.05) * 40 + Math.cos(x * 0.12) * 20;
      if (x === 400) mctx.moveTo(x, 150 + wave);
      else mctx.lineTo(x, 150 + wave);
    }
    mctx.stroke();

    // Right pane: Glowing alert badge
    mctx.fillStyle = '#FF003C';
    mctx.fillRect(870, 60, 130, 36);
    mctx.fillStyle = '#FFFFFF';
    mctx.font = 'bold 14px monospace';
    mctx.fillText('NET READY', 890, 84);

    // Bottom prompt line
    mctx.fillStyle = '#00F0FF';
    mctx.font = 'bold 18px monospace';
    mctx.fillText('root@megabuilding-h10:~$ select_project --interactive _', 24, 340);

    const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
    const monitorMat = new THREE.MeshBasicMaterial({
      map: monitorTexture
    });

    // Monitor screen (curved cylinder slice or angled panel)
    const monitorGeo = new THREE.BoxGeometry(1.35, 0.52, 0.04);
    const monitor = new THREE.Mesh(monitorGeo, monitorMat);
    monitor.position.set(0, 1.15, -0.15);
    monitor.castShadow = true;
    deskGroup.add(monitor);

    // Monitor bezel / frame
    const bezelGeo = new THREE.BoxGeometry(1.39, 0.56, 0.05);
    const bezel = new THREE.Mesh(bezelGeo, this.darkMetal);
    bezel.position.set(0, 1.15, -0.17);
    deskGroup.add(bezel);

    // Monitor heavy duty metal stand
    const standPoleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
    const standPole = new THREE.Mesh(standPoleGeo, this.darkMetal);
    standPole.position.set(0, 0.95, -0.22);
    deskGroup.add(standPole);

    const standBaseGeo = new THREE.BoxGeometry(0.35, 0.02, 0.25);
    const standBase = new THREE.Mesh(standBaseGeo, this.darkMetal);
    standBase.position.set(0, 0.74, -0.2);
    deskGroup.add(standBase);

    // Monitor glow casting on the desk
    const monitorLight = new THREE.PointLight(0x00F0FF, 1.8, 2.5, 1.4);
    monitorLight.position.set(0, 1.15, 0.3);
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
    kb.position.set(-0.1, 0.77, 0.15);
    deskGroup.add(kb);

    // Mouse & Mousepad
    const mousepadGeo = new THREE.BoxGeometry(0.24, 0.005, 0.22);
    const mousepad = new THREE.Mesh(mousepadGeo, this.cushionMaterial);
    mousepad.position.set(0.36, 0.765, 0.15);
    deskGroup.add(mousepad);

    // PC Server Tower / Rack under desk
    const towerGeo = new THREE.BoxGeometry(0.26, 0.55, 0.6);
    const tower = new THREE.Mesh(towerGeo, this.darkMetal);
    tower.position.set(0.68, 0.28, 0.05);
    deskGroup.add(tower);

    // Glowing RGB strip on PC tower
    const rgbStripGeo = new THREE.BoxGeometry(0.02, 0.48, 0.02);
    const rgbStrip = new THREE.Mesh(rgbStripGeo, this.cyanEmissive);
    rgbStrip.position.set(0.55, 0.28, 0.35);
    deskGroup.add(rgbStrip);

    // Shelves mounted on wall above desk
    const shelfGeo = new THREE.BoxGeometry(1.8, 0.05, 0.35);
    const shelf1 = new THREE.Mesh(shelfGeo, this.tanMetal);
    shelf1.position.set(0, 1.8, -0.45);
    deskGroup.add(shelf1);

    const shelf2 = new THREE.Mesh(shelfGeo, this.tanMetal);
    shelf2.position.set(0, 2.25, -0.45);
    deskGroup.add(shelf2);

    // Warm shelf strip light
    const shelfLightMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.03), this.warmOrangeEmissive);
    shelfLightMesh.position.set(0, 1.76, -0.4);
    deskGroup.add(shelfLightMesh);

    const shelfPoint = new THREE.PointLight(0xff7722, 1.4, 2.2);
    shelfPoint.position.set(0, 1.7, -0.3);
    deskGroup.add(shelfPoint);

    // Props on shelves: server drive arrays & datashards
    for (let s = -0.6; s <= 0.6; s += 0.3) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), this.darkMetal);
      box.position.set(s, 1.92, -0.45);
      deskGroup.add(box);
    }

    // Swivel Chair (Egg / Pilot swivel bucket seat)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0.75);

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

    // Samurai Bomber Jacket hanging on the wall hook near desk
    const jacketGroup = new THREE.Group();
    jacketGroup.position.set(-1.15, 1.6, 0.6);

    const jacketHook = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), this.darkMetal);
    jacketHook.rotation.z = Math.PI / 2;
    jacketGroup.add(jacketHook);

    // Leather jacket silhouette (dark leather with yellow Samurai collar)
    const jacketBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.18), new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.6,
      metalness: 0.15
    }));
    jacketBody.position.set(0, -0.35, 0);
    jacketGroup.add(jacketBody);

    // Glowing Samurai collar neon rim
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.2), this.yellowAccentMaterial);
    collar.position.set(0, -0.05, 0);
    jacketGroup.add(collar);

    deskGroup.add(jacketGroup);
    this.group.add(deskGroup);
  }

  // ===========================================================================
  // 2E: SUNKEN LOUNGE AREA (Top-Right - Focus for STATS)
  // ===========================================================================
  buildSunkenLounge() {
    const loungeGroup = new THREE.Group();
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

    // Braindance (BD) Headset Unit suspended nearby
    const bdGroup = new THREE.Group();
    bdGroup.position.set(0.65, 1.9, -0.4);

    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 6), this.darkMetal);
    cord.position.y = 0.5;
    bdGroup.add(cord);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.14), this.darkMetal);
    bdGroup.add(visor);

    const lens = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.02), this.cyanEmissive);
    lens.position.set(0, 0, 0.075);
    bdGroup.add(lens);

    loungeGroup.add(bdGroup);

    this.group.add(loungeGroup);
  }

  // ===========================================================================
  // 2F: WARDROBE (Bottom-Right)
  // ===========================================================================
  buildWardrobe() {
    const wGroup = new THREE.Group();
    wGroup.position.set(3.6, 0, 1.9);

    // Main wardrobe cabinet
    const bodyGeo = new THREE.BoxGeometry(1.5, 2.4, 0.85);
    const body = new THREE.Mesh(bodyGeo, this.darkMetal);
    body.position.y = 1.2;
    body.castShadow = true;
    wGroup.add(body);

    // Sliding door panel with vertical recess seam
    const door1 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.25, 0.04), this.tanMetal);
    door1.position.set(-0.35, 1.2, 0.44);
    wGroup.add(door1);

    const door2 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.25, 0.04), this.tanMetal);
    door2.position.set(0.35, 1.2, 0.46);
    wGroup.add(door2);

    // Long vertical industrial handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6), this.yellowAccentMaterial);
    handle.position.set(-0.06, 1.2, 0.48);
    wGroup.add(handle);

    // Status indicator LED (standby green)
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), new THREE.MeshStandardMaterial({
      color: 0x00FF88,
      emissive: 0x00FF88,
      emissiveIntensity: 2.0
    }));
    led.position.set(-0.6, 2.25, 0.48);
    wGroup.add(led);

    this.group.add(wGroup);
  }

  // ===========================================================================
  // 2G: CEILING FAN & CABLES
  // ===========================================================================
  buildCeilingFan() {
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 3.05, 0);

    // Downrod tube
    const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
    const rod = new THREE.Mesh(rodGeo, this.darkMetal);
    rod.position.y = -0.175;
    fanGroup.add(rod);

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

    fanGroup.add(this.rotorGroup);
    this.group.add(fanGroup);

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
    const wireMesh = new THREE.Mesh(wireGeo, this.darkMetal);
    this.group.add(wireMesh);
  }

  update() {
    this.animatedObjects.forEach((obj) => obj.update());
  }
}
