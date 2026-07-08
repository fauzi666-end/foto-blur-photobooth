export type PhotoboothTemplate = 
  | 'coquette-pink'
  | 'retro-film'
  | 'pastel-dream'
  | 'starry-night'
  | 'love-heart'
  | 'birthday-party'
  | 'y2k-aesthetic'
  | 'vintage-polaroid'
  | 'neon-glow'
  | 'kawaii-japanese'
  | 'beach-vibes'
  | 'disco-party';

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
  height: number,
  colors: string[] = ['#ffb6c1', '#ffd1dc', '#ff69b4', '#ffc0cb']
) {
  ctx.save();
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 7 + 3;
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
  const hearts = ['❤️', '💕', '💗', '💖', '🩷', '🤍', '💝'];
  for (let i = 0; i < 22; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 18;
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
  const stars = ['✨', '⭐', '🌟', '💫', '✴️', '⭐', '✨'];
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 12 + Math.random() * 16;
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

function drawBows(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const bows = ['🎀', '🎀', '🎀', '🎀'];
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 16 + Math.random() * 20;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bows[Math.floor(Math.random() * bows.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawFlowers(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const flowers = ['🌸', '🌷', '🌺', '🌻', '💐', '🌼'];
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 15 + Math.random() * 17;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flowers[Math.floor(Math.random() * flowers.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawMusicNotes(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const music = ['🎵', '🎶', '🎤', '🎸', '🎹'];
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 16;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(music[Math.floor(Math.random() * music.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawNeonShapes(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const neonColors = ['#ff00ff', '#00ffff', '#ff0080', '#40ff00', '#ffff00', '#ff8000'];
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 20 + 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    ctx.fillStyle = neonColors[Math.floor(Math.random() * neonColors.length)];
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawCoquettePink(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#ffe4ec');
  bg.addColorStop(0.5, '#ffd1dc');
  bg.addColorStop(1, '#ffb6c1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height, ['#ffb6c1', '#ffd1dc', '#ff69b4']);
  drawHearts(ctx, width, height);
  drawBows(ctx, width, height);

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

  drawText(ctx, '🎞️ Retro 🎞️', width / 2, height - 25, 20, '#ffdfba');
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
  drawConfetti(ctx, width, height, ['#ffecd2', '#fcb69f', '#a8edea', '#fed6e3']);
  drawFlowers(ctx, width, height);

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

  drawText(ctx, '🌷✨ Pastel ✨🌷', width / 2, height - 28, 22, '#ffffff');
}

function drawStarryNight(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#0f2027');
  bg.addColorStop(0.5, '#203a43');
  bg.addColorStop(1, '#2c5364');
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

  drawText(ctx, '🌙 Starry 🌙', width / 2, height - 28, 24, '#ffffff');
}

function drawLoveHeart(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fff0f5';
  ctx.fillRect(0, 0, width, height);
  drawHearts(ctx, width, height);
  drawConfetti(ctx, width, height, ['#ff69b4', '#ffb6c1', '#ff1493']);

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

  drawText(ctx, '💕 Love 💕', width / 2, height - 28, 24, '#ff69b4');
}

function drawBirthdayParty(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#f093fb');
  bg.addColorStop(1, '#f5576c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height, ['#ffdfba', '#ffffba', '#baffc9', '#bae1ff']);
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

  drawText(ctx, '🎂 Happy Bday! 🎂', width / 2, height - 28, 22, '#ffffff');
}

function drawY2KAesthetic(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#43cea2');
  bg.addColorStop(0.5, '#185a9d');
  bg.addColorStop(1, '#6dd5ed');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  drawStars(ctx, width, height);
  ctx.save();
  const emojis = ['💻', '📼', '💿', '📀', '🎮', '🕹️', '⭐', '🌟'];
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojis[Math.floor(Math.random() * emojis.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();

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

  drawText(ctx, '💿 Y2K 💿', width / 2, height - 28, 26, '#ffffff');
}

function drawVintagePolaroid(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#fdfcfb');
  bg.addColorStop(1, '#e2d1c3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  drawFlowers(ctx, width, height);

  const padding = 30;
  const gap = 25;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(x, y, frameWidth, frameHeight + 40);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    drawImageCover(ctx, images[i], x + 8, y + 8, frameWidth - 16, frameHeight - 16);
  }

  drawText(ctx, '📸 Vintage 📸', width / 2, height - 25, 20, '#333333');
}

function drawNeonGlow(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  drawNeonShapes(ctx, width, height);

  const padding = 35;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;

  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, y, frameWidth, frameHeight, 12);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 4, y + 4, frameWidth - 8, frameHeight - 8);
    drawImageCover(ctx, images[i], x + 8, y + 8, frameWidth - 16, frameHeight - 16);
  }

  drawText(ctx, '✨ Neon ✨', width / 2, height - 28, 24, '#00ffff');
}

function drawKawaiiJapanese(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#fff3cd');
  bg.addColorStop(1, '#ffeaa7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawFlowers(ctx, width, height);
  ctx.save();
  const kawaii = ['🐱', '🐰', '🐶', '🎀', '🎀', '🍓', '🍡', '🍰', '🐻', '🐼'];
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(kawaii[Math.floor(Math.random() * kawaii.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();

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

  drawText(ctx, '🐱 Kawaii 🐱', width / 2, height - 28, 24, '#ff6b81');
}

function drawBeachVibes(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#a8edea');
  bg.addColorStop(0.5, '#fed6e3');
  bg.addColorStop(1, '#fcd34d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const beach = ['🏖️', '🌴', '🌊', '☀️', '🐚', '🦀', '🍉', '🧴', '🏝️', '🌅'];
  for (let i = 0; i < 16; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(beach[Math.floor(Math.random() * beach.length)], 0, 0);
    ctx.restore();
  }
  ctx.restore();

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

  drawText(ctx, '🏖️ Beach 🏖️', width / 2, height - 28, 22, '#ffffff');
}

function drawDiscoParty(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#f093fb');
  bg.addColorStop(0.3, '#f5576c');
  bg.addColorStop(0.6, '#4facfe');
  bg.addColorStop(1, '#00f2fe');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawMusicNotes(ctx, width, height);
  drawStars(ctx, width, height);
  drawConfetti(ctx, width, height, ['#ff00ff', '#ffff00', '#00ffff', '#ff0080']);

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

  drawText(ctx, '💃 Disco 🕺', width / 2, height - 28, 24, '#ffffff');
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
    case 'y2k-aesthetic':
      drawY2KAesthetic(context, images, width, height);
      break;
    case 'vintage-polaroid':
      drawVintagePolaroid(context, images, width, height);
      break;
    case 'neon-glow':
      drawNeonGlow(context, images, width, height);
      break;
    case 'kawaii-japanese':
      drawKawaiiJapanese(context, images, width, height);
      break;
    case 'beach-vibes':
      drawBeachVibes(context, images, width, height);
      break;
    case 'disco-party':
      drawDiscoParty(context, images, width, height);
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
      bg4.addColorStop(0, '#0f2027');
      bg4.addColorStop(0.5, '#203a43');
      bg4.addColorStop(1, '#2c5364');
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

    case 'y2k-aesthetic':
      const bg7 = ctx.createLinearGradient(0, 0, width, height);
      bg7.addColorStop(0, '#43cea2');
      bg7.addColorStop(0.5, '#185a9d');
      bg7.addColorStop(1, '#6dd5ed');
      ctx.fillStyle = bg7;
      ctx.fillRect(0, 0, width, height);
      const pad7 = 20, gap7 = 18, fw7 = width - pad7*2, fh7 = (height - pad7*2 - gap7*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad7, pad7 + i*(fh7+gap7), fw7, fh7, 8);
        ctx.fill();
        drawDummy(pad7+7, pad7+7 + i*(fh7+gap7), fw7-14, fh7-14, i);
      }
      break;

    case 'vintage-polaroid':
      const bg8 = ctx.createLinearGradient(0, 0, 0, height);
      bg8.addColorStop(0, '#fdfcfb');
      bg8.addColorStop(1, '#e2d1c3');
      ctx.fillStyle = bg8;
      ctx.fillRect(0, 0, width, height);
      const pad8 = 20, gap8 = 18, fw8 = width - pad8*2, fh8 = (height - pad8*2 - gap8*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad8, pad8 + i*(fh8+gap8), fw8, fh8, 8);
        ctx.fill();
        drawDummy(pad8+7, pad8+7 + i*(fh8+gap8), fw8-14, fh8-14, i);
      }
      break;

    case 'neon-glow':
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      const pad9 = 20, gap9 = 18, fw9 = width - pad9*2, fh9 = (height - pad9*2 - gap9*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(pad9, pad9 + i*(fh9+gap9), fw9, fh9, 8);
        ctx.fill();
        drawDummy(pad9+7, pad9+7 + i*(fh9+gap9), fw9-14, fh9-14, i);
      }
      break;

    case 'kawaii-japanese':
      const bg10 = ctx.createLinearGradient(0, 0, 0, height);
      bg10.addColorStop(0, '#fff3cd');
      bg10.addColorStop(1, '#ffeaa7');
      ctx.fillStyle = bg10;
      ctx.fillRect(0, 0, width, height);
      const pad10 = 20, gap10 = 18, fw10 = width - pad10*2, fh10 = (height - pad10*2 - gap10*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad10, pad10 + i*(fh10+gap10), fw10, fh10, 8);
        ctx.fill();
        drawDummy(pad10+7, pad10+7 + i*(fh10+gap10), fw10-14, fh10-14, i);
      }
      break;

    case 'beach-vibes':
      const bg11 = ctx.createLinearGradient(0, 0, 0, height);
      bg11.addColorStop(0, '#a8edea');
      bg11.addColorStop(0.5, '#fed6e3');
      bg11.addColorStop(1, '#fcd34d');
      ctx.fillStyle = bg11;
      ctx.fillRect(0, 0, width, height);
      const pad11 = 20, gap11 = 18, fw11 = width - pad11*2, fh11 = (height - pad11*2 - gap11*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad11, pad11 + i*(fh11+gap11), fw11, fh11, 8);
        ctx.fill();
        drawDummy(pad11+7, pad11+7 + i*(fh11+gap11), fw11-14, fh11-14, i);
      }
      break;

    case 'disco-party':
      const bg12 = ctx.createLinearGradient(0, 0, width, height);
      bg12.addColorStop(0, '#f093fb');
      bg12.addColorStop(0.3, '#f5576c');
      bg12.addColorStop(0.6, '#4facfe');
      bg12.addColorStop(1, '#00f2fe');
      ctx.fillStyle = bg12;
      ctx.fillRect(0, 0, width, height);
      const pad12 = 20, gap12 = 18, fw12 = width - pad12*2, fh12 = (height - pad12*2 - gap12*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad12, pad12 + i*(fh12+gap12), fw12, fh12, 8);
        ctx.fill();
        drawDummy(pad12+7, pad12+7 + i*(fh12+gap12), fw12-14, fh12-14, i);
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
