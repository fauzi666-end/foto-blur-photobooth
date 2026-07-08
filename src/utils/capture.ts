export type PhotoboothTemplate = 
  | 'classic-strip-4'
  | 'classic-strip-3'
  | 'square-grid-2x2'
  | 'polaroid-strip'
  | 'film-strip-simple';

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

function drawClassicStrip4(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 25;
  const gap = 20;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawImageCover(ctx, images[i], x, y, frameWidth, frameHeight);
  }
}

function drawClassicStrip3(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 30;
  const gap = 25;
  const frameWidth = width - padding * 2;
  const frameHeight = (height - padding * 2 - gap * 2) / 3;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    drawImageCover(ctx, images[i], x, y, frameWidth, frameHeight);
  }
}

function drawSquareGrid2x2(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 30;
  const gap = 20;
  const frameSize = (width - padding * 2 - gap) / 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (frameSize + gap);
    const y = padding + row * (frameSize + gap);
    drawImageCover(ctx, images[i], x, y, frameSize, frameSize);
  }
}

function drawPolaroidStrip(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 25;
  const gap = 15;
  const polaroidWidth = (width - padding * 2 - gap * 2) / 3;
  const polaroidHeight = polaroidWidth * 1.3;
  const startY = (height - polaroidHeight) / 2;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = startY;
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(x, y, polaroidWidth, polaroidHeight);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    const photoSize = polaroidWidth - 20;
    drawImageCover(ctx, images[i], x + 10, y + 10, photoSize, photoSize);
  }
}

function drawFilmStripSimple(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 35;
  const frameWidth = (width - padding * 2) / 4;
  const frameHeight = height - padding * 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * frameWidth;
    const y = padding;
    drawImageCover(ctx, images[i], x + 8, y + 8, frameWidth - 16, frameHeight - 16);
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
    case 'classic-strip-3': width = 400; height = 650; break;
    case 'square-grid-2x2': width = 600; height = 600; break;
    case 'polaroid-strip': width = 800; height = 500; break;
    case 'film-strip-simple': width = 900; height = 400; break;
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
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const colors = ['#ffcdd2', '#bbdefb', '#c8e6c9', '#fff9c4', '#e1bee7'];

  const drawDummy = (x: number, y: number, w: number, h: number, idx: number) => {
    ctx.fillStyle = colors[idx % colors.length];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `${Math.min(w, h)/4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📷', x + w/2, y + h/2);
  };

  switch (template) {
    case 'classic-strip-4': {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
      const pad = 15, gap = 12, fw = width - pad*2, fh = (height - pad*2 - gap*3)/4;
      for (let i=0; i<4; i++) drawDummy(pad, pad + i*(fh+gap), fw, fh, i);
      break;
    }
    case 'classic-strip-3': {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
      const pad = 15, gap = 12, fw = width - pad*2, fh = (height - pad*2 - gap*2)/3;
      for (let i=0; i<3; i++) drawDummy(pad, pad + i*(fh+gap), fw, fh, i);
      break;
    }
    case 'square-grid-2x2': {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
      const pad = 15, gap = 10, fs = (width - pad*2 - gap)/2;
      for (let i=0; i<4; i++) {
        const r = Math.floor(i/2), c = i%2;
        drawDummy(pad + c*(fs+gap), pad + r*(fs+gap), fs, fs, i);
      }
      break;
    }
    case 'polaroid-strip': {
      ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0, 0, width, height);
      const pad = 15, gap = 10, pw = (width - pad*2 - gap*2)/3, ph = pw*1.3;
      const sy = (height - ph)/2;
      for (let i=0; i<3; i++) {
        const x = pad + i*(pw+gap), y = sy;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
        ctx.fillRect(x, y, pw, ph);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        drawDummy(x+8, y+8, pw-16, pw-16, i);
      }
      break;
    }
    case 'film-strip-simple': {
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, width, height);
      const pad = 15, fw = (width - pad*2)/4, fh = height - pad*2;
      for (let i=0; i<4; i++) drawDummy(pad + i*fw + 5, pad+5, fw-10, fh-10, i);
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
