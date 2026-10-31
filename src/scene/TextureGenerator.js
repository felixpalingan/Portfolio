import * as THREE from 'three';

/**
 * Procedural Texture Generator for Cyberpunk Apartment
 * Optimized for rapid generation and high performance.
 */
export class TextureGenerator {
  static projectImgCache = new Map();

  /**
   * Preload all critical image assets (screenshots, icons, avatar)
   * Resolves when all assets are loaded into cache
   */
  static preloadAllAssets(onProgress = null) {
    const urls = [
      '/default.jpg',
      '/felix_avatar.jpg',
      '/ironpixels_icon.png',
      '/ironpixels_preview.png',
      '/oit_logo.png',
      '/oit_preview.png',
      '/preview.png'
    ];

    let loaded = 0;
    const total = urls.length;

    const promises = urls.map(url => {
      return new Promise(resolve => {
        if (TextureGenerator.projectImgCache.has(url)) {
          const cached = TextureGenerator.projectImgCache.get(url);
          if (cached && cached.complete && cached.naturalWidth > 0) {
            loaded++;
            if (onProgress) onProgress(loaded / total, url);
            resolve(cached);
            return;
          }
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          TextureGenerator.projectImgCache.set(url, img);
          loaded++;
          if (onProgress) onProgress(loaded / total, url);
          resolve(img);
        };
        img.onerror = () => {
          console.warn(`[TextureGenerator] Preload notice for ${url}`);
          loaded++;
          if (onProgress) onProgress(loaded / total, url);
          resolve(null);
        };
        img.src = url;
      });
    });

    return Promise.all(promises);
  }

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
   * Renders the avatar photo full-bleed across the entire mirror with Cyberpunk HUD overlays.
   */
  static createSmartMirrorTexture() {
    const w = 1024;
    const h = 1280;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);

    function renderBase(img = null) {
      // 1. Base dark background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // 2. Full-bleed Avatar Photo if available
      if (img && img.complete && img.naturalWidth > 0) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = w / h; // 1024 / 1280 = 0.8
        let sW, sH, sX, sY;
        if (imgRatio > canvasRatio) {
          sH = img.naturalHeight;
          sW = sH * canvasRatio;
          sX = (img.naturalWidth - sW) / 2;
          sY = 0;
        } else {
          sW = img.naturalWidth;
          sH = sW / canvasRatio;
          sX = 0;
          sY = (img.naturalHeight - sH) / 2;
        }
        ctx.drawImage(img, sX, sY, sW, sH, 0, 0, w, h);

        // Cyberpunk tint overlay across photo
        ctx.fillStyle = 'rgba(6, 12, 24, 0.22)';
        ctx.fillRect(0, 0, w, h);
      } else {
        // Scanning grid placeholder if image is loading
        ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
        for (let x = 0; x < w; x += 32) {
          ctx.fillRect(x, 0, 1, h);
        }
        for (let y = 0; y < h; y += 32) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      // 3. Cyberpunk Cinematic Lighting & Vignette Gradients
      // Top Header Gradient (darkens top area for sharp HUD text)
      const topGrad = ctx.createLinearGradient(0, 0, 0, 260);
      topGrad.addColorStop(0, 'rgba(6, 10, 18, 0.92)');
      topGrad.addColorStop(0.5, 'rgba(6, 10, 18, 0.60)');
      topGrad.addColorStop(1, 'rgba(6, 10, 18, 0.05)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, 260);

      // Bottom Overlay Gradient (soft gentle vignette at the very bottom where transparent buttons hover)
      const bottomGrad = ctx.createLinearGradient(0, 880, 0, h);
      bottomGrad.addColorStop(0, 'rgba(6, 10, 18, 0.00)');
      bottomGrad.addColorStop(0.40, 'rgba(6, 10, 18, 0.35)');
      bottomGrad.addColorStop(1, 'rgba(6, 10, 18, 0.75)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 880, w, h - 880);

      // Subtle holographic scanlines
      ctx.fillStyle = 'rgba(0, 240, 255, 0.035)';
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 2);
      }

      // Outer HUD frame with cyber brackets
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, w - 48, h - 48);

      // Corner brackets
      ctx.fillStyle = '#FCEE09';
      ctx.fillRect(16, 16, 36, 6);
      ctx.fillRect(16, 16, 6, 36);
      ctx.fillRect(w - 52, 16, 36, 6);
      ctx.fillRect(w - 22, 16, 6, 36);
      ctx.fillRect(16, h - 22, 36, 6);
      ctx.fillRect(16, h - 52, 6, 36);
      ctx.fillRect(w - 52, h - 22, 36, 6);
      ctx.fillRect(w - 22, h - 52, 6, 36);

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
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, 145);
      ctx.lineTo(w - 56, 145);
      ctx.stroke();
    }

    renderBase();

    let cachedAvatar = TextureGenerator.projectImgCache.get('/default.jpg') || TextureGenerator.projectImgCache.get('/felix_avatar.jpg');
    if (cachedAvatar && cachedAvatar.complete && cachedAvatar.naturalWidth > 0) {
      renderBase(cachedAvatar);
      texture.needsUpdate = true;
    } else {
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        TextureGenerator.projectImgCache.set('/default.jpg', avatarImg);
        renderBase(avatarImg);
        texture.needsUpdate = true;
      };
      avatarImg.src = '/default.jpg';
    }

    return texture;
  }

  /**
   * Generates high-res Cyberpunk 3D button canvas textures (normal, hover, success)
   * Styled as translucent holographic glass floating on top of the mirror photo.
   */
  static createMirrorButtonTexture(config) {
    const { icon, title, subtitle, color = '#00F0FF', isHovered = false, isSuccess = false } = config;
    const w = 512;
    const h = 136;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Translucent cybernetic glass background (transparent so photo shows through!)
    ctx.fillStyle = isSuccess 
      ? 'rgba(0, 255, 102, 0.45)' 
      : (isHovered ? 'rgba(0, 240, 255, 0.35)' : 'rgba(6, 14, 28, 0.45)');

    // Angled corner clip (Cyberpunk 2077 HUD style)
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h - 16);
    ctx.lineTo(w - 16, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();

    // Subtle inner glass highlight gradient
    const innerGrad = ctx.createLinearGradient(0, 0, 0, h);
    innerGrad.addColorStop(0, isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 240, 255, 0.12)');
    innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    ctx.fillStyle = innerGrad;
    ctx.fill();

    // Glowing cyber border
    ctx.strokeStyle = isSuccess ? '#00FF66' : (isHovered ? '#FFFFFF' : 'rgba(0, 240, 255, 0.85)');
    ctx.lineWidth = isHovered ? 3.5 : 2;
    ctx.stroke();

    // Corner yellow hazard tabs
    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(0, 0, 14, 4);
    ctx.fillRect(0, 0, 4, 14);
    ctx.fillRect(w - 14, h - 4, 14, 4);
    ctx.fillRect(w - 4, h - 14, 4, 14);

    // Left Icon Box (frosted translucent glass)
    ctx.fillStyle = isHovered ? color : 'rgba(0, 240, 255, 0.18)';
    ctx.fillRect(20, 24, 60, 88);
    ctx.strokeStyle = isSuccess ? '#00FF66' : color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 24, 60, 88);

    ctx.fillStyle = isHovered ? '#070a10' : (isSuccess ? '#00FF66' : color);
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 50, 68);

    // Text content
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Title with high-contrast text shadow for maximum legibility over background photo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = isSuccess ? '#00FF66' : (isHovered ? '#FFFFFF' : '#EAF2FF');
    ctx.font = 'bold 24px monospace';
    ctx.fillText(isSuccess ? '[✓ COPIED TO CLIPBOARD]' : title, 98, 58);

    // Subtitle
    ctx.fillStyle = isSuccess ? '#00FF66' : (isHovered ? color : 'rgba(0, 240, 255, 0.95)');
    ctx.font = 'bold 18px monospace';
    ctx.fillText(isSuccess ? 'felixbariq@gmail.com' : subtitle, 98, 92);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Right Arrow badge
    ctx.fillStyle = isHovered ? color : 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(icon === '◄' ? '◄' : '↗', w - 24, 76);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Card layout geometry helper for Left Monitor
   */
  static getLeftMonitorCardGeometry(total = 2) {
    const cardStartX = 20;
    const cardGap = total <= 2 ? 22 : 14;
    const cardH = total <= 2 ? 180 : 130;
    const startY = total <= 2 ? 66 : 56;
    return { cardStartX, cardGap, cardH, startY };
  }

  /**
   * LEFT MONITOR (Directory Shards): Displays selectable project list cards
   * Canvas: 720 x 540
   */
  static renderProjectLeftMonitorCanvas(canvas, projects, currentIndex, hoveredIndex = null) {
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');
    const total = projects.length;
    const { cardStartX, cardGap, cardH, startY } = TextureGenerator.getLeftMonitorCardGeometry(total);

    // Background & carbon grid
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, w, h);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 240, 255, 0.025)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Header bar
    ctx.fillStyle = '#0b111e';
    ctx.fillRect(0, 0, w, 44);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 44);
    ctx.lineTo(w, 44);
    ctx.stroke();

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ REPO ARCHIVE // SHARD SELECTOR', 20, 28);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('[CLICK TO MOUNT]', w - 20, 28);

    const cardW = w - 40; // 680px

    projects.forEach((p, idx) => {
      const cy = startY + idx * (cardH + cardGap);
      const isActive = idx === currentIndex;
      const isHovered = hoveredIndex === idx;

      // Card Background
      if (isActive) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.10)';
      } else {
        ctx.fillStyle = 'rgba(11, 16, 26, 0.88)';
      }
      ctx.fillRect(cardStartX, cy, cardW, cardH);

      // Card Border
      ctx.strokeStyle = isActive ? (p.color || '#00F0FF') : (isHovered ? '#FFFFFF' : 'rgba(0, 240, 255, 0.28)');
      ctx.lineWidth = isActive ? 2.5 : (isHovered ? 2 : 1);
      ctx.strokeRect(cardStartX, cy, cardW, cardH);

      // Left Accent Strip
      if (isActive) {
        ctx.fillStyle = p.color || '#00F0FF';
        ctx.fillRect(cardStartX, cy, 8, cardH);
      } else if (isHovered) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(cardStartX, cy, 4, cardH);
      }

      // Shard Index Badge
      ctx.fillStyle = isActive ? (p.color || '#00F0FF') : 'rgba(0, 240, 255, 0.6)';
      ctx.font = cardH >= 150 ? 'bold 18px monospace' : 'bold 15px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`[SHARD 0${idx + 1}]`, cardStartX + 20, cy + (cardH >= 150 ? 32 : 26));

      // Title
      ctx.fillStyle = isActive ? '#FFFFFF' : (isHovered ? '#00F0FF' : 'rgba(230, 242, 255, 0.9)');
      ctx.font = cardH >= 150 ? 'bold 26px monospace' : 'bold 22px monospace';
      ctx.fillText(p.title, cardStartX + 20, cy + (cardH >= 150 ? 68 : 54));

      // Category & Year
      ctx.fillStyle = isActive ? '#FCEE09' : 'rgba(255, 255, 255, 0.65)';
      ctx.font = cardH >= 150 ? 'bold 15px monospace' : 'bold 13px monospace';
      ctx.fillText(`// ${p.category} [${p.year}]`, cardStartX + 20, cy + (cardH >= 150 ? 98 : 78));

      // Tagline or Tags summary
      if (cardH >= 150 && p.tagline) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '13px monospace';
        ctx.fillText(`◈ ${p.tagline}`, cardStartX + 20, cy + 128);

        // Tech badges line
        if (p.tags && p.tags.length > 0) {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
          ctx.font = '12px monospace';
          ctx.fillText(`LOADOUT: ${p.tags.slice(0, 4).join(' • ')}`, cardStartX + 20, cy + 154);
        }
      } else if (p.tags && p.tags.length > 0) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.70)';
        ctx.font = '12px monospace';
        ctx.fillText(`LOADOUT: ${p.tags.slice(0, 3).join(' • ')}`, cardStartX + 20, cy + 104);
      }

      // Status Pill on Right of Card
      ctx.textAlign = 'right';
      if (isActive) {
        ctx.fillStyle = '#00FF66';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('● MOUNTED ACTIVE', cardStartX + cardW - 24, cy + (cardH >= 150 ? 40 : 32));
        ctx.fillStyle = 'rgba(0, 255, 102, 0.55)';
        ctx.font = cardH >= 150 ? '14px monospace' : '11px monospace';
        ctx.fillText('DISPLAYING ON CENTER SCREEN', cardStartX + cardW - 24, cy + (cardH >= 150 ? 68 : 52));
      } else {
        ctx.fillStyle = isHovered ? '#00F0FF' : 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('▷ SELECT SHARD', cardStartX + cardW - 24, cy + (cardH >= 150 ? 55 : 42));
      }

      // Project icon thumbnail in card if available
      if (p.image) {
        const thumbBoxSize = cardH >= 150 ? 72 : 52;
        const thumbBoxX = cardStartX + cardW - (cardH >= 150 ? 100 : 76);
        const thumbBoxY = cy + (cardH >= 150 ? 85 : 66);

        ctx.fillStyle = 'rgba(8, 14, 26, 0.9)';
        ctx.fillRect(thumbBoxX, thumbBoxY, thumbBoxSize, thumbBoxSize);
        ctx.strokeStyle = isActive ? (p.color || '#00F0FF') : 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(thumbBoxX, thumbBoxY, thumbBoxSize, thumbBoxSize);

        let img = TextureGenerator.projectImgCache.get(p.image);
        if (!img) {
          img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            TextureGenerator.projectImgCache.set(p.image, img);
            if (canvas._ownerTexture) canvas._ownerTexture.needsUpdate = true;
          };
          img.src = p.image;
          TextureGenerator.projectImgCache.set(p.image, img);
        } else if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, thumbBoxX + 4, thumbBoxY + 4, thumbBoxSize - 8, thumbBoxSize - 8);
        }
      }
    });

    // Bottom Status Bar
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`WATSON NEURAL ARCHIVE // ${total} ACTIVE SHARDS DETECTED // 100% HEALTH`, w / 2, h - 14);
  }

  static getLeftMonitorActionAtUV(u, v, totalProjects = 2) {
    const y = (1 - v) * 540;
    const { cardH, cardGap, startY } = TextureGenerator.getLeftMonitorCardGeometry(totalProjects);

    for (let i = 0; i < totalProjects; i++) {
      const cy = startY + i * (cardH + cardGap);
      if (y >= cy && y <= cy + cardH) {
        return { action: 'select', index: i };
      }
    }
    return null;
  }

  /**
   * CENTER MONITOR (Main Dossier): Displays large, crystal-clear project details & links
   * Canvas: 1024 x 576 (16:9)
   */
  static renderProjectCenterMonitorCanvas(canvas, project, currentIndex, total, hoveredAction = null) {
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');

    // Background & carbon grid
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, w, h);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 240, 255, 0.025)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Top Header Bar
    ctx.fillStyle = '#0b111e';
    ctx.fillRect(0, 0, w, 40);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(w, 40);
    ctx.stroke();

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ NETRUNNER OS // PROJECT DOSSIER // [0${currentIndex + 1} / 0${total}]`, 24, 26);

    ctx.fillStyle = '#00FF66';
    ctx.textAlign = 'right';
    ctx.fillText(`● STATUS: ${project.status || 'PRODUCTION READY'}`, w - 24, 26);

    // Main Left Section: Project details
    const leftX = 36;

    // Project Logo Box on Top Right of Dossier
    const logoSize = 130;
    const logoX = w - logoSize - 36;
    const logoY = 56;

    ctx.fillStyle = 'rgba(10, 16, 28, 0.95)';
    ctx.fillRect(logoX, logoY, logoSize, logoSize);
    ctx.strokeStyle = project.color || '#00F0FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(logoX, logoY, logoSize, logoSize);

    // Reticle corner accents
    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(logoX, logoY, 12, 2.5);
    ctx.fillRect(logoX, logoY, 2.5, 12);
    ctx.fillRect(logoX + logoSize - 12, logoY, 12, 2.5);
    ctx.fillRect(logoX + logoSize - 2.5, logoY, 2.5, 12);
    ctx.fillRect(logoX, logoY + logoSize - 2.5, 12, 2.5);
    ctx.fillRect(logoX, logoY + logoSize - 12, 2.5, 12);
    ctx.fillRect(logoX + logoSize - 12, logoY + logoSize - 2.5, 12, 2.5);
    ctx.fillRect(logoX + logoSize - 2.5, logoY + logoSize - 12, 2.5, 12);

    if (project.image) {
      let img = TextureGenerator.projectImgCache.get(project.image);
      if (!img) {
        img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          TextureGenerator.projectImgCache.set(project.image, img);
          if (canvas._ownerTexture) canvas._ownerTexture.needsUpdate = true;
          if (canvas._redrawCallback) canvas._redrawCallback();
        };
        img.src = project.image;
        TextureGenerator.projectImgCache.set(project.image, img);
      }
      
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, logoX + 8, logoY + 8, logoSize - 16, logoSize - 16);
      } else {
        // High-tech logo loading indicator
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.fillRect(logoX + 8, logoY + 8, logoSize - 16, logoSize - 16);
        ctx.fillStyle = project.color || '#00F0FF';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LOADING', logoX + logoSize / 2, logoY + logoSize / 2 - 4);
        ctx.fillText('SHARD...', logoX + logoSize / 2, logoY + logoSize / 2 + 14);
      }
    }

    // Category & Year Tagline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`// CATEGORY: ${project.category.toUpperCase()} — RELEASE: ${project.year}`, leftX, 85);

    // Title (Huge & Legible)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(project.title, leftX, 138);

    // Color indicator under-title line
    ctx.fillStyle = project.color || '#00F0FF';
    ctx.fillRect(leftX, 154, 220, 4);

    // Description text (bold 21px high-contrast white with 30px line height)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 21px monospace';
    const words = project.description.split(' ');
    let line = '';
    let lineY = 196;
    const maxLineWidth = logoX - leftX - 24; // avoid overlapping logo box

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line, leftX, lineY);
        line = words[n] + ' ';
        lineY += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, leftX, lineY);

    // Core Tech Stack Badges
    const tagY = lineY + 34;
    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('CORE LOADOUT:', leftX, tagY + 18);

    let tagX = leftX + 140;
    if (project.tags && project.tags.length > 0) {
      project.tags.forEach(tag => {
        ctx.font = 'bold 16px monospace';
        const tw = ctx.measureText(tag).width + 24;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.14)';
        ctx.fillRect(tagX, tagY, tw, 30);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tagX, tagY, tw, 30);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(tag, tagX + 12, tagY + 21);
        tagX += tw + 12;
      });
    }

    // Telemetry metric cards (Flagship Feature Highlights)
    const mY = tagY + 52;
    const mCardW = 300;
    const metricsData = Array.isArray(project.metrics) ? project.metrics : [
      { label: 'LATENCY', val: project.metrics?.latency || '1.2ms', color: '#00FF66' },
      { label: 'NODES', val: project.metrics?.nodes || '1,024 Active', color: '#00F0FF' },
      { label: 'CLEARANCE', val: project.metrics?.security || 'ICE-Bypass Clean', color: '#FCEE09' }
    ];

    metricsData.forEach((m, i) => {
      const mx = leftX + i * (mCardW + 24);
      ctx.fillStyle = 'rgba(10, 16, 28, 0.9)';
      ctx.fillRect(mx, mY, mCardW, 64);
      ctx.strokeStyle = m.color ? `${m.color}66` : 'rgba(255, 255, 255, 0.20)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx, mY, mCardW, 64);

      // Micro accent strip on left of card
      ctx.fillStyle = m.color || '#00F0FF';
      ctx.fillRect(mx, mY, 3.5, 64);

      ctx.fillStyle = m.color || '#00F0FF';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`◈ ${m.label}`, mx + 14, mY + 24);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(m.val, mx + 14, mY + 49);
    });

    // Action Buttons Pinned at Bottom of Center Monitor Canvas (h = 576)
    const actY = 490;
    const actH = 66;

    // Button 1: OPEN GITHUB REPOSITORY
    const repoW = 460;
    const repoX = leftX;
    const isRepoHovered = hoveredAction === 'repo';
    ctx.fillStyle = isRepoHovered ? 'rgba(0, 240, 255, 0.50)' : 'rgba(0, 240, 255, 0.20)';
    ctx.fillRect(repoX, actY, repoW, actH);
    ctx.strokeStyle = isRepoHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isRepoHovered ? 3 : 2;
    ctx.strokeRect(repoX, actY, repoW, actH);

    ctx.fillStyle = isRepoHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('◈ OPEN GITHUB REPOSITORY ↗', repoX + repoW / 2, actY + 41);

    // Button 2: LIVE DEMO
    const liveW = 460;
    const liveX = repoX + repoW + 24;
    const isLiveHovered = hoveredAction === 'live';
    ctx.fillStyle = isLiveHovered ? 'rgba(252, 238, 9, 0.50)' : 'rgba(252, 238, 9, 0.20)';
    ctx.fillRect(liveX, actY, liveW, actH);
    ctx.strokeStyle = isLiveHovered ? '#FFFFFF' : '#FCEE09';
    ctx.lineWidth = isLiveHovered ? 3 : 2;
    ctx.strokeRect(liveX, actY, liveW, actH);

    ctx.fillStyle = isLiveHovered ? '#FFFFFF' : '#FCEE09';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('⚡ RUN LIVE DEMO ↗', liveX + liveW / 2, actY + 41);
  }

  static getCenterMonitorActionAtUV(u, v) {
    const x = u * 1024;
    const y = (1 - v) * 576;

    // Generous, foolproof hit detection covering entire bottom action area (y >= 440 to 576)
    if (y >= 440 && y <= 576) {
      if (x >= 20 && x <= 508) return { action: 'repo' };
      if (x > 508 && x <= 1004) return { action: 'live' };
    }
    return null;
  }

  /**
   * RIGHT MONITOR (Telemetry & Nav Deck): Radar wireframe, live waveforms, next/prev controls
   * Canvas: 720 x 540
   */
  static renderProjectRightMonitorCanvas(canvas, project, currentIndex, total, hoveredAction = null) {
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');

    // Background & carbon grid
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, w, h);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 240, 255, 0.025)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Header bar
    ctx.fillStyle = '#0b111e';
    ctx.fillRect(0, 0, w, 44);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 44);
    ctx.lineTo(w, 44);
    ctx.stroke();

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ TELEMETRY // NAV DECK', 20, 28);

    ctx.fillStyle = '#00FF66';
    ctx.font = '13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('SERVER: NOMINAL ●', w - 20, 28);

    // Live Production UI Snapshot Feed Box (672 x 250)
    const rx = 24;
    const ry = 58;
    const rw = w - 48; // 672px
    const rh = 250;

    ctx.fillStyle = 'rgba(8, 14, 24, 0.95)';
    ctx.fillRect(rx, ry, rw, rh);

    let hasDrawnPreview = false;
    const previewSrc = project.preview || project.image;
    if (previewSrc) {
      let previewImg = TextureGenerator.projectImgCache.get(previewSrc);
      if (!previewImg) {
        previewImg = new Image();
        previewImg.crossOrigin = 'anonymous';
        previewImg.onload = () => {
          TextureGenerator.projectImgCache.set(previewSrc, previewImg);
          if (canvas._ownerTexture) canvas._ownerTexture.needsUpdate = true;
          if (canvas._redrawCallback) canvas._redrawCallback();
        };
        previewImg.src = previewSrc;
        TextureGenerator.projectImgCache.set(previewSrc, previewImg);
      } else if (previewImg.complete && previewImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();

        // Draw image cover to fill the 16:9 feed box seamlessly
        const imgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
        const boxRatio = rw / rh;
        let sW, sH, sX, sY;
        if (imgRatio > boxRatio) {
          sH = previewImg.naturalHeight;
          sW = sH * boxRatio;
          sX = (previewImg.naturalWidth - sW) / 2;
          sY = 0;
        } else {
          sW = previewImg.naturalWidth;
          sH = sW / boxRatio;
          sX = 0;
          sY = (previewImg.naturalHeight - sH) / 2;
        }
        ctx.drawImage(previewImg, sX, sY, sW, sH, rx, ry, rw, rh);

        // Subtle gradient vignette & scanline effect
        const grad = ctx.createLinearGradient(rx, ry, rx, ry + rh);
        grad.addColorStop(0, 'rgba(6, 9, 18, 0.45)');
        grad.addColorStop(0.5, 'rgba(6, 9, 18, 0.10)');
        grad.addColorStop(1, 'rgba(6, 9, 18, 0.70)');
        ctx.fillStyle = grad;
        ctx.fillRect(rx, ry, rw, rh);

        ctx.restore();
        hasDrawnPreview = true;
      }
    }

    if (!hasDrawnPreview) {
      // Animated High-Tech Cyberpunk Loading & Buffering State
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let gx = rx + 36; gx < rx + rw; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx, ry);
        ctx.lineTo(gx, ry + rh);
        ctx.stroke();
      }
      for (let gy = ry + 30; gy < ry + rh; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(rx, gy);
        ctx.lineTo(rx + rw, gy);
        ctx.stroke();
      }

      const cx = rx + rw / 2;
      const cy = ry + rh / 2;

      // Scanning sweep line
      const now = performance.now() * 0.002;
      const scanY = ry + (Math.sin(now) * 0.5 + 0.5) * (rh - 24) + 12;
      const scanGrad = ctx.createLinearGradient(rx, scanY - 14, rx, scanY + 14);
      scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.45)');
      scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(rx, scanY - 14, rw, 28);

      // Rotating cyber crosshairs & rings
      ctx.save();
      ctx.translate(cx, cy - 14);
      ctx.rotate(now * 1.2);
      ctx.strokeStyle = project.color || '#00F0FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(-32, -32, 64, 64);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy - 14);
      ctx.rotate(-now * 2);
      ctx.strokeStyle = '#FCEE09';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 46, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();

      // Loading HUD text & pulse
      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ DOWNLOADING HIGH-RES SHARD FEED...', cx, cy + 54);

      ctx.fillStyle = '#00FF66';
      ctx.font = 'bold 13px monospace';
      const dots = '.'.repeat(Math.floor((now * 4) % 4) + 1);
      ctx.fillText(`BUFFERING // ${project.title} // DECRYPTING ICE STREAM ${dots}`, cx, cy + 78);
    }

    // Border & hazard accents
    ctx.strokeStyle = project.color || '#00F0FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, ry, rw, rh);

    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(rx, ry, 14, 3);
    ctx.fillRect(rx, ry, 3, 14);
    ctx.fillRect(rx + rw - 14, ry, 14, 3);
    ctx.fillRect(rx + rw - 3, ry, 3, 14);
    ctx.fillRect(rx, ry + rh - 3, 14, 3);
    ctx.fillRect(rx, ry + rh - 14, 3, 14);
    ctx.fillRect(rx + rw - 14, ry + rh - 3, 14, 3);
    ctx.fillRect(rx + rw - 3, ry + rh - 14, 3, 14);

    // Overlay HUD Top Status Bar
    ctx.fillStyle = 'rgba(11, 17, 30, 0.88)';
    ctx.fillRect(rx, ry, rw, 32);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx, ry + 32);
    ctx.lineTo(rx + rw, ry + 32);
    ctx.stroke();

    ctx.fillStyle = project.color || '#00F0FF';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`● LIVE UI SNAPSHOT // ${project.title}`, rx + 14, ry + 22);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00FF66';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('DEPLOYMENT: ONLINE', rx + rw - 14, ry + 22);

    // Overlay HUD Bottom Status Bar
    ctx.fillStyle = 'rgba(11, 17, 30, 0.88)';
    ctx.fillRect(rx, ry + rh - 32, rw, 32);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(rx, ry + rh - 32);
    ctx.lineTo(rx + rw, ry + rh - 32);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(project.tagline || 'SYSTEM DATA SHARD ARCHIVE', rx + rw / 2, ry + rh - 11);

    // Large Nav Buttons Section
    const btnY = 325;
    const btnH = 68;
    const btnW = 200;

    // PREV Button
    const prevX = rx;
    const isPrevHovered = hoveredAction === 'prev';
    ctx.fillStyle = isPrevHovered ? 'rgba(0, 240, 255, 0.4)' : 'rgba(14, 20, 32, 0.9)';
    ctx.fillRect(prevX, btnY, btnW, btnH);
    ctx.strokeStyle = isPrevHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isPrevHovered ? 2.5 : 1.5;
    ctx.strokeRect(prevX, btnY, btnW, btnH);

    ctx.fillStyle = isPrevHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('◄ PREV SHARD', prevX + btnW / 2, btnY + 42);

    // Shard Counter Center Display
    const idxX = prevX + btnW + 20;
    const idxW = rw - 2 * btnW - 40;
    ctx.fillStyle = 'rgba(10, 16, 26, 0.85)';
    ctx.fillRect(idxX, btnY, idxW, btnH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(idxX, btnY, idxW, btnH);

    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`0${currentIndex + 1} / 0${total}`, idxX + idxW / 2, btnY + 34);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px monospace';
    ctx.fillText('SHARD MOUNTED', idxX + idxW / 2, btnY + 54);

    // NEXT Button
    const nextX = idxX + idxW + 20;
    const isNextHovered = hoveredAction === 'next';
    ctx.fillStyle = isNextHovered ? 'rgba(0, 240, 255, 0.4)' : 'rgba(14, 20, 32, 0.9)';
    ctx.fillRect(nextX, btnY, btnW, btnH);
    ctx.strokeStyle = isNextHovered ? '#FFFFFF' : '#00F0FF';
    ctx.lineWidth = isNextHovered ? 2.5 : 1.5;
    ctx.strokeRect(nextX, btnY, btnW, btnH);

    ctx.fillStyle = isNextHovered ? '#FFFFFF' : '#00F0FF';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('NEXT SHARD ►', nextX + btnW / 2, btnY + 42);

    // Bottom Navigation Guide Card
    const guideY = 416;
    const guideH = 104;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.9)';
    ctx.fillRect(rx, guideY, rw, guideH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, guideY, rw, guideH);

    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('OPERATOR CONTROL MANUAL:', rx + 20, guideY + 28);

    ctx.fillStyle = 'rgba(230, 242, 255, 0.85)';
    ctx.font = '14px monospace';
    ctx.fillText('• KLIK SHARD DI MONITOR KIRI UNTUK LANGSUNG PILIH PROYEK', rx + 20, guideY + 52);
    ctx.fillText('• KLIK TOMBOL GITHUB / DEMO DI MONITOR TENGAH UNTUK AKSES REPO', rx + 20, guideY + 74);
    ctx.fillText('• SHORTCUT KEYBOARD: ◄ / ► / A / D SIKLUS PROYEK // O UNTUK REPO', rx + 20, guideY + 96);
  }

  static getRightMonitorActionAtUV(u, v) {
    const x = u * 720;
    const y = (1 - v) * 540;

    if (y >= 325 && y <= 395) {
      if (x >= 24 && x <= 224) return { action: 'prev' };
      if (x >= 496 && x <= 696) return { action: 'next' };
    }
    return null;
  }
}


