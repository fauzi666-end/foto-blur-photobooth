import { useCallback, useEffect, useRef, useState } from 'react'

import type { CameraDevice } from '@/store/useAppStore'

type UseCameraOptions = {
  deviceId?: string | null
  width?: number
  height?: number
}

export function useCamera(options: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [devices, setDevices] = useState<CameraDevice[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
  }, [])

  const refreshDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = allDevices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Kamera ${index + 1}`,
        }))

      setDevices(videoInputs)
      return videoInputs
    } catch {
      return []
    }
  }, [])

  const startCamera = useCallback(async () => {
    setIsStarting(true)
    setError(null)

    try {
      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: options.deviceId ? { exact: options.deviceId } : undefined,
          width: options.width ? { ideal: options.width } : { ideal: 1280 },
          height: options.height ? { ideal: options.height } : { ideal: 720 },
          facingMode: options.deviceId ? undefined : 'user',
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setIsActive(true)
      await refreshDevices()
    } catch (cameraError) {
      setError(cameraError instanceof Error ? cameraError.message : 'Gagal mengakses kamera.')
      setIsActive(false)
    } finally {
      setIsStarting(false)
    }
  }, [options.deviceId, options.height, options.width, refreshDevices, stopCamera])

  useEffect(() => {
    refreshDevices()

    const mediaDevices = navigator.mediaDevices
    if (!mediaDevices?.addEventListener) {
      return undefined
    }

    const handleDeviceChange = () => {
      refreshDevices()
    }

    mediaDevices.addEventListener('devicechange', handleDeviceChange)
    return () => {
      mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [refreshDevices])

  useEffect(() => () => stopCamera(), [stopCamera])

  return {
    videoRef,
    devices,
    isStarting,
    isActive,
    error,
    startCamera,
    stopCamera,
    refreshDevices,
  }
}
