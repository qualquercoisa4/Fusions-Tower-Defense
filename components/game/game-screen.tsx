'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Coins, FastForward, Heart, Merge, Play, RotateCcw, Trash2, Waves } from 'lucide-react'
import { BUILDABLE, CELL, HEIGHT, TARGET_MODES, TOWERS, WIDTH, fusionResult, type TargetMode, type TowerType } from '@/lib/game/data'
import {
  createGame,
  fuseTowers,
  placeTower,
  render,
  sellTower,
  startWave,
  towerAt,
  update,
  type GameState,
} from '@/lib/game/engine'
import { SpriteIcon } from './sprite-icon'

export function GameScreen({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const game = useRef<GameState>(createGame())
  const speedRef = useRef(1)
  const [, setTick] = useState(0)
  const [speed, setSpeed] = useState(1)
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

    if (s.fuseMode && s.selectedId) {
      if (clicked && clicked.id !== s.selectedId) {
        const source = s.towers.find((t) => t.id === s.selectedId)!
        const result = fusionResult(source.type, clicked.type)
        const fusionCost = Math.ceil((source.invested + clicked.invested) * 1.1)
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
                    <span className="flex items-center gap-1 text-amber-300 text-xs">
                      <Coins className="size-3" aria-hidden />
                      {def.cost}
                    </span>
                    <kbd className="text-[10px] text-slate-500">{i < 4 ? `[${i + 1}]` : i === 4 ? '[5]' : '[6]'}</kbd>
                  </button>
                )
              })}
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
                    <p className="text-xs text-slate-400">Tier {selDef.tier}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <dt className="text-slate-400">{selected.type === 'lightning' ? 'Dano total' : selected.type === 'tesla' ? 'Dano/pulso' : selected.type === 'raygun' ? 'Dano/pulso' : 'Dano'}</dt>
                  <dd>{selDef.damage}</dd>
                  <dt className="text-slate-400">Alcance</dt>
                  <dd>{selDef.range}</dd>
                  <dt className="text-slate-400">{selected.type === 'lightning' || selected.type === 'tesla' ? 'Pulsos/s' : 'Disparos/s'}</dt>
                  <dd>{selected.type === 'tesla' ? `${(1 / 0.12).toFixed(1)} máx.` : selDef.fireRate}</dd>
                  <dt className="text-slate-400">{selected.type === 'raygun' ? 'Aura' : 'Área'}</dt>
                  <dd>{selDef.splash || '—'}</dd>
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
