import { Heart, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

type CameraStageProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isCameraActive: boolean
  isEffectActive?: boolean
  blurAmount?: number
  title: string
  subtitle: string
}

const hearts = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${10 + (index % 6) * 14}%`,
  delay: `${index * 0.18}s`,
  duration: `${3 + (index % 4) * 0.5}s`,
}))

export function CameraStage({
  videoRef,
  isCameraActive,
  isEffectActive = false,
  blurAmount = 10,
  title,
  subtitle,
}: CameraStageProps) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#170512]/80 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={cn(
            'h-full w-full object-cover transition duration-500',
            isEffectActive && 'scale-[1.03] saturate-150 brightness-110',
          )}
          style={{
            filter: isEffectActive ? `blur(${blurAmount}px)` : 'none',
          }}
        />

        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-center">
            <Sparkles className="h-10 w-10 text-pink-200" />
            <p className="mt-4 font-serif text-2xl text-white">{title}</p>
            <p className="mt-2 max-w-md text-sm text-pink-50/70">{subtitle}</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,120,180,0.24),transparent_35%),radial-gradient(circle_at_bottom,rgba(120,60,255,0.28),transparent_35%)] opacity-70 transition',
              isEffectActive ? 'animate-pulse' : 'opacity-45',
            )}
          />

          {isEffectActive &&
            hearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute bottom-6 animate-float-up text-pink-200/90"
                style={{
                  left: heart.left,
                  animationDelay: heart.delay,
                  animationDuration: heart.duration,
                }}
              >
                <Heart className="h-6 w-6 fill-current" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
