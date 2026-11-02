'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Atom, BookOpen, Bug, Coins, Gamepad2, Layers3, Plus, Search, ShoppingBag, Sparkles, Swords, Zap } from 'lucide-react'
import { ENEMIES, FUSION_LIST, TOWERS, type EnemyType, type TowerType } from '@/lib/game/data'
import { SpriteIcon } from './sprite-icon'

export function TitleScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const go = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') onStart()
    }
    window.addEventListener('keydown', go)
    return () => window.removeEventListener('keydown', go)
  }, [onStart])

  return (
    <main className="ftd-title-screen">
      <img src="/images/title.jpg" alt="" className="ftd-title-art" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/95 via-transparent to-[#020611]/20" />
      <button onClick={onStart} className="ftd-title-action">
        <Sparkles size={17} /> Pressione para iniciar <ArrowRight size={17} />
      </button>
      <h1 className="sr-only">Fusion Tower Defense</h1>
    </main>
  )
}

export function MainMenu({ onPlay, onTowers }: { onPlay: () => void; onTowers: () => void }) {
  const [notice, setNotice] = useState(false)
  return (
    <main className="ftd-menu-screen">
      <img src="/images/menu.jpg" alt="" className="ftd-menu-art" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020611]/95 via-[#020611]/65 to-[#020611]/75" />
      <div className="ftd-menu-content">
        <section className="ftd-brand">
          <div className="ftd-menu-kicker flex items-center gap-3"><span className="ftd-brand-mark"><Atom size={28}/></span> Estratégia · Tecnologia · Fusão</div>
          <h1 className="ftd-menu-title">FUSION <span>TOWER DEFENSE</span></h1>
          <p className="ftd-menu-copy">Construa seu arsenal, combine torres e descubra sinergias para sobreviver a ondas cada vez mais perigosas. Cada fusão muda a maneira de defender.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-[10px] font-semibold tracking-[.16em] text-sky-100/65">
            <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-2">8 TORRES INICIAIS</span>
            <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-2">FUSÕES EM CADEIA</span>
            <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-2">MÚLTIPLOS ELEMENTOS</span>
          </div>
        </section>
        <nav className="ftd-menu-actions" aria-label="Menu principal">
          <button onClick={onPlay} className="ftd-menu-button primary">
            <span className="ftd-menu-button-icon"><Gamepad2 size={23}/></span>
            <span><strong>INICIAR PARTIDA</strong><small>Entre na arena e defenda sua base</small></span>
            <span className="ftd-arrow"><ArrowRight/></span>
          </button>
          <button onClick={onTowers} className="ftd-menu-button">
            <span className="ftd-menu-button-icon"><BookOpen size={22}/></span>
            <span><strong>ENCICLOPÉDIA</strong><small>Consulte torres, inimigos e receitas</small></span>
            <span className="ftd-arrow"><ArrowRight/></span>
          </button>
          <button onClick={() => setNotice(true)} className="ftd-menu-button">
            <span className="ftd-menu-button-icon"><ShoppingBag size={22}/></span>
            <span><strong>ARSENAL</strong><small>Novos conteúdos em desenvolvimento</small></span>
            <span className="ftd-arrow"><ArrowRight/></span>
          </button>
          {notice && <div role="status" className="rounded-xl border border-sky-300/30 bg-[#07172b]/95 px-4 py-3 text-sm text-sky-100 shadow-xl">O Arsenal estará disponível em uma atualização futura. <button onClick={() => setNotice(false)} className="ml-2 text-sky-300 underline">Fechar</button></div>}
        </nav>
      </div>
      <div className="ftd-menu-footer">FUSION TD <span className="mx-2 text-sky-400">◆</span> DEFENDA · COMBINE · EVOLUA</div>
    </main>
  )
}

export function TowersCodex({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<'all' | '0' | '1' | '2' | '3'>('all')
  const towerTypes = Object.keys(TOWERS) as TowerType[]
  const filteredTowers = useMemo(() => towerTypes.filter((type) => {
    const tower = TOWERS[type]
    return (tier === 'all' || tower.tier === Number(tier)) &&
      (tower.name.toLowerCase().includes(search.toLowerCase()) || tower.description.toLowerCase().includes(search.toLowerCase()))
  }), [search, tier])
  const enemies = Object.keys(ENEMIES) as EnemyType[]

  return (
    <main className="ftd-codex">
      <div className="ftd-codex-inner">
        <header className="ftd-codex-header">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="ftd-codex-back"><ArrowLeft size={16}/> Voltar</button>
            <div><h1 className="ftd-codex-title">ENCICLOPÉDIA</h1><p className="ftd-codex-subtitle">Arquivo tático · Fusion Defense Network</p></div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-sky-200/70 sm:flex"><Layers3 size={17}/> DATABASE ONLINE</div>
        </header>

        <section className="ftd-codex-section">
          <h2><Swords size={17}/> RECEITAS DE FUSÃO <span className="text-slate-500">({FUSION_LIST.length})</span></h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {FUSION_LIST.map((fusion) => (
              <li key={fusion.result} className="ftd-codex-card ftd-recipe">
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <SpriteIcon tower={fusion.a} label={TOWERS[fusion.a].name} size={42}/>
                  <span className="max-w-full truncate text-[10px] text-slate-300">{TOWERS[fusion.a].name}</span>
                </div>
                <Plus className="size-4 shrink-0 text-slate-500"/>
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <SpriteIcon tower={fusion.b} label={TOWERS[fusion.b].name} size={42}/>
                  <span className="max-w-full truncate text-[10px] text-slate-300">{TOWERS[fusion.b].name}</span>
                </div>
                <span className="ftd-equals">=</span>
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <SpriteIcon tower={fusion.result} label={TOWERS[fusion.result].name} size={48}/>
                  <span className="max-w-full truncate text-center text-[10px] font-semibold text-cyan-200">{TOWERS[fusion.result].name}</span>
                  <span className="text-[9px] text-slate-500">TIER {TOWERS[fusion.result].tier}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">As fusões exigem duas torres do mesmo tier e uma receita válida.</p>
        </section>

        <section className="ftd-codex-section">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="mb-0"><Atom size={17}/> CATÁLOGO DE TORRES <span className="text-slate-500">({filteredTowers.length}/{towerTypes.length})</span></h2>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input className="ftd-codex-search pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar torre..."/></label>
              <div className="flex rounded-lg border border-sky-300/20 bg-[#08172b] p-1">
                {(['all','0','1','2','3'] as const).map((value) => <button key={value} onClick={() => setTier(value)} className={`rounded-md px-3 py-2 text-[10px] font-bold ${tier === value ? 'bg-sky-400/20 text-cyan-100' : 'text-slate-500 hover:text-slate-200'}`}>{value === 'all' ? 'TODOS' : `T${value}`}</button>)}
              </div>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTowers.map((type) => {
              const tower = TOWERS[type]
              return <li key={type} className="ftd-codex-card flex gap-3 p-4">
                <div className="grid size-[62px] shrink-0 place-items-center rounded-xl border border-sky-300/15 bg-[#061226]"><SpriteIcon tower={type} label={tower.name} size={54}/></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><p className="font-semibold text-slate-100">{tower.name}</p><span className="shrink-0 rounded-md border border-sky-300/20 bg-sky-300/5 px-2 py-1 text-[9px] font-bold text-cyan-200">T{tower.tier}</span></div>
                  <p className="mt-1 text-[11px] text-slate-400">{tower.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-300"><span>DANO <b className="text-white">{tower.damage}</b></span><span>ALCANCE <b className="text-white">{tower.range}</b></span><span>CADÊNCIA <b className="text-white">{tower.fireRate}/s</b></span></div>
                </div>
              </li>
            })}
          </ul>
          {filteredTowers.length === 0 && <p className="ftd-codex-card p-6 text-center text-sm text-slate-400">Nenhuma torre encontrada.</p>}
        </section>

        <section className="ftd-codex-section">
          <h2><Bug size={17}/> BESTIÁRIO <span className="text-slate-500">({enemies.length})</span></h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {enemies.map((type) => {
              const enemy = ENEMIES[type]
              return <li key={type} className="ftd-codex-card flex items-center gap-3 p-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-rose-300/15 bg-[#1b1420]"><SpriteIcon enemy={type} label={enemy.name} size={48}/></div>
                <div className="min-w-0"><p className="font-semibold text-slate-100">{enemy.name}</p><p className="mt-1 text-[11px] text-slate-400">{enemy.description}</p><p className="mt-2 text-[10px] text-slate-300">VIDA <b className="text-white">{enemy.hp}</b> <span className="mx-2 text-slate-600">/</span> VELOCIDADE <b className="text-white">{enemy.speed}</b></p></div>
              </li>
            })}
          </ul>
        </section>
        <footer className="mt-12 border-t border-sky-300/10 py-6 text-center text-[10px] tracking-[.2em] text-slate-600">FUSION DEFENSE NETWORK · DADOS TÁTICOS</footer>
      </div>
    </main>
  )
}
