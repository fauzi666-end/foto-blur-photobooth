import { useEffect, useRef, useState } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sourceLabel, setSourceLabel] = useState('Belum ada file lagu')
  const [canPlay, setCanPlay] = useState(false)

  const loadFile = (file: File) => {
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src)
    }

    const audio = new Audio(URL.createObjectURL(file))
    audio.loop = true
    audio.volume = 0.85
    audioRef.current = audio
    setSourceLabel(file.name)
    setIsPlaying(false)
    setCanPlay(true)
  }

  const toggle = async () => {
    if (!audioRef.current) {
      return false
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return false
    }

    await audioRef.current.play()
    setIsPlaying(true)
    return true
  }

  const stop = () => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio?.src) {
        URL.revokeObjectURL(audio.src)
      }
    }
  }, [])

  return {
    isPlaying,
    canPlay,
    sourceLabel,
    loadFile,
    toggle,
    stop,
  }
}
