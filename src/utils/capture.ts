export type PhotoboothTemplate = 
  | 'classic-strip-4'
  | 'classic-strip-3'
  | 'square-grid-2x2'
  | 'polaroid-strip'
  | 'film-strip-simple'
  | 'pastel-dream'
  | 'polaroid-funky'
  | 'heart-strip'
  | 'retro-pink'
  | 'flower-frame'
  | 'neon-border'
  | 'polaroid-party';

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
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
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
  ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 12);
  ctx.stroke();
}

function drawDotsBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  size: number = 6
) {
  ctx.fillStyle = color;
  for (let y = 0; y < height; y += size * 4) {
    for (let x = 0; x < width; x += size * 4) {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawStarBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
) {
  ctx.fillStyle = color;
  const stars = [
    [20, 20], [width - 30, 30], [width / 2, 25],
    [40, height - 40], [width - 50, height - 30],
  ];
  stars.forEach(([x, y]) => {
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', x, y);
  });
}

function drawClassicStrip4(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#fff0f5);
  bg.addColorStop(1, '#ffe4ec');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(244, 114, 182, 0.15)');
  
  const padding = 30;
  const gap = 20;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
  
  ['❤️', '✨', '💕', '😊'].forEach((s, i) => {
    drawStarBackground(ctx, width, height, 'rgba(244, 114, 182, 0.3)');
  });
}

function drawClassicStrip3(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fffaf5';
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(255, 187, 120, 0.18)');
  
  const padding = 30;
  const gap = 25;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 2) / 3;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#fff');
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
}

function drawSquareGrid2x2(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(96, 165, 250, 0.15)');
  
  const padding = 35;
  const gap = 25;
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
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(168, 85, 247, 0.12)');
  
  const padding = 30;
  const gap = 20;
  const polaroidWidth = (width - padding * 2 - gap * 2) / 3;
  const polaroidHeight = polaroidWidth * 1.35;
  const startY = (height - polaroidHeight) / 2;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = startY + (i === 1 ? 15 : (i === 0 ? -10 : 5));
    
    ctx.save();
    ctx.translate(x + polaroidWidth/2, y + polaroidHeight/2);
    ctx.rotate((i - 1) * 0.08);
    ctx.translate(-polaroidWidth/2, -polaroidHeight/2);
    
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.roundRect(0, 0, polaroidWidth, polaroidHeight, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    const photoSize = polaroidWidth - 20;
    drawImageCover(ctx, images[i], 10, 12, photoSize, photoSize);
    ctx.restore();
  }
}

function drawFilmStripSimple(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 40;
  const frameWidth = (width - padding * 2) / 4;
  const frameHeight = height - padding * 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * frameWidth;
    const y = padding;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(x + 5, y + 5, frameWidth - 10, frameHeight - 10, 6);
    ctx.fill();
    drawImageCover(ctx, images[i], x + 10, y + 10, frameWidth - 20, frameHeight - 20);
  }
  
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(15 + i * (frameWidth/2), height/2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 15 - i * (frameWidth/2), height/2, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPastelDream(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#fef3c7');
  bg.addColorStop(0.5, '#fbcfe8');
  bg.addColorStop(1, '#ddd6fe');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  const padding = 35;
  const gap = 18;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#ffffff');
    drawImageCover(ctx, images[i], x + 14, y + 14, frameWidth - 28, frameHeight - 28);
  }
}

function drawPolaroidFunky(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 40;
  const sizes = [
    { x: padding, y: 40, w: 200, h: 200, r: -0.1 },
    { x: width/2 - 90, y: 70, w: 180, h: 180, r: 0.08 },
    { x: width - 220, y: height - 240, w: 180, h: 180, r: -0.06 },
    { x: 60, y: height - 250, w: 190, h: 190, r: 0.12 }
  ];
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const s = sizes[i];
    ctx.save();
    ctx.translate(s.x + s.w/2, s.y + s.h/2);
    ctx.rotate(s.r);
    ctx.translate(-s.w/2, -s.h/2);
    drawPhotoFrame(ctx, 0, 0, s.w, s.h, ['#fbbf24', '#34d399', '#f472b6', '#60a5fa'][i]);
    drawImageCover(ctx, images[i], 14, 14, s.w - 28, s.h - 28);
    ctx.restore();
  }
}

function drawHeartStrip(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#fce7f3');
  bg.addColorStop(1, '#fbcfe8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(236, 72, 153, 0.18)');
  
  const padding = 30;
  const gap = 20;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#fff');
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
  
  const hearts = ['❤️', '💕', '💖', '💗', '💘', '💓'];
  hearts.forEach((s, i) => {
    const angle = (i / hearts.length) * Math.PI * 2;
    const r = 100;
    const cx = width/2 + Math.cos(angle) * r;
    const cy = height/2 + Math.sin(angle) * r;
    drawStarBackground(ctx, width, height, 'rgba(244, 114, 182, 0.25)');
  });
}

function drawRetroPink(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, 0);
  bg.addColorStop(0, '#fecaca');
  bg.addColorStop(0.5, '#fed7aa');
  bg.addColorStop(1, '#fef3c7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  const padding = 35;
  const gap = 20;
  const frameWidth = (width - padding * 2 - gap) / 2;
  const frameHeight = (height - padding * 2 - gap) / 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (frameWidth + gap);
    const y = padding + row * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#fff');
    drawImageCover(ctx, images[i], x + 14, y + 14, frameWidth - 28, frameHeight - 28);
  }
}

function drawFlowerFrame(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fdf2f8';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width/2;
  const centerY = height/2;
  const radius = 120;
  const circleSize = 85;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2 + 10, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  if (images[0]) drawImageCover(ctx, images[0], centerX - circleSize/2, centerY - circleSize/2, circleSize, circleSize);
  ctx.restore();
  
  for (let i = 1; i < Math.min(images.length, 7); i++) {
    const angle = ((i - 1) / 6) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(x, y, circleSize/2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, circleSize/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], x - circleSize/2, y - circleSize/2, circleSize, circleSize);
    ctx.restore();
  }
}

function drawNeonBorder(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.strokeRect(15, 15, width - 30, height - 30);
  
  const padding = 40;
  const gap = 20;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, '#1e293b');
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
}

function drawPolaroidParty(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
  bg.addColorStop(0, '#fef3c7');
  bg.addColorStop(1, '#fed7aa');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawDotsBackground(ctx, width, height, 'rgba(234, 179, 8, 0.18)');
  
  const padding = 30;
  const gap = 25;
  const polaroidWidth = (width - padding * 2 - gap * 3) / 4;
  const polaroidHeight = polaroidWidth * 1.35;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = (height - polaroidHeight) / 2 + (i % 2 === 0 ? -20 : 20);
    
    ctx.save();
    ctx.translate(x + polaroidWidth/2, y + polaroidHeight/2);
    ctx.rotate((i - 1.5) * 0.09);
    ctx.translate(-polaroidWidth/2, -polaroidHeight/2);
    drawPhotoFrame(ctx, 0, 0, polaroidWidth, polaroidHeight, '#fff');
    drawImageCover(ctx, images[i], 12, 14, polaroidWidth - 24, polaroidWidth - 24);
    ctx.restore();
  }
}

export async function buildPhotoboothStrip(
  frames: string[],
  template: PhotoboothTemplate,
) {
  let width = 400;
  let height = 800;

  switch (template) {
    case 'classic-strip-4': width = 400; height = 800; break;
    case 'classic-strip-3': width = 400; height = 680; break;
    case 'square-grid-2x2': width = 650; height = 650; break;
    case 'polaroid-strip': width = 850; height = 520; break;
    case 'film-strip-simple': width = 900; height = 400; break;
    case 'pastel-dream': width = 400; height = 800; break;
    case 'polaroid-funky': width = 650; height = 650; break;
    case 'heart-strip': width = 400; height = 800; break;
    case 'retro-pink': width = 650; height = 650; break;
    case 'flower-frame': width = 700; height = 700; break;
    case 'neon-border': width = 400; height = 800; break;
    case 'polaroid-party': width = 850; height = 520; break;
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
    case 'pastel-dream': drawPastelDream(context, images, width, height); break;
    case 'polaroid-funky': drawPolaroidFunky(context, images, width, height); break;
    case 'heart-strip': drawHeartStrip(context, images, width, height); break;
    case 'retro-pink': drawRetroPink(context, images, width, height); break;
    case 'flower-frame': drawFlowerFrame(context, images, width, height); break;
    case 'neon-border': drawNeonBorder(context, images, width, height); break;
    case 'polaroid-party': drawPolaroidParty(context, images, width, height); break;
    default: drawClassicStrip4(context, images, width, height);
  }

  return canvas;
}

export function buildTemplatePreview(template: PhotoboothTemplate): string {
  const canvas = document.createElement('canvas');
  let width = 200;
  let height = 300;

  switch (template) {
    case 'classic-strip-4': width = 200; height = 320; break;
    case 'classic-strip-3': width = 200; height = 260; break;
    case 'square-grid-2x2': width = 200; height = 200; break;
    case 'polaroid-strip': width = 280; height = 160; break;
    case 'film-strip-simple': width = 280; height = 120; break;
    case 'pastel-dream': width = 200; height = 320; break;
    case 'polaroid-funky': width = 200; height = 200; break;
    case 'heart-strip': width = 200; height = 320; break;
    case 'retro-pink': width = 200; height = 200; break;
    case 'flower-frame': width = 200; height = 200; break;
    case 'neon-border': width = 200; height = 320; break;
    case 'polaroid-party': width = 280; height = 160; break;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const colors = ['#ffcdd2', '#bbdefb', '#c8e6c9', '#fff9c4', '#e1bee7', '#fecaca'];

  const drawDummy = (x: number, y: number, w: number, h: number, idx: number) => {
    ctx.fillStyle = colors[idx % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `${Math.min(w, h)/4}px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📷', x + w/2, y + h/2);
  };

  switch (template) {
    case 'classic-strip-4':
      const bg1 = ctx.createLinearGradient(0, 0, 0, height);
      bg1.addColorStop(0, '#fff0f5');
      bg1.addColorStop(1, '#ffe4ec');
      ctx.fillStyle = bg1;
      ctx.fillRect(0, 0, width, height);
      const pad1 = 15, gap1 = 12, fw1 = width - pad1*2, fh1 = (height - pad1*2 - gap1*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(pad1, pad1 + i*(fh1 + gap1), fw1, fh1, 8);
        ctx.fill();
        drawDummy(pad1 + 6, pad1 + 6 + i*(fh1 + gap1), fw1 - 12, fh1 - 12, i);
      }
      break;

    case 'classic-strip-3':
      ctx.fillStyle = '#fffaf5';
      ctx.fillRect(0, 0, width, height);
      const pad2 = 15, gap2 = 12, fw2 = width - pad2*2, fh2 = (height - pad2*2 - gap2*2)/3;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(pad2, pad2 + i*(fh2 + gap2), fw2, fh2, 8);
        ctx.fill();
        drawDummy(pad2 + 6, pad2 + 6 + i*(fh2 + gap2), fw2 - 12, fh2 - 12, i);
      }
      break;

    case 'square-grid-2x2':
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, width, height);
      const pad3 = 15, gap3 = 10, fs3 = (width - pad3*2 - gap3)/2;
      for (let i = 0; i < 4; i++) {
        const r = Math.floor(i / 2), c = i % 2;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(pad3 + c*(fs3 + gap3), pad3 + r*(fs3 + gap3), fs3, fs3, 8);
        ctx.fill();
        drawDummy(pad3 + 6 + c*(fs3 + gap3), pad3 + 6 + r*(fs3 + gap3), fs3 - 12, fs3 - 12, i);
      }
      break;

    case 'polaroid-strip':
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
      const pad4 = 15, gap4 = 10, pw4 = (width - pad4*2 - gap4*2)/3, ph4 = pw4 * 1.35;
      const sy4 = (height - ph4)/2;
      for (let i = 0; i < 3; i++) {
        const x = pad4 + i*(pw4 + gap4), y = sy4 + (i === 1 ? 8 : (i === 0 ? -5 : 3));
        ctx.save();
        ctx.translate(x + pw4/2, y + ph4/2);
        ctx.rotate((i - 1) * 0.06);
        ctx.translate(-pw4/2, -ph4/2);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(0, 0, pw4, ph4, 6);
        ctx.fill();
        const ps4 = pw4 - 16;
        drawDummy(8, 10, ps4, ps4, i);
        ctx.restore();
      }
      break;

    case 'film-strip-simple':
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
      const pad5 = 15, fw5 = (width - pad5*2)/4, fh5 = height - pad5*2;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.roundRect(pad5 + i*fw5 + 4, pad5 + 4, fw5 - 8, fh5 - 8, 4);
        ctx.fill();
        drawDummy(pad5 + i*fw5 + 8, pad5 + 8, fw5 - 16, fh5 - 16, i);
      }
      break;

    case 'pastel-dream':
      const bg6 = ctx.createLinearGradient(0, 0, width, height);
      bg6.addColorStop(0, '#fef3c7');
      bg6.addColorStop(0.5, '#fbcfe8');
      bg6.addColorStop(1, '#ddd6fe');
      ctx.fillStyle = bg6;
      ctx.fillRect(0, 0, width, height);
      const pad6 = 15, gap6 = 12, fw6 = width - pad6*2, fh6 = (height - pad6*2 - gap6*3)/4;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(pad6, pad6 + i*(fh6 + gap6), fw6, fh6, 8);
        ctx.fill();
        drawDummy(pad6 + 6, pad6 + 6 + i*(fh6 + gap6), fw6 - 12, fh6 - 12, i);
      }
      break;

    case 'polaroid-funky':
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      const funky = [
        {x:10, y:15, w:130, h:130, r:-0.08},
        {x:80, y:30, w:110, h:110, r:0.06},
        {x:70, y:90, w:120, h:120, r:-0.05},
        {x:15, y:100, w:100, h:100, r:0.09}
      ];
      for (let i=0; i<4; i++) {
        const f = funky[i];
        ctx.save();
        ctx.translate(f.x + f.w/2, f.y + f.h/2);
        ctx.rotate(f.r);
        ctx.translate(-f.w/2, -f.h/2);
        ctx.fillStyle = ['#fbbf24', '#34d399', '#f472b6', '#60a5fa'][i];
        ctx.beginPath();
        ctx.roundRect(0,0,f.w,f.h,8);
        ctx.fill();
        drawDummy(8,8,f.w-16,f.h-16,i);
        ctx.restore();
      }
      break;

    case 'heart-strip':
      const bg8 = ctx.createLinearGradient(0,0,0,height);
      bg8.addColorStop(0,'#fce7f3');
      bg8.addColorStop(1,'#fbcfe8');
      ctx.fillStyle = bg8;
      ctx.fillRect(0,0,width,height);
      const pad8 =15, gap8=12, fw8=width-pad8*2, fh8=(height-pad8*2 - gap8*3)/4;
      for (let i=0; i<4; i++) {
        ctx.fillStyle='#fff';
        ctx.beginPath();
        ctx.roundRect(pad8, pad8+i*(fh8+gap8), fw8, fh8,8);
        ctx.fill();
        drawDummy(pad8+6, pad8+6+i*(fh8+gap8), fw8-12, fh8-12, i);
      }
      break;

    case 'retro-pink':
      const bg9 = ctx.createLinearGradient(0,0,width,0);
      bg9.addColorStop(0,'#fecaca');
      bg9.addColorStop(0.5,'#fed7aa');
      bg9.addColorStop(1,'#fef3c7');
      ctx.fillStyle=bg9;
      ctx.fillRect(0,0,width,height);
      const pad9=15, gap9=10, fs9=(width-pad9*2 - gap9)/2, fh9=(height-pad9*2 - gap9)/2;
      for (let i=0; i<4; i++) {
        const r=Math.floor(i/2), c=i%2;
        ctx.fillStyle='#fff';
        ctx.beginPath();
        ctx.roundRect(pad9 + c*(fs9+gap9), pad9 + r*(fh9+gap9), fs9, fh9,8);
        ctx.fill();
        drawDummy(pad9+6 + c*(fs9+gap9), pad9+6 + r*(fh9+gap9), fs9-12, fh9-12, i);
      }
      break;

    case 'flower-frame':
      ctx.fillStyle='#fdf2f8';
      ctx.fillRect(0,0,width,height);
      const cx10=width/2, cy10=height/2, r10=60, cs10=40;
      ctx.fillStyle='#fff';
      ctx.beginPath();
      ctx.arc(cx10, cy10, cs10/2+4, 0, Math.PI*2);
      ctx.fill();
      drawDummy(cx10 - cs10/2, cy10 - cs10/2, cs10, cs10, 0);
      for (let i=1; i<7; i++) {
        const a = (i-1)/6*Math.PI*2;
        const x=cx10 + Math.cos(a)*r10;
        const y=cy10 + Math.sin(a)*r10;
        ctx.fillStyle='#fff';
        ctx.beginPath();
        ctx.arc(x,y,cs10/2+3,0,Math.PI*2);
        ctx.fill();
        drawDummy(x - cs10/2, y - cs10/2, cs10, cs10, i);
      }
      break;

    case 'neon-border':
      ctx.fillStyle='#0f172a';
      ctx.fillRect(0,0,width,height);
      ctx.strokeStyle='#f472b6';
      ctx.lineWidth=3;
      ctx.strokeRect(5,5,width-10,height-10);
      ctx.strokeStyle='#60a5fa';
      ctx.lineWidth=1.5;
      ctx.strokeRect(8,8,width-16,height-16);
      const pad11=15, gap11=10, fw11=width-pad11*2, fh11=(height-pad11*2 - gap11*3)/4;
      for (let i=0; i<4; i++) {
        ctx.fillStyle='#1e293b';
        ctx.beginPath();
        ctx.roundRect(pad11, pad11+i*(fh11+gap11), fw11, fh11,6);
        ctx.fill();
        drawDummy(pad11+6, pad11+6+i*(fh11+gap11), fw11-12, fh11-12, i);
      }
      break;

    case 'polaroid-party':
      const bg12 = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
      bg12.addColorStop(0,'#fef3c7');
      bg12.addColorStop(1,'#fed7aa');
      ctx.fillStyle=bg12;
      ctx.fillRect(0,0,width,height);
      const pad12=12, gap12=8, pw12=(width-pad12*2 - gap12*3)/4, ph12=pw12*1.35;
      for (let i=0; i<4; i++) {
        const x=pad12+i*(pw12+gap12);
        const y=(height-ph12)/2 + (i%2===0?-10:10);
        ctx.save();
        ctx.translate(x+pw12/2, y+ph12/2);
        ctx.rotate((i-1.5)*0.07);
        ctx.translate(-pw12/2, -ph12/2);
        ctx.fillStyle='#fff';
        ctx.beginPath();
        ctx.roundRect(0,0,pw12,ph12,6);
        ctx.fill();
        drawDummy(8,10,pw12-16,pw12-16,i);
        ctx.restore();
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
