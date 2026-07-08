import { create } from 'zustand'
import type { PhotoboothTemplate } from '@/utils/capture'

export type AppMode = 'blur-cam' | 'photobooth'

export type CameraDevice = {
  deviceId: string
  label: string
}

export type CapturedFrame = {
  id: string
  dataUrl: string
  createdAt: number
}

type BlurSettings = {
  blurStrength: number
  heartDensity: number
  gestureConfidence: number
}

type PhotoboothSettings = {
  frameCount: number
  countdownSeconds: number
  template: PhotoboothTemplate
}

type AppState = {
  mode: AppMode
  devices: CameraDevice[]
  selectedCameraId: string | null
  blurSettings: BlurSettings
  photoboothSettings: PhotoboothSettings
  captures: CapturedFrame[]
  setMode: (mode: AppMode) => void
  setDevices: (devices: CameraDevice[]) => void
  setSelectedCameraId: (deviceId: string | null) => void
  setBlurSettings: (settings: Partial<BlurSettings>) => void
  setPhotoboothSettings: (settings: Partial<PhotoboothSettings>) => void
  addCapture: (capture: CapturedFrame) => void
  clearCaptures: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'blur-cam',
  devices: [],
  selectedCameraId: null,
  blurSettings: {
    blurStrength: 18,
    heartDensity: 10,
    gestureConfidence: 0.65,
  },
  photoboothSettings: {
    frameCount: 4,
    countdownSeconds: 3,
    template: 'classic-strip-4',
  },
  captures: [],
  setMode: (mode) => set({ mode }),
  setDevices: (devices) => set({ devices }),
  setSelectedCameraId: (selectedCameraId) => set({ selectedCameraId }),
  setBlurSettings: (settings) =>
    set((state) => ({
      blurSettings: {
        ...state.blurSettings,
        ...settings,
      },
    })),
  setPhotoboothSettings: (settings) =>
    set((state) => ({
      photoboothSettings: {
        ...state.photoboothSettings,
        ...settings,
      },
    })),
  addCapture: (capture) =>
    set((state) => ({
      captures: [capture, ...state.captures].slice(0, 12),
    })),
  clearCaptures: () => set({ captures: [] }),
}))
