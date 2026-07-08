export type PhotoboothTemplate = 
  | 'classic-strip-4'
  | 'grid-2x2'
  | 'polaroid-3'
  | 'film-strip'
  | 'heart-shape'
  | 'diagonal'
  | 'circle-grid'
  | 'retro-35mm'
  | 'polaroid-fun'
  | 'flower'
  | 'vintage'
  | 'modern-minimal';

export function captureVideoFrame(video: HTMLVideoElement) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Gagal memuat frame photobooth.'));
    image.src = source;
  });
}

// Helper untuk draw image dengan cover (tidak stretch)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  if (imgRatio > targetRatio) {
    drawHeight = h;
    drawWidth = img.width * (h / img.height);
    offsetX = (w - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = w;
    drawHeight = img.height * (w / img.width);
    offsetX = 0;
    offsetY = (h - drawHeight) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

// Helper untuk membuat frame bayangan
function drawShadowFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string = '#ffffff'
) {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// Helper untuk menggambar stiker emoji lucu
function drawCuteSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  sticker: string
) {
  ctx.font = `${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sticker, x, y);
}

// Helper untuk menggambar polka dot background
function drawPolkaDotBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dotColor: string = 'rgba(255,105,180,0.3)',
  dotSize: number = 15,
  spacing: number = 40
) {
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x + (y % spacing === 0 ? spacing / 2 : 0), y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }
  }
}

// Helper untuk menggambar bintang-bintang kecil
function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number = 20
) {
  const stars = ['✨', '⭐', '🌟', '💫'];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 12 + Math.random() * 10;
    const star = stars[Math.floor(Math.random() * stars.length)];
    drawCuteSticker(ctx, x, y, size, star);
  }
}

// Helper untuk menggambar confetti
function drawConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const colors = ['#ff69b4', '#ffd700', '#87ceeb', '#98fb98', '#dda0dd'];
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 5 + Math.random() * 10;
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.6);
    ctx.restore();
  }
}

// Template 1: Classic 4x1 Strip (Photobooth Umumnya)
function drawClassicStrip4(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  // Background gradient pink lembut + polka dot
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#fff0f5');
  bg.addColorStop(1, '#ffe4e1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(255,182,193,0.4)', 10, 35);

  const padding = 30;
  const gap = 20;
  const availableHeight = height - padding * 2;
  const photoHeight = (availableHeight - gap * 3) / 4;
  const photoWidth = width - padding * 2;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (photoHeight + gap);
    
    drawShadowFrame(ctx, x, y, photoWidth, photoHeight);
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 5, y + 5, photoWidth - 10, photoHeight - 10);
    drawImageCover(ctx, images[i], x + 10, y + 10, photoWidth - 20, photoHeight - 20);
  }

  // Tambahkan stiker lucu di pinggir
  const stickers = ['❤️', '😊', '✨', '🌸', '🎉'];
  for (let i = 0; i < 5; i++) {
    const sx = 20 + Math.random() * (width - 40);
    const sy = 20 + Math.random() * (height - 40);
    drawCuteSticker(ctx, sx, sy, 25, stickers[i]);
  }
}

// Template 2: Grid 2x2
function drawGrid2x2(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fdf5e6';
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height, 15);

  const padding = 40;
  const gap = 25;
  const photoSize = (width - padding * 2 - gap) / 2;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (photoSize + gap);
    const y = padding + row * (photoSize + gap);

    drawShadowFrame(ctx, x, y, photoSize, photoSize);
    ctx.strokeStyle = `hsl(${i * 90}, 70%, 60%)`;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 5, y + 5, photoSize - 10, photoSize - 10);
    drawImageCover(ctx, images[i], x + 10, y + 10, photoSize - 20, photoSize - 20);
  }

  // Tambahkan stiker di sudut
  drawCuteSticker(ctx, 30, 30, 30, '🌟');
  drawCuteSticker(ctx, width - 30, 30, 30, '✨');
  drawCuteSticker(ctx, 30, height - 30, 30, '💫');
  drawCuteSticker(ctx, width - 30, height - 30, 30, '⭐');
}

// Template 3: Polaroid 3 in a row
function drawPolaroid3(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f8f8ff';
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);

  const padding = 30;
  const gap = 25;
  const polaroidWidth = (width - padding * 2 - gap * 2) / 3;
  const polaroidHeight = polaroidWidth * 1.3;
  const startY = (height - polaroidHeight) / 2;

  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = startY + (i % 2 === 0 ? -15 : 15);

    ctx.save();
    const angle = (i - 1) * 0.05;
    ctx.translate(x + polaroidWidth / 2, y + polaroidHeight / 2);
    ctx.rotate(angle);
    ctx.translate(-polaroidWidth / 2, -polaroidHeight / 2);

    drawShadowFrame(ctx, 0, 0, polaroidWidth, polaroidHeight);
    
    const photoSize = polaroidWidth - 20;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(10, 10, photoSize, photoSize);
    drawImageCover(ctx, images[i], 10, 10, photoSize, photoSize);

    ctx.restore();
  }

  // Tambahkan stiker lucu
  const stickers = ['📸', '💕', '😊'];
  for (let i = 0; i < 3; i++) {
    drawCuteSticker(ctx, 50 + i * 200, height - 40, 35, stickers[i]);
  }
}

// Template 4: Film Strip
function drawFilmStrip(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height, 12);

  const padding = 30;
  const photoWidth = (width - padding * 2) / 5;
  const photoHeight = height - padding * 2;

  // Perforasi film
  ctx.fillStyle = '#0f0f1e';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(padding - 10, padding + i * (photoHeight / 20), 8, 8);
    ctx.fillRect(width - padding + 2, padding + i * (photoHeight / 20), 8, 8);
  }

  for (let i = 0; i < Math.min(images.length, 5); i++) {
    const x = padding + i * photoWidth;
    const y = padding;
    
    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(x + 5, y, photoWidth - 10, photoHeight);
    drawImageCover(ctx, images[i], x + 10, y + 10, photoWidth - 20, photoHeight - 20);
  }

  // Tambahkan stiker film
  drawCuteSticker(ctx, 50, 35, 30, '🎬');
  drawCuteSticker(ctx, width - 50, 35, 30, '🎞️');
}

// Template 5: Heart Shape
function drawHeartShape(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  bg.addColorStop(0, '#fff0f5');
  bg.addColorStop(1, '#ffb6c1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(255,255,255,0.4)', 8, 30);

  const positions = [
    { x: width/2 - 90, y: height/2 - 120, size: 80 },
    { x: width/2 + 10, y: height/2 - 120, size: 80 },
    { x: width/2 - 140, y: height/2 - 40, size: 80 },
    { x: width/2 - 45, y: height/2 - 40, size: 80 },
    { x: width/2 + 55, y: height/2 - 40, size: 80 },
    { x: width/2 - 95, y: height/2 + 40, size: 80 },
    { x: width/2 + 5, y: height/2 + 40, size: 80 },
    { x: width/2 - 45, y: height/2 + 100, size: 80 },
  ];

  for (let i = 0; i < Math.min(images.length, positions.length); i++) {
    const pos = positions[i];
    ctx.beginPath();
    ctx.arc(pos.x + pos.size/2, pos.y + pos.size/2, pos.size/2 + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(pos.x + pos.size/2, pos.y + pos.size/2, pos.size/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], pos.x, pos.y, pos.size, pos.size);
    ctx.restore();
  }

  // Tambahkan hati kecil di sekeliling
  const heartStickers = ['❤️', '💕', '💖', '💗'];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 280;
    const hx = width/2 + Math.cos(angle) * radius;
    const hy = height/2 + Math.sin(angle) * radius;
    drawCuteSticker(ctx, hx, hy, 35, heartStickers[i % heartStickers.length]);
  }
}

// Template 6: Diagonal
function drawDiagonal(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#e6f3ff';
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height, 18);

  const padding = 40;
  const photoSize = 120;
  const maxPhotos = 5;

  for (let i = 0; i < Math.min(images.length, maxPhotos); i++) {
    const progress = i / (maxPhotos - 1);
    const x = padding + progress * (width - padding * 2 - photoSize);
    const y = padding + progress * (height - padding * 2 - photoSize);
    
    ctx.save();
    ctx.translate(x + photoSize/2, y + photoSize/2);
    ctx.rotate((i - 2) * 0.1);
    ctx.translate(-photoSize/2, -photoSize/2);

    drawShadowFrame(ctx, 0, 0, photoSize, photoSize);
    drawImageCover(ctx, images[i], 10, 10, photoSize - 20, photoSize - 20);
    
    ctx.restore();
  }

  // Tambahkan stiker random
  const randomStickers = ['🌈', '☁️', '🌤️', '✨', '🦋'];
  for (let i = 0; i < 4; i++) {
    const rx = 30 + Math.random() * (width - 60);
    const ry = 30 + Math.random() * (height - 60);
    drawCuteSticker(ctx, rx, ry, 30, randomStickers[i]);
  }
}

// Template 7: Circle Grid
function drawCircleGrid(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f0fff4';
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(152,251,152,0.3)', 12, 38);

  const padding = 40;
  const circleSize = 100;
  const gap = 20;

  const positions = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      positions.push({
        x: padding + col * (circleSize + gap),
        y: padding + row * (circleSize + gap)
      });
    }
  }

  for (let i = 0; i < Math.min(images.length, positions.length); i++) {
    const pos = positions[i];
    const cx = pos.x + circleSize/2;
    const cy = pos.y + circleSize/2;
    
    ctx.beginPath();
    ctx.arc(cx, cy, circleSize/2 + 5, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${i * 40 + 100}, 70%, 85%)`;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx, cy, circleSize/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], pos.x, pos.y, circleSize, circleSize);
    ctx.restore();
  }

  // Tambahkan stiker hijau
  drawCuteSticker(ctx, 35, 35, 30, '🌿');
  drawCuteSticker(ctx, width - 35, height - 35, 30, '🌱');
}

// Template 8: Retro 35mm
function drawRetro35mm(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#2c1810';
  ctx.fillRect(0, 0, width, height);

  const padding = 50;
  const photoWidth = (width - padding * 2 - 30) / 4;
  const photoHeight = photoWidth * 0.7;
  const centerY = height / 2 - photoHeight / 2;

  // Retro border
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(padding - 5, centerY - 5, width - padding * 2 + 10, photoHeight + 10);

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * (photoWidth + 10);
    const y = centerY;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, photoWidth, photoHeight);
    drawImageCover(ctx, images[i], x + 5, y + 5, photoWidth - 10, photoHeight - 10);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, x + photoWidth/2, y + photoHeight - 10);
  }

  // Tambahkan stiker retro
  drawCuteSticker(ctx, 40, centerY, 35, '🎸');
  drawCuteSticker(ctx, width - 40, centerY, 35, '🎵');
}

// Template 9: Polaroid Fun
function drawPolaroidFun(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  const polaroids = [
    { x: centerX - 160, y: centerY - 140, w: 140, h: 170, angle: -0.15 },
    { x: centerX + 20, y: centerY - 130, w: 140, h: 170, angle: 0.12 },
    { x: centerX - 100, y: centerY + 30, w: 140, h: 170, angle: 0.08 },
    { x: centerX + 60, y: centerY + 40, w: 140, h: 170, angle: -0.1 },
  ];

  for (let i = 0; i < Math.min(images.length, polaroids.length); i++) {
    const p = polaroids[i];
    ctx.save();
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    ctx.rotate(p.angle);
    ctx.translate(-p.w/2, -p.h/2);

    drawShadowFrame(ctx, 0, 0, p.w, p.h);
    
    const photoSize = p.w - 20;
    drawImageCover(ctx, images[i], 10, 10, photoSize, photoSize);

    ctx.restore();
  }

  // Tambahkan stiker polaroid
  const funStickers = ['📷', '🎀', '🎈', '🎉'];
  for (let i = 0; i < 4; i++) {
    const fx = 40 + (i % 2) * (width - 80);
    const fy = 40 + Math.floor(i / 2) * (height - 80);
    drawCuteSticker(ctx, fx, fy, 35, funStickers[i]);
  }
}

// Template 10: Flower
function drawFlower(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  bg.addColorStop(0, '#fffacd');
  bg.addColorStop(1, '#ffd700');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100;
  const circleSize = 70;

  // Center photo
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2 + 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  if (images[0]) drawImageCover(ctx, images[0], centerX - circleSize/2, centerY - circleSize/2, circleSize, circleSize);
  ctx.restore();

  // Petals
  for (let i = 1; i < Math.min(images.length, 7); i++) {
    const angle = ((i - 1) / 6) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.arc(x, y, circleSize/2 + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8dc';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, circleSize/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], x - circleSize/2, y - circleSize/2, circleSize, circleSize);
    ctx.restore();
  }

  // Tambahkan stiker bunga
  const flowerStickers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐'];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const r = 250;
    drawCuteSticker(ctx, centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r, 40, flowerStickers[i]);
  }
}

// Template 11: Vintage
function drawVintage(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(139,69,19,0.2)', 10, 40);

  // Border vintage
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 15;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  const padding = 60;
  const gap = 20;
  const photoWidth = (width - padding * 2 - gap) / 2;
  const photoHeight = (height - padding * 2 - gap) / 2;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (photoWidth + gap);
    const y = padding + row * (photoHeight + gap);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, photoWidth, photoHeight);
    ctx.strokeStyle = '#d2b48c';
    ctx.lineWidth = 8;
    ctx.strokeRect(x + 5, y + 5, photoWidth - 10, photoHeight - 10);
    drawImageCover(ctx, images[i], x + 15, y + 15, photoWidth - 30, photoHeight - 30);
  }

  // Tambahkan stiker vintage
  drawCuteSticker(ctx, 45, 45, 35, '☕');
  drawCuteSticker(ctx, width - 45, 45, 35, '📜');
  drawCuteSticker(ctx, 45, height - 45, 35, '🎞️');
  drawCuteSticker(ctx, width - 45, height - 45, 35, '📻');
}

// Template 12: Modern Minimal
function drawModernMinimal(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height, 10);

  const padding = 40;
  const gap = 15;
  const photoHeight = (height - padding * 2 - gap * 3) / 4;
  const photoWidth = width - padding * 2;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (photoHeight + gap);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, photoWidth, photoHeight);
    drawImageCover(ctx, images[i], x, y, photoWidth, photoHeight);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`0${i + 1}`, x + 15, y + 30);
  }

  // Tambahkan stiker minimal
  const minStickers = ['✦', '◆', '●', '▲'];
  for (let i = 0; i < 4; i++) {
    drawCuteSticker(ctx, width - 35, padding + i * (photoHeight + gap) + photoHeight / 2, 25, minStickers[i]);
  }
}

export async function buildPhotoboothStrip(
  frames: string[],
  template: PhotoboothTemplate,
) {
  // Ukuran berdasarkan template
  let width = 600;
  let height = 900;

  switch (template) {
    case 'classic-strip-4':
      width = 400; height = 800; break;
    case 'grid-2x2':
      width = 700; height = 700; break;
    case 'polaroid-3':
      width = 900; height = 500; break;
    case 'film-strip':
      width = 900; height = 400; break;
    case 'heart-shape':
      width = 700; height = 700; break;
    case 'diagonal':
      width = 800; height = 600; break;
    case 'circle-grid':
      width = 700; height = 700; break;
    case 'retro-35mm':
      width = 900; height = 400; break;
    case 'polaroid-fun':
      width = 700; height = 700; break;
    case 'flower':
      width = 700; height = 700; break;
    case 'vintage':
      width = 700; height = 700; break;
    case 'modern-minimal':
      width = 500; height = 800; break;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const images = await Promise.all(frames.map((frame) => loadImage(frame)));

  // Pilih template
  switch (template) {
    case 'classic-strip-4': drawClassicStrip4(context, images, width, height); break;
    case 'grid-2x2': drawGrid2x2(context, images, width, height); break;
    case 'polaroid-3': drawPolaroid3(context, images, width, height); break;
    case 'film-strip': drawFilmStrip(context, images, width, height); break;
    case 'heart-shape': drawHeartShape(context, images, width, height); break;
    case 'diagonal': drawDiagonal(context, images, width, height); break;
    case 'circle-grid': drawCircleGrid(context, images, width, height); break;
    case 'retro-35mm': drawRetro35mm(context, images, width, height); break;
    case 'polaroid-fun': drawPolaroidFun(context, images, width, height); break;
    case 'flower': drawFlower(context, images, width, height); break;
    case 'vintage': drawVintage(context, images, width, height); break;
    case 'modern-minimal': drawModernMinimal(context, images, width, height); break;
    default: drawClassicStrip4(context, images, width, height);
  }

  return canvas;
}

// Fungsi untuk membuat preview template (dengan gambar placeholder)
export function buildTemplatePreview(template: PhotoboothTemplate): string {
  const canvas = document.createElement('canvas');
  let width = 200;
  let height = 280;

  switch (template) {
    case 'grid-2x2':
    case 'heart-shape':
    case 'circle-grid':
    case 'polaroid-fun':
    case 'flower':
    case 'vintage':
      width = 200; height = 200; break;
    case 'polaroid-3':
    case 'film-strip':
    case 'retro-35mm':
      width = 280; height = 130; break;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw placeholder background
  const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e0bbff'];
  
  // Create dummy images
  const drawDummy = (x: number, y: number, w: number, h: number, colorIndex: number) => {
    ctx.fillStyle = colors[colorIndex % colors.length];
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷', x + w/2, y + h/2);
  };

  // Draw tiny stickers for preview
  const drawTinySticker = (x: number, y: number, sticker: string) => {
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker, x, y);
  };

  switch (template) {
    case 'classic-strip-4': {
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(0, 0, width, height);
      // Tiny polkadot
      ctx.fillStyle = 'rgba(255,182,193,0.4)';
      for(let i=0; i<20; i++){
        ctx.beginPath();
        ctx.arc(10 + Math.random()*180, 10 + Math.random()*260, 3, 0, Math.PI*2);
        ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        const h = (height - 30) / 4;
        drawDummy(15, 10 + i * (h + 5), width - 30, h - 5, i);
      }
      // Tiny stickers
      drawTinySticker(30, 25, '❤️');
      drawTinySticker(width-30, height-25, '✨');
      break;
    }
    case 'grid-2x2': {
      ctx.fillStyle = '#fdf5e6';
      ctx.fillRect(0, 0, width, height);
      // Tiny stars
      ['✨','⭐'].forEach((s,i)=>drawTinySticker(30+i*140, 30, s));
      const s = (width - 30) / 2;
      [[0,0],[1,0],[0,1],[1,1]].forEach(([c, r], i) => {
        drawDummy(10 + c * (s + 10), 10 + r * (s + 10), s, s, i);
      });
      drawTinySticker(width-30, height-30, '🌟');
      break;
    }
    case 'polaroid-3': {
      ctx.fillStyle = '#f8f8ff';
      ctx.fillRect(0, 0, width, height);
      // Tiny confetti
      const confettiColors = ['#ff69b4','#ffd700','#87ceeb','#98fb98'];
      for(let i=0;i<10;i++){
        ctx.fillStyle = confettiColors[i%4];
        ctx.fillRect(20+Math.random()*240, 20+Math.random()*90, 4, 4);
      }
      const pw = (width - 30) / 3;
      for (let i = 0; i < 3; i++) {
        drawDummy(10 + i * (pw + 5), 20, pw, height - 40, i);
      }
      drawTinySticker(width-20, 25, '📷');
      break;
    }
    case 'film-strip': {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      // Tiny stars
      drawTinySticker(25, 25, '🎬');
      const fw = (width - 30) / 5;
      for (let i = 0; i < 5; i++) {
        drawDummy(15 + i * fw, 15, fw - 5, height - 30, i);
      }
      drawTinySticker(width-25, 25, '🎞️');
      break;
    }
    case 'heart-shape': {
      const bg = ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width/2);
      bg.addColorStop(0,'#fff0f5');
      bg.addColorStop(1,'#ffb6c1');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,width,height);
      drawDummy(60, 40, 40, 40, 0);
      drawDummy(100, 40, 40, 40, 1);
      drawDummy(40, 80, 40, 40, 2);
      drawDummy(80, 80, 40, 40, 3);
      drawDummy(120, 80, 40, 40, 4);
      drawDummy(60, 120, 40, 40, 5);
      drawDummy(100, 120, 40, 40, 0);
      // Tiny hearts
      ['❤️','💕','💖'].forEach((s,i)=>drawTinySticker(20+i*80, 20, s));
      break;
    }
    case 'diagonal': {
      ctx.fillStyle = '#e6f3ff';
      ctx.fillRect(0, 0, width, height);
      drawTinySticker(30,30,'☁️');
      for (let i = 0; i < 5; i++) {
        const p = i / 4;
        drawDummy(10 + p * 120, 10 + p * 120, 50, 50, i);
      }
      drawTinySticker(width-30,height-30,'🌈');
      break;
    }
    case 'circle-grid': {
      ctx.fillStyle = '#f0fff4';
      ctx.fillRect(0, 0, width, height);
      drawTinySticker(25,25,'🌿');
      for (let i = 0; i < 9; i++) {
        const r = Math.floor(i / 3), c = i % 3;
        const x = 15 + c * 60, y = 15 + r * 60;
        ctx.beginPath();
        ctx.arc(x + 25, y + 25, 27, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
      }
      drawTinySticker(width-25,height-25,'🌱');
      break;
    }
    case 'retro-35mm': {
      ctx.fillStyle = '#2c1810';
      ctx.fillRect(0, 0, width, height);
      drawTinySticker(30,height/2,'🎸');
      const rw = (width - 40) / 4;
      for (let i = 0; i < 4; i++) {
        drawDummy(20 + i * (rw + 5), 30, rw - 5, height - 60, i);
      }
      drawTinySticker(width-30,height/2,'🎵');
      break;
    }
    case 'polaroid-fun': {
      ctx.fillStyle = '#fffaf0';
      ctx.fillRect(0, 0, width, height);
      const funStickers = ['🎀','🎈','🎉'];
      drawTinySticker(25,25,funStickers[0]);
      const pSize = 70;
      [[40, 30], [100, 40], [60, 100], [110, 110]].forEach(([x, y], i) => {
        drawDummy(x, y, pSize, pSize, i);
      });
      drawTinySticker(width-25,height-25,funStickers[2]);
      break;
    }
    case 'flower': {
      const bg = ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width/2);
      bg.addColorStop(0,'#fffacd');
      bg.addColorStop(1,'#ffd700');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,width,height);
      drawDummy(80, 80, 40, 40, 0); // center
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = 100 + Math.cos(a) * 50;
        const y = 100 + Math.sin(a) * 50;
        drawDummy(x - 20, y - 20, 40, 40, i + 1);
      }
      // Tiny flower stickers
      const flowerStickers = ['🌸','🌺','🌻'];
      flowerStickers.forEach((s,i)=>drawTinySticker(30+i*70, 25, s));
      break;
    }
    case 'vintage': {
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 5; ctx.strokeRect(10, 10, width-20, height-20);
      // Tiny polkadot vintage
      ctx.fillStyle = 'rgba(139,69,19,0.2)';
      for(let i=0;i<15;i++){
        ctx.beginPath();
        ctx.arc(20+Math.random()*160,20+Math.random()*160, 3,0,Math.PI*2);
        ctx.fill();
      }
      const vs = (width - 35) / 2;
      [[0,0],[1,0],[0,1],[1,1]].forEach(([c, r], i) => {
        drawDummy(15 + c * (vs + 5), 15 + r * (vs + 5), vs, vs, i);
      });
      drawTinySticker(30,30,'☕');
      break;
    }
    case 'modern-minimal': {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, width, height);
      drawTinySticker(width-25,40,'✦');
      const mh = (height - 30) / 4;
      for (let i = 0; i < 4; i++) {
        drawDummy(15, 10 + i * (mh + 5), width - 30, mh - 5, i);
      }
      break;
    }
  }

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
