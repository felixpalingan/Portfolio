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
}

