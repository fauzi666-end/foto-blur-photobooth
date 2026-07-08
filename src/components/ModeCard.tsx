import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

type ModeCardProps = {
  title: string
  description: string
  points: string[]
  href: string
  accentClassName: string
  icon: LucideIcon
}

export function ModeCard({
  title,
  description,
  points,
  href,
  accentClassName,
  icon: Icon,
}: ModeCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-pink-200/40 hover:bg-white/10">
      <div className={`absolute inset-x-8 top-0 h-24 rounded-full blur-3xl ${accentClassName}`} />
      <div className="relative">
        <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-3 text-pink-100">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="mt-6 font-serif text-3xl text-white">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-pink-50/75">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {points.map((point) => (
            <span
              key={point}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-pink-100/80"
            >
              {point}
            </span>
          ))}
        </div>
        <Link
          to={href}
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-300 to-fuchsia-500 px-5 py-3 text-sm font-medium text-[#230312] shadow-[0_12px_40px_rgba(236,72,153,0.35)] transition group-hover:scale-[1.02]"
        >
          Buka mode
        </Link>
      </div>
    </div>
  )
}
