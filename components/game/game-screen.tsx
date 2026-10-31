'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, ArrowLeft, Atom, Bomb, Bug, CircleDot, Coins, Crosshair, FastForward, Flame, Heart, Merge, Mountain, Pickaxe, Play, RotateCcw, Snowflake, Sparkles, Trash2, Waves, Wind, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { BUILDABLE, CELL, ENEMIES, HEIGHT, TARGET_MODES, TOWERS, TOWER_ELEMENTS, WIDTH, fusionResult, type ElementClass, type EnemyType, type TargetMode, type TowerType } from '@/lib/game/data'
import {
  createGame,
  fuseTowers,
  placeTower,
  render,
  spawnDebugEnemy,
  sellTower,
  startWave,
  towerAt,
  update,
  type GameState,
  getFusionCost,
  SOULSTORM_ESSENCE_REQUIRED,
} from '@/lib/game/engine'
import { SpriteIcon } from './sprite-icon'

const ELEMENT_LABELS: Record<ElementClass, string> = {
  normal: 'Normal / Primário',
  fire: 'Fogo / Explosivo',
  electricity: 'Eletricidade / Choque',
  ice: 'Gelo / Ar',
  earth: 'Terra / Terrestre',
  plasma: 'Plasma / Mágico',
}

const BASE_TOWER_ELEMENT_ICONS: Partial<Record<TowerType, readonly [LucideIcon, LucideIcon]>> = {
  shooter: [CircleDot, Crosshair],
  cannon: [Flame, Bomb],
  lightning: [Zap, Activity],
  retarder: [Snowflake, Wind],
  boulderLauncher: [Mountain, Pickaxe],
  teleporter: [Atom, Sparkles],
}

const FUSION_ELEMENT_ICONS: Record<ElementClass, LucideIcon> = {
  normal: CircleDot,
  fire: Flame,
  electricity: Zap,
  ice: Snowflake,
  earth: Mountain,
  plasma: Atom,
}

function TowerElementIcons({ type }: { type: TowerType }) {
  const element = TOWER_ELEMENTS[type]
  const baseIcons = BASE_TOWER_ELEMENT_ICONS[type]
  const icons: LucideIcon[] = baseIcons ? [...baseIcons] : element ? [FUSION_ELEMENT_ICONS[element]] : []
  if (!icons.length) return null
  const label = element ? ELEMENT_LABELS[element] : 'Elemento'
  return (
    <span className="inline-flex items-center gap-1 text-violet-300" role="img" aria-label={label} title={label}>
      {icons.map((Icon, index) => <Icon key={index} className="size-3.5" aria-hidden />)}
    </span>
  )
}

export function GameScreen({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const game = useRef<GameState>(createGame())
  const speedRef = useRef(1)
  const [, setTick] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [autoNextWave, setAutoNextWave] = useState(false)
  const autoNextWaveRef = useRef(false)
  const [debugOpen, setDebugOpen] = useState(false)
  const [debugTowerType, setDebugTowerType] = useState<TowerType | ''>('')
  const [debugEnemyType, setDebugEnemyType] = useState<EnemyType>('grunt')
  const [message, setMessage] = useState<string | null>(null)
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let last = performance.now()
    let hudTimer = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      for (let i = 0; i < speedRef.current; i++) update(game.current, dt)
      if (autoNextWaveRef.current && game.current.wave > 0 && !game.current.waveActive && game.current.status === 'playing') startWave(game.current)
      render(ctx, game.current)
      hudTimer += dt
      if (hudTimer > 0.1) {
        hudTimer = 0
        setTick((t) => t + 1)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = game.current
      if (e.key === 'Escape') {
        s.buildType = null
        s.selectedId = null
        s.fuseMode = false
      } else if (e.key === '1') selectBuild('shooter')
      else if (e.key === '2') selectBuild('cannon')
      else if (e.key === '3') selectBuild('lightning')
      else if (e.key === '4') selectBuild('retarder')
      else if (e.key === '5') selectBuild('incomeFarm')
      else if (e.key === '6') selectBuild('buffer')
      else if (e.key === '7') selectBuild('teleporter')
      else if (e.key === '8') selectBuild('boulderLauncher')
      else if (e.key === ' ') {
        e.preventDefault()
        startWave(s)
      } else if (e.key.toLowerCase() === 'f' && s.selectedId) s.fuseMode = !s.fuseMode
      refresh()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flash = (msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage((m) => (m === msg ? null : m)), 1800)
  }

  const cellFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT
    return { col: Math.floor(x / CELL), row: Math.floor(y / CELL) }
  }

  const handleClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = game.current
    if (s.status !== 'playing') return
    const { col, row } = cellFromEvent(e)
    const clicked = towerAt(s, col, row)

    if (debugOpen && debugTowerType) {
      if (placeTower(s, debugTowerType, col, row, true)) {
        flash(`${TOWERS[debugTowerType].name} criada gratuitamente`)
        setDebugTowerType('')
      } else {
        flash('Local inválido ou já ocupado')
      }
      refresh()
      return
    }

    if (s.fuseMode && s.selectedId) {
      if (clicked && clicked.id !== s.selectedId) {
        const source = s.towers.find((t) => t.id === s.selectedId)!
        const result = fusionResult(source.type, clicked.type)
        const fusionCost = result ? getFusionCost(source, clicked) : 0
        if (result && s.money < fusionCost) {
          flash(`Fusão custa ${fusionCost} créditos; saldo insuficiente`)
        } else if (result && fuseTowers(s, source.id, clicked.id)) {
          flash(`Fusão: ${TOWERS[result].name} (-${fusionCost})!`)
        } else {
          flash(
            TOWERS[source.type].tier !== TOWERS[clicked.type].tier
              ? 'Só é possível fundir torres do mesmo tier'
              : 'Não existe fusão para essas torres',
          )
        }
      }
      s.fuseMode = false
      refresh()
      return
    }

    if (clicked) {
      s.selectedId = clicked.id
      s.buildType = null
    } else if (s.buildType) {
      if (!placeTower(s, s.buildType, col, row)) {
        flash(s.money < TOWERS[s.buildType].cost ? 'Créditos insuficientes' : 'Não é possível construir aqui')
      }
    } else {
      s.selectedId = null
    }
    refresh()
  }

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    game.current.hover = cellFromEvent(e)
  }

  function selectBuild(type: TowerType) {
    const s = game.current
    s.buildType = s.buildType === type ? null : type
    s.selectedId = null
    s.fuseMode = false
    refresh()
  }

  const restart = () => {
    game.current = createGame()
    refresh()
  }

  const toggleSpeed = () => {
    const next = speed === 1 ? 2 : speed === 2 ? 3 : 1
    speedRef.current = next
    setSpeed(next)
  }

  const s = game.current
  const selected = s.towers.find((t) => t.id === s.selectedId)
  const selDef = selected ? TOWERS[selected.type] : null
  const possibleFusions = selected
    ? (Object.keys(TOWERS) as TowerType[])
        .map((other) => ({ other, result: fusionResult(selected.type, other) }))
        .filter((f): f is { other: TowerType; result: TowerType } => !!f.result)
    : []

  return (
    <main className="min-h-dvh bg-[#050914] text-slate-100 font-sans flex flex-col">
      <header className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-sky-500/20 bg-[#0a1226]">
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-md border border-sky-500/30 px-3 py-1.5 text-sm hover:bg-sky-500/10"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Menu
        </button>
        <h1 className="font-display text-lg tracking-widest text-sky-300">FUSION TD</h1>
        <div className="ml-auto flex items-center gap-4 font-display text-sm">
          <Stat icon={<Heart className="size-4 text-rose-400" aria-hidden />} label="Vidas" value={s.lives} />
          <Stat icon={<Coins className="size-4 text-amber-300" aria-hidden />} label="Créditos" value={s.money} />
          <Stat icon={<Waves className="size-4 text-sky-300" aria-hidden />} label="Onda" value={s.wave} />
          <button onClick={() => { setDebugOpen((v) => !v); setDebugTowerType(''); }} aria-pressed={debugOpen} className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${debugOpen ? 'border-amber-300 bg-amber-400/15 text-amber-200' : 'border-slate-600 text-slate-300 hover:border-amber-300'}`}><Wrench className="size-3.5" aria-hidden /> Debug</button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row gap-4 p-4">
        <div className="relative flex-1 flex items-start justify-center">
          <div className="relative w-full max-w-[960px]">
            <canvas
              ref={canvasRef}
              onPointerDown={handleClick}
              onPointerMove={handleMove}
              onPointerLeave={() => (game.current.hover = null)}
              className="w-full h-auto rounded-lg border border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.15)] touch-none cursor-crosshair"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
              aria-label="Campo de batalha"
            />
            {message && (
              <div
                role="status"
                className="absolute left-1/2 top-4 -translate-x-1/2 rounded-md border border-sky-400/40 bg-[#0a1226]/90 px-4 py-2 font-display text-sm text-sky-200"
              >
                {message}
              </div>
            )}
            {s.status === 'over' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/75">
                <p className="font-display text-4xl tracking-widest text-rose-400">GAME OVER</p>
                <p className="text-slate-300">Você sobreviveu até a onda {s.wave}</p>
                <button
                  onClick={restart}
                  className="flex items-center gap-2 rounded-md bg-sky-500 px-5 py-2 font-display text-slate-950 hover:bg-sky-400"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Jogar novamente
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-72 flex flex-col gap-4">
          {debugOpen && (
            <section className="rounded-lg border border-amber-400/40 bg-[#171526] p-3">
              <h2 className="mb-2 flex items-center gap-2 font-display text-xs tracking-widest text-amber-300"><Bug className="size-4" aria-hidden /> MODO DEBUG</h2>
              <p className="mb-3 text-[11px] leading-relaxed text-slate-400">Crie qualquer torre sem gastar créditos ou invoque insetos instantaneamente. Para colocar uma torre, escolha-a e toque em uma casa livre do mapa.</p>
              <label className="mb-1 block text-xs text-slate-300" htmlFor="debug-enemy">Spawnar inseto</label>
              <div className="flex gap-2">
                <select id="debug-enemy" value={debugEnemyType} onChange={(event) => setDebugEnemyType(event.target.value as EnemyType)} className="min-w-0 flex-1 rounded-md border border-slate-600 bg-[#071020] px-2 py-2 text-sm">
                  {(Object.keys(ENEMIES) as EnemyType[]).map((type) => <option key={type} value={type}>{ENEMIES[type].name}</option>)}
                </select>
                <button onClick={() => { spawnDebugEnemy(game.current, debugEnemyType); refresh(); flash(`${ENEMIES[debugEnemyType].name} spawnado`); }} className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950">Spawn</button>
              </div>
              <label className="mb-1 mt-3 block text-xs text-slate-300" htmlFor="debug-tower">Spawnar torre grátis</label>
              <select id="debug-tower" value={debugTowerType} onChange={(event) => setDebugTowerType(event.target.value as TowerType | '')} className="mb-2 w-full rounded-md border border-slate-600 bg-[#071020] px-2 py-2 text-sm">
                <option value="">Selecione uma torre...</option>
                {(Object.keys(TOWERS) as TowerType[]).map((type) => <option key={type} value={type}>{TOWERS[type].name} (T{TOWERS[type].tier})</option>)}
              </select>
              {debugTowerType && <div className="flex items-center gap-2"><SpriteIcon tower={debugTowerType} label={TOWERS[debugTowerType].name} /><span className="min-w-0 flex-1 text-xs text-amber-200">Toque no mapa para posicionar grátis</span><button onClick={() => setDebugTowerType('')} className="rounded border border-slate-600 px-2 py-1 text-xs">Cancelar</button></div>}
            </section>
          )}
          <section className="rounded-lg border border-sky-500/20 bg-[#0a1226] p-3">
            <h2 className="mb-2 font-display text-xs tracking-widest text-sky-300/80">CONSTRUIR</h2>
            <div className="grid grid-cols-2 gap-2">
              {BUILDABLE.map((type, i) => {
                const def = TOWERS[type]
                const active = s.buildType === type
                return (
                  <button
                    key={type}
                    onClick={() => selectBuild(type)}
                    disabled={s.money < def.cost && !active}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1 rounded-md border p-2 text-sm transition-colors disabled:opacity-40 ${
                      active ? 'border-sky-300 bg-sky-500/15' : 'border-slate-700 hover:border-sky-500/50'
                    }`}
                  >
                    <SpriteIcon tower={type} label={def.name} />
                    <span className="font-medium">{def.name}</span>
                    {TOWER_ELEMENTS[type] && (
                      <span className="flex items-center gap-1 text-[10px] leading-tight text-violet-300">
                        <TowerElementIcons type={type} />
                        {ELEMENT_LABELS[TOWER_ELEMENTS[type]!]}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-300 text-xs">
                      <Coins className="size-3" aria-hidden />
                      {def.cost}
                    </span>
                    <kbd className="text-[10px] text-slate-500">{`[${i + 1}]`}</kbd>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-violet-500/20 bg-[#0a1226] p-3">
            <h2 className="mb-2 font-display text-xs tracking-widest text-violet-300/90">FUSÕES TIER 2</h2>
            <div className="flex flex-col gap-2">
              {([
                { result: 'cryoMortar', recipe: 'Mortar + Icicles' },
                { result: 'tripleShooter', recipe: 'Dual Shooter + Dual Shooter' },
                { result: 'economyHouse', recipe: 'Income Tax + Income Tax' },
                { result: 'commsBuilding', recipe: 'Comms Lan House + Comms Lan House' },
                { result: 'soulstorm', recipe: 'Plasma Rod + Tesla Rod' },
                { result: 'pebblesLauncher', recipe: 'Rock Launcher + Rock Launcher' },
                { result: 'flamethrower', recipe: 'Dual Shooter + Cluster Cannon' },
                { result: 'hyperLaser', recipe: 'Plasma Rod + Plasma Blaster' },
              ] as const).map(({ result, recipe }) => (
                <div key={result} className="flex items-center gap-2 rounded-md border border-slate-700/80 bg-slate-900/50 p-2">
                  <SpriteIcon tower={result} label={TOWERS[result].name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><p className="text-sm font-medium text-slate-100">{TOWERS[result].name}</p><TowerElementIcons type={result} /></div>
                    <p className="text-[11px] leading-snug text-slate-400">{recipe}</p>
                  </div>
                  <span className="text-[10px] text-violet-300">T2</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-sky-500/20 bg-[#0a1226] p-3 min-h-40">
            <h2 className="mb-2 font-display text-xs tracking-widest text-sky-300/80">TORRE SELECIONADA</h2>
            {selected && selDef ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <SpriteIcon tower={selected.type} label={selDef.name} size={40} />
                  <div>
                    <p className="font-medium">{selDef.name}</p>
                    <p className="text-xs text-slate-400">Tier {selDef.tier} · {TOWER_ELEMENTS[selected.type] ? ELEMENT_LABELS[TOWER_ELEMENTS[selected.type]!] : 'Suporte'}</p>
                    {TOWER_ELEMENTS[selected.type] && <TowerElementIcons type={selected.type} />}
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {['incomeFarm','incomeTax','economyHouse'].includes(selected.type) ? <><dt className="text-slate-400">Dinheiro/sinal</dt><dd>{selected.type === 'incomeFarm' ? 30 : selected.type === 'incomeTax' ? 70 : 80}</dd><dt className="text-slate-400">Sinais por round</dt><dd>{selected.type === 'incomeFarm' ? 5 : selected.type === 'incomeTax' ? 7 : 8}</dd><dt className="text-slate-400">Total por round</dt><dd>{selected.type === 'incomeFarm' ? 150 : selected.type === 'incomeTax' ? 490 : 640}</dd>{selected.type === 'economyHouse' && <><dt className="text-slate-400">Bônus por abate</dt><dd>+10%</dd></>}</> : selected.type === 'soulstorm' ? <><dt className="text-slate-400">Essência</dt><dd>{selected.essence}/{SOULSTORM_ESSENCE_REQUIRED} abates elétricos</dd><dt className="text-slate-400">Dano total do raio</dt><dd>300 (dividido)</dd><dt className="text-slate-400">Alcance</dt><dd>Infinito</dd><dt className="text-slate-400">Perfuração</dt><dd>Infinita</dd></> : ['buffer','commsLanHouse','commsBuilding','electricalStation'].includes(selected.type) ? <><dt className="text-slate-400">Alcance de suporte</dt><dd>{selDef.range}</dd><dt className="text-slate-400">Bônus de dano</dt><dd>{selected.type === 'commsLanHouse' ? '+20%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+10%' : '+5%'}</dd><dt className="text-slate-400">Bônus de alcance</dt><dd>{selected.type === 'commsLanHouse' ? '+10%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+6%' : '+3%'}</dd><dt className="text-slate-400">Bônus de cadência</dt><dd>{selected.type === 'commsLanHouse' ? '+20%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+10%' : '+5%'}</dd>{selected.type === 'commsBuilding' && <><dt className="text-slate-400">Overclock</dt><dd>2x alcance e cadência</dd><dt className="text-slate-400">Duração / intervalo</dt><dd>4 s / 12 s</dd></>}{selected.type === 'electricalStation' && <><dt className="text-slate-400">Renda próxima</dt><dd>+50%</dd></>}</> : <><dt className="text-slate-400">{selected.type === 'lightning' ? 'Dano total' : selected.type === 'tesla' || selected.type === 'raygun' ? 'Dano/pulso' : 'Dano'}</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Alcance</dt><dd>{selDef.range}</dd><dt className="text-slate-400">{selected.type === 'lightning' || selected.type === 'tesla' ? 'Pulsos/s' : 'Disparos/s'}</dt><dd>{selected.type === 'tesla' ? `${(1 / 0.12).toFixed(1)} máx.` : selDef.fireRate}</dd><dt className="text-slate-400">{selected.type === 'raygun' ? 'Aura' : 'Área'}</dt><dd>{selDef.splash || '—'}</dd>{selected.type === 'boulderLauncher' && <><dt className="text-slate-400">Perfuração</dt><dd>10 inimigos</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−20 de dano e tamanho menor</dd></>}{selected.type === 'rockLauncher' && <><dt className="text-slate-400">Pedras por disparo</dt><dd>2</dd><dt className="text-slate-400">Perfuração</dt><dd>Até 13 inimigos por pedra</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−10 de dano e tamanho menor</dd></>}{selected.type === 'pebblesLauncher' && <><dt className="text-slate-400">Pedras por disparo</dt><dd>4</dd><dt className="text-slate-400">Dano inicial por pedra</dt><dd>80% da Rock Launcher</dd><dt className="text-slate-400">Perfuração</dt><dd>Até 10 inimigos por pedra</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−10 de dano e tamanho menor</dd></>}{selected.type === 'flamethrower' && <><dt className="text-slate-400">Dano por pulso</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Alvos atravessados</dt><dd>Até 10</dd><dt className="text-slate-400">Perda por alvo</dt><dd>12% de dano</dd><dt className="text-slate-400">Ataques por segundo</dt><dd>{selDef.fireRate}</dd></>}{selected.type === 'hyperLaser' && <><dt className="text-slate-400">Dano por inimigo</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Perfuração</dt><dd>Todos os inimigos alinhados</dd><dt className="text-slate-400">Intervalo aleatório</dt><dd>0,5–5 s</dd><dt className="text-slate-400">Duração do raio</dt><dd>0,5 s</dd></>}{selected.type === 'ice' && <><dt className="text-slate-400">Lentidão em área</dt><dd>35% por 0,45 s</dd><dt className="text-slate-400">Congelamento</dt><dd>0,5 s</dd><dt className="text-slate-400">Perfuração</dt><dd>8 inimigos</dd></>}</>}
                </dl>
                <div>
                  <label htmlFor={`target-mode-${selected.id}`} className="mb-1 block text-xs text-slate-400">
                    ALVO ESPECIAL
                  </label>
                  <select
                    id={`target-mode-${selected.id}`}
                    value={selected.targetMode}
                    onChange={(event) => {
                      selected.targetMode = event.target.value as TargetMode
                      refresh()
                    }}
                    className="w-full rounded-md border border-sky-500/30 bg-[#071020] px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
                  >
                    {TARGET_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                  </select>
                </div>
                {possibleFusions.length > 0 ? (
                  <div className="text-xs text-slate-300">
                    <p className="mb-1 text-slate-400">Fusões possíveis:</p>
                    <ul className="flex flex-col gap-0.5">
                      {possibleFusions.map((f) => (
                        <li key={f.other}>
                          + {TOWERS[f.other].name} → <span className="text-emerald-300">{TOWERS[f.result].name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Nenhuma fusão disponível para este tier ainda.</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      s.fuseMode = !s.fuseMode
                      refresh()
                    }}
                    disabled={!possibleFusions.length}
                    aria-pressed={s.fuseMode}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${
                      s.fuseMode ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Merge className="size-4" aria-hidden />
                    {s.fuseMode ? 'Escolha alvo' : 'Fundir [F]'}
                  </button>
                  <button
                    onClick={() => {
                      sellTower(s, selected.id)
                      refresh()
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-rose-500/15 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/25"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    {Math.floor(selected.invested * 0.6)}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-400">
                Clique numa torre para ver detalhes. Use <span className="text-emerald-300">Fundir</span> e depois
                clique numa torre do mesmo tier para combiná-las.
              </p>
            )}
          </section>

          <label className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
            <input
              type="checkbox"
              checked={autoNextWave}
              onChange={(event) => { autoNextWaveRef.current = event.target.checked; setAutoNextWave(event.target.checked) }}
              className="accent-emerald-400"
            />
            Iniciar próxima onda automaticamente
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                startWave(s)
                refresh()
              }}
              disabled={s.waveActive || s.status !== 'playing'}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 font-display text-sm tracking-wider text-slate-950 hover:bg-sky-400 disabled:opacity-40"
            >
              <Play className="size-4" aria-hidden />
              {s.waveActive ? 'Onda em curso' : `Onda ${s.wave + 1}`}
            </button>
            <button
              onClick={toggleSpeed}
              aria-label={`Velocidade ${speed}x`}
              className="flex items-center gap-1 rounded-md border border-sky-500/30 px-3 font-display text-sm hover:bg-sky-500/10"
            >
              <FastForward className="size-4" aria-hidden />
              {speed}x
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5" title={label}>
      {icon}
      <span className="sr-only">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
