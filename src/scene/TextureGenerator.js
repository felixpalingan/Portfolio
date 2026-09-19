import * as THREE from 'three';

/**
 * Procedural Texture Generator for Cyberpunk Apartment
 * Generates Megabuilding H10 hexagonal floor tiles and industrial wall panel textures.
 */
export class TextureGenerator {
  /**
   * Generates hexagonal floor tile texture matching Megabuilding H10
   * (warm reddish-amber/terracotta tiles with dark grout lines)
   */
  static createHexFloorTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background / Grout color (dark industrial charcoal)
    ctx.fillStyle = '#0f0a08';
    ctx.fillRect(0, 0, size, size);

    const radius = 38;
    const h = radius * Math.sqrt(3);
    const vDist = radius * 1.5;
    const hDist = h;

    const cols = Math.ceil(size / hDist) + 2;
    const rows = Math.ceil(size / vDist) + 2;

    // Palette of subtle Megabuilding H10 tile shades
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

      // Subtle bevel highlight on top edges
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 180, 120, 0.08)';
      ctx.stroke();
    }

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const xOffset = (r % 2 === 0) ? 0 : hDist / 2;
        const cx = c * hDist + xOffset;
        const cy = r * vDist;

        // Deterministic pseudo-random variation based on position
        const seed = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
        const colorIdx = Math.floor(Math.abs(seed) % tileColors.length);
        const tileColor = tileColors[colorIdx];

        drawHexagon(cx, cy, radius - 3, tileColor);
      }
    }

    // Subtle noise/grunge overlay for worn apartment feel
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.7));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.5));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    return texture;
  }

  /**
   * Generates industrial wall panel texture with subtle panel seams
   */
  static createWallTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark industrial wall tone
    ctx.fillStyle = '#181412';
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y - 2);
      ctx.lineTo(size, y - 2);
      ctx.stroke();
      ctx.strokeStyle = '#0e0b0a';
      ctx.lineWidth = 4;
    }

    // Subtle grunge
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2);
    return texture;
  }
}
