'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { ENEMIES, FUSION_LIST, TOWERS, type EnemyType, type TowerType } from '@/lib/game/data'
import { SpriteIcon } from './sprite-icon'

export function TitleScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const go = () => onStart()
    window.addEventListener('keydown', go)
    return () => window.removeEventListener('keydown', go)
  }, [onStart])

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#050a2a]">
      <button onClick={onStart} className="absolute inset-0 size-full" aria-label="Pressione qualquer botão para iniciar">
        <img src="/images/title.jpg" alt="" className="size-full object-cover" />
      </button>
      <h1 className="sr-only">Fusion TD</h1>
    </main>
  )
}

export function MainMenu({ onPlay, onTowers }: { onPlay: () => void; onTowers: () => void }) {
  const [notice, setNotice] = useState(false)

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#0d0c0a]">
      <h1 className="sr-only">Fusion TD - Menu principal</h1>
      <div className="relative w-[min(100vw,calc(100dvh*1507/704))] aspect-[1507/704]">
        <img src="/images/menu.jpg" alt="Oficina com uma torre sobre a plataforma de fusão" className="size-full" />
        <MenuHotspot label="Loja" style={{ left: '10%', top: '75%', width: '24.5%', height: '14%' }} onClick={() => setNotice(true)} />
        <MenuHotspot label="Jogar" style={{ left: '38.5%', top: '72%', width: '24%', height: '19%' }} onClick={onPlay} />
        <MenuHotspot label="Torres" style={{ left: '66.6%', top: '75%', width: '24.5%', height: '14%' }} onClick={onTowers} />
        {notice && (
          <div
            role="status"
            className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-md border border-sky-400/50 bg-black/80 px-5 py-3 text-center font-display text-sky-200"
          >
            Loja em breve!
            <button onClick={() => setNotice(false)} className="ml-4 text-xs text-slate-400 underline">
              fechar
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function MenuHotspot({ label, style, onClick }: { label: string; style: React.CSSProperties; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={style}
      aria-label={label}
      className="absolute rounded-xl transition-all hover:bg-sky-300/10 hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] focus-visible:outline-2 focus-visible:outline-sky-300"
    />
  )
}

export function TowersCodex({ onBack }: { onBack: () => void }) {
  const towerTypes = Object.keys(TOWERS) as TowerType[]
  return (
    <main className="min-h-dvh bg-[#050914] text-slate-100 px-4 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-md border border-sky-500/30 px-3 py-1.5 text-sm hover:bg-sky-500/10"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar
          </button>
          <h1 className="font-display text-2xl tracking-widest text-sky-300">TORRES</h1>
        </header>

        <section>
          <h2 className="mb-3 font-display text-sm tracking-widest text-sky-300/80">RECEITAS DE FUSÃO</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {FUSION_LIST.map((f) => (
              <li key={f.result} className="flex items-center justify-center gap-1 rounded-lg border border-sky-500/20 bg-[#0a1226] p-3">
                <SpriteIcon tower={f.a} label={TOWERS[f.a].name} size={40} />
                <Plus className="size-4 text-slate-500" aria-hidden />
                <SpriteIcon tower={f.b} label={TOWERS[f.b].name} size={40} />
                <span className="px-1 text-slate-500" aria-hidden>
                  =
                </span>
                <SpriteIcon tower={f.result} label={TOWERS[f.result].name} size={48} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-400">Só é possível fundir torres do mesmo tier. Tier 0 + Tier 0 = Tier 1.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm tracking-widest text-sky-300/80">CATÁLOGO</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {towerTypes.map((t) => {
              const d = TOWERS[t]
              return (
                <li key={t} className="flex gap-3 rounded-lg border border-sky-500/20 bg-[#0a1226] p-3">
                  <SpriteIcon tower={t} label={d.name} size={56} />
                  <div className="flex-1">
                    <p className="font-medium">
                      {d.name} <span className="text-xs text-slate-400">· Tier {d.tier}</span>
                    </p>
                    <p className="text-xs text-slate-400">{d.description}</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Dano {d.damage} · Alcance {d.range} · {d.fireRate}/s{d.splash ? ` · Área ${d.splash}` : ''}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm tracking-widest text-sky-300/80">INIMIGOS</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(ENEMIES) as EnemyType[]).map((e) => {
              const d = ENEMIES[e]
              return (
                <li key={e} className="flex items-center gap-3 rounded-lg border border-sky-500/20 bg-[#0a1226] p-3">
                  <SpriteIcon enemy={e} label={d.name} size={48} />
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.description}</p>
                    <p className="text-xs text-slate-300">
                      Vida {d.hp} · Vel. {d.speed}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </main>
  )
}
