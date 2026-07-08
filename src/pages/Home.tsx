import { Camera, Heart, Music4, Printer } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { ModeCard } from '@/components/ModeCard'

export default function Home() {
  return (
    <AppShell
      title="Trend camera blur + photobooth dalam satu aplikasi"
      subtitle="Pakai kamera laptop atau HP dari browser, aktifkan efek blur saat pose dua jari terdeteksi, lalu lanjut ke mode photobooth untuk hasil yang bisa disimpan dan dicetak."
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-pink-200/70">Konsep Utama</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white">
            Satu layar untuk bikin momen blur yang viral, satu layar lagi untuk hasil photobooth siap print.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-pink-50/72">
            Flow aplikasi ini dibuat sederhana: buka kamera, pilih mode, upload lagu
            <span className="font-medium text-white"> Foto Kita Blur </span>
            jika ingin, lalu mainkan pengalaman visual langsung dari browser.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <Heart className="h-6 w-6 text-pink-200" />
              <h3 className="mt-4 text-lg font-medium text-white">Blur Cam</h3>
              <p className="mt-2 text-sm text-pink-50/70">
                Gesture dua jari memicu blur visual dan love effect agar cocok untuk trend video atau foto.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <Printer className="h-6 w-6 text-pink-200" />
              <h3 className="mt-4 text-lg font-medium text-white">Photobooth</h3>
              <p className="mt-2 text-sm text-pink-50/70">
                Ambil beberapa frame dengan countdown, susun jadi strip, lalu simpan atau print langsung.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-pink-200/70">Yang Disiapkan</p>
          <div className="mt-6 space-y-4">
            {[
              {
                icon: Camera,
                title: 'Kamera laptop atau HP',
                desc: 'Bisa memakai webcam bawaan, kamera USB, atau HP yang dipakai langsung membuka browser.',
              },
              {
                icon: Music4,
                title: 'File lagu sendiri',
                desc: 'Upload file audio lagu yang Anda miliki supaya browser bisa memutarnya saat kamera aktif.',
              },
              {
                icon: Heart,
                title: 'Pencahayaan cukup',
                desc: 'Deteksi gesture dua jari akan lebih stabil jika tangan terlihat jelas oleh kamera.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <item.icon className="h-5 w-5 text-pink-200" />
                <h3 className="mt-3 text-sm font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-pink-50/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ModeCard
          title="Blur Cam"
          description="Mode kamera interaktif untuk trend blur. Saat pose dua jari dikenali, efek blur dan love langsung aktif di area kamera."
          points={['Kamera live', 'Gesture dua jari', 'Love effect', 'Upload lagu', 'Snapshot']}
          href="/blur-cam"
          accentClassName="bg-pink-500/30"
          icon={Heart}
        />

        <ModeCard
          title="Photobooth"
          description="Mode photobooth untuk ambil beberapa foto otomatis, menyusun strip, lalu download atau print dari browser."
          points={['Countdown', '4 frame', 'Strip klasik', 'Grid strip', 'Print']}
          href="/photobooth"
          accentClassName="bg-violet-500/30"
          icon={Printer}
        />
      </section>
    </AppShell>
  )
}
