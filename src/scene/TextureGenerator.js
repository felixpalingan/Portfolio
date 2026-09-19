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
   * Generates Cyberpunk 2077 Smart Mirror interactive HUD texture
   */
  static createSmartMirrorTexture() {
    const w = 1024;
    const h = 1536;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Deep semi-transparent cybernetic glass background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    // Subtle background scanline matrix
    ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
    for (let y = 0; y < h; y += 8) {
      ctx.fillRect(0, y, w, 4);
    }

    // Outer HUD frame with cyber brackets
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Corner brackets
    ctx.fillStyle = '#FCEE09';
    ctx.fillRect(20, 20, 40, 10);
    ctx.fillRect(20, 20, 10, 40);
    ctx.fillRect(w - 60, 20, 40, 10);
    ctx.fillRect(w - 30, 20, 10, 40);
    ctx.fillRect(20, h - 30, 40, 10);
    ctx.fillRect(20, h - 60, 10, 40);
    ctx.fillRect(w - 60, h - 30, 40, 10);
    ctx.fillRect(w - 30, h - 60, 10, 40);

    // Top Header
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('KIROSHI OPTICAL // SMART MIRROR v2.077', 60, 95);

    ctx.fillStyle = '#FCEE09';
    ctx.font = '22px monospace';
    ctx.fillText('● NEURAL LINK SYNCHRONIZED // 98.7 MHz', 60, 135);

    // Divider Line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.lineTo(w - 60, 160);
    ctx.stroke();

    // =========================================================================
    // AVATAR / PROFILE PHOTO BOX (Styled Cyberpunk Operative Scan)
    // =========================================================================
    const photoX = 60;
    const photoY = 195;
    const photoW = w - 120;
    const photoH = 500;

    // Dark photo container
    ctx.fillStyle = '#090e18';
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Operative Silhouette / Cyber Face
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(w / 2, photoY + 200, 110, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.beginPath();
    ctx.ellipse(w / 2, photoY + 420, 220, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Cyberware Visor / Optics
    ctx.fillStyle = '#FCEE09';
    ctx.shadowColor = '#FCEE09';
    ctx.shadowBlur = 18;
    ctx.fillRect(w / 2 - 80, photoY + 185, 160, 28);
    ctx.shadowBlur = 0;

    // Biometric facial tracking crosshair brackets
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(w / 2 - 120, photoY + 80, 240, 240);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('[SUBJECT: ALMAKIUS FELIX BARIQ HEKOPUNG]', w / 2 - 270, photoY + 470);

    // =========================================================================
    // BIOMETRIC & OPERATIVE TELEMETRY
    // =========================================================================
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.font = '24px monospace';
    ctx.fillText('ROLE: FULL STACK NETRUNNER // CREATIVE DEVELOPER', 60, 750);
    ctx.fillText('LOC : WATSON DISTRICT // MEGABUILDING H10', 60, 790);
    ctx.fillText('PULSE: 72 BPM  |  NEURAL LOAD: 14%  |  ICE: SECURE', 60, 830);

    // Divider
    ctx.strokeStyle = '#FF003C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 865);
    ctx.lineTo(w - 60, 865);
    ctx.stroke();

    // =========================================================================
    // TRANSMISSION CHANNELS (CONTACT INFO)
    // =========================================================================
    ctx.fillStyle = '#FCEE09';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('// DIRECT TRANSMISSION CHANNELS', 60, 925);

    // Channel Box 1: Email
    ctx.fillStyle = '#0a1220';
    ctx.fillRect(60, 960, w - 120, 95);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 960, w - 120, 95);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('✉ COMMS / EMAIL', 90, 1000);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px monospace';
    ctx.fillText('felixbariq@gmail.com', 90, 1038);

    // Channel Box 2: GitHub
    ctx.fillStyle = '#0a1220';
    ctx.fillRect(60, 1075, w - 120, 95);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 1075, w - 120, 95);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('◈ CODE REPOSITORY / GITHUB', 90, 1115);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px monospace';
    ctx.fillText('github.com/felixpalingan', 90, 1153);

    // Channel Box 3: LinkedIn
    ctx.fillStyle = '#0a1220';
    ctx.fillRect(60, 1190, w - 120, 95);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 1190, w - 120, 95);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('◆ PROFESSIONAL NETWORK / LINKEDIN', 90, 1230);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px monospace';
    ctx.fillText('linkedin.com/in/felixpalingan', 90, 1268);

    // Bottom Status Badge
    ctx.fillStyle = '#00FF66';
    ctx.fillRect(60, 1340, w - 120, 50);
    ctx.fillStyle = '#060a12';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ STATUS: OPEN FOR CONTRACTS & NEW MISSIONS ⚡', w / 2, 1375);
    ctx.textAlign = 'left';

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}

