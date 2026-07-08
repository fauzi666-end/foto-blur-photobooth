export type PhotoboothTemplate = 
  | 'classic-strip-4'
  | 'classic-strip-3'
  | 'square-grid-2x2'
  | 'polaroid-strip'
  | 'film-strip-simple'
  | 'love-party';

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
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 5, w - 10, h - 10, 12);
  ctx.stroke();
}

function drawConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
  ctx.save();
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 8 + 4;
    const rotation = Math.random() * Math.PI * 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.beginPath();
    ctx.roundRect(-size/2, -size/2, size, size * 0.6, 2);
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
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const hearts = ['❤️', '💕', '💖', '💗'];
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 16 + Math.random() * 20;
    const rotation = (Math.random() - 0.5) * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${size}px Arial`;
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
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 14 + Math.random() * 18;
    const rotation = (Math.random() - 0.5) * 0.6;
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
  size: number = 24,
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

function drawClassicStrip4(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);
  
  const padding = 40;
  const gap = 35;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 14, y + 14, frameWidth - 28, frameHeight - 28);
  }
  
  drawText(ctx, 'Photobooth', width / 2, height - 25, 20, '#ff6b81');
}

function drawClassicStrip3(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fff5f7';
  ctx.fillRect(0, 0, width, height);
  drawHearts(ctx, width, height);
  
  const padding = 45;
  const gap = 40;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 2) / 3;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 14, y + 14, frameWidth - 28, frameHeight - 28);
  }
  
  drawText(ctx, '💖 Memories 💖', width / 2, height - 28, 22, '#ff4757');
}

function drawSquareGrid2x2(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height);
  
  const padding = 45;
  const gap = 35;
  const frameSize = (width - padding * 2 - gap) / 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (frameSize + gap);
    const y = padding + row * (frameSize + gap);
    drawPhotoFrame(ctx, x, y, frameSize, frameSize);
    drawImageCover(ctx, images[i], x + 14, y + 14, frameSize - 28, frameSize - 28);
  }
}

function drawPolaroidStrip(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 35;
  const gap = 25;
  const polaroidWidth = (width - padding * 2 - gap * 2) / 3;
  const polaroidHeight = polaroidWidth * 1.35;
  const startY = (height - polaroidHeight) / 2;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = startY + (i === 1 ? 15 : (i === 0 ? -12 : 8));
    
    ctx.save();
    ctx.translate(x + polaroidWidth/2, y + polaroidHeight/2);
    ctx.rotate((i - 1) * 0.08);
    ctx.translate(-polaroidWidth/2, -polaroidHeight/2);
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.roundRect(0, 0, polaroidWidth, polaroidHeight, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    const photoSize = polaroidWidth - 24;
    drawImageCover(ctx, images[i], 12, 14, photoSize, photoSize);
    ctx.restore();
  }
}

function drawFilmStripSimple(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 15; i++) {
    const x = 10 + i * (width / 14);
    ctx.beginPath();
    ctx.arc(x, 20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, height - 20, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const padding = 55;
  const frameWidth = (width - padding * 2) / 4;
  const frameHeight = height - padding * 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * frameWidth;
    const y = padding;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 6, frameWidth - 12, frameHeight - 12, 6);
    ctx.fill();
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
}

function drawLoveParty(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#ffd1dc');
  bg.addColorStop(1, '#ffe4ec');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawConfetti(ctx, width, height);
  drawHearts(ctx, width, height);
  
  const padding = 45;
  const gap = 30;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#fff5f7');
    drawImageCover(ctx, images[i], x + 14, y + 14, frameWidth - 28, frameHeight - 28);
  }
  
  drawText(ctx, '❤️ Love is in the air ❤️', width / 2, height - 28, 22, '#ff4757');
}

export async function buildPhotoboothStrip(
  frames: string[],
  template: PhotoboothTemplate,
) {
  let width = 420;
  let height = 900;

  switch (template) {
    case 'classic-strip-4': width = 420; height = 900; break;
    case 'classic-strip-3': width = 420; height = 750; break;
    case 'square-grid-2x2': width = 680; height = 680; break;
    case 'polaroid-strip': width = 880; height = 580; break;
    case 'film-strip-simple': width = 920; height = 420; break;
    case 'love-party': width = 420; height = 900; break;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const images = await Promise.all(frames.map(loadImage));

  switch (template) {
    case 'classic-strip-4': drawClassicStrip4(context, images, width, height); break;
    case 'classic-strip-3': drawClassicStrip3(context, images, width, height); break;
    case 'square-grid-2x2': drawSquareGrid2x2(context, images, width, height); break;
    case 'polaroid-strip': drawPolaroidStrip(context, images, width, height); break;
    case 'film-strip-simple': drawFilmStripSimple(context, images, width, height); break;
    case 'love-party': drawLoveParty(context, images, width, height); break;
    default: drawClassicStrip4(context, images, width, height);
  }

  return canvas;
}

export function buildTemplatePreview(template: PhotoboothTemplate): string {
  const canvas = document.createElement('canvas');
  let width = 220;
  let height = 340;

  switch (template) {
    case 'classic-strip-4': width = 220; height = 340; break;
    case 'classic-strip-3': width = 220; height = 280; break;
    case 'square-grid-2x2': width = 220; height = 220; break;
    case 'polaroid-strip': width = 300; height = 180; break;
    case 'film-strip-simple': width = 300; height = 140; break;
    case 'love-party': width = 220; height = 340; break;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#ffc3a0'];

  const drawDummy = (x: number, y: number, w: number, h: number, idx: number) => {
    ctx.fillStyle = colors[idx % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `${Math.min(w, h)/4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📷', x + w/2, y + h/2);
  };

  switch (template) {
    case 'classic-strip-4':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      const pad1 = 20, gap1 = 15, fw1 = width - pad1*2, fh1 = (height - pad1*2 - gap1*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad1, pad1 + i*(fh1 + gap1), fw1, fh1, 8);
        ctx.fill();
        drawDummy(pad1 + 8, pad1 + 8 + i*(fh1 + gap1), fw1 - 16, fh1 - 16, i);
      }
      break;

    case 'classic-strip-3':
      ctx.fillStyle = '#fff5f7';
      ctx.fillRect(0, 0, width, height);
      const pad2 = 22, gap2 = 18, fw2 = width - pad2*2, fh2 = (height - pad2*2 - gap2*2)/3;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad2, pad2 + i*(fh2 + gap2), fw2, fh2, 8);
        ctx.fill();
        drawDummy(pad2 + 8, pad2 + 8 + i*(fh2 + gap2), fw2 - 16, fh2 - 16, i);
      }
      break;

    case 'square-grid-2x2':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      const pad3 = 22, gap3 = 15, fs3 = (width - pad3*2 - gap3)/2;
      for (let i = 0; i < 4; i++) {
        const r = Math.floor(i / 2), c = i % 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(pad3 + c*(fs3 + gap3), pad3 + r*(fs3 + gap3), fs3, fs3, 8);
        ctx.fill();
        drawDummy(pad3 + 8 + c*(fs3 + gap3), pad3 + 8 + r*(fs3 + gap3), fs3 - 16, fs3 - 16, i);
      }
      break;

    case 'polaroid-strip':
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      const pad4 = 20, gap4 = 12, pw4 = (width - pad4*2 - gap4*2)/3, ph4 = pw4 * 1.35;
      const sy4 = (height - ph4)/2;
      for (let i = 0; i < 3; i++) {
        const x = pad4 + i*(pw4 + gap4), y = sy4 + (i === 1 ? 10 : (i === 0 ? -8 : 6));
        ctx.save();
        ctx.translate(x + pw4/2, y + ph4/2);
        ctx.rotate((i - 1) * 0.06);
        ctx.translate(-pw4/2, -ph4/2);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(0, 0, pw4, ph4, 6);
        ctx.fill();
        const ps4 = pw4 - 18;
        drawDummy(9, 11, ps4, ps4, i);
        ctx.restore();
      }
      break;

    case 'film-strip-simple':
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
      const pad5 = 20, fw5 = (width - pad5*2)/4, fh5 = height - pad5*2;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(pad5 + i*fw5 + 4, pad5 + 4, fw5 - 8, fh5 - 8, 4);
        ctx.fill();
        drawDummy(pad5 + i*fw5 + 8, pad5 + 8, fw5 - 16, fh5 - 16, i);
      }
      break;

    case 'love-party':
      const bg6 = ctx.createLinearGradient(0, 0, 0, height);
      bg6.addColorStop(0, '#ffd1dc');
      bg6.addColorStop(1, '#ffe4ec');
      ctx.fillStyle = bg6;
      ctx.fillRect(0, 0, width, height);
      const pad6 = 20, gap6 = 15, fw6 = width - pad6*2, fh6 = (height - pad6*2 - gap6*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#fff5f7';
        ctx.beginPath();
        ctx.roundRect(pad6, pad6 + i*(fh6 + gap6), fw6, fh6, 8);
        ctx.fill();
        drawDummy(pad6 + 8, pad6 + 8 + i*(fh6 + gap6), fw6 - 16, fh6 - 16, i);
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
