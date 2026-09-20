import * as THREE from 'three';

/**
 * Procedural Texture Generator for Cyberpunk Apartment
 * Optimized for rapid generation and high performance.
 */
export class TextureGenerator {
  /**
   * Generates hexagonal floor tile texture matching Megabuilding H10
   */
  static createHexFloorTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background / Grout color (dark charcoal)
    ctx.fillStyle = '#0f0a08';
    ctx.fillRect(0, 0, size, size);

    const radius = 24;
    const h = radius * Math.sqrt(3);
    const vDist = radius * 1.5;
    const hDist = h;

    const cols = Math.ceil(size / hDist) + 2;
    const rows = Math.ceil(size / vDist) + 2;

    const tileColors = [
      '#3a2218', '#42281d', '#351f15', '#4a2c20', 
      '#382117', '#482a1e', '#311d14', '#3d251a'
    ];

    function drawHexagon(cx, cy, r, fill) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      // Subtle bevel stroke
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 180, 120, 0.12)';
      ctx.stroke();
    }

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const xOffset = (r % 2 === 0) ? 0 : hDist / 2;
        const cx = c * hDist + xOffset;
        const cy = r * vDist;

        const colorIdx = (Math.abs(c * 7 + r * 13)) % tileColors.length;
        const tileColor = tileColors[colorIdx];

        drawHexagon(cx, cy, radius - 2, tileColor);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }

  /**
   * Generates industrial wall panel texture
   */
  static createWallTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark industrial wall tone
    ctx.fillStyle = '#1c1714';
    ctx.fillRect(0, 0, size, size);

    // Horizontal panel seams
    ctx.strokeStyle = '#0e0b0a';
    ctx.lineWidth = 4;
    for (let y = 128; y < size; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();

      // Top highlight line for bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y - 2);
      ctx.lineTo(size, y - 2);
      ctx.stroke();
      ctx.strokeStyle = '#0e0b0a';
      ctx.lineWidth = 4;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2);
    return texture;
  }

  /**
   * Generates natural window glass surface texture (fine condensation streaks, subtle corner grime)
   */
  static createGlassRoughnessTexture() {
    const w = 512;
    const h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Base glass roughness (low roughness = glossy reflection)
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, w, h);

    // Subtle edge / corner dust (higher roughness around edges)
    const edgeGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.55);
    edgeGrad.addColorStop(0, 'rgba(34, 34, 34, 0)');
    edgeGrad.addColorStop(1, 'rgba(90, 80, 70, 0.45)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, h);

    // Faint vertical rain / condensation drip streaks
    ctx.strokeStyle = 'rgba(160, 180, 200, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 12; x < w; x += 18 + Math.random() * 24) {
      ctx.beginPath();
      const startY = Math.random() * 80;
      const len = 60 + Math.random() * 120;
      ctx.moveTo(x, startY);
      ctx.lineTo(x + (Math.random() - 0.5) * 3, startY + len);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Generates authentic 2x2 twill weave carbon fiber texture
   */
  static createCarbonFiberTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark carbon substrate
    ctx.fillStyle = '#101216';
    ctx.fillRect(0, 0, size, size);

    const step = 8;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const isOddRow = Math.floor(y / step) % 2 === 0;
        const isOddCol = Math.floor(x / step) % 2 === 0;

        // Alternating directional twill fibers
        const grad = ctx.createLinearGradient(x, y, x + step, y + step);
        if ((isOddRow && isOddCol) || (!isOddRow && !isOddCol)) {
          grad.addColorStop(0.0, '#2e323b');
          grad.addColorStop(0.5, '#1e2026');
          grad.addColorStop(1.0, '#131519');
        } else {
          grad.addColorStop(0.0, '#15171c');
          grad.addColorStop(0.5, '#252932');
          grad.addColorStop(1.0, '#1a1c22');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, step, step);

        // Subtle weave groove border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, step, step);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 8);
    return texture;
  }

  /**
   * Generates a photorealistic Chrome Silver metallic reflection texture
   * Produces brilliant specular gleams and horizontal horizon line typical of polished chrome
   */
  static createChromeSilverTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Multi-stop metallic sky-ground horizon gradient
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0.0, '#1c2432');  // Deep dark metal top edge
    grad.addColorStop(0.18, '#52647a'); // Cool blue-grey metal
    grad.addColorStop(0.40, '#a2b8d0'); // Light silver reflection
    grad.addColorStop(0.48, '#eaf2fa'); // Brilliant silver sheen
    grad.addColorStop(0.50, '#ffffff'); // Sharp white horizon highlight line
    grad.addColorStop(0.52, '#28313e'); // High-contrast ground reflection
    grad.addColorStop(0.68, '#58687a'); // Reflective floor ambient
    grad.addColorStop(0.85, '#92a6be'); // Soft lower specular reflection
    grad.addColorStop(1.0, '#1c222c');  // Dark base edge

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Subtle horizontal brushed chrome striations
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += 4) {
      const alpha = (Math.sin(y * 0.1) * 0.5 + 0.5) * 0.08;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // Diagonal specular flare streaks
    const flareGrad = ctx.createLinearGradient(0, 0, size, size);
    flareGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0)');
    flareGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.28)');
    flareGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.5)');
    flareGrad.addColorStop(0.46, 'rgba(255, 255, 255, 0.2)');
    flareGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, size, size);

    // Cyberpunk optical grid watermark
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < size; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y < size; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(y, size);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  /**
   * Generates Cyberpunk 2077 Smart Mirror diegetic HUD texture with biometric avatar
   */
  static createSmartMirrorTexture() {
    const w = 1024;
    const h = 1280;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);

    function renderBase() {
      // Deep semi-transparent cybernetic glass background
      ctx.fillStyle = 'rgba(6, 10, 18, 0.88)';
      ctx.fillRect(0, 0, w, h);

      // Subtle background scanline matrix
      ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
      for (let y = 0; y < h; y += 8) {
        ctx.fillRect(0, y, w, 4);
      }

      // Outer HUD frame with cyber brackets
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);

      // Corner brackets
      ctx.fillStyle = '#FCEE09';
      ctx.fillRect(20, 20, 36, 8);
      ctx.fillRect(20, 20, 8, 36);
      ctx.fillRect(w - 56, 20, 36, 8);
      ctx.fillRect(w - 28, 20, 8, 36);
      ctx.fillRect(20, h - 28, 36, 8);
      ctx.fillRect(20, h - 56, 8, 36);
      ctx.fillRect(w - 56, h - 28, 36, 8);
      ctx.fillRect(w - 28, h - 56, 8, 36);

      // Top Header
      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('⚡ ARASAKA BIOTECH // KIROSHI SMART MIRROR', 56, 85);

      ctx.fillStyle = '#FCEE09';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('● OPTICAL LINK ACTIVE // 98.7 MHz NET_SUBNET', 56, 120);

      ctx.fillStyle = '#00FF66';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('WATSON MEGABUILDING H10', w - 56, 120);
      ctx.textAlign = 'left';

      // Divider Line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, 145);
      ctx.lineTo(w - 56, 145);
      ctx.stroke();

      // =======================================================================
      // AVATAR / PROFILE PHOTO BOX (Left Column: w=340, h=340)
      // =======================================================================
      const photoX = 56;
      const photoY = 175;
      const photoSize = 340;

      ctx.fillStyle = '#0a101d';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      // Biometric tag
      ctx.fillStyle = '#00FF66';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('[BIOMETRIC SCAN: 100% MATCH // ARASAKA ICE CLEAN]', 56, photoY + photoSize + 32);

      // =======================================================================
      // OPERATIVE INFO & TELEMETRY (Right Column)
      // =======================================================================
      const infoX = 428;
      const infoY = 195;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('ALMAKIUS FELIX BARIQ HEKOPUNG', infoX, infoY + 15);

      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('// FULL STACK NETRUNNER & CREATIVE DEVELOPER', infoX, infoY + 55);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '18px monospace';
      ctx.fillText('LOCATION: WATSON DISTRICT // MEGABUILDING H10', infoX, infoY + 95);
      ctx.fillText('ICE PROTOCOL: WATSON SUBNET BYPASS [SECURE]', infoX, infoY + 125);
      ctx.fillText('CORE LOADOUT: REACT | NEXT.JS | THREE.JS | PYTHON', infoX, infoY + 155);
      ctx.fillText('SPECIALTY   : IMMERSIVE 3D WEBGL & SYSTEMS ARCHITECTURE', infoX, infoY + 185);

      // Status Pill
      ctx.fillStyle = 'rgba(0, 255, 102, 0.15)';
      ctx.fillRect(infoX, infoY + 220, 520, 48);
      ctx.strokeStyle = '#00FF66';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(infoX, infoY + 220, 520, 48);

      ctx.fillStyle = '#00FF66';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('● STATUS: AVAILABLE FOR CONTRACTS & RAID TEAMS', infoX + 20, infoY + 252);

      // Middle Divider
      ctx.strokeStyle = '#FF003C';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(56, 580);
      ctx.lineTo(w - 56, 580);
      ctx.stroke();

      // =======================================================================
      // TRANSMISSION CHANNELS HEADER
      // =======================================================================
      ctx.fillStyle = '#FCEE09';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('// DIRECT TRANSMISSION CHANNELS [SELECT 3D BUTTONS ON MIRROR]', 56, 625);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.font = '18px monospace';
      ctx.fillText('CLICK DIRECTLY ON THE 3D INTERFACE PLATES BELOW TO ENGAGE COMMS', 56, 655);
    }

    renderBase();

    // Load authentic avatar image and render onto photo box
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.onload = () => {
      renderBase();
      const photoX = 56;
      const photoY = 175;
      const photoSize = 340;
      ctx.drawImage(avatarImg, photoX, photoY, photoSize, photoSize);

      // Cyan HUD facial targeting brackets overlay on top of photo
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(photoX + 30, photoY + 30, photoSize - 60, photoSize - 60);

      // Retinal crosshair
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2 - 20, 24, 0, Math.PI * 2);
      ctx.strokeStyle = '#FCEE09';
      ctx.stroke();

      texture.needsUpdate = true;
    };
    avatarImg.src = '/felix_avatar.jpg';

    return texture;
  }

  /**
   * Generates high-res Cyberpunk 3D button canvas textures (normal, hover, success)
   */
  static createMirrorButtonTexture(config) {
    const { icon, title, subtitle, color = '#00F0FF', isHovered = false, isSuccess = false } = config;
    const w = 512;
    const h = 136;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = isHovered ? 'rgba(0, 240, 255, 0.28)' : 'rgba(8, 14, 26, 0.94)';
    if (isSuccess) ctx.fillStyle = 'rgba(0, 255, 102, 0.35)';

    // Angled corner clip
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h - 16);
    ctx.lineTo(w - 16, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = isSuccess ? '#00FF66' : (isHovered ? '#FFFFFF' : color);
    ctx.lineWidth = isHovered ? 3.5 : 2;
    ctx.stroke();

    // Corner yellow hazard tabs
    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(0, 0, 14, 4);
    ctx.fillRect(0, 0, 4, 14);
    ctx.fillRect(w - 14, h - 4, 14, 4);
    ctx.fillRect(w - 4, h - 14, 4, 14);

    // Left Icon Box
    ctx.fillStyle = isHovered ? color : 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(20, 24, 60, 88);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 24, 60, 88);

    ctx.fillStyle = isHovered ? '#070a10' : color;
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 50, 68);

    // Text content
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Title
    ctx.fillStyle = isSuccess ? '#00FF66' : (isHovered ? '#FFFFFF' : '#EAF2FF');
    ctx.font = 'bold 24px monospace';
    ctx.fillText(isSuccess ? '[✓ COPIED TO CLIPBOARD]' : title, 98, 58);

    // Subtitle
    ctx.fillStyle = isSuccess ? '#00FF66' : (isHovered ? color : 'rgba(0, 240, 255, 0.7)');
    ctx.font = 'bold 18px monospace';
    ctx.fillText(isSuccess ? 'felixbariq@gmail.com' : subtitle, 98, 92);

    // Right Arrow badge
    ctx.fillStyle = isHovered ? color : 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(icon === '◄' ? '◄' : '↗', w - 24, 76);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Generates interactive project repository terminal canvas for workstation ultrawide monitor
   */
  static renderProjectMonitorCanvas(canvas, projects, currentIndex, hoveredAction = null) {
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');
    const project = projects[currentIndex] || projects[0];

    // Background & carbon grid
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, w, h);

    // Subtle matrix scanlines
    ctx.fillStyle = 'rgba(0, 240, 255, 0.025)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Top Header bar
    ctx.fillStyle = '#0b111e';
    ctx.fillRect(0, 0, w, 32);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(w, 32);
    ctx.stroke();

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ NETRUNNER OS v4.81 // ARASAKA ARCHIVE EXPLORER // WATSON SUBNET [SECURE]', 24, 21);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00FF66';
    ctx.fillText(`SYSTEM DAEMON: ACTIVE ● [0${currentIndex + 1} / 0${projects.length}]`, w - 24, 21);

    // 4 Project Selector Tabs
    const tabY = 40;
    const tabH = 38;
    const tabW = 290;
    const tabGap = 16;
    const tabStartX = 24;

    projects.forEach((p, idx) => {
      const tx = tabStartX + idx * (tabW + tabGap);
      const isActive = idx === currentIndex;
      const isHovered = hoveredAction === `tab_${idx}`;

      // Tab Background
      if (isActive) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.10)';
      } else {
        ctx.fillStyle = 'rgba(12, 18, 30, 0.85)';
      }
      ctx.fillRect(tx, tabY, tabW, tabH);

      // Tab Border
      ctx.strokeStyle = isActive ? (p.color || '#00F0FF') : (isHovered ? '#FFFFFF' : 'rgba(0, 240, 255, 0.35)');
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.strokeRect(tx, tabY, tabW, tabH);

      if (isActive) {
        ctx.fillStyle = p.color || '#00F0FF';
        ctx.fillRect(tx, tabY, 6, tabH);
        ctx.fillRect(tx, tabY + tabH - 3, tabW, 3);
      }

      ctx.fillStyle = isActive ? '#FFFFFF' : (isHovered ? '#00F0FF' : 'rgba(230, 242, 255, 0.65)');
      ctx.font = isActive ? 'bold 15px monospace' : '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.tabTitle || `0${idx + 1} // ${p.title.substring(0, 14)}`, tx + tabW / 2, tabY + 24);
    });

    // Main Left Section: Project details
    const leftX = 28;

    // Category & Year Tagline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`// ${project.category.toUpperCase()} — YEAR: ${project.year}`, leftX, 115);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(project.title, leftX, 160);

    // Color indicator under-title line
    ctx.fillStyle = project.color || '#00F0FF';
    ctx.fillRect(leftX, 172, 160, 3);

    // Description text (word-wrapped)
    ctx.fillStyle = 'rgba(220, 235, 255, 0.88)';
    ctx.font = '17px monospace';
    const words = project.description.split(' ');
    let line = '';
    let lineY = 205;
    const maxLineWidth = 720;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line, leftX, lineY);
        line = words[n] + ' ';
        lineY += 26;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, leftX, lineY);

    // Tags list
    const tagY = 295;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('CORE STACK:', leftX, tagY + 16);

    let tagX = leftX + 115;
    if (project.tags && project.tags.length > 0) {
      project.tags.forEach(tag => {
        const tw = ctx.measureText(tag).width + 20;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(tagX, tagY, tw, 26);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tagX, tagY, tw, 26);

        ctx.fillStyle = '#EAF4FF';
        ctx.fillText(tag, tagX + 10, tagY + 18);
        tagX += tw + 10;
      });
    }

    // Telemetry metric cards
    const mY = 345;
    const mCardW = 230;
    const metricsData = [
      { label: 'LATENCY', val: project.metrics?.latency || '1.4ms', color: '#00FF66' },
      { label: 'NODES', val: project.metrics?.nodes || '1,024 Active', color: '#00F0FF' },
      { label: 'STATUS', val: project.status || 'DEPLOYED // PROD', color: '#FCEE09' }
    ];

    metricsData.forEach((m, i) => {
      const mx = leftX + i * (mCardW + 14);
      ctx.fillStyle = 'rgba(10, 16, 28, 0.9)';
      ctx.fillRect(mx, mY, mCardW, 58);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx, mY, mCardW, 58);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px monospace';
      ctx.fillText(m.label, mx + 14, mY + 22);

      ctx.fillStyle = m.color;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(m.val, mx + 14, mY + 46);
    });

    // Right Section: Holographic Radar Wireframe Box
    const rx = 780;
    const ry = 98;
    const rw = 470;
    const rh = 232;

    ctx.fillStyle = 'rgba(8, 12, 22, 0.95)';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = project.color || '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx, ry, rw, rh);

    // Corner hazard trims
    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(rx, ry, 12, 3);
    ctx.fillRect(rx, ry, 3, 12);
    ctx.fillRect(rx + rw - 12, ry, 12, 3);
    ctx.fillRect(rx + rw - 3, ry, 3, 12);
    ctx.fillRect(rx, ry + rh - 3, 12, 3);
    ctx.fillRect(rx, ry + rh - 12, 3, 12);
    ctx.fillRect(rx + rw - 12, ry + rh - 3, 12, 3);
    ctx.fillRect(rx + rw - 3, ry + rh - 12, 3, 12);

    // Grid in radar box
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let gx = rx + 30; gx < rx + rw; gx += 30) {
      ctx.beginPath();
      ctx.moveTo(gx, ry);
      ctx.lineTo(gx, ry + rh);
      ctx.stroke();
    }
    for (let gy = ry + 25; gy < ry + rh; gy += 25) {
      ctx.beginPath();
      ctx.moveTo(rx, gy);
      ctx.lineTo(rx + rw, gy);
      ctx.stroke();
    }

    // Radar circle & crosshair
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;
    ctx.strokeStyle = project.color || '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy);
    ctx.lineTo(cx + 75, cy);
    ctx.moveTo(cx, cy - 75);
    ctx.lineTo(cx, cy + 75);
    ctx.stroke();

    // Wireframe Box header & footer labels
    ctx.fillStyle = project.color || '#00F0FF';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ID: ${project.id.toUpperCase()}`, rx + 14, ry + 22);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00FF66';
    ctx.fillText('ICE INTEGRITY: 100%', rx + rw - 14, ry + 22);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(project.tagline || 'SYSTEM DATA SHARD ARCHIVE', cx, ry + rh - 16);

    // Right Nav Controls: PREV / NEXT buttons
    const btnY = 345;
    const btnH = 58;

    // PREV Button
    const prevW = 145;
    const prevX = rx;
    const isPrevHovered = hoveredAction === 'prev';
    ctx.fillStyle = isPrevHovered ? 'rgba(0, 240, 255, 0.35)' : 'rgba(12, 18, 30, 0.9)';
    ctx.fillRect(prevX, btnY, prevW, btnH);
    ctx.strokeStyle = isPrevHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isPrevHovered ? 2.5 : 1.5;
    ctx.strokeRect(prevX, btnY, prevW, btnH);

    ctx.fillStyle = isPrevHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('◄ PREV', prevX + prevW / 2, btnY + 36);

    // Index Badge
    const idxW = 150;
    const idxX = prevX + prevW + 15;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.8)';
    ctx.fillRect(idxX, btnY, idxW, btnH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(idxX, btnY, idxW, btnH);

    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`PROJECT ${currentIndex + 1} / ${projects.length}`, idxX + idxW / 2, btnY + 36);

    // NEXT Button
    const nextW = 145;
    const nextX = idxX + idxW + 15;
    const isNextHovered = hoveredAction === 'next';
    ctx.fillStyle = isNextHovered ? 'rgba(0, 240, 255, 0.35)' : 'rgba(12, 18, 30, 0.9)';
    ctx.fillRect(nextX, btnY, nextW, btnH);
    ctx.strokeStyle = isNextHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isNextHovered ? 2.5 : 1.5;
    ctx.strokeRect(nextX, btnY, nextW, btnH);

    ctx.fillStyle = isNextHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('NEXT ►', nextX + nextW / 2, btnY + 36);

    // Bottom Action Bar: GITHUB REPO & LIVE PREVIEW buttons
    const actY = 432;
    const actH = 56;

    // Button 1: GITHUB REPO
    const repoW = 410;
    const repoX = leftX;
    const isRepoHovered = hoveredAction === 'repo';
    ctx.fillStyle = isRepoHovered ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(repoX, actY, repoW, actH);
    ctx.strokeStyle = isRepoHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isRepoHovered ? 2.5 : 1.5;
    ctx.strokeRect(repoX, actY, repoW, actH);

    ctx.fillStyle = isRepoHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('◈ OPEN GITHUB REPOSITORY ↗', repoX + 24, actY + 35);

    // Button 2: LIVE PREVIEW / DEMO
    const liveW = 340;
    const liveX = repoX + repoW + 16;
    const isLiveHovered = hoveredAction === 'live';
    ctx.fillStyle = isLiveHovered ? 'rgba(252, 238, 9, 0.4)' : 'rgba(252, 238, 9, 0.15)';
    ctx.fillRect(liveX, actY, liveW, actH);
    ctx.strokeStyle = isLiveHovered ? '#FFFFFF' : '#FCEE09';
    ctx.lineWidth = isLiveHovered ? 2.5 : 1.5;
    ctx.strokeRect(liveX, actY, liveW, actH);

    ctx.fillStyle = isLiveHovered ? '#FFFFFF' : '#FCEE09';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('⚡ RUN LIVE DEMO ↗', liveX + 24, actY + 35);

    // Instructions on the right
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '13px monospace';
    ctx.fillText('[ CLICK TABS / BUTTONS // USE ◄ / ► KEYS ]', w - 28, actY + 35);
  }

  /**
   * Translates UV (0 to 1) coordinates from Raycaster hit on monitor plane
   * into specific clickable button action
   */
  static getProjectActionAtUV(u, v) {
    const x = u * 1280;
    const y = (1 - v) * 512;

    // 1. Top tabs
    if (y >= 40 && y <= 78) {
      if (x >= 24 && x <= 314) return { action: 'tab', index: 0 };
      if (x >= 330 && x <= 620) return { action: 'tab', index: 1 };
      if (x >= 636 && x <= 926) return { action: 'tab', index: 2 };
      if (x >= 942 && x <= 1232) return { action: 'tab', index: 3 };
    }
    // 2. Nav buttons (PREV / NEXT)
    if (y >= 345 && y <= 405) {
      if (x >= 780 && x <= 925) return { action: 'prev' };
      if (x >= 1105 && x <= 1250) return { action: 'next' };
    }
    // 3. Action bar buttons (REPO / LIVE)
    if (y >= 430 && y <= 490) {
      if (x >= 28 && x <= 440) return { action: 'repo' };
      if (x >= 454 && x <= 800) return { action: 'live' };
    }
    return null;
  }
}


