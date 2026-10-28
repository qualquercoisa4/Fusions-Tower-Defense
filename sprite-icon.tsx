'use client'

import { useEffect, useRef } from 'react'
import type { EnemyType, TowerType } from '@/lib/game/data'
import { drawBug, drawTower } from '@/lib/game/engine'

type Props = { size?: number; label: string } & (
  | { tower: TowerType; enemy?: never }
  | { enemy: EnemyType; tower?: never }
)

export function SpriteIcon({ size = 48, label, tower, enemy }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale((size * dpr) / 48, (size * dpr) / 48)
    ctx.clearRect(0, 0, 48, 48)
    if (tower) drawTower(ctx, tower, 24, 24, -Math.PI / 4)
    else if (enemy) {
      ctx.translate(24, 24)
      ctx.scale(1.4, 1.4)
      drawBug(ctx, enemy, 0, 0, -Math.PI / 2, 0.3)
    }
  }, [size, tower, enemy])

  return <canvas ref={ref} role="img" aria-label={label} style={{ width: size, height: size }} />
}
