'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Atom, BookOpen, Bug, Gamepad2, Layers3, Map as MapIcon, Plus, Search, ShoppingBag, Sparkles, Star, Swords } from 'lucide-react'
import { ENEMIES, FUSION_LIST, GAME_MAPS, TOWERS, type EnemyType, type MapDifficulty, type MapId, type TowerType } from '@/lib/game/data'
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
            <span><strong>ESCOLHER MAPA</strong><small>Selecione uma arena e sua dificuldade</small></span>
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

const MAP_DIFFICULTIES: { id: MapDifficulty; label: string; subtitle: string; color: string }[] = [
  { id: 'beginner', label: 'INICIANTE', subtitle: 'Rotas abertas', color: 'emerald' },
  { id: 'intermediate', label: 'INTERMEDIÁRIO', subtitle: 'Mais curvas', color: 'cyan' },
  { id: 'advanced', label: 'AVANÇADO', subtitle: 'Poucas margens', color: 'orange' },
  { id: 'expert', label: 'EXPERT', subtitle: 'Desafio máximo', color: 'rose' },
]

function smoothRouteSvgPath(points: readonly (readonly [number, number])[]) {
  if (points.length < 2) return ''
  let path = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const previous = points[Math.max(0, i - 1)]
    const current = points[i]
    const next = points[i + 1]
    const after = points[Math.min(points.length - 1, i + 2)]
    const c1x = current[0] + (next[0] - previous[0]) / 6
    const c1y = current[1] + (next[1] - previous[1]) / 6
    const c2x = next[0] - (after[0] - current[0]) / 6
    const c2y = next[1] - (after[1] - current[1]) / 6
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${next[0]} ${next[1]}`
  }
  return path
}

function MapPreview({ map, large = false }: { map: typeof GAME_MAPS[number]; large?: boolean }) {
  const routes = map.routes?.length ? map.routes : [{ id: 'main', waypoints: map.waypoints }]
  return (
    <div className={`ftd-map-preview ${large ? 'large' : ''}`}>
      <svg viewBox="-1.2 0 19.4 12" role="img" aria-label={`Prévia do mapa ${map.name}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id={`ftd-map-grid-${map.id}-${large ? 'large' : 'small'}`} width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgba(125,211,252,.12)" strokeWidth=".035" />
          </pattern>
        </defs>
        <rect x="-1.2" y="0" width="19.4" height="12" fill="#061326" />
        <rect x="-1.2" y="0" width="19.4" height="12" fill={`url(#ftd-map-grid-${map.id}-${large ? 'large' : 'small'})`} />
        {routes.map((route, index) => {
          const path = smoothRouteSvgPath(route.waypoints)
          const start = route.waypoints[0], end = route.waypoints[route.waypoints.length - 1]
          return <g key={route.id}>
            <path d={path} fill="none" stroke="rgba(14,165,233,.22)" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
            <path d={path} fill="none" stroke="#38536d" strokeWidth="1.72" strokeLinecap="round" strokeLinejoin="round" />
            <path d={path} fill="none" stroke={index % 2 ? '#c4b5fd' : '#80dff2'} strokeWidth=".055" strokeDasharray=".18 .2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={start[0]} cy={start[1]} r=".17" fill="#4ade80" stroke="#dcfce7" strokeWidth=".05" />
            <circle cx={end[0]} cy={end[1]} r=".17" fill="#fb7185" stroke="#ffe4e6" strokeWidth=".05" />
          </g>
        })}
      </svg>
      <div className="ftd-map-preview-legend"><span><i className="start" /> ENTRADA</span><span><i className="exit" /> SAÍDA</span></div>
    </div>
  )
}

function mapRouteLength(map: typeof GAME_MAPS[number]) {
  const routes = map.routes?.length ? map.routes : [{ id: 'main', waypoints: map.waypoints }]
  return routes.reduce((grandTotal, route) => grandTotal + route.waypoints.slice(1).reduce((total, point, index) => {
    const previous = route.waypoints[index]
    return total + Math.hypot(point[0] - previous[0], point[1] - previous[1])
  }, 0), 0)
}

export function MapSelectScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (mapId: MapId) => void }) {
  const [difficulty, setDifficulty] = useState<MapDifficulty>('beginner')
  const [selectedMapId, setSelectedMapId] = useState<MapId>(GAME_MAPS[0].id)
  const visibleMaps = GAME_MAPS.filter(map => map.difficulty === difficulty)
  const selectedMap = visibleMaps.find(map => map.id === selectedMapId) ?? visibleMaps[0]
  const difficultyInfo = MAP_DIFFICULTIES.find(item => item.id === difficulty)!

  const changeDifficulty = (next: MapDifficulty) => {
    setDifficulty(next)
    const firstMap = GAME_MAPS.find(map => map.difficulty === next)
    if (firstMap) setSelectedMapId(firstMap.id)
  }

  return (
    <main className="ftd-map-select">
      <div className="ftd-map-select-inner">
        <header className="ftd-map-select-header">
          <button onClick={onBack} className="ftd-map-back"><ArrowLeft size={16} /> MENU</button>
          <div className="ftd-map-heading">
            <p className="ftd-map-kicker"><MapIcon size={14} /> SELEÇÃO DE FASE</p>
            <h1>ESCOLHA SUA ARENA</h1>
            <p>Selecione uma dificuldade e escolha o mapa da partida.</p>
          </div>
          <div className="ftd-map-count"><span>{GAME_MAPS.length}</span> MAPAS DISPONÍVEIS</div>
        </header>

        <nav className="ftd-map-difficulties" aria-label="Dificuldade dos mapas">
          {MAP_DIFFICULTIES.map(item => {
            const count = GAME_MAPS.filter(map => map.difficulty === item.id).length
            return (
              <button key={item.id} onClick={() => changeDifficulty(item.id)} aria-pressed={difficulty === item.id} className={`ftd-map-difficulty ${difficulty === item.id ? 'active' : ''} ${item.color}`}>
                <strong>{item.label}</strong><span>{item.subtitle}</span><small>{count} MAPAS</small>
              </button>
            )
          })}
        </nav>

        <div className="ftd-map-browser">
          <section className="ftd-map-catalog">
            <div className="ftd-map-catalog-heading">
              <div><h2>{difficultyInfo.label}</h2><p>{difficultyInfo.subtitle} · {visibleMaps.length} opções</p></div>
              <span>SELECIONE UM MAPA</span>
            </div>
            <div className="ftd-map-cards">
              {visibleMaps.map(map => (
                <button key={map.id} onClick={() => setSelectedMapId(map.id)} aria-pressed={selectedMap.id === map.id} className={`ftd-map-card ${selectedMap.id === map.id ? 'selected' : ''}`}>
                  <MapPreview map={map} />
                  <div className="ftd-map-card-info">
                    <div className="ftd-map-card-title"><strong>{map.name}</strong><span>{map.rating}/5</span></div>
                    <div className="ftd-map-stars" aria-label={`Dificuldade ${map.rating} de 5`}>
                      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={11} fill={index < map.rating ? 'currentColor' : 'none'} className={index < map.rating ? 'filled' : ''} />)}
                    </div>
                    <p>{map.description}</p>
                  </div>
                  <span className="ftd-map-select-indicator">{selectedMap.id === map.id ? 'SELECIONADO' : 'VER MAPA'}</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="ftd-map-details">
            <div className="ftd-map-details-top"><span>MAPA SELECIONADO</span><span className={`ftd-map-tier ${difficulty}`}>{difficultyInfo.label}</span></div>
            <MapPreview map={selectedMap} large />
            <h2>{selectedMap.name}</h2>
            <p className="ftd-map-description">{selectedMap.description}</p>
            <div className="ftd-map-stats">
              <div><strong>{mapRouteLength(selectedMap)}</strong><span>CÉLULAS DE ROTA</span></div>
              <div><strong>{(selectedMap.routes?.length ? selectedMap.routes : [{ id: 'main', waypoints: selectedMap.waypoints }]).reduce((sum, route) => sum + route.waypoints.length - 2, 0)}</strong><span>CURVAS</span></div>
              <div><strong>{selectedMap.rating}/5</strong><span>DIFICULDADE</span></div>
            </div>
            <div className="ftd-map-note">A dificuldade desta seleção considera o traçado e o espaço para construção. As regras de ondas e economia permanecem iguais entre os mapas.</div>
            <button onClick={() => onSelect(selectedMap.id)} className="ftd-map-play">
              JOGAR NESTE MAPA <ArrowRight size={17} />
            </button>
          </aside>
        </div>
        <footer className="ftd-map-footer">FUSION TD <span>◆</span> 8 ARENAS · 4 NÍVEIS DE DIFICULDADE</footer>
      </div>
    </main>
  )
}

const TOWER_TYPES = Object.keys(TOWERS) as TowerType[]

export function TowersCodex({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<'all' | '0' | '1' | '2' | '3'>('all')
  const towerTypes = TOWER_TYPES
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
