import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Heart, Music4, RefreshCcw, Sparkles, Upload } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { CameraStage } from '@/components/CameraStage'
import { ControlPanel } from '@/components/ControlPanel'
import { Field } from '@/components/Field'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useCamera } from '@/hooks/useCamera'
import { useHandGesture } from '@/hooks/useHandGesture'
import { useAppStore } from '@/store/useAppStore'
import { captureVideoFrame, downloadDataUrl } from '@/utils/capture'

export default function BlurCamPage() {
  const {
    selectedCameraId,
    setSelectedCameraId,
    blurSettings,
    setBlurSettings,
    addCapture,
    captures,
  } = useAppStore()
  const { videoRef, devices, isActive, isStarting, startCamera, stopCamera, error } = useCamera({
    deviceId: selectedCameraId,
  })
  const gesture = useHandGesture(videoRef.current, blurSettings.gestureConfidence)
  const { canPlay, isPlaying, loadFile, sourceLabel, stop, toggle } = useAudioPlayer()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [snapshotMessage, setSnapshotMessage] = useState('Belum ada snapshot')
  const [audioError, setAudioError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCameraId && devices[0]) {
      setSelectedCameraId(devices[0].deviceId)
    }
  }, [devices, selectedCameraId, setSelectedCameraId])

  const statusLabel = useMemo(() => {
    if (gesture.error) {
      return 'Deteksi gesture belum aktif'
    }
    if (gesture.isLoading) {
      return 'Memuat model gesture...'
    }
    if (gesture.isDetected) {
      return 'Pose dua jari terdeteksi'
    }
    return 'Arahkan pose dua jari ke kamera'
  }, [gesture.error, gesture.isDetected, gesture.isLoading])

  const handleTakeSnapshot = () => {
    if (!videoRef.current) {
      return
    }

    const frame = captureVideoFrame(videoRef.current)
    if (!frame) {
      return
    }

    const filename = `blur-cam-${Date.now()}.png`
    addCapture({
      id: filename,
      dataUrl: frame,
      createdAt: Date.now(),
    })
    downloadDataUrl(frame, filename)
    setSnapshotMessage('Snapshot berhasil diunduh')
  }

  const handleAudioToggle = async () => {
    setAudioError(null)

    try {
      await toggle()
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : 'Audio tidak bisa diputar.')
    }
  }

  return (
    <AppShell
      title="Blur Cam"
      subtitle="Gunakan pose dua jari untuk memicu efek blur dan love. Upload lagu Anda sendiri agar backsound bisa diputar aman dari browser."
    >
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <CameraStage
            videoRef={videoRef}
            isCameraActive={isActive}
            isEffectActive={gesture.isDetected}
            blurAmount={blurSettings.blurStrength}
            title="Nyalakan kamera Anda"
            subtitle="Setelah kamera aktif, arahkan pose dua jari ke depan lensa untuk memicu blur dan love effect."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Gesture</p>
              <p className="mt-3 text-lg font-medium text-white">{statusLabel}</p>
              <p className="mt-2 text-sm text-pink-50/65">
                Confidence: {(gesture.confidence * 100).toFixed(0)}%
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Audio</p>
              <p className="mt-3 text-lg font-medium text-white">
                {isPlaying ? 'Lagu sedang diputar' : 'Lagu belum diputar'}
              </p>
              <p className="mt-2 text-sm text-pink-50/65">{sourceLabel}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">Snapshot</p>
              <p className="mt-3 text-lg font-medium text-white">{captures.length} hasil tersimpan</p>
              <p className="mt-2 text-sm text-pink-50/65">{snapshotMessage}</p>
            </div>
          </div>
        </div>

        <ControlPanel
          title="Kontrol Blur Cam"
          description="Pilih kamera, upload lagu, lalu atur sensitivitas gesture agar efek blur aktif saat pose dua jari terbaca."
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
                <Camera className="h-4 w-4" />
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

          <Field label="Lagu Foto Kita Blur" hint="Upload file audio">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  loadFile(file)
                }
              }}
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white"
              >
                <Upload className="h-4 w-4" />
                Upload lagu
              </button>

              <button
                type="button"
                onClick={handleAudioToggle}
                disabled={!canPlay}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#230312] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Music4 className="h-4 w-4" />
                {isPlaying ? 'Pause lagu' : 'Putar lagu'}
              </button>

              <button
                type="button"
                onClick={stop}
                disabled={!canPlay}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                Stop lagu
              </button>
            </div>
            {audioError ? <p className="mt-3 text-sm text-rose-300">{audioError}</p> : null}
          </Field>

          <Field
            label="Sensitivitas gesture"
            hint={`${Math.round(blurSettings.gestureConfidence * 100)}%`}
          >
            <input
              type="range"
              min="0.4"
              max="0.95"
              step="0.05"
              value={blurSettings.gestureConfidence}
              onChange={(event) =>
                setBlurSettings({ gestureConfidence: Number(event.target.value) })
              }
              className="h-2 w-full accent-pink-400"
            />
          </Field>

          <Field label="Kekuatan blur" hint={`${blurSettings.blurStrength}px`}>
            <input
              type="range"
              min="8"
              max="28"
              step="2"
              value={blurSettings.blurStrength}
              onChange={(event) => setBlurSettings({ blurStrength: Number(event.target.value) })}
              className="h-2 w-full accent-pink-400"
            />
            <p className="mt-3 text-xs text-pink-50/55">
              Nilai ini saat ini memengaruhi overlay visual pada preview kamera.
            </p>
          </Field>

          <Field label="Output snapshot">
            <button
              type="button"
              onClick={handleTakeSnapshot}
              disabled={!isActive}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-300 to-pink-400 px-5 py-3 text-sm font-medium text-[#230312] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Heart className="h-4 w-4" />
              Ambil snapshot blur
            </button>
          </Field>
        </ControlPanel>
      </section>
    </AppShell>
  )
}
