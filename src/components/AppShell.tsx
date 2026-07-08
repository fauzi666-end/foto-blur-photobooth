import { Link, useLocation } from 'react-router-dom'
import { Aperture, Camera, Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Beranda', icon: Heart },
  { to: '/blur-cam', label: 'Blur Cam', icon: Camera },
  { to: '/photobooth', label: 'Photobooth', icon: Aperture },
]

type AppShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#09020a] text-[#fff7fb]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-pink-200/70">Foto Kita Blur Experience</p>
              <h1 className="mt-2 font-serif text-3xl tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-pink-50/75 sm:text-base">{subtitle}</p>
            </div>

            <nav className="flex flex-wrap gap-3">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                      isActive
                        ? 'border-pink-300 bg-pink-300/15 text-white shadow-[0_0_30px_rgba(244,114,182,0.25)]'
                        : 'border-white/10 bg-black/20 text-pink-50/80 hover:border-pink-200/40 hover:bg-white/10',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
