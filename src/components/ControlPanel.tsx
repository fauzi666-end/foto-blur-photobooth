type ControlPanelProps = {
  title: string
  description: string
  children: React.ReactNode
}

export function ControlPanel({ title, description, children }: ControlPanelProps) {
  return (
    <aside className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h2 className="font-serif text-2xl text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-pink-50/70">{description}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </aside>
  )
}
