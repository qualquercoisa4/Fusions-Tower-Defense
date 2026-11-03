'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, ArrowLeft, Atom, Bomb, Bug, CircleDot, Coins, Crosshair, FastForward, Flame, Heart, Merge, Mountain, Pickaxe, Play, RotateCcw, Snowflake, Sparkles, Trash2, Waves, Wind, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { BUILDABLE, CELL, ENEMIES, HEIGHT, MAPS, TARGET_MODES, TOWERS, TOWER_ELEMENTS, TOWER_SECONDARY_ELEMENTS, WIDTH, fusionResult, type ElementClass, type EnemyType, type MapId, type TargetMode, type TowerType } from '@/lib/game/data'
import {
  createGame,
  fuseTowers,
  placeTowerAt,
  isBuildableAt,
  towerAtPoint,
  render,
  spawnDebugEnemy,
  sellTower,
  startWave,
  update,
  type GameState,
  getFusionCost,
  repairTower,
  collectMasterBank,
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
  air: 'Ar',
  explosive: 'Explosivo',
}

const BASE_TOWER_ELEMENT_ICONS: Partial<Record<TowerType, readonly [LucideIcon, LucideIcon]>> = {
  shooter: [CircleDot, Crosshair],
  cannon: [Flame, Bomb],
  lightning: [Zap, Activity],
  retarder: [Snowflake, Wind],
  boulderLauncher: [Mountain, Pickaxe],
  teleporter: [Atom, Sparkles],
  bladeOfChaos: [CircleDot, Atom],
}

const FUSION_ELEMENT_ICONS: Record<ElementClass, LucideIcon> = {
  normal: CircleDot,
  fire: Flame,
  electricity: Zap,
  ice: Snowflake,
  earth: Mountain,
  plasma: Atom,
  air: Wind,
  explosive: Bomb,
}

function TowerElementIcons({ type }: { type: TowerType }) {
  const element = TOWER_ELEMENTS[type]
  const secondary = TOWER_SECONDARY_ELEMENTS[type] ?? element
  const baseIcons = BASE_TOWER_ELEMENT_ICONS[type]
  const icons: LucideIcon[] = baseIcons ? [...baseIcons] : element ? [FUSION_ELEMENT_ICONS[element], FUSION_ELEMENT_ICONS[secondary ?? element]] : []
  if (!icons.length) return null
  const label = [element, secondary].filter(Boolean).map(item => ELEMENT_LABELS[item!]).join(' + ')
  return (
    <span className="inline-flex items-center gap-1 text-violet-300" role="img" aria-label={label} title={label}>
      {icons.map((Icon, index) => <Icon key={index} className="size-3.5" aria-hidden />)}
    </span>
  )
}

export function GameScreen({ onExit, mapId }: { onExit: () => void; mapId: MapId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const game = useRef<GameState>(createGame(mapId))
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
        s.pendingPlacement = null
        s.placementDragging = false
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

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(WIDTH, ((e.clientX - rect.left) / rect.width) * WIDTH))
    const y = Math.max(0, Math.min(HEIGHT, ((e.clientY - rect.top) / rect.height) * HEIGHT))
    return { x, y, col: Math.floor(x / CELL), row: Math.floor(y / CELL) }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = game.current
    if (s.status !== 'playing') return
    const point = pointFromEvent(e)
    const isDebugPlacement = !!(debugOpen && debugTowerType)
    if (s.buildType || isDebugPlacement) {
      const existing = !isDebugPlacement ? towerAtPoint(s, point.x, point.y) : null
      if (existing) {
        s.selectedId = existing.id
        s.buildType = null
        s.pendingPlacement = null
        refresh()
        return
      }
      s.pendingPlacement = null
      if (isDebugPlacement && debugTowerType) s.buildType = debugTowerType
      s.placementDragging = true
      s.hover = point
      e.currentTarget.setPointerCapture(e.pointerId)
      refresh()
      return
    }

    const clicked = towerAtPoint(s, point.x, point.y)
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
          flash(TOWERS[source.type].tier !== TOWERS[clicked.type].tier
            ? 'Só é possível fundir torres do mesmo tier'
            : 'Não existe fusão para essas torres')
        }
      }
      s.fuseMode = false
      refresh()
      return
    }
    s.selectedId = clicked?.id ?? null
    refresh()
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = game.current
    if (!s.placementDragging) return
    const point = pointFromEvent(e)
    const type = debugOpen && debugTowerType ? debugTowerType : s.buildType
    if (type) {
      s.pendingPlacement = { type, x: point.x, y: point.y, free: !!(debugOpen && debugTowerType) }
    }
    s.hover = point
    s.placementDragging = false
    refresh()
  }

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    game.current.hover = pointFromEvent(e)
  }

  const confirmPlacement = () => {
    const s = game.current
    const pending = s.pendingPlacement
    if (!pending) return
    if (placeTowerAt(s, pending.type, pending.x, pending.y, pending.free)) {
      flash(`${TOWERS[pending.type].name} posicionada`)
      if (pending.free) setDebugTowerType('')
      s.buildType = null
    } else {
      flash(s.money < TOWERS[pending.type].cost && !pending.free ? 'Créditos insuficientes' : 'Posição inválida ou muito próxima de outra torre')
    }
    s.pendingPlacement = null
    s.hover = null
    refresh()
  }

  const cancelPlacement = () => {
    const s = game.current
    s.pendingPlacement = null
    s.placementDragging = false
    s.buildType = null
    s.hover = null
    if (debugOpen) setDebugTowerType('')
    refresh()
  }

  function selectBuild(type: TowerType) {
    const s = game.current
    s.buildType = s.buildType === type ? null : type
    s.pendingPlacement = null
    s.placementDragging = false
    s.selectedId = null
    s.fuseMode = false
    refresh()
  }

  const restart = () => {
    game.current = createGame(mapId)
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
    <main className="h-dvh overflow-hidden bg-[#050914] text-slate-100 font-sans flex flex-col">
      <header className="flex h-[58px] shrink-0 flex-wrap items-center gap-3 border-b border-sky-500/20 bg-[#0a1226] px-4 py-2">
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-md border border-sky-500/30 px-3 py-1.5 text-sm hover:bg-sky-500/10"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Menu
        </button>
        <h1 className="font-display text-lg tracking-widest text-sky-300">FUSION TD</h1><span className="hidden text-xs text-slate-400 sm:inline">{MAPS[mapId].name} · {MAPS[mapId].difficulty}</span>
        <div className="ml-auto flex items-center gap-4 font-display text-sm">
          <Stat icon={<Heart className="size-4 text-rose-400" aria-hidden />} label="Vidas" value={s.lives} />
          <Stat icon={<Coins className="size-4 text-amber-300" aria-hidden />} label="Créditos" value={s.money} />
          <Stat icon={<Waves className="size-4 text-sky-300" aria-hidden />} label="Onda" value={s.wave} />
          <button onClick={() => { setDebugOpen((v) => !v); setDebugTowerType(''); }} aria-pressed={debugOpen} className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${debugOpen ? 'border-amber-300 bg-amber-400/15 text-amber-200' : 'border-slate-600 text-slate-300 hover:border-amber-300'}`}><Wrench className="size-3.5" aria-hidden /> Debug</button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden p-2 lg:grid-cols-[220px_minmax(0,1fr)_270px] lg:grid-rows-[minmax(0,1fr)_auto]">
        <div className="relative flex min-h-0 min-w-0 items-center justify-center lg:col-start-2 lg:row-start-1">
          <div className="relative flex h-full min-h-0 w-full items-center justify-center">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handleMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={cancelPlacement}
              onPointerLeave={() => { if (!game.current.placementDragging) game.current.hover = null }}
              className="block h-auto w-full max-w-full rounded-lg border border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.15)] touch-none cursor-crosshair"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}`, width: `min(100%, calc((100dvh - 150px) * ${WIDTH / HEIGHT}))` }}
              aria-label="Campo de batalha"
            />
            {s.pendingPlacement && (
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/15 bg-slate-950/95 p-2 shadow-2xl">
                <span className="px-2 text-xs text-slate-200">{TOWERS[s.pendingPlacement.type].name}</span>
                <button onClick={confirmPlacement} disabled={!isBuildableAt(s,s.pendingPlacement.x,s.pendingPlacement.y,s.pendingPlacement.type) || (!s.pendingPlacement.free && s.money < TOWERS[s.pendingPlacement.type].cost)} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
                  <span aria-hidden>✓</span> Confirmar
                </button>
                <button onClick={cancelPlacement} aria-label="Cancelar posicionamento" className="flex size-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/35">
                  <span className="text-xl leading-none" aria-hidden>×</span>
                </button>
              </div>
            )}
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

        <aside className="contents">
          {debugOpen && (
            <section className="rounded-lg border border-amber-400/40 bg-[#171526] p-2 lg:col-start-1 lg:row-start-2">
              <h2 className="mb-1 flex items-center gap-2 font-display text-xs tracking-widest text-amber-300"><Bug className="size-4" aria-hidden /> MODO DEBUG</h2>
              <p className="mb-3 text-[11px] leading-relaxed text-slate-400">Crie qualquer torre sem gastar créditos ou invoque insetos instantaneamente. Selecione uma torre, arraste-a até o local desejado e confirme no botão verde.</p>
              <label className="mb-1 block text-xs text-slate-300" htmlFor="debug-enemy">Spawnar inseto</label>
              <div className="flex gap-1.5">
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
          <section className="min-h-0 overflow-hidden rounded-lg border border-rose-500/30 bg-[#0a1226] p-2 lg:col-start-1 lg:row-start-1">
            <h2 className="mb-1 font-display text-xs tracking-widest text-rose-300">CONSTRUIR</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {BUILDABLE.map((type, i) => {
                const def = TOWERS[type]
                const active = s.buildType === type
                return (
                  <button
                    key={type}
                    onClick={() => selectBuild(type)}
                    disabled={s.money < def.cost && !active}
                    aria-pressed={active}
                    className={`flex min-h-0 flex-col items-center gap-0.5 rounded-md border p-1.5 text-xs transition-colors disabled:opacity-40 ${
                      active ? 'border-rose-300 bg-rose-500/15' : 'border-slate-700 hover:border-rose-500/50'
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

          <section className="min-h-0 overflow-hidden rounded-lg border border-emerald-500/25 bg-[#0a1226] p-2 lg:col-start-3 lg:row-start-1 lg:row-span-2">
            <h2 className="mb-1 font-display text-xs tracking-widest text-emerald-300">TORRE SELECIONADA</h2>
            {selected && selDef ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <SpriteIcon tower={selected.type} label={selDef.name} size={40} />
                  <div>
                    <p className="font-medium">{selDef.name}</p>
                    <p className="text-xs text-slate-400">Tier {selDef.tier} · {TOWER_ELEMENTS[selected.type] ? ELEMENT_LABELS[TOWER_ELEMENTS[selected.type]!] : 'Suporte'}</p>
                    {TOWER_ELEMENTS[selected.type] && <TowerElementIcons type={selected.type} />}
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <dt className="text-slate-400">Vida da torre</dt><dd className="font-semibold tabular-nums">{Math.ceil(selected.hp)} / {selected.maxHp}</dd>
                  {selected.type === 'masterBank' ? <><dt className="text-slate-400">Renda por rodada</dt><dd>1.000 créditos</dd><dt className="text-slate-400">Conta principal</dt><dd>800 créditos</dd><dt className="text-slate-400">Saldo acumulado</dt><dd className="font-semibold text-amber-300">{Math.floor(selected.bankedMoney)} créditos</dd><dt className="text-slate-400">Juros por rodada</dt><dd>20%</dd></> : ['incomeFarm','incomeTax','economyHouse'].includes(selected.type) ? <><dt className="text-slate-400">Dinheiro/sinal</dt><dd>{selected.type === 'incomeFarm' ? 30 : selected.type === 'incomeTax' ? 70 : 80}</dd><dt className="text-slate-400">Sinais por round</dt><dd>{selected.type === 'incomeFarm' ? 5 : selected.type === 'incomeTax' ? 7 : 8}</dd><dt className="text-slate-400">Total por round</dt><dd>{selected.type === 'incomeFarm' ? 150 : selected.type === 'incomeTax' ? 490 : 640}</dd>{selected.type === 'economyHouse' && <><dt className="text-slate-400">Bônus por abate</dt><dd>+10%</dd></>}</> : selected.type === 'soulstorm' ? <><dt className="text-slate-400">Essência</dt><dd>{selected.essence}/{SOULSTORM_ESSENCE_REQUIRED} abates elétricos</dd><dt className="text-slate-400">Dano total do raio</dt><dd>300 (dividido)</dd><dt className="text-slate-400">Alcance</dt><dd>Infinito</dd><dt className="text-slate-400">Perfuração</dt><dd>Infinita</dd></> : ['buffer','commsLanHouse','commsBuilding','electricalStation'].includes(selected.type) ? <><dt className="text-slate-400">Alcance de suporte</dt><dd>{selDef.range}</dd><dt className="text-slate-400">Bônus de dano</dt><dd>{selected.type === 'commsLanHouse' ? '+20%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+10%' : '+5%'}</dd><dt className="text-slate-400">Bônus de alcance</dt><dd>{selected.type === 'commsLanHouse' ? '+10%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+6%' : '+3%'}</dd><dt className="text-slate-400">Bônus de cadência</dt><dd>{selected.type === 'commsLanHouse' ? '+20%' : selected.type === 'commsBuilding' ? '+15%' : selected.type === 'buffer' ? '+10%' : '+5%'}</dd>{selected.type === 'buffer' && <><dt className="text-slate-400">Reparo por rodada</dt><dd>18 HP nas torres próximas</dd></>}{selected.type === 'commsBuilding' && <><dt className="text-slate-400">Overclock</dt><dd>2x alcance e cadência</dd><dt className="text-slate-400">Duração / intervalo</dt><dd>4 s / 12 s</dd></>}{selected.type === 'electricalStation' && <><dt className="text-slate-400">Renda próxima</dt><dd>+50%</dd></>}</> : <><dt className="text-slate-400">{selected.type === 'lightning' ? 'Dano total' : selected.type === 'tesla' || selected.type === 'raygun' ? 'Dano/pulso' : 'Dano'}</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Alcance</dt><dd>{selDef.range}</dd><dt className="text-slate-400">{selected.type === 'lightning' || selected.type === 'tesla' ? 'Pulsos/s' : 'Disparos/s'}</dt><dd>{selected.type === 'tesla' ? `${(1 / 0.12).toFixed(1)} máx.` : selDef.fireRate}</dd><dt className="text-slate-400">{selected.type === 'raygun' ? 'Aura' : 'Área'}</dt><dd>{selDef.splash || '—'}</dd>{selected.type === 'boulderLauncher' && <><dt className="text-slate-400">Perfuração</dt><dd>10 inimigos</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−20 de dano e tamanho menor</dd></>}{selected.type === 'rockLauncher' && <><dt className="text-slate-400">Pedras por disparo</dt><dd>2</dd><dt className="text-slate-400">Perfuração</dt><dd>Até 13 inimigos por pedra</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−10 de dano e tamanho menor</dd></>}{selected.type === 'pebblesLauncher' && <><dt className="text-slate-400">Pedras por disparo</dt><dd>4</dd><dt className="text-slate-400">Dano inicial por pedra</dt><dd>80% da Rock Launcher</dd><dt className="text-slate-400">Perfuração</dt><dd>Até 10 inimigos por pedra</dd><dt className="text-slate-400">Redução por impacto</dt><dd>−10 de dano e tamanho menor</dd></>}{selected.type === 'flamethrower' && <><dt className="text-slate-400">Dano por pulso</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Alvos atravessados</dt><dd>Até 10</dd><dt className="text-slate-400">Perda por alvo</dt><dd>12% de dano</dd><dt className="text-slate-400">Ataques por segundo</dt><dd>{selDef.fireRate}</dd></>}{selected.type === 'hyperLaser' && <><dt className="text-slate-400">Dano por inimigo</dt><dd>{selDef.damage}</dd><dt className="text-slate-400">Perfuração</dt><dd>Todos os inimigos alinhados</dd><dt className="text-slate-400">Intervalo aleatório</dt><dd>0,5–5 s</dd><dt className="text-slate-400">Duração do raio</dt><dd>0,5 s</dd></>}{selected.type === 'ice' && <><dt className="text-slate-400">Lentidão em área</dt><dd>35% por 0,45 s</dd><dt className="text-slate-400">Congelamento</dt><dd>0,5 s</dd><dt className="text-slate-400">Perfuração</dt><dd>8 inimigos</dd></>}</>}
                </dl>
                {selected.type === 'masterBank' && <button onClick={() => { const amount = collectMasterBank(s, selected.id); flash(amount ? `Sacados ${amount} créditos` : 'Nenhum saldo disponível'); refresh() }} disabled={selected.bankedMoney <= 0} className="w-full rounded-md bg-amber-400/15 px-3 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-400/25 disabled:opacity-40">Sacar {Math.floor(selected.bankedMoney)} créditos</button>}
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
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(selected.hp / selected.maxHp) * 100}%`, backgroundColor: selected.hp / selected.maxHp > 0.5 ? "#4ade80" : selected.hp / selected.maxHp > 0.25 ? "#facc15" : "#fb7185" }} />
                </div>
                <button
                  onClick={() => {
                    const restored = repairTower(s, selected.id)
                    flash(restored ? `Torre reparada: +${restored} HP` : "Reparo indisponível ou créditos insuficientes")
                    refresh()
                  }}
                  disabled={selected.hp >= selected.maxHp || s.money < Math.ceil(Math.min(50, selected.maxHp - selected.hp))}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/25 disabled:opacity-40"
                >
                  <Wrench className="size-4" aria-hidden />
                  Reparar até 50 HP · {Math.ceil(Math.min(50, selected.maxHp - selected.hp))} créditos
                </button>
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

          <section className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-sky-500/25 bg-[#0a1226] p-2 lg:col-start-2 lg:row-start-2">
          <label className="flex items-center gap-2 rounded-md border border-sky-500/30 bg-sky-500/5 px-2 py-1.5 text-[11px] text-sky-200">
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
              className="flex items-center justify-center gap-2 rounded-md bg-sky-500 px-3 py-2 font-display text-xs tracking-wider text-slate-950 hover:bg-sky-400 disabled:opacity-40"
            >
              <Play className="size-4" aria-hidden />
              {s.waveActive ? 'Onda em curso' : `Onda ${s.wave + 1}`}
            </button>
            <button
              onClick={toggleSpeed}
              aria-label={`Velocidade ${speed}x`}
              className="flex items-center gap-1 rounded-md border border-sky-500/30 px-2 font-display text-xs hover:bg-sky-500/10"
            >
              <FastForward className="size-4" aria-hidden />
              {speed}x
            </button>
          </div>
          </section>
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
