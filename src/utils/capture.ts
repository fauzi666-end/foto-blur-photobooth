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

// Helper untuk membuat frame bayangan + border putih
function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  borderWidth: number = 8,
  borderRadius: number = 12
) {
  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  
  // White border
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, x, y, w, h, borderRadius);
  ctx.fill();
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Inner border
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 2;
  roundRect(ctx, x + borderWidth/2, y + borderWidth/2, w - borderWidth, h - borderWidth, borderRadius - 4);
  ctx.stroke();
}

// Helper untuk rounded rect
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper untuk menggambar stiker
function drawSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  sticker: string,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sticker, 0, 0);
  ctx.restore();
}

// Helper untuk polkadot background
function drawPolkaDotBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dotColor: string = 'rgba(255,105,180,0.25)',
  dotSize: number = 15,
  spacing: number = 40
) {
  ctx.fillStyle = dotColor;
  for (let row = 0; row < height/spacing + 1; row++) {
    for (let col = 0; col < width/spacing + 1; col++) {
      const offsetX = (row % 2) * (spacing/2);
      ctx.beginPath();
      ctx.arc(col * spacing + offsetX, row * spacing, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Template 1: Classic Strip 4 (Photobooth Asli)
function drawClassicStrip4(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  // Background gradient pink cantik
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#ffe4ec');
  bg.addColorStop(1, '#ffc9da');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(255,255,255,0.4)', 10, 35);
  
  const padding = 30;
  const gap = 25;
  const availableHeight = height - padding * 2;
  const frameHeight = (availableHeight - gap * 3) / 4;
  const frameWidth = width - padding * 2;
  
  // Draw frames
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 12, y + 12, frameWidth - 24, frameHeight - 24);
  }
  
  // Cute stickers
  drawSticker(ctx, 40, height - 40, 28, '❤️', -0.2);
  drawSticker(ctx, width - 40, 40, 28, '✨', 0.15);
  drawSticker(ctx, width/2, height - 35, 22, '💕', 0);
  drawSticker(ctx, 45, 45, 22, '😊', 0.1);
}

// Template 2: Grid 2x2
function drawGrid2x2(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(0, 0, width, height);
  
  // Decorative background
  const bg2 = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
  bg2.addColorStop(0, 'rgba(255,182,193,0.2)');
  bg2.addColorStop(1, 'rgba(255,218,185,0.2)');
  ctx.fillStyle = bg2;
  ctx.fillRect(0,0,width,height);
  
  const padding = 40;
  const gap = 30;
  const frameSize = (width - padding * 2 - gap) / 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (frameSize + gap);
    const y = padding + row * (frameSize + gap);
    
    drawPhotoFrame(ctx, x, y, frameSize, frameSize, 10, 16);
    drawImageCover(ctx, images[i], x + 14, y + 14, frameSize - 28, frameSize - 28);
  }
  
  // Corner decorations
  const cornerStickers = ['🌟','⭐','💫','✨'];
  cornerStickers.forEach((s,i) => {
    const cx = i%2===0 ? 35 : width-35;
    const cy = i<2 ? 35 : height-35;
    drawSticker(ctx, cx, cy, 32, s, (i-1.5)*0.2);
  });
}

// Template 3: Polaroid 3
function drawPolaroid3(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f0f8ff';
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(135,206,250,0.2)', 12, 45);
  
  const padding = 40;
  const gap = 35;
  const polaroidWidth = (width - padding * 2 - gap * 2) / 3;
  const polaroidHeight = polaroidWidth * 1.4;
  const startY = (height - polaroidHeight) / 2;
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const x = padding + i * (polaroidWidth + gap);
    const y = startY + (i === 1 ? 20 : (i === 0 ? -15 : -10));
    
    ctx.save();
    ctx.translate(x + polaroidWidth/2, y + polaroidHeight/2);
    ctx.rotate((i - 1) * 0.08);
    ctx.translate(-polaroidWidth/2, -polaroidHeight/2);
    
    // Polaroid frame
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,polaroidWidth,polaroidHeight);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 3;
    ctx.strokeRect(3,3,polaroidWidth-6,polaroidHeight-6);
    
    const photoSize = polaroidWidth - 24;
    const photoY = 16;
    ctx.fillStyle = '#333';
    ctx.fillRect(12, photoY, photoSize, photoSize);
    drawImageCover(ctx, images[i], 14, photoY + 2, photoSize - 4, photoSize - 4);
    
    ctx.restore();
  }
  
  // Bottom stickers
  drawSticker(ctx, width/2, height - 30, 30, '🎉', 0);
  drawSticker(ctx, 50, height - 35, 26, '📸', -0.15);
  drawSticker(ctx, width - 50, height - 35, 26, '🎈', 0.15);
}

// Template 4: Film Strip
function drawFilmStrip(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 40;
  const frameWidth = (width - padding * 2) / 5;
  const frameHeight = height - padding * 2;
  
  // Film perforations
  ctx.fillStyle = '#0f0f1a';
  for (let i = 0; i < 12; i++) {
    const y = padding + i * (frameHeight / 11);
    ctx.fillRect(padding - 14, y, 10, 10);
    ctx.fillRect(width - padding + 4, y, 10, 10);
  }
  
  for (let i = 0; i < Math.min(images.length, 5); i++) {
    const x = padding + i * frameWidth;
    const y = padding;
    
    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(x + 6, y, frameWidth - 12, frameHeight);
    drawImageCover(ctx, images[i], x + 12, y + 8, frameWidth - 24, frameHeight - 16);
  }
  
  // Film reel decorations
  drawSticker(ctx, 35, height/2, 35, '🎬', 0);
  drawSticker(ctx, width - 35, height/2, 35, '🎞️', 0);
}

// Template 5: Heart Shape
function drawHeartShape(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
  bg.addColorStop(0, '#fff0f5');
  bg.addColorStop(0.5, '#ffd6e0');
  bg.addColorStop(1, '#ffb6c1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(255,255,255,0.35)', 8, 32);
  
  const centerX = width/2;
  const centerY = height/2;
  const positions = [
    { x: centerX - 80, y: centerY - 100, size: 70 },
    { x: centerX + 10, y: centerY - 100, size: 70 },
    { x: centerX - 130, y: centerY - 30, size: 70 },
    { x: centerX - 40, y: centerY - 30, size: 70 },
    { x: centerX + 50, y: centerY - 30, size: 70 },
    { x: centerX - 90, y: centerY + 40, size: 70 },
    { x: centerX + 0, y: centerY + 40, size: 70 },
    { x: centerX - 40, y: centerY + 110, size: 70 },
  ];
  
  for (let i = 0; i < Math.min(images.length, positions.length); i++) {
    const pos = positions[i];
    // Circle frame
    ctx.beginPath();
    ctx.arc(pos.x + pos.size/2, pos.y + pos.size/2, pos.size/2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(pos.x + pos.size/2, pos.y + pos.size/2, pos.size/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], pos.x, pos.y, pos.size, pos.size);
    ctx.restore();
  }
  
  // Heart stickers around
  const heartStickers = ['❤️','💕','💖','💗','💓','💘'];
  heartStickers.forEach((s,i) => {
    const angle = (i / heartStickers.length) * Math.PI * 2;
    const r = 270;
    drawSticker(ctx, centerX + Math.cos(angle)*r, centerY + Math.sin(angle)*r, 32, s, angle*0.3);
  });
}

// Template 6: Diagonal
function drawDiagonal(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#e6f3ff');
  bg.addColorStop(0.5, '#f0f9ff');
  bg.addColorStop(1, '#e6f3ff');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  const padding = 50;
  const frameSize = 110;
  const maxPhotos = 5;
  
  for (let i = 0; i < Math.min(images.length, maxPhotos); i++) {
    const progress = i / (maxPhotos - 1);
    const x = padding + progress * (width - padding * 2 - frameSize);
    const y = padding + progress * (height - padding * 2 - frameSize);
    
    ctx.save();
    ctx.translate(x + frameSize/2, y + frameSize/2);
    ctx.rotate((i - 2) * 0.12);
    ctx.translate(-frameSize/2, -frameSize/2);
    
    drawPhotoFrame(ctx, 0, 0, frameSize, frameSize, 9, 14);
    drawImageCover(ctx, images[i], 13, 13, frameSize - 26, frameSize - 26);
    
    ctx.restore();
  }
  
  // Cloud & rainbow stickers
  drawSticker(ctx, 45, 45, 30, '☁️', -0.1);
  drawSticker(ctx, width - 50, height - 45, 35, '🌈', 0.15);
  drawSticker(ctx, width - 55, 50, 28, '☀️', 0.1);
  drawSticker(ctx, 55, height - 50, 28, '🦋', -0.15);
}

// Template 7: Circle Grid
function drawCircleGrid(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f0fff4';
  ctx.fillRect(0,0,width,height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(152,251,152,0.2)', 10, 40);
  
  const padding = 45;
  const circleSize = 95;
  const gap = 25;
  
  const positions: {x:number,y:number}[] = [];
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
    
    // Pastel circle background
    ctx.beginPath();
    ctx.arc(cx, cy, circleSize/2 + 10, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${i * 40 + 100}, 70%, 85%)`;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(cx, cy, circleSize/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], pos.x, pos.y, circleSize, circleSize);
    ctx.restore();
  }
  
  // Leaf stickers
  drawSticker(ctx, 35,35,32,'🌿',-0.15);
  drawSticker(ctx, width-35, height-35,32,'🌱',0.15);
}

// Template 8: Retro 35mm
function drawRetro35mm(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#2c1810';
  ctx.fillRect(0,0,width,height);
  
  const padding = 55;
  const frameWidth = (width - padding * 2 - 30) / 4;
  const frameHeight = frameWidth * 0.7;
  const centerY = height/2 - frameHeight/2;
  
  // Retro yellow border
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(padding - 8, centerY - 8, width - padding*2 + 16, frameHeight + 16);
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding + i * (frameWidth + 10);
    const y = centerY;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, frameWidth, frameHeight);
    drawImageCover(ctx, images[i], x + 7, y + 7, frameWidth - 14, frameHeight - 14);
    
    // Frame number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${i+1}`, x + frameWidth/2, y + frameHeight - 15);
  }
  
  // Retro stickers
  drawSticker(ctx, 40, centerY, 38, '🎸', 0);
  drawSticker(ctx, width - 40, centerY, 38, '🎵', 0);
}

// Template 9: Polaroid Fun
function drawPolaroidFun(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createLinearGradient(0,0,width,height);
  bg.addColorStop(0,'#fff5e6');
  bg.addColorStop(0.5,'#fffaf0');
  bg.addColorStop(1,'#fff5e6');
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,width,height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(255,182,193,0.2)', 11, 42);
  
  const centerX = width/2;
  const centerY = height/2;
  
  const polaroids = [
    { x: centerX - 165, y: centerY - 145, w: 135, h: 170, angle: -0.18 },
    { x: centerX + 15, y: centerY - 135, w: 135, h: 170, angle: 0.15 },
    { x: centerX - 105, y: centerY + 25, w: 135, h: 170, angle: 0.1 },
    { x: centerX + 60, y: centerY + 35, w: 135, h: 170, angle: -0.12 },
  ];
  
  for (let i = 0; i < Math.min(images.length, polaroids.length); i++) {
    const p = polaroids[i];
    ctx.save();
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    ctx.rotate(p.angle);
    ctx.translate(-p.w/2, -p.h/2);
    
    // Polaroid
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,p.w,p.h);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(3,3,p.w-6,p.h-6);
    
    const photoSize = p.w - 26;
    ctx.fillStyle = '#333';
    ctx.fillRect(13, 17, photoSize, photoSize);
    drawImageCover(ctx, images[i], 15, 19, photoSize - 4, photoSize - 4);
    
    ctx.restore();
  }
  
  // Party stickers
  const partyStickers = ['🎀','🎈','🎉','🎊'];
  partyStickers.forEach((s,i) => {
    const x = i%2===0 ? 45 : width-45;
    const y = i<2 ? 45 : height-45;
    drawSticker(ctx,x,y,34,s,(i-1.5)*0.25);
  });
}

// Template 10: Flower
function drawFlower(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  const bg = ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width/1.5);
  bg.addColorStop(0,'#fffacd');
  bg.addColorStop(1,'#ffd700');
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,width,height);
  
  const centerX = width/2;
  const centerY = height/2;
  const radius = 105;
  const circleSize = 75;
  
  // Center photo
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2 + 10, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize/2, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  if(images[0]) drawImageCover(ctx, images[0], centerX - circleSize/2, centerY - circleSize/2, circleSize, circleSize);
  ctx.restore();
  
  // Petals
  for (let i = 1; i < Math.min(images.length, 7); i++) {
    const angle = ((i - 1) / 6) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(x, y, circleSize/2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8dc';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(x, y, circleSize/2, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, images[i], x - circleSize/2, y - circleSize/2, circleSize, circleSize);
    ctx.restore();
  }
  
  // Flower stickers
  const flowerStickers = ['🌸','🌺','🌻','🌷','🌹','💐'];
  flowerStickers.forEach((s,i) => {
    const angle = (i / flowerStickers.length) * Math.PI * 2 + Math.PI/6;
    const r = 260;
    drawSticker(ctx, centerX + Math.cos(angle)*r, centerY + Math.sin(angle)*r, 35, s, angle*0.25);
  });
}

// Template 11: Vintage
function drawVintage(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(0,0,width,height);
  drawPolkaDotBackground(ctx, width, height, 'rgba(139,69,19,0.18)', 10, 40);
  
  // Vintage border
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 18;
  ctx.strokeRect(15,15,width-30,height-30);
  
  ctx.strokeStyle = '#a0522d';
  ctx.lineWidth = 6;
  ctx.strokeRect(30,30,width-60,height-60);
  
  const padding = 65;
  const gap = 25;
  const frameWidth = (width - padding * 2 - gap) / 2;
  const frameHeight = (height - padding * 2 - gap) / 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = padding + col * (frameWidth + gap);
    const y = padding + row * (frameHeight + gap);
    
    drawPhotoFrame(ctx, x, y, frameWidth, frameHeight, 12, 8);
    drawImageCover(ctx, images[i], x + 16, y + 16, frameWidth - 32, frameHeight - 32);
  }
  
  // Vintage stickers
  drawSticker(ctx, 50, 50, 35, '☕', -0.1);
  drawSticker(ctx, width-50,50,35,'📜',0.1);
  drawSticker(ctx,50,height-50,35,'🎞️',-0.1);
  drawSticker(ctx,width-50,height-50,35,'📻',0.1);
}

// Template 12: Modern Minimal
function drawModernMinimal(ctx: CanvasRenderingContext2D, images: HTMLImageElement[], width: number, height: number) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0,0,width,height);
  
  // Subtle grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  for(let i=0;i<width;i+=40){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,height); ctx.stroke(); }
  for(let i=0;i<height;i+=40){ ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(width,i); ctx.stroke(); }
  
  const padding = 45;
  const gap = 20;
  const frameHeight = (height - padding * 2 - gap * 3) / 4;
  const frameWidth = width - padding * 2;
  
  for (let i = 0; i < Math.min(images.length, 4); i++) {
    const x = padding;
    const y = padding + i * (frameHeight + gap);
    
    // Minimalist frame
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(x,y,frameWidth,frameHeight);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(x+3,y+3,frameWidth-6,frameHeight-6);
    
    drawImageCover(ctx, images[i], x+6, y+6, frameWidth-12, frameHeight-12);
    
    // Frame number
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`0${i+1}`, x + 15, y + 38);
  }
  
  // Minimalist decorations
  const minStickers = ['✦','◆','●','▲'];
  minStickers.forEach((s,i) => {
    drawSticker(ctx, width - 40, padding + i*(frameHeight+gap) + frameHeight/2, 24, s, 0);
  });
}

export async function buildPhotoboothStrip(
  frames: string[],
  template: PhotoboothTemplate,
) {
  let width = 600;
  let height = 900;

  switch (template) {
    case 'classic-strip-4': width = 420; height = 850; break;
    case 'grid-2x2': width = 700; height = 700; break;
    case 'polaroid-3': width = 900; height = 550; break;
    case 'film-strip': width = 900; height = 420; break;
    case 'heart-shape': width = 720; height = 720; break;
    case 'diagonal': width = 820; height = 620; break;
    case 'circle-grid': width = 720; height = 720; break;
    case 'retro-35mm': width = 900; height = 420; break;
    case 'polaroid-fun': width = 720; height = 720; break;
    case 'flower': width = 720; height = 720; break;
    case 'vintage': width = 720; height = 720; break;
    case 'modern-minimal': width = 500; height = 880; break;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const images = await Promise.all(frames.map(loadImage));

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

// Template Preview
export function buildTemplatePreview(template: PhotoboothTemplate): string {
  const canvas = document.createElement('canvas');
  let width = 220;
  let height = 300;

  switch (template) {
    case 'grid-2x2':
    case 'heart-shape':
    case 'circle-grid':
    case 'polaroid-fun':
    case 'flower':
    case 'vintage':
      width = 220; height = 220; break;
    case 'polaroid-3':
    case 'film-strip':
    case 'retro-35mm':
      width = 300; height = 150; break;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const colors = ['#ffb3ba','#ffdfba','#ffffba','#baffc9','#bae1ff','#e0bbff','#d4a5ff','#ffd4a3'];

  const drawDummyPhoto = (x: number, y: number, w: number, h: number, colorIndex: number, isCircle: boolean = false) => {
    ctx.fillStyle = colors[colorIndex % colors.length];
    if(isCircle) {
      ctx.beginPath();
      ctx.arc(x + w/2, y + h/2, Math.min(w,h)/2, 0, Math.PI*2);
      ctx.fill();
    } else {
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${Math.min(w,h)/3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📷', x + w/2, y + h/2);
  };

  // Draw preview based on template
  switch (template) {
    case 'classic-strip-4': {
      const bg = ctx.createLinearGradient(0,0,0,height);
      bg.addColorStop(0,'#ffe4ec'); bg.addColorStop(1,'#ffc9da');
      ctx.fillStyle = bg; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(255,255,255,0.35)',7,28);
      const pad = 20, gap = 18, fh = (height - pad*2 - gap*3)/4, fw = width - pad*2;
      for(let i=0;i<4;i++) {
        drawPhotoFrame(ctx, pad, pad + i*(fh+gap), fw, fh, 6, 10);
        drawDummyPhoto(pad+8, pad+8+i*(fh+gap), fw-16, fh-16, i);
      }
      drawSticker(ctx,30,height-25,20,'❤️',-0.15);
      drawSticker(ctx,width-30,25,20,'✨',0.1);
      break;
    }
    case 'grid-2x2': {
      ctx.fillStyle = '#fff8e7'; ctx.fillRect(0,0,width,height);
      const pad = 25, gap = 20, fs = (width-pad*2 - gap)/2;
      for(let i=0;i<4;i++) {
        const r = Math.floor(i/2), c = i%2;
        drawPhotoFrame(ctx, pad + c*(fs+gap), pad + r*(fs+gap), fs, fs,7,12);
        drawDummyPhoto(pad+9 + c*(fs+gap), pad+9 + r*(fs+gap), fs-18, fs-18, i);
      }
      ['🌟','⭐','💫','✨'].forEach((s,i)=>{
        const cx = i%2===0 ? 25 : width-25;
        const cy = i<2 ? 25 : height-25;
        drawSticker(ctx,cx,cy,22,s,(i-1.5)*0.2);
      });
      break;
    }
    case 'polaroid-3': {
      ctx.fillStyle = '#f0f8ff'; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(135,206,250,0.2)',9,35);
      const pad = 25, gap = 20, pw = (width-pad*2 - gap*2)/3, ph = pw*1.4;
      const sy = (height-ph)/2;
      for(let i=0;i<3;i++) {
        const x = pad + i*(pw+gap);
        const y = sy + (i===1?12:(i===0?-10:-8));
        ctx.save(); ctx.translate(x+pw/2,y+ph/2); ctx.rotate((i-1)*0.07); ctx.translate(-pw/2,-ph/2);
        ctx.fillStyle = '#fff'; ctx.fillRect(0,0,pw,ph);
        const ps = pw-20;
        drawDummyPhoto(10,14,ps,ps,i);
        ctx.restore();
      }
      drawSticker(ctx,width/2,height-22,24,'🎉',0);
      break;
    }
    case 'film-strip': {
      ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,width,height);
      const pad = 30, fw = (width-pad*2)/5, fh = height-pad*2;
      for(let i=0;i<5;i++) {
        const x = pad + i*fw;
        ctx.fillStyle = '#2d2d44'; ctx.fillRect(x+4,pad,fw-8,fh);
        drawDummyPhoto(x+8, pad+6, fw-16, fh-12, i);
      }
      drawSticker(ctx,28,height/2,28,'🎬',0);
      drawSticker(ctx,width-28,height/2,28,'🎞️',0);
      break;
    }
    case 'heart-shape': {
      const bg = ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width/1.5);
      bg.addColorStop(0,'#fff0f5'); bg.addColorStop(1,'#ffb6c1');
      ctx.fillStyle = bg; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(255,255,255,0.3)',6,28);
      const cx=width/2, cy=height/2;
      const pos=[{x:cx-60,y:cy-70,s:50},{x:cx+10,y:cy-70,s:50},{x:cx-95,y:cy-20,s:50},{x:cx-30,y:cy-20,s:50},{x:cx+35,y:cy-20,s:50},{x:cx-65,y:cy+30,s:50},{x:cx+5,y:cy+30,s:50},{x:cx-30,y:cy+80,s:50}];
      pos.forEach((p,i)=>{
        ctx.beginPath(); ctx.arc(p.x+p.s/2,p.y+p.s/2,p.s/2+5,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
        drawDummyPhoto(p.x,p.y,p.s,p.s,i,true);
      });
      ['❤️','💕','💖'].forEach((s,i)=>drawSticker(ctx,22+i*70,22,18,s,0));
      break;
    }
    case 'diagonal': {
      const bg = ctx.createLinearGradient(0,0,width,height);
      bg.addColorStop(0,'#e6f3ff'); bg.addColorStop(1,'#f0f9ff');
      ctx.fillStyle = bg; ctx.fillRect(0,0,width,height);
      const pad=35, fs=85;
      for(let i=0;i<5;i++) {
        const p = i/4, x=pad+p*(width-pad*2 - fs), y=pad+p*(height-pad*2 - fs);
        ctx.save(); ctx.translate(x+fs/2,y+fs/2); ctx.rotate((i-2)*0.1); ctx.translate(-fs/2,-fs/2);
        drawPhotoFrame(ctx,0,0,fs,fs,6,10);
        drawDummyPhoto(9,9,fs-18,fs-18,i);
        ctx.restore();
      }
      drawSticker(ctx,30,30,22,'☁️',-0.1);
      drawSticker(ctx,width-35,height-30,24,'🌈',0.12);
      break;
    }
    case 'circle-grid': {
      ctx.fillStyle = '#f0fff4'; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(152,251,152,0.2)',7,32);
      const pad=30, cs=70, gap=18;
      for(let r=0;r<3;r++) for(let c=0;c<3;c++) {
        const i=r*3+c, x=pad + c*(cs+gap), y=pad + r*(cs+gap);
        ctx.beginPath(); ctx.arc(x+cs/2,y+cs/2,cs/2+6,0,Math.PI*2);
        ctx.fillStyle = `hsl(${i*40+100},70%,85%)`; ctx.fill();
        drawDummyPhoto(x,y,cs,cs,i,true);
      }
      drawSticker(ctx,28,28,24,'🌿',-0.1);
      drawSticker(ctx,width-28,height-28,24,'🌱',0.1);
      break;
    }
    case 'retro-35mm': {
      ctx.fillStyle = '#2c1810'; ctx.fillRect(0,0,width,height);
      const pad=38, fw=(width-pad*2 - 25)/4, fh=fw*0.7, cy=height/2 - fh/2;
      ctx.fillStyle='#ffd700'; ctx.fillRect(pad-6, cy-6, width-pad*2 +12, fh+12);
      for(let i=0;i<4;i++) {
        const x=pad + i*(fw+8);
        ctx.fillStyle='#000'; ctx.fillRect(x,cy,fw,fh);
        drawDummyPhoto(x+5, cy+5, fw-10, fh-10, i);
      }
      drawSticker(ctx,28,height/2,28,'🎸',0);
      drawSticker(ctx,width-28,height/2,28,'🎵',0);
      break;
    }
    case 'polaroid-fun': {
      const bg=ctx.createLinearGradient(0,0,width,height);
      bg.addColorStop(0,'#fff5e6'); bg.addColorStop(1,'#fffaf0');
      ctx.fillStyle=bg; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(255,182,193,0.2)',8,35);
      const cx=width/2, cy=height/2;
      const pols = [
        {x:cx-108,y:cy-92,w:90,h:112,a:-0.15},
        {x:cx+12,y:cy-85,w:90,h:112,a:0.12},
        {x:cx-70,y:cy+18,w:90,h:112,a:0.08},
        {x:cx+40,y:cy+25,w:90,h:112,a:-0.1}
      ];
      pols.forEach((p,i)=>{
        ctx.save(); ctx.translate(p.x+p.w/2,p.y+p.h/2); ctx.rotate(p.a); ctx.translate(-p.w/2,-p.h/2);
        ctx.fillStyle='#fff'; ctx.fillRect(0,0,p.w,p.h);
        drawDummyPhoto(9,12,p.w-18,p.w-18,i);
        ctx.restore();
      });
      ['🎀','🎈'].forEach((s,i)=>drawSticker(ctx,30+i*(width-60),30,24,s,(i-0.5)*0.2));
      break;
    }
    case 'flower': {
      const bg=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width/1.5);
      bg.addColorStop(0,'#fffacd'); bg.addColorStop(1,'#ffd700');
      ctx.fillStyle=bg; ctx.fillRect(0,0,width,height);
      const cx=width/2, cy=height/2, r=75, cs=55;
      ctx.beginPath(); ctx.arc(cx,cy,cs/2+6,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
      drawDummyPhoto(cx-cs/2, cy-cs/2, cs, cs,0,true);
      for(let i=1;i<7;i++) {
        const a=(i-1)/6*Math.PI*2, x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
        ctx.beginPath(); ctx.arc(x,y,cs/2+5,0,Math.PI*2); ctx.fillStyle='#fff8dc'; ctx.fill();
        drawDummyPhoto(x-cs/2, y-cs/2, cs, cs,i,true);
      }
      ['🌸','🌺','🌻'].forEach((s,i)=>drawSticker(ctx,28+i*70,26,22,s,0));
      break;
    }
    case 'vintage': {
      ctx.fillStyle='#f5f5dc'; ctx.fillRect(0,0,width,height);
      drawPolkaDotBackground(ctx,width,height,'rgba(139,69,19,0.15)',7,32);
      ctx.strokeStyle='#8b4513'; ctx.lineWidth=14; ctx.strokeRect(12,12,width-24,height-24);
      ctx.strokeStyle='#a0522d'; ctx.lineWidth=5; ctx.strokeRect(24,24,width-48,height-48);
      const pad=45, gap=18, fw=(width-pad*2 - gap)/2, fh=(height-pad*2 - gap)/2;
      for(let i=0;i<4;i++) {
        const r=Math.floor(i/2), c=i%2, x=pad+c*(fw+gap), y=pad+r*(fh+gap);
        drawPhotoFrame(ctx,x,y,fw,fh,9,6);
        drawDummyPhoto(x+12,y+12,fw-24,fh-24,i);
      }
      drawSticker(ctx,35,35,24,'☕',-0.1);
      break;
    }
    case 'modern-minimal': {
      ctx.fillStyle='#fafafa'; ctx.fillRect(0,0,width,height);
      const pad=30, gap=15, fh=(height-pad*2 - gap*3)/4, fw=width-pad*2;
      for(let i=0;i<4;i++) {
        const x=pad, y=pad + i*(fh+gap);
        ctx.fillStyle='#fff'; ctx.fillRect(x,y,fw,fh);
        drawDummyPhoto(x+5,y+5,fw-10,fh-10,i);
      }
      ['✦','◆','●','▲'].forEach((s,i)=>drawSticker(ctx,width-28, pad+i*(fh+gap)+fh/2, 18,s,0));
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
