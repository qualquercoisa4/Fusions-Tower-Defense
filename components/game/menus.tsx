'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { CELL, ENEMIES, FUSION_LIST, HEIGHT, MAPS, MAP_SCALE_X, MAP_SCALE_Y, TOWERS, WIDTH, type EnemyType, type MapId, type TowerType } from '@/lib/game/data'
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


const MAP_DIFFICULTY_GROUPS: {
  title: string
  subtitle: string
  color: string
  maps: MapId[]
}[] = [
  { title: 'INICIANTE', subtitle: 'Aprenda as rotas e construa sua economia.', color: '#4ade80', maps: ['original', 'meadow'] },
  { title: 'INTERMEDIÁRIO', subtitle: 'Duas rotas exigem uma defesa mais distribuída.', color: '#38bdf8', maps: ['frostline', 'emberCrossing'] },
  { title: 'AVANÇADO', subtitle: 'Percursos exigentes, terreno limitado e rotas separadas.', color: '#f59e0b', maps: ['quarrySpiral', 'neonGauntlet'] },
  { title: 'EXPERT', subtitle: 'Desafios extremos com caminhos alternados.', color: '#fb7185', maps: ['voidLabyrinth', 'infernoCircuit'] },
]

export function MapSelection({ onBack, onSelect }: { onBack: () => void; onSelect: (mapId: MapId) => void }) {
  return (
    <main className="h-dvh overflow-y-auto bg-[#050914] px-4 py-5 text-slate-100 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-8">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="flex shrink-0 items-center gap-2 rounded-md border border-sky-500/30 px-3 py-2 text-sm hover:bg-sky-500/10">
            <ArrowLeft className="size-4" aria-hidden /> Voltar
          </button>
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-sky-300">FUSION TD</p>
            <h1 className="font-display text-2xl tracking-widest text-white sm:text-3xl">SELECIONE UM MAPA</h1>
          </div>
        </header>

        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
          Escolha uma arena. Cada mapa possui um percurso próprio, identidade visual e dificuldade crescente.
          Todos usam a campanha de 75 ondas.
        </p>

        {MAP_DIFFICULTY_GROUPS.map((group, groupIndex) => (
          <section key={group.title} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full" style={{ backgroundColor: group.color }} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-sm tracking-[0.2em]" style={{ color: group.color }}>{group.title}</h2>
                <p className="text-xs text-slate-500">{group.subtitle}</p>
              </div>
              <span className="text-xs tracking-widest text-slate-600">{String(groupIndex + 1).padStart(2, '0')} / 04</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {group.maps.map((mapId) => {
                const map = MAPS[mapId]
                const hpIncrease = Math.round((map.hpMultiplier - 1) * 100)
                const speedIncrease = Math.round((map.speedMultiplier - 1) * 100)
                const routePoints = map.routes.map(route => route.path.map(point => `${point.x},${point.y}`).join(' '))
                return (
                  <button
                    key={mapId}
                    onClick={() => onSelect(mapId)}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b1223] text-left transition hover:-translate-y-0.5 hover:border-white/30 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ outlineColor: map.colors.accent }}
                  >
                    <div className="relative aspect-[8/7] w-full overflow-hidden border-b border-white/10" style={{ background: map.colors.preview }}>
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1.5px), radial-gradient(circle at 70% 70%, white 1px, transparent 1.5px)', backgroundSize: '24px 24px, 31px 31px' }} />
                      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="relative size-full" aria-hidden="true">
                        {map.terrainPatches.map((patch, index) => <polygon key={index} points={patch.points.map(([x,y]) => `${x * MAP_SCALE_X},${y * MAP_SCALE_Y}`).join(' ')} fill={patch.color} />)}
                        {(map.id === 'original' || map.id === 'infernoCircuit') && Array.from(map.blockedCells).map((cell) => {
                          const [col, row] = cell.split(',').map(Number)
                          return <rect key={cell} x={col * CELL + 1} y={row * CELL + 1} width={CELL - 2} height={CELL - 2} rx="3" fill="#020617" fillOpacity="0.7" stroke={map.colors.accent} strokeOpacity="0.3" />
                        })}
                        {map.routes.map((route, routeIndex) => {
                          const points = routePoints[routeIndex]
                          const start = route.path[0], finish = route.path[route.path.length - 1]
                          return <g key={routeIndex}>
                            {map.sandOnly && <polyline points={points} fill="none" stroke="#f6ff93" strokeWidth="135" strokeLinecap="round" strokeLinejoin="round" />}
                            <polyline points={points} fill="none" stroke={map.colors.pathGlow} strokeWidth={map.pathWidth + 8} strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points={points} fill="none" stroke={map.colors.path} strokeWidth={map.pathWidth} strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx={start.x} cy={start.y} r="25" fill="#00cfff" stroke="#e0f2fe" strokeWidth="3" />
                            <circle cx={finish.x} cy={finish.y} r="25" fill="#ef0800" stroke="#fee2e2" strokeWidth="3" />
                          </g>
                        })}
                        {Array.from(map.farmCells).map((cell) => {
                          const [col, row] = cell.split(',').map(Number)
                          const x = col * CELL, y = row * CELL
                          return map.id === 'quarrySpiral' && cell === '29,15'
                            ? <g key={cell} transform={`translate(${x + CELL/2} ${y + CELL/2})`}><path d="M-12 2 L12 2 8 9 -8 9Z" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5"/><path d="M0 -11 V2 M1 -10 L9 -1 H1Z" fill="#fef3c7"/></g>
                            : <g key={cell}><rect x={x + 2} y={y + 2} width={CELL - 4} height={CELL - 4} rx="4" fill={map.colors.farmFill} stroke={map.colors.farmStroke} strokeWidth="2" /><text x={x + CELL/2} y={y + CELL/2 + 3} fontSize="8" fontWeight="bold" textAnchor="middle" fill={map.colors.farmText}>FARM</text></g>
                        })}
                      </svg>
                      <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[10px] font-bold tracking-widest text-white/90">75 ONDAS</span>
                      <span className="absolute bottom-3 right-3 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider text-slate-950" style={{ backgroundColor: map.colors.accent }}>{map.difficulty.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-2 p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base tracking-wide text-white">{map.name}</h3>
                        <span className="text-xs font-semibold" style={{ color: map.colors.accent }}>JOGAR →</span>
                      </div>
                      <p className="min-h-10 text-xs leading-relaxed text-slate-400">{map.description}</p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-300">
                        <span className="rounded bg-white/5 px-2 py-1">Vida inimiga +{hpIncrease}%</span>
                        <span className="rounded bg-white/5 px-2 py-1">Velocidade +{speedIncrease}%</span>
                        {map.routes.length > 1 && <span className="rounded bg-sky-400/10 px-2 py-1 text-sky-200">{map.routes.length} rotas · alternância 1:1</span>}
                        <span className="rounded bg-emerald-400/10 px-2 py-1 text-emerald-200">{map.farmCells.size} farms</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
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
