type FieldProps = {
  label: string
  hint?: string
  children: React.ReactNode
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        {hint ? <span className="text-xs text-pink-100/60">{hint}</span> : null}
      </div>
      <div className="mt-3">{children}</div>
    </label>
  )
}
