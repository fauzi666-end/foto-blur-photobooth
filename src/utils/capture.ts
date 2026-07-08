export type PhotoboothTemplate = 
  | 'coquette-pink'
  | 'retro-film'
  | 'pastel-dream'
  | 'starry-night'
  | 'love-heart'
  | 'birthday-party'

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
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat frame photobooth.'));
    img.src = source;
  });
}

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

function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string = '#ffffff',
  shadow: boolean = true
) {
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function drawConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const colors = ['#ffb6c1', '#ffd1dc', '#ff69b4', '#ffc0cb', '#ff6b6b', '#ffe4e1'];
  ctx.save();
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 6 + 3;
    const rotation = Math.random() * Math.PI * 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size * 0.6, 1);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawHearts(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();
  const hearts = ['❤️', '💕', '💗', '💖', '🩷', '🤍'];
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 16;
    const rotation = (Math.random() - 0.5) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hearts[Math.floor(Math.random() * hearts.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();
  const stars = ['✨', '⭐', '🌟', '💫'];
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 12 + Math.random() * 14;
    const rotation = (Math.random() - 0.5) * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stars[Math.floor(Math.random() * stars.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number = 22,
  color: string = '#333333'
) {
  ctx.save();
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawCoquettePink(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#ffe4ec');
  bg.addColorStop(0.5, '#ffd1dc');
  bg.addColorStop(1, '#ffb6c1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);
  drawHearts(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }

  drawText(ctx, '🎀 Memori 🎀', width / 2, height - 28, 24, '#ff4757');
}

function drawRetroFilm(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#2d2d2d';
  for (let i = 0; i < 12; i++) {
    const x = 15 + i * (width / 11);
    ctx.beginPath();
    ctx.arc(x, 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, height - 18, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const padding = 45;
  const gap = 25;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(x, y, frameWidth, frameHeight, 8);
    ctx.fill();
    drawImageCover(ctx, images[i], x + 8, y + 8, frameWidth - 16, frameHeight - 16);
  }
}

function drawPastelDream(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, 0);
  bg.addColorStop(0, '#ffecd2');
  bg.addColorStop(0.25, '#fcb69f');
  bg.addColorStop(0.5, '#ffecd2');
  bg.addColorStop(0.75, '#a8edea');
  bg.addColorStop(1, '#fed6e3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#ffffff');
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }

  drawText(ctx, '✨ ✨', width / 2, height - 28, 26, '#ffffff');
}

function drawStarryNight(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#2c3e50');
  bg.addColorStop(1, '#4ca1af');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#ecf0f1');
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }

  drawText(ctx, '🌙', width / 2, height - 28, 28, '#ffffff');
}

function drawLoveHeart(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fff0f5';
  ctx.fillRect(0, 0, width, height);
  drawHearts(ctx, width, height);
  drawConfetti(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#ffe4e1');
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }

  drawText(ctx, '💕', width / 2, height - 28, 24, '#ff69b4');
}

function drawBirthdayParty(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#f093fb');
  bg.addColorStop(1, '#f5576c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);
  drawStars(ctx, width, height);
  drawHearts(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#ffffff');
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }

  drawText(ctx, '🎂 HBD 🎂', width / 2, height - 28, 24, '#ffffff');
}

export async function buildPhotoboothStrip(
  frames: string[],
  template: PhotoboothTemplate
) {
  const width = 450;
  const height = 1125;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const images = await Promise.all(frames.map(loadImage));

  switch (template) {
    case 'coquette-pink':
      drawCoquettePink(context, images, width, height);
      break;
    case 'retro-film':
      drawRetroFilm(context, images, width, height);
      break;
    case 'pastel-dream':
      drawPastelDream(context, images, width, height);
      break;
    case 'starry-night':
      drawStarryNight(context, images, width, height);
      break;
    case 'love-heart':
      drawLoveHeart(context, images, width, height);
      break;
    case 'birthday-party':
      drawBirthdayParty(context, images, width, height);
      break;
    default:
      drawCoquettePink(context, images, width, height);
  }

  return canvas;
}

export function buildTemplatePreview(template: PhotoboothTemplate): string {
  const canvas = document.createElement('canvas');
  const width = 240;
  const height = 600;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#ffc3a0'];

  const drawDummy = (x: number, y: number, w: number, h: number, idx: number) => {
    ctx.fillStyle = colors[idx % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `${Math.min(w, h) / 3.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📸', x + w / 2, y + h / 2);
  };

  switch (template) {
    case 'coquette-pink':
      const bg1 = ctx.createLinearGradient(0, 0, 0, height);
      bg1.addColorStop(0, '#ffe4ec');
      bg1.addColorStop(0.5, '#ffd1dc');
      bg1.addColorStop(1, '#ffb6c1');
      ctx.fillStyle = bg1;
      ctx.fillRect(0, 0, width, height);
      const pad1 = 20, gap1 = 18, fw1 = width - pad1*2, fh1 = (height - pad1*2 - gap1*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad1, pad1 + i*(fh1+gap1), fw1, fh1, 8);
        ctx.fill();
        drawDummy(pad1+7, pad1+7 + i*(fh1+gap1), fw1-14, fh1-14, i);
      }
      break;

    case 'retro-film':
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#2d2d2d';
      for (let i = 0; i < 8; i++) {
        const x = 12 + i * (width / 7);
        ctx.beginPath();
        ctx.arc(x, 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, height - 14, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      const pad2 = 25, gap2 = 15, fw2 = width - pad2*2, fh2 = (height - pad2*2 - gap2*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(pad2, pad2 + i*(fh2+gap2), fw2, fh2, 6);
        ctx.fill();
        drawDummy(pad2+6, pad2+6 + i*(fh2+gap2), fw2-12, fh2-12, i);
      }
      break;

    case 'pastel-dream':
      const bg3 = ctx.createLinearGradient(0, 0, width, 0);
      bg3.addColorStop(0, '#ffecd2');
      bg3.addColorStop(0.25, '#fcb69f');
      bg3.addColorStop(0.5, '#ffecd2');
      bg3.addColorStop(0.75, '#a8edea');
      bg3.addColorStop(1, '#fed6e3');
      ctx.fillStyle = bg3;
      ctx.fillRect(0, 0, width, height);
      const pad3 = 20, gap3 = 18, fw3 = width - pad3*2, fh3 = (height - pad3*2 - gap3*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad3, pad3 + i*(fh3+gap3), fw3, fh3, 8);
        ctx.fill();
        drawDummy(pad3+7, pad3+7 + i*(fh3+gap3), fw3-14, fh3-14, i);
      }
      break;

    case 'starry-night':
      const bg4 = ctx.createLinearGradient(0, 0, 0, height);
      bg4.addColorStop(0, '#2c3e50');
      bg4.addColorStop(1, '#4ca1af');
      ctx.fillStyle = bg4;
      ctx.fillRect(0, 0, width, height);
      const pad4 = 20, gap4 = 18, fw4 = width - pad4*2, fh4 = (height - pad4*2 - gap4*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.roundRect(pad4, pad4 + i*(fh4+gap4), fw4, fh4, 8);
        ctx.fill();
        drawDummy(pad4+7, pad4+7 + i*(fh4+gap4), fw4-14, fh4-14, i);
      }
      break;

    case 'love-heart':
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(0, 0, width, height);
      const pad5 = 20, gap5 = 18, fw5 = width - pad5*2, fh5 = (height - pad5*2 - gap5*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffe4e1';
        ctx.beginPath();
        ctx.roundRect(pad5, pad5 + i*(fh5+gap5), fw5, fh5, 8);
        ctx.fill();
        drawDummy(pad5+7, pad5+7 + i*(fh5+gap5), fw5-14, fh5-14, i);
      }
      break;

    case 'birthday-party':
      const bg6 = ctx.createLinearGradient(0, 0, 0, height);
      bg6.addColorStop(0, '#f093fb');
      bg6.addColorStop(1, '#f5576c');
      ctx.fillStyle = bg6;
      ctx.fillRect(0, 0, width, height);
      const pad6 = 20, gap6 = 18, fw6 = width - pad6*2, fh6 = (height - pad6*2 - gap6*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad6, pad6 + i*(fh6+gap6), fw6, fh6, 8);
        ctx.fill();
        drawDummy(pad6+7, pad6+7 + i*(fh6+gap6), fw6-14, fh6-14, i);
      }
      break;
  }

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
