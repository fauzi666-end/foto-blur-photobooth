import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

import { isTwoFingerPose, type Point3D } from '@/utils/gesture'

type GestureState = {
  isSupported: boolean
  isLoading: boolean
  isDetected: boolean
  confidence: number
  error: string | null
}

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export function useHandGesture(video: HTMLVideoElement | null, minConfidence = 0.65) {
  const detectorRef = useRef<HandLandmarker | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const [state, setState] = useState<GestureState>({
    isSupported: typeof window !== 'undefined',
    isLoading: true,
    isDetected: false,
    confidence: 0,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function setup() {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL)
        const detector = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: 'CPU',
          },
          numHands: 1,
          runningMode: 'VIDEO',
          minHandDetectionConfidence: 0.45,
          minHandPresenceConfidence: 0.45,
          minTrackingConfidence: 0.45,
        })

        if (!isMounted) {
          detector.close()
          return
        }

        detectorRef.current = detector
        setState((previous) => ({
          ...previous,
          isLoading: false,
        }))
      } catch (error) {
        if (!isMounted) {
          return
        }

        setState((previous) => ({
          ...previous,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Gagal memuat deteksi tangan.',
        }))
      }
    }

    setup()

    return () => {
      isMounted = false
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      detectorRef.current?.close()
      detectorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!video || !detectorRef.current) {
      return undefined
    }

    let stopped = false

    const detect = async () => {
      if (stopped || !detectorRef.current || video.readyState < 2) {
        frameIdRef.current = requestAnimationFrame(detect)
        return
      }

      const result = detectorRef.current.detectForVideo(video, performance.now())
      const landmarks = result.landmarks?.[0] as Point3D[] | undefined
      const confidence = result.handednesses?.[0]?.[0]?.score ?? 0
      const detected = Boolean(landmarks) && confidence >= minConfidence && isTwoFingerPose(landmarks)

      setState((previous) => ({
        ...previous,
        isDetected: detected,
        confidence,
      }))

      frameIdRef.current = requestAnimationFrame(detect)
    }

    frameIdRef.current = requestAnimationFrame(detect)

    return () => {
      stopped = true
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }
    }
  }, [video, minConfidence])

  return state
}
