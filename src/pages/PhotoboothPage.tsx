import { useEffect, useMemo, useState } from 'react';
import { Aperture, Download, Printer, RefreshCcw, TimerReset } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { CameraStage } from '@/components/CameraStage';
import { ControlPanel } from '@/components/ControlPanel';
import { Field } from '@/components/Field';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import {
  buildPhotoboothStrip,
  captureVideoFrame,
  downloadDataUrl,
  type PhotoboothTemplate,
  buildTemplatePreview,
} from '@/utils/capture';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const TEMPLATES: {
  value: PhotoboothTemplate;
  label: string;
  desc: string;
  recommendedFrames: number;
}[] = [
  { value: 'classic-strip-4', label: 'Classic Strip 4', desc: 'Strip vertikal 4 frame (photobooth asli)', recommendedFrames: 4 },
  { value: 'classic-strip-3', label: 'Classic Strip 3', desc: 'Strip vertikal 3 frame', recommendedFrames: 3 },
  { value: 'square-grid-2x2', label: 'Square Grid 2x2', desc: 'Layout kotak 4 frame', recommendedFrames: 4 },
  { value: 'polaroid-strip', label: 'Polaroid Strip', desc: '3 polaroid bersebelahan', recommendedFrames: 3 },
  { value: 'film-strip-simple', label: 'Film Strip', desc: 'Seperti gulungan film', recommendedFrames: 4 },
];

export default function PhotoboothPage() {
  const {
    selectedCameraId,
    setSelectedCameraId,
    photoboothSettings,
    setPhotoboothSettings,
    clearCaptures,
  } = useAppStore();
  const { videoRef, devices, isActive, isStarting, startCamera, stopCamera, error } = useCamera({
    deviceId: selectedCameraId,
  });
  const [countdown, setCountdown] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Belum ada sesi photobooth');

  useEffect(() => {
    if (!selectedCameraId && devices[0]) {
      setSelectedCameraId(devices[0].deviceId);
    }
  }, [devices, selectedCameraId, setSelectedCameraId]);

  const frameLabel = useMemo(
    () => `${frames.length}/${photoboothSettings.frameCount} frame`,
    [frames.length, photoboothSettings.frameCount],
  );

  const runSession = async () => {
    if (!videoRef.current) {
      return;
    }

    setIsCapturing(true);
    setFrames([]);
    setStripUrl(null);
    setStatusMessage('Sesi dimulai...');
    clearCaptures();

    const captured: string[] = [];

    for (let i = 0; i < photoboothSettings.frameCount; i++) {
      for (let second = photoboothSettings.countdownSeconds; second > 0; second--) {
        setCountdown(second);
        setStatusMessage(`Bersiap untuk frame ${i + 1}`);
        await wait(1000);
      }

      setCountdown(0);
      const frame = captureVideoFrame(videoRef.current);
      if (frame) {
        captured.push(frame);
        setFrames([...captured]);
      }

      await wait(300);
    }

    const stripCanvas = await buildPhotoboothStrip(captured, photoboothSettings.template);
    if (stripCanvas) {
      const result = stripCanvas.toDataURL('image/png');
      setStripUrl(result);
      setStatusMessage('Strip photobooth siap disimpan atau diprint');
    }

    setIsCapturing(false);
  };

  const handleDownload = () => {
    if (!stripUrl) {
      return;
    }

    downloadDataUrl(stripUrl, `photobooth-${Date.now()}.png`);
  };

  const handlePrint = () => {
    if (!stripUrl) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photobooth</title>
          <style>
            body { margin: 0; background: #140713; display: grid; place-items: center; min-height: 100vh; }
            img { max-width: 92vw; max-height: 96vh; box-shadow: 0 10px 50px rgba(0,0,0,.35); border-radius: 24px; }
          </style>
        </head>
        <body>
          <img src="${stripUrl}" alt="Photobooth result" />
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AppShell
      title="Photobooth"
      subtitle="Pilih template kolase favoritmu, lalu mulai berfoto!"
    >
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <CameraStage
            videoRef={videoRef}
            isCameraActive={isActive}
            title="Siapkan pose terbaik Anda"
            subtitle="Photobooth akan mengambil beberapa frame otomatis sesuai countdown yang Anda pilih."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Countdown</p>
              <p className="mt-3 text-3xl font-semibold text-white">{countdown || '-'}</p>
              <p className="mt-2 text-sm text-pink-50/65">Detik menuju frame berikutnya</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Frame</p>
              <p className="mt-3 text-lg font-medium text-white">{frameLabel}</p>
              <p className="mt-2 text-sm text-pink-50/65">{statusMessage}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Template</p>
              <p className="mt-3 text-lg font-medium capitalize text-white">
                {TEMPLATES.find(t => t.value === photoboothSettings.template)?.label}
              </p>
              <p className="mt-2 text-sm text-pink-50/65">Pilih template lucu!</p>
            </div>
          </div>

          {stripUrl ? (
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-pink-200/70">Hasil Photobooth</p>
              <div className="mt-4 flex justify-center rounded-[28px] bg-black/20 p-4">
                <img
                  src={stripUrl}
                  alt="Hasil photobooth"
                  className="max-h-[36rem] rounded-[24px] object-contain shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          ) : null}
        </div>

        <ControlPanel
          title="Pengaturan Photobooth"
          description="Pilih template, atur frame dan countdown, lalu mulai!"
        >
          <Field label="Pilih kamera" hint={`${devices.length} perangkat`}>
            <select
              value={selectedCameraId ?? ''}
              onChange={(event) => setSelectedCameraId(event.target.value || null)}
              className="w-full rounded-2xl border border-white/10 bg-[#140713] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="">Pilih kamera</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Kontrol kamera">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={isActive ? stopCamera : startCamera}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-300 to-fuchsia-500 px-5 py-3 text-sm font-medium text-[#230312]"
              >
                <Aperture className="h-4 w-4" />
                {isStarting ? 'Menyalakan...' : isActive ? 'Matikan kamera' : 'Nyalakan kamera'}
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh kamera
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </Field>

          {/* Template Preview */}
          <Field label="Pilih Template Kolase">
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {TEMPLATES.map((tpl) => {
                const isSelected = photoboothSettings.template === tpl.value;
                return (
                  <button
                    key={tpl.value}
                    type="button"
                    onClick={() => {
                      setPhotoboothSettings({ template: tpl.value, frameCount: tpl.recommendedFrames });
                    }}
                    className={`relative rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-pink-400 bg-pink-400/20 shadow-[0_0_20px_rgba(244,114,182,0.3)]'
                        : 'border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <img
                        src={buildTemplatePreview(tpl.value)}
                        alt={tpl.label}
                        className="rounded-lg border border-white/10"
                      />
                    </div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-pink-200' : 'text-white'}`}>
                      {tpl.label}
                    </p>
                    <p className="text-xs text-pink-50/60 mt-1">{tpl.desc}</p>
                    <p className="text-xs text-pink-400 mt-1">✓ {tpl.recommendedFrames} frame</p>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-[#230312] font-bold">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Jumlah frame" hint={`${photoboothSettings.frameCount} frame`}>
            <input
              type="range"
              min="2"
              max="9"
              step="1"
              value={photoboothSettings.frameCount}
              onChange={(event) =>
                setPhotoboothSettings({ frameCount: Number(event.target.value) })
              }
              className="h-2 w-full accent-pink-400"
            />
          </Field>

          <Field
            label="Countdown per frame"
            hint={`${photoboothSettings.countdownSeconds} detik`}
          >
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={photoboothSettings.countdownSeconds}
              onChange={(event) =>
                setPhotoboothSettings({ countdownSeconds: Number(event.target.value) })
              }
              className="h-2 w-full accent-pink-400"
            />
          </Field>

          <Field label="Mulai sesi">
            <button
              type="button"
              onClick={runSession}
              disabled={!isActive || isCapturing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-300 to-pink-400 px-5 py-3 text-sm font-medium text-[#230312] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <TimerReset className="h-4 w-4" />
              {isCapturing ? 'Sedang mengambil frame...' : 'Mulai Photobooth'}
            </button>
          </Field>

          <Field label="Output strip">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!stripUrl}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#230312] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                Download
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={!stripUrl}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </Field>
        </ControlPanel>
      </section>
    </AppShell>
  );
}
