import {
  CELL,
  COLS,
  ENEMIES,
  HEIGHT,
  PATH,
  PATH_CELLS,
  ROWS,
  TOWERS,
  WIDTH,
  buildWave,
  fusionResult,
  hpScale,
  type EnemyType,
  type TowerType,
  type TargetMode,
} from './data'

export interface Enemy {
  id: number
  type: EnemyType
  x: number
  y: number
  hp: number
  maxHp: number
  reviveHp: number
  frozenTimer: number
  slowTimer: number
  slowFactor: number
  jumpCooldown: number
  airborneTimer: number
  healCooldown: number
  bossThreshold: number
  spawnCooldown: number
  helmet: boolean
  wp: number
  dist: number
  angle: number
  anim: number
  alive: boolean
  cocooning: boolean
  cocoonTimer: number
}

export interface Tower {
  id: number
  type: TowerType
  col: number
  row: number
  x: number
  y: number
  cooldown: number
  angle: number
  invested: number
  recoil: number
  beamTargets: number[]
  targetMode: TargetMode
  chargeTargetId: number | null
  chargeTime: number
}

type Projectile =
  | {
      kind: 'direct'
      x: number
      y: number
      tx: number
      ty: number
      targetId: number
      speed: number
      damage: number
      splash: number
      color: string
      size: number
      sourceType?: TowerType
    }
  | {
      kind: 'energy'
      x: number
      y: number
      dirX: number
      dirY: number
      traveled: number
      maxDistance: number
      speed: number
      aura: number
      hitTimers: Record<number, number>
      damage: number
      color: string
      size: number
    }
  | {
      kind: 'ice'
      x: number
      y: number
      dirX: number
      dirY: number
      traveled: number
      maxDistance: number
      speed: number
      damage: number
      color: string
      size: number
      freezeDuration: number
      slowDuration: number
      slowFactor: number
      hitLimit: number
      hitIds: number[]
      splitOnHit: boolean
      explodeAtLimit: boolean
      splash: number
      splashFreezeDuration: number
      sourceType?: TowerType
    }
  | {
      kind: 'arc'
      sx: number
      sy: number
      tx: number
      ty: number
      t: number
      duration: number
      height: number
      damage: number
      splash: number
      cluster: boolean
      color: string
      size: number
    }

interface LightningStrike {
  x: number
  y: number
  t: number
  dur: number
  color: string
}

interface LightningFlash {
  points: { x: number; y: number }[]
  t: number
  dur: number
  color: string
}

interface Explosion {
  x: number
  y: number
  r: number
  t: number
  dur: number
  color: string
}

export interface GameState {
  enemies: Enemy[]
  towers: Tower[]
  projectiles: Projectile[]
  explosions: Explosion[]
  strikes: LightningStrike[]
  lightningFlashes: LightningFlash[]
  money: number
  lives: number
  wave: number
  waveActive: boolean
  spawnQueue: { type: EnemyType; delay: number }[]
  spawnTimer: number
  status: 'playing' | 'over'
  nextId: number
  buildType: TowerType | null
  selectedId: number | null
  fuseMode: boolean
  hover: { col: number; row: number } | null
  time: number
  seenEnemyTypes: EnemyType[]
  bugPrinceDefeated: boolean
  swarmCounter: number
}

export function createGame(): GameState {
  return {
    enemies: [],
    towers: [],
    projectiles: [],
    explosions: [],
    strikes: [],
    lightningFlashes: [],
    money: 180,
    lives: 20,
    wave: 0,
    waveActive: false,
    spawnQueue: [],
    spawnTimer: 0,
    status: 'playing',
    nextId: 1,
    buildType: null,
    selectedId: null,
    fuseMode: false,
    hover: null,
    time: 0,
    seenEnemyTypes: [],
    bugPrinceDefeated: false,
    swarmCounter: 0,
  }
}

export const isBuildable = (s: GameState, col: number, row: number) =>
  col >= 0 &&
  row >= 0 &&
  col < COLS &&
  row < ROWS &&
  !PATH_CELLS.has(`${col},${row}`) &&
  !s.towers.some((t) => t.col === col && t.row === row)

export const towerAt = (s: GameState, col: number, row: number) =>
  s.towers.find((t) => t.col === col && t.row === row)

export function placeTower(s: GameState, type: TowerType, col: number, row: number) {
  const cost = TOWERS[type].cost
  if (s.money < cost || !isBuildable(s, col, row)) return false
  s.money -= cost
  s.towers.push({
    id: s.nextId++,
    type,
    col,
    row,
    x: col * CELL + CELL / 2,
    y: row * CELL + CELL / 2,
    cooldown: 0,
    angle: -Math.PI / 2,
    invested: cost,
    recoil: 0,
    beamTargets: [],
    targetMode: 'first',
    chargeTargetId: null,
    chargeTime: 0,
  })
  return true
}

export function fuseTowers(s: GameState, sourceId: number, targetId: number) {
  const a = s.towers.find((t) => t.id === sourceId)
  const b = s.towers.find((t) => t.id === targetId)
  if (!a || !b || a === b) return false
  const result = fusionResult(a.type, b.type)
  if (!result) return false
  s.towers = s.towers.filter((t) => t !== a)
  b.type = result
  b.invested += a.invested
  b.cooldown = 0.3
  b.beamTargets = []
  b.chargeTargetId = null
  b.chargeTime = 0
  s.explosions.push({ x: b.x, y: b.y, r: 40, t: 0, dur: 0.6, color: TOWERS[result].color })
  s.selectedId = b.id
  return true
}

export function sellTower(s: GameState, id: number) {
  const t = s.towers.find((tw) => tw.id === id)
  if (!t) return
  s.money += Math.floor(t.invested * 0.6)
  s.towers = s.towers.filter((tw) => tw !== t)
  s.selectedId = null
  s.fuseMode = false
}

export function startWave(s: GameState) {
  if (s.waveActive || s.status !== 'playing') return
  s.wave++
  s.waveActive = true
  s.spawnQueue = buildWave(s.wave)
  s.spawnTimer = 0
}

function applyFreeze(e: Enemy, duration: number) {
  if (e.alive && duration > 0) {
    e.frozenTimer = Math.max(e.frozenTimer, duration)
    if (e.type === 'healer') e.healCooldown = 1.5
  }
}

function applySlow(e: Enemy, duration: number, factor: number) {
  if (!e.alive || duration <= 0) return
  e.slowTimer = Math.max(e.slowTimer, duration)
  e.slowFactor = Math.min(e.slowFactor, factor)
}

function freezeInRadius(s: GameState, x: number, y: number, radius: number, duration: number) {
  for (const e of s.enemies) {
    if (e.alive && Math.hypot(e.x - x, e.y - y) <= radius + ENEMIES[e.type].radius) applyFreeze(e, duration)
  }
}

function damageEnemy(s: GameState, e: Enemy, dmg: number, sourceType?: TowerType) {
  if (!e.alive) return
  if(e.type==='jumper'&&e.airborneTimer>0&&sourceType&&['shooter','cannon','retarder'].includes(sourceType))return
  const previousHp=e.hp;e.hp-=dmg
  if(e.type==='bugPrince'){
    const lostThirds=Math.floor((e.maxHp-e.hp)/(e.maxHp/3))
    while(e.bossThreshold<=3&&lostThirds>=e.bossThreshold){
      const count=8+s.swarmCounter*2, types:EnemyType[]=['grunt','runner','jumper']
      for(let i=0;i<count;i++)s.spawnQueue.push({type:types[i%types.length],delay:.06})
      s.swarmCounter++;e.bossThreshold++
    }
    if(e.hp>0&&previousHp>e.hp)s.explosions.push({x:e.x,y:e.y,r:18,t:0,dur:.15,color:'#fbbf24'})
  }
  if (e.hp <= 0) {
    if(e.type==='bugPrince'){
      s.bugPrinceDefeated=true
      for(const ally of s.enemies){if(!ally.alive||!s.seenEnemyTypes.includes(ally.type)||ally.helmet)continue;ally.maxHp=Math.ceil(ally.maxHp*1.25);ally.hp=Math.ceil(Math.max(1,ally.hp)*1.25);ally.helmet=true}
      s.explosions.push({x:e.x,y:e.y,r:100,t:0,dur:1.2,color:'#fbbf24'})
    }
    if (e.type === 'vessel' && !e.cocooning) {
      const nextReviveHp = e.reviveHp * 0.75
      // Regrowth compounds: 75% of the previous regenerated amount each time.
      if (nextReviveHp >= 1) {
        e.reviveHp = nextReviveHp
        e.cocooning = true
        e.cocoonTimer = 5
        e.hp = e.reviveHp
        e.anim = 0
        s.explosions.push({ x: e.x, y: e.y, r: ENEMIES[e.type].radius * 1.8, t: 0, dur: 0.45, color: '#d97706' })
        return
      }
    }
    e.alive = false
    s.money += ENEMIES[e.type].reward
    s.explosions.push({ x: e.x, y: e.y, r: ENEMIES[e.type].radius * 1.6, t: 0, dur: 0.35, color: ENEMIES[e.type].color })
  }
}

function explode(s: GameState, x: number, y: number, radius: number, dmg: number, color: string, sourceType?: TowerType) {
  for (const e of s.enemies) {
    if (e.alive && Math.hypot(e.x - x, e.y - y) <= radius + ENEMIES[e.type].radius) damageEnemy(s, e, dmg, sourceType)
  }
  s.explosions.push({ x, y, r: radius, t: 0, dur: 0.4, color })
}

function findTarget(
  s: GameState,
  t: Tower,
  range: number,
  mode: TargetMode = 'first',
  filter: (enemy: Enemy) => boolean = () => true,
) {
  let best: Enemy | null = null
  for (const e of s.enemies) {
    if (!e.alive || !filter(e)) continue
    const distance = Math.hypot(e.x - t.x, e.y - t.y)
    if (distance > range) continue
    if (!best) {
      best = e
      continue
    }
    const bestDistance = Math.hypot(best.x - t.x, best.y - t.y)
    const preferred =
      mode === 'first' ? e.dist > best.dist
      : mode === 'last' ? e.dist < best.dist
      : mode === 'strongest' ? e.hp > best.hp
      : mode === 'weakest' ? e.hp < best.hp
      : distance < bestDistance
    if (preferred) best = e
  }
  return best
}

function findChainTargets(s: GameState, first: Enemy, linkRange = 76) {
  const targets = [first]
  const used = new Set([first.id])
  while (targets.length < 3) {
    const from = targets[targets.length - 1]
    let nearest: Enemy | null = null
    let nearestDistance = linkRange
    for (const e of s.enemies) {
      if (!e.alive || used.has(e.id)) continue
      const distance = Math.hypot(e.x - from.x, e.y - from.y)
      if (distance <= nearestDistance) {
        nearest = e
        nearestDistance = distance
      }
    }
    if (!nearest) break
    targets.push(nearest)
    used.add(nearest.id)
  }
  return targets
}

function fire(s: GameState, t: Tower, target: Enemy) {
  const def = TOWERS[t.type]
  t.recoil = 1

  if (t.type === 'retarder' || t.type === 'icicles' || t.type === 'snowballer') {
    const dirX = Math.cos(t.angle)
    const dirY = Math.sin(t.angle)
    s.projectiles.push({
      kind: 'ice',
      x: t.x + dirX * 16,
      y: t.y + dirY * 16,
      dirX,
      dirY,
      traveled: 0,
      maxDistance: def.range + 24,
      speed: def.projectileSpeed,
      damage: def.damage,
      color: def.color,
      size: t.type === 'snowballer' ? 7 : t.type === 'icicles' ? 4 : 4.5,
      freezeDuration: t.type === 'retarder' ? 2 : 0,
      slowDuration: t.type === 'icicles' ? 2 : 0,
      slowFactor: 0.5,
      hitLimit: t.type === 'retarder' ? 3 : t.type === 'snowballer' ? 5 : 1,
      hitIds: [],
      splitOnHit: t.type === 'icicles',
      explodeAtLimit: t.type === 'snowballer',
      splash: def.splash,
      splashFreezeDuration: t.type === 'snowballer' ? 2 : 0,
      sourceType: t.type,
    })
    return
  }

  if (def.style === 'lightning') {
    const enemiesInRange = s.enemies.filter(
      (e) => e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= def.range,
    )
    const chooseEnemy = Math.random() < 0.5 && enemiesInRange.length > 0
    let x: number
    let y: number
    if (chooseEnemy) {
      const selected = enemiesInRange[Math.floor(Math.random() * enemiesInRange.length)]
      x = selected.x
      y = selected.y
    } else {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.sqrt(Math.random()) * def.range
      x = Math.max(4, Math.min(WIDTH - 4, t.x + Math.cos(angle) * distance))
      y = Math.max(4, Math.min(HEIGHT - 4, t.y + Math.sin(angle) * distance))
    }
    s.strikes.push({ x, y, t: 0, dur: 0.34, color: def.color })
    explode(s, x, y, def.splash, def.damage, def.color)
    return
  }

  if (def.style === 'energy') {
    s.projectiles.push({
      kind: 'energy',
      x: t.x + Math.cos(t.angle) * 15,
      y: t.y + Math.sin(t.angle) * 15,
      dirX: Math.cos(t.angle),
      dirY: Math.sin(t.angle),
      traveled: 0,
      maxDistance: def.range + 24,
      speed: def.projectileSpeed,
      aura: def.splash,
      hitTimers: {},
      damage: def.damage,
      color: def.color,
      size: 7,
    })
    return
  }

  if (def.style === 'bullet' || def.style === 'shell') {
    const barrels = t.type === 'dual' ? [-4, 4] : [0]
    const side = t.type === 'dual' ? barrels[Math.floor(s.time * 100) % 2] : 0
    const px = Math.cos(t.angle + Math.PI / 2) * side
    const py = Math.sin(t.angle + Math.PI / 2) * side
    s.projectiles.push({
      kind: 'direct',
      x: t.x + Math.cos(t.angle) * 18 + px,
      y: t.y + Math.sin(t.angle) * 18 + py,
      tx: target.x,
      ty: target.y,
      targetId: target.id,
      speed: def.projectileSpeed,
      damage: def.damage,
      splash: def.splash,
      color: def.color,
      size: def.style === 'shell' ? 5 : 3,
      sourceType: t.type,
    })
    return
  }
  const duration = def.style === 'mortar' ? 1.1 : 1.3
  const eDef = ENEMIES[target.type]
  const lead = eDef.speed * duration * 0.85
  const spread = def.inaccuracy
  const ang = Math.random() * Math.PI * 2
  const off = Math.random() * spread
  s.projectiles.push({
    kind: 'arc',
    sx: t.x,
    sy: t.y,
    tx: target.x + Math.cos(target.angle) * lead + Math.cos(ang) * off,
    ty: target.y + Math.sin(target.angle) * lead + Math.sin(ang) * off,
    t: 0,
    duration,
    height: def.style === 'mortar' ? 110 : 60,
    damage: def.damage,
    splash: def.splash,
    cluster: def.style === 'cluster',
    color: def.color,
    size: def.style === 'mortar' ? 6 : 7,
  })
}

export function update(s: GameState, dt: number) {
  if (s.status !== 'playing') return
  s.time += dt

  if (s.waveActive && s.spawnQueue.length) {
    s.spawnTimer -= dt
    if (s.spawnTimer <= 0) {
      const next = s.spawnQueue.shift()!
      const def = ENEMIES[next.type]
      const boss = next.type === 'bugPrince'
      const helmet = s.bugPrinceDefeated && s.seenEnemyTypes.includes(next.type)
      const hp = Math.round(def.hp * (boss ? 1 : hpScale(s.wave)) * (helmet ? 1.25 : 1))
      if (!boss && !s.seenEnemyTypes.includes(next.type)) s.seenEnemyTypes.push(next.type)
      s.enemies.push({
        id: s.nextId++,
        type: next.type,
        x: PATH[0].x,
        y: PATH[0].y,
        hp,
        maxHp: hp,
        reviveHp: hp,
        frozenTimer: 0,
        slowTimer: 0,
        slowFactor: 1,
        jumpCooldown: 1.25,
        airborneTimer: 0,
        healCooldown: 2,
        bossThreshold: 1,
        spawnCooldown: 3.5,
        helmet,
        wp: 1,
        dist: 0,
        angle: 0,
        anim: Math.random() * 10,
        alive: true,
        cocooning: false,
        cocoonTimer: 0,
      })
      s.spawnTimer = next.delay
    }
  }

  for (const e of s.enemies) {
    if (!e.alive) continue
    const def = ENEMIES[e.type]
    e.anim += dt
    e.frozenTimer = Math.max(0, e.frozenTimer - dt)
    e.airborneTimer = Math.max(0, e.airborneTimer - dt)
    e.jumpCooldown -= dt
    e.healCooldown -= dt
    e.spawnCooldown -= dt
    e.slowTimer = Math.max(0, e.slowTimer - dt)
    if (e.slowTimer <= 0) e.slowFactor = 1
    if (e.cocooning) {
      e.cocoonTimer -= dt
      if (e.cocoonTimer <= 0) {
        e.cocooning = false
        e.hp = Math.max(1, e.reviveHp)
        e.anim = 0
      }
      // The vessel cannot move while sealed, but towers can still damage it.
      continue
    }
    if (e.type === 'healer' && e.frozenTimer > 0) {
      // Freezing interrupts healing and keeps the cooldown reset until thawed.
      e.healCooldown = 1.5
    } else if (e.type === 'healer' && e.healCooldown <= 0) {
      for (const ally of s.enemies) {
        if (!ally.alive || ally.id === e.id || ally.type === 'bugPrince') continue
        if (Math.hypot(ally.x-e.x,ally.y-e.y)<=92 && ally.hp<ally.maxHp) ally.hp=Math.min(ally.maxHp,ally.hp+Math.max(1,ally.hp*.15))
      }
      s.explosions.push({x:e.x,y:e.y,r:92,t:0,dur:.25,color:'#4ade80'});e.healCooldown=1.5
    }
    if(e.type==='bugPrince'&&e.spawnCooldown<=0){
      const picks:EnemyType[]=['grunt','runner','tank','vessel','jumper','healer']
      const type=picks[Math.floor(Math.random()*picks.length)]
      s.spawnQueue.push({type,delay:.05},{type:Math.random()<.5?'grunt':'runner',delay:.05});e.spawnCooldown=3.5
    }
    if(e.type==='jumper'&&e.jumpCooldown<=0&&e.frozenTimer<=0&&!e.cocooning){
      e.airborneTimer=.52;e.jumpCooldown=1.25;e.anim=0
    }
    if (e.frozenTimer > 0) continue
    if (e.type === 'jumper') {
      // Each jump covers up to 70 world units over 0.52s, smoothly following
      // the waypoint path instead of teleporting. Crossing a waypoint never stalls it.
      if(e.airborneTimer>0){
        let step=70*dt/.52
        while(step>0&&e.alive&&e.wp<PATH.length){
          const target=PATH[e.wp]
          const dx=target.x-e.x,dy=target.y-e.y,distance=Math.hypot(dx,dy)
          if(distance<=.001){e.x=target.x;e.y=target.y;e.wp++;continue}
          e.angle=Math.atan2(dy,dx)
          if(step>=distance){
            e.x=target.x;e.y=target.y;e.dist+=distance;step-=distance;e.wp++
          }else{
            e.x+=(dx/distance)*step;e.y+=(dy/distance)*step;e.dist+=step;step=0
          }
        }
        if(e.wp>=PATH.length&&e.alive){e.alive=false;s.lives-=def.damage}
      }
      continue
    }
    let step = def.speed * (e.slowTimer > 0 ? e.slowFactor : 1) * dt
    while (step > 0 && e.alive) {
      const target = PATH[e.wp]
      const dx = target.x - e.x
      const dy = target.y - e.y
      const d = Math.hypot(dx, dy)
      if (d > 0.001) e.angle = Math.atan2(dy, dx)
      if (step >= d) {
        e.x = target.x
        e.y = target.y
        e.dist += d
        step -= d
        e.wp++
        if (e.wp >= PATH.length) {
          e.alive = false
          s.lives -= def.damage
        }
      } else {
        e.x += (dx / d) * step
        e.y += (dy / d) * step
        e.dist += step
        step = 0
      }
    }
  }

  for (const t of s.towers) {
    const def = TOWERS[t.type]
    t.cooldown -= dt
    t.recoil = Math.max(0, t.recoil - dt * 5)
    const foundTarget = findTarget(
      s,
      t,
      def.range,
      t.targetMode,
      (enemy) => t.type !== 'retarder' || enemy.frozenTimer <= 0,
    )
    const lockedTeslaTarget =
      t.type === 'tesla' && t.chargeTargetId !== null
        ? s.enemies.find(
            (e) =>
              e.id === t.chargeTargetId &&
              e.alive &&
              Math.hypot(e.x - t.x, e.y - t.y) <= def.range,
          ) ?? null
        : null
    const target = lockedTeslaTarget ?? foundTarget

    if (t.type === 'ice') {
      t.beamTargets = []
      if (target && t.cooldown <= 0) {
        freezeInRadius(s, t.x, t.y, def.range, 1)
        t.cooldown = 1 / def.fireRate
        t.recoil = 0.35
        s.explosions.push({ x: t.x, y: t.y, r: 24, t: 0, dur: 0.18, color: def.color })
      }
      continue
    }

    if (t.type === 'thunderstorm') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      if (t.cooldown <= 0) {
        const dirX = Math.cos(t.angle)
        const dirY = Math.sin(t.angle)
        const lineTargets = s.enemies
          .filter((enemy) => {
            if (!enemy.alive) return false
            const dx = enemy.x - t.x
            const dy = enemy.y - t.y
            const along = dx * dirX + dy * dirY
            const across = Math.abs(dx * dirY - dy * dirX)
            return along > 0 && along <= def.range && across <= 22
          })
          .sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))
        for (const enemy of lineTargets) {
          damageEnemy(s, enemy, def.damage)
          applyFreeze(enemy, 1)
          s.lightningFlashes.push({
            points: [{ x: enemy.x, y: Math.max(0, enemy.y - 96) }, { x: enemy.x, y: enemy.y }],
            t: 0,
            dur: 0.26,
            color: def.color,
          })
        }
        t.cooldown = 1 / def.fireRate
        t.recoil = 0.35
      }
      continue
    }

    if (t.type === 'lightning') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      if (t.cooldown <= 0) {
        const chain = findChainTargets(s, target)
        s.lightningFlashes.push({
          points: [{ x: t.x, y: t.y }, ...chain.map((enemy) => ({ x: enemy.x, y: enemy.y }))],
          t: 0,
          dur: 0.18,
          color: def.color,
        })
        const splitDamage = def.damage / chain.length
        for (const enemy of chain) damageEnemy(s, enemy, splitDamage)
        t.cooldown = 1 / def.fireRate
        t.recoil = 0.35
      }
      continue
    }

    if (t.type === 'tesla') {
      if (!target) {
        t.beamTargets = []
        t.chargeTargetId = null
        t.chargeTime = 0
        t.cooldown = 0
        continue
      }
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      if (t.chargeTargetId !== target.id) {
        t.chargeTargetId = target.id
        t.chargeTime = 0
        t.cooldown = 0
      }
      t.chargeTime += dt
      t.beamTargets = [target.id]
      if (t.cooldown <= 0) {
        const chargeMultiplier = 1 + Math.min(11, t.chargeTime * 2.2)
        damageEnemy(s, target, def.damage * chargeMultiplier)
        t.cooldown = 1 / def.fireRate
        t.recoil = 0.3
      }
      continue
    }

    t.beamTargets = []
    t.chargeTargetId = null
    t.chargeTime = 0
    if (!target) continue
    t.angle = Math.atan2(target.y - t.y, target.x - t.x)
    if (t.cooldown <= 0) {
      fire(s, t, target)
      t.cooldown = 1 / def.fireRate
    }
  }

  const spawned: Projectile[] = []
  s.projectiles = s.projectiles.filter((p) => {
    if (p.kind === 'direct') {
      const target = s.enemies.find((e) => e.id === p.targetId && e.alive)
      if (target) {
        p.tx = target.x
        p.ty = target.y
      }
      const dx = p.tx - p.x
      const dy = p.ty - p.y
      const d = Math.hypot(dx, dy)
      const step = p.speed * dt
      if (d <= step + 4) {
        if (p.splash > 0) explode(s, p.tx, p.ty, p.splash, p.damage, p.color, p.sourceType)
        else if (target) damageEnemy(s, target, p.damage, p.sourceType)
        return false
      }
      p.x += (dx / d) * step
      p.y += (dy / d) * step
      return true
    }
    if (p.kind === 'energy') {
      const step = p.speed * dt
      p.x += p.dirX * step
      p.y += p.dirY * step
      p.traveled += step
      for (const enemy of s.enemies) {
        if (!enemy.alive) continue
        const distance = Math.hypot(enemy.x - p.x, enemy.y - p.y)
        if (distance <= p.aura + ENEMIES[enemy.type].radius) {
          const remaining = p.hitTimers[enemy.id] ?? 0
          if (remaining <= 0) {
            // Aura damage is applied in small electric pulses while an enemy is inside it.
            damageEnemy(s, enemy, p.damage / 4)
            p.hitTimers[enemy.id] = 0.18
            s.explosions.push({ x: enemy.x, y: enemy.y, r: 9, t: 0, dur: 0.12, color: p.color })
          } else {
            p.hitTimers[enemy.id] = remaining - dt
          }
        } else {
          delete p.hitTimers[enemy.id]
        }
      }
      return p.traveled < p.maxDistance && p.x >= -20 && p.x <= WIDTH + 20 && p.y >= -20 && p.y <= HEIGHT + 20
    }
    if (p.kind === 'ice') {
      const step = p.speed * dt
      p.x += p.dirX * step
      p.y += p.dirY * step
      p.traveled += step

      const hit = s.enemies.find(
        (enemy) =>
          enemy.alive &&
          !p.hitIds.includes(enemy.id) &&
          Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 2,
      )
      if (hit) {
        p.hitIds.push(hit.id)
        if (p.freezeDuration > 0) applyFreeze(hit, p.freezeDuration)
        if (p.slowDuration > 0) applySlow(hit, p.slowDuration, p.slowFactor)
        damageEnemy(s, hit, p.damage, p.sourceType)

        if (p.splitOnHit) {
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2
            const dirX = Math.cos(angle)
            const dirY = Math.sin(angle)
            spawned.push({
              kind: 'ice',
              x: p.x,
              y: p.y,
              dirX,
              dirY,
              traveled: 0,
              maxDistance: 100,
              speed: 235,
              damage: p.damage * 0.72,
              color: '#a5f3fc',
              size: 3.5,
              freezeDuration: 0,
              slowDuration: 2,
              slowFactor: 0.5,
              hitLimit: 1,
              hitIds: [hit.id],
              splitOnHit: false,
              explodeAtLimit: false,
              splash: 0,
              splashFreezeDuration: 0,
            })
          }
          return false
        }

        if (p.hitIds.length >= p.hitLimit) {
          if (p.explodeAtLimit) {
            explode(s, p.x, p.y, p.splash, p.damage, p.color)
            freezeInRadius(s, p.x, p.y, p.splash, p.splashFreezeDuration)
          }
          return false
        }
      }

      const stillInBounds =
        p.traveled < p.maxDistance && p.x >= -20 && p.x <= WIDTH + 20 && p.y >= -20 && p.y <= HEIGHT + 20
      if (!stillInBounds && p.explodeAtLimit) {
        explode(s, p.x, p.y, p.splash, p.damage, p.color)
        freezeInRadius(s, p.x, p.y, p.splash, p.splashFreezeDuration)
      }
      return stillInBounds
    }
    p.t += dt
    if (p.t >= p.duration) {
      explode(s, p.tx, p.ty, p.splash, p.damage, p.color)
      if (p.cluster) {
        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2
          const dist = 40 + Math.random() * 45
          spawned.push({
            kind: 'arc',
            sx: p.tx,
            sy: p.ty,
            tx: p.tx + Math.cos(a) * dist,
            ty: p.ty + Math.sin(a) * dist,
            t: 0,
            duration: 0.45,
            height: 28,
            damage: 16,
            splash: 32,
            cluster: false,
            color: '#fb7185',
            size: 4,
          })
        }
      }
      return false
    }
    return true
  })
  s.projectiles.push(...spawned)

  s.explosions = s.explosions.filter((x) => {
    x.t += dt
    return x.t < x.dur
  })
  s.strikes = s.strikes.filter((strike) => {
    strike.t += dt
    return strike.t < strike.dur
  })
  s.lightningFlashes = s.lightningFlashes.filter((flash) => {
    flash.t += dt
    return flash.t < flash.dur
  })
  s.enemies = s.enemies.filter((e) => e.alive)

  if (s.waveActive && !s.spawnQueue.length && !s.enemies.length) {
    s.waveActive = false
    s.money += 20 + s.wave * 5
  }
  if (s.lives <= 0) {
    s.lives = 0
    s.status = 'over'
  }
}

/* ---------- Rendering ---------- */

export function drawBug(ctx: CanvasRenderingContext2D, type: EnemyType, x: number, y: number, angle: number, anim: number, cocooning = false, airborne = false, helmet = false) {
  const def = ENEMIES[type]
  const r = def.radius
  ctx.save()
  ctx.translate(x, y)
  if(airborne){ctx.scale(1.3,1.3);ctx.shadowColor='#c084fc';ctx.shadowBlur=12}
  ctx.rotate(angle)
  if (type === 'vessel' && cocooning) {
    const pulse = 1 + Math.sin(anim * 5) * 0.035
    ctx.scale(pulse, 1 / pulse)
    ctx.fillStyle = 'rgba(0,0,0,0.32)'
    ctx.beginPath()
    ctx.ellipse(1, 3, r * 1.35, r * 0.9, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#78350f'
    ctx.strokeStyle = '#451a03'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(0, 0, r * 1.25, r * 0.9, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 1.5
    for (const offset of [-0.55, -0.18, 0.2, 0.55]) {
      ctx.beginPath()
      ctx.ellipse(offset * r, 0, r * 0.3, r * 0.82, offset * 0.3, -Math.PI / 2, Math.PI / 2)
      ctx.stroke()
    }
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(-r * 0.65, -r * 0.1, 1.6, 0, Math.PI * 2)
    ctx.arc(-r * 0.65, r * 0.1, 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }
  ctx.strokeStyle = def.dark
  ctx.lineWidth = type === 'tank' ? 2.2 : 1.6
  ctx.lineCap = 'round'
  const wig = Math.sin(anim * (type === 'runner' ? 30 : 16)) * 0.4
  for (const side of [-1, 1]) {
    for (let i = -1; i <= 1; i++) {
      const sw = (i % 2 === 0 ? wig : -wig) * side
      ctx.beginPath()
      ctx.moveTo(i * r * 0.45, side * r * 0.3)
      ctx.lineTo(i * r * 0.45 + sw * r, side * r * 1.25)
      ctx.stroke()
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(-r * 0.2 + 2, 3, r * 1.2, r * 0.75, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = def.color
  ctx.strokeStyle = def.dark
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.ellipse(-r * 0.55, 0, r * 0.8, r * 0.62, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  if (type === 'tank') {
    ctx.beginPath()
    ctx.moveTo(-r * 0.55, -r * 0.6)
    ctx.lineTo(-r * 0.55, r * 0.6)
    ctx.moveTo(-r * 0.95, -r * 0.45)
    ctx.lineTo(-r * 0.95, r * 0.45)
    ctx.stroke()
  }
  if (type === 'vessel') {
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(-r * 0.55, 0, r * 0.55, r * 0.48, 0, -Math.PI / 2, Math.PI / 2)
    ctx.moveTo(-r * 0.8, -r * 0.22)
    ctx.lineTo(-r * 0.3, -r * 0.22)
    ctx.moveTo(-r * 0.8, r * 0.22)
    ctx.lineTo(-r * 0.3, r * 0.22)
    ctx.stroke()
    ctx.fillStyle = '#b45309'
    ctx.beginPath()
    ctx.arc(-r * 0.7, -r * 0.25, 1.6, 0, Math.PI * 2)
    ctx.arc(-r * 0.7, r * 0.25, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.ellipse(r * 0.25, 0, r * 0.42, r * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = def.dark
  ctx.beginPath()
  ctx.arc(r * 0.78, 0, r * 0.32, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = def.dark
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(r * 0.95, -r * 0.15)
  ctx.quadraticCurveTo(r * 1.4, -r * 0.3, r * 1.5, -r * 0.7)
  ctx.moveTo(r * 0.95, r * 0.15)
  ctx.quadraticCurveTo(r * 1.4, r * 0.3, r * 1.5, r * 0.7)
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(r * 0.9, -r * 0.14, 1.2, 0, Math.PI * 2)
  ctx.arc(r * 0.9, r * 0.14, 1.2, 0, Math.PI * 2)
  ctx.fill()
  if(type==='healer'){ctx.strokeStyle='#dcfce7';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-r*.35,-r*.3);ctx.lineTo(-r*.35,r*.3);ctx.moveTo(-r*.65,0);ctx.lineTo(-r*.05,0);ctx.stroke()}
  if(type==='bugPrince'){ctx.fillStyle='#fef3c7';ctx.strokeStyle='#92400e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.5,-r*.45);ctx.lineTo(-r*.6,-r*1.05);ctx.lineTo(-r*.15,-r*.78);ctx.lineTo(0,-r*1.25);ctx.lineTo(r*.2,-r*.78);ctx.lineTo(r*.6,-r*1.05);ctx.lineTo(r*.48,-r*.42);ctx.closePath();ctx.fill();ctx.stroke()}
  if(helmet){ctx.fillStyle='#cbd5e1';ctx.strokeStyle='#475569';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(r*.25,-r*.35,r*.42,Math.PI,Math.PI*2);ctx.lineTo(r*.67,-r*.1);ctx.lineTo(-r*.17,-r*.1);ctx.closePath();ctx.fill();ctx.stroke()}
  ctx.restore()
}

export function drawTower(ctx: CanvasRenderingContext2D, type: TowerType, x: number, y: number, angle: number, recoil = 0) {
  const def = TOWERS[type]
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#1e293b'
  ctx.strokeStyle = def.color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(-19, -19, 38, 38, 7)
  ctx.fill()
  ctx.stroke()
  if (def.tier >= 1) {
    ctx.fillStyle = def.color
    for (const [cx, cy] of [
      [-14, -14],
      [14, -14],
      [-14, 14],
      [14, 14],
    ]) {
      ctx.beginPath()
      ctx.arc(cx, cy, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (type === 'mortar') {
    ctx.fillStyle = def.accent
    ctx.beginPath()
    ctx.arc(0, 0, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = def.color
    ctx.beginPath()
    ctx.arc(0, 0, 10 + recoil * 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(0, 0, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  if (type === 'ice') {
    ctx.strokeStyle = def.color
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (const a of [0, Math.PI / 3, (Math.PI * 2) / 3]) {
      ctx.moveTo(Math.cos(a) * -10, Math.sin(a) * -10)
      ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10)
    }
    ctx.stroke()
    ctx.fillStyle = '#ecfeff'
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  if (type === 'retarder' || type === 'icicles' || type === 'snowballer') {
    ctx.rotate(angle)
    const back = recoil * 4
    if (type === 'retarder') {
      ctx.fillStyle = def.accent
      ctx.fillRect(-2, -6, 18 - back, 12)
      ctx.fillStyle = def.color
      ctx.beginPath()
      ctx.moveTo(16 - back, -5)
      ctx.lineTo(22 - back, 0)
      ctx.lineTo(16 - back, 5)
      ctx.closePath()
      ctx.fill()
    } else if (type === 'icicles') {
      ctx.fillStyle = def.color
      for (const offset of [-6, 0, 6]) {
        ctx.beginPath()
        ctx.moveTo(1 - back, offset)
        ctx.lineTo(18 - back, offset - 2)
        ctx.lineTo(14 - back, offset + 2)
        ctx.closePath()
        ctx.fill()
      }
    } else {
      ctx.fillStyle = def.accent
      ctx.fillRect(-1 - back, -5, 14, 10)
      ctx.fillStyle = def.color
      ctx.beginPath()
      ctx.arc(15 - back, 0, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ecfeff'
      ctx.beginPath()
      ctx.arc(15 - back, 0, 4, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
    return
  }

  if (type === 'lightning' || type === 'tesla' || type === 'thunderstorm') {
    ctx.fillStyle = def.accent
    ctx.beginPath()
    ctx.arc(0, 0, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = def.color
    ctx.lineWidth = type === 'tesla' || type === 'thunderstorm' ? 3.5 : 2.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-7, -10)
    ctx.lineTo(-4, -3)
    ctx.lineTo(0, -7)
    ctx.lineTo(4, 2)
    ctx.lineTo(7, -4)
    ctx.moveTo(0, -15)
    ctx.lineTo(0, -7)
    ctx.moveTo(-5, 6)
    ctx.lineTo(0, 10)
    ctx.lineTo(5, 6)
    ctx.stroke()
    ctx.fillStyle = '#e0f2fe'
    ctx.beginPath()
    ctx.arc(0, 0, type === 'tesla' ? 5 : 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.rotate(angle)
  const back = recoil * 4
  ctx.fillStyle = def.accent
  ctx.beginPath()
  ctx.arc(0, 0, type === 'cluster' || type === 'raygun' || type === 'bolt' ? 13 : 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = def.color
  if (type === 'shooter') {
    ctx.fillRect(2 - back, -3, 18, 6)
  } else if (type === 'dual') {
    ctx.fillRect(2 - back, -7, 18, 5)
    ctx.fillRect(2 - back, 2, 18, 5)
  } else if (type === 'cannon') {
    ctx.fillRect(2 - back, -5.5, 17, 11)
    ctx.fillRect(15 - back, -7, 5, 14)
  } else if (type === 'cluster') {
    ctx.fillRect(2 - back, -7, 17, 14)
    ctx.fillStyle = def.accent
    for (const oy of [-3.5, 3.5]) {
      ctx.beginPath()
      ctx.arc(17 - back, oy, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (type === 'raygun') {
    ctx.fillRect(1 - back, -6, 10, 12)
    ctx.fillStyle = def.accent
    ctx.beginPath()
    ctx.arc(14 - back, 0, 7 + recoil, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = def.color
    ctx.beginPath()
    ctx.arc(14 - back, 0, 4.2 + recoil * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#f3e8ff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(14 - back, 0, 6, -1.1, 1.1)
    ctx.stroke()
  } else if (type === 'bolt') {
    ctx.fillRect(1 - back, -5, 11, 10)
    ctx.strokeStyle = def.color
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(7 - back, -8)
    ctx.lineTo(12 - back, -2)
    ctx.lineTo(9 - back, 1)
    ctx.lineTo(16 - back, 7)
    ctx.stroke()
  }
  ctx.fillStyle = def.color
  ctx.beginPath()
  ctx.arc(0, 0, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function render(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.fillStyle = '#070d1f'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = 'rgba(56,189,248,0.07)'
  ctx.lineWidth = 1
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath()
    ctx.moveTo(c * CELL, 0)
    ctx.lineTo(c * CELL, HEIGHT)
    ctx.stroke()
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * CELL)
    ctx.lineTo(WIDTH, r * CELL)
    ctx.stroke()
  }

  ctx.lineJoin = 'round'
  ctx.lineCap = 'square'
  ctx.strokeStyle = 'rgba(56,189,248,0.35)'
  ctx.lineWidth = CELL + 4
  tracePath(ctx)
  ctx.stroke()
  ctx.strokeStyle = '#0f1a33'
  ctx.lineWidth = CELL - 4
  tracePath(ctx)
  ctx.stroke()
  ctx.setLineDash([6, 10])
  ctx.lineDashOffset = -s.time * 20
  ctx.strokeStyle = 'rgba(56,189,248,0.25)'
  ctx.lineWidth = 2
  tracePath(ctx)
  ctx.stroke()
  ctx.setLineDash([])

  const selected = s.towers.find((t) => t.id === s.selectedId)

  if (s.hover && s.buildType) {
    const ok = isBuildable(s, s.hover.col, s.hover.row) && s.money >= TOWERS[s.buildType].cost
    const hx = s.hover.col * CELL + CELL / 2
    const hy = s.hover.row * CELL + CELL / 2
    ctx.fillStyle = ok ? 'rgba(56,189,248,0.08)' : 'rgba(239,68,68,0.1)'
    ctx.strokeStyle = ok ? 'rgba(56,189,248,0.5)' : 'rgba(239,68,68,0.5)'
    ctx.beginPath()
    ctx.arc(hx, hy, TOWERS[s.buildType].range, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.globalAlpha = 0.55
    drawTower(ctx, s.buildType, hx, hy, -Math.PI / 2)
    ctx.globalAlpha = 1
  }

  if (selected) {
    ctx.fillStyle = 'rgba(56,189,248,0.07)'
    ctx.strokeStyle = 'rgba(56,189,248,0.5)'
    ctx.beginPath()
    ctx.arc(selected.x, selected.y, TOWERS[selected.type].range, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  for (const t of s.towers) {
    drawTower(ctx, t.type, t.x, t.y, t.angle, t.recoil)
    if (selected && t.id === selected.id) {
      ctx.strokeStyle = '#e0f2fe'
      ctx.lineWidth = 2
      ctx.strokeRect(t.x - 22, t.y - 22, 44, 44)
    } else if (selected && s.fuseMode) {
      const ok = !!fusionResult(selected.type, t.type)
      const pulse = 0.5 + Math.sin(s.time * 8) * 0.3
      ctx.strokeStyle = ok ? `rgba(74,222,128,${pulse + 0.2})` : 'rgba(100,116,139,0.4)'
      ctx.lineWidth = 2
      ctx.setLineDash(ok ? [] : [4, 4])
      ctx.strokeRect(t.x - 22, t.y - 22, 44, 44)
      ctx.setLineDash([])
    }
  }

  // Tesla keeps a focused beam; Lightning Rod fires brief flashes instead.
  for (const t of s.towers) {
    if (t.type !== 'tesla') continue
    const target = t.beamTargets
      .map((id) => s.enemies.find((e) => e.id === id && e.alive))
      .find((e): e is Enemy => !!e)
    if (target) drawElectricBeam(ctx, t.x, t.y, target.x, target.y, TOWERS.tesla.color, s.time, 2.7)
  }

  for (const flash of s.lightningFlashes) {
    const progress = flash.t / flash.dur
    const alpha = progress < 0.18 ? progress / 0.18 : Math.max(0, 1 - (progress - 0.18) / 0.82)
    ctx.save()
    ctx.globalAlpha = alpha
    for (let i = 0; i < flash.points.length - 1; i++) {
      const from = flash.points[i]
      const to = flash.points[i + 1]
      drawElectricBeam(ctx, from.x, from.y, to.x, to.y, flash.color, s.time + flash.t * 24, 4)
    }
    ctx.restore()
  }

  for (const e of s.enemies) {
    drawBug(ctx, e.type, e.x, e.y-(e.airborneTimer>0?14:0), e.angle, e.anim, e.cocooning, e.airborneTimer>0, e.helmet)
    if (e.frozenTimer > 0 || e.slowTimer > 0) {
      ctx.save()
      ctx.strokeStyle = e.frozenTimer > 0 ? '#7dd3fc' : '#a5f3fc'
      ctx.lineWidth = e.frozenTimer > 0 ? 2.5 : 1.5
      ctx.globalAlpha = e.frozenTimer > 0 ? 0.9 : 0.6
      ctx.beginPath()
      ctx.arc(e.x, e.y, ENEMIES[e.type].radius + (e.frozenTimer > 0 ? 5 : 3), 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    if (e.hp < e.maxHp || e.cocooning) {
      const r = ENEMIES[e.type].radius
      ctx.fillStyle = '#111827'
      ctx.fillRect(e.x - r, e.y - r - 8, r * 2, 3)
      ctx.fillStyle = e.cocooning ? '#f59e0b' : '#4ade80'
      const ratio = e.cocooning ? Math.max(0, e.cocoonTimer / 5) : e.hp / e.maxHp
      ctx.fillRect(e.x - r, e.y - r - 8, r * 2 * ratio, 3)
    }
  }

  for (const p of s.projectiles) {
    if (p.kind === 'energy') {
      ctx.save()
      ctx.globalAlpha = 0.13
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.aura, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.shadowColor = p.color
      ctx.shadowBlur = 18
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#f3e8ff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 0.65, s.time * 5, s.time * 5 + Math.PI * 1.4)
      ctx.stroke()
      ctx.restore()
    } else if (p.kind === 'direct') {
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    } else if (p.kind === 'ice') {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(Math.atan2(p.dirY, p.dirX))
      ctx.fillStyle = p.color
      ctx.strokeStyle = '#ecfeff'
      ctx.lineWidth = 1
      ctx.shadowColor = p.color
      ctx.shadowBlur = 7
      ctx.beginPath()
      ctx.moveTo(p.size * 1.8, 0)
      ctx.lineTo(0, -p.size)
      ctx.lineTo(-p.size * 1.4, 0)
      ctx.lineTo(0, p.size)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.restore()
    } else {
      const k = p.t / p.duration
      const gx = p.sx + (p.tx - p.sx) * k
      const gy = p.sy + (p.ty - p.sy) * k
      const h = p.height * 4 * k * (1 - k)
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.beginPath()
      ctx.ellipse(gx, gy, p.size * (0.6 + k * 0.4), p.size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(gx, gy - h, p.size * (1 + (h / p.height) * 0.5), 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }

  for (const strike of s.strikes) {
    const progress = strike.t / strike.dur
    const alpha = progress < 0.25 ? progress / 0.25 : 1 - (progress - 0.25) / 0.75
    ctx.save()
    ctx.globalAlpha = Math.max(0, alpha)
    ctx.strokeStyle = strike.color
    ctx.lineWidth = 5
    ctx.shadowColor = strike.color
    ctx.shadowBlur = 16
    ctx.beginPath()
    const startY = Math.max(0, strike.y - 100)
    ctx.moveTo(strike.x - 8, startY)
    const segments = 7
    for (let i = 1; i < segments; i++) {
      const k = i / segments
      const jitter = Math.sin(s.time * 90 + i * 17 + strike.x) * (8 + i % 2 * 4)
      ctx.lineTo(strike.x + jitter, startY + (strike.y - startY) * k)
    }
    ctx.lineTo(strike.x, strike.y)
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#fef9c3'
    ctx.beginPath()
    ctx.arc(strike.x, strike.y, 6 + (1 - progress) * 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  for (const x of s.explosions) {
    const k = x.t / x.dur
    ctx.globalAlpha = 1 - k
    ctx.fillStyle = x.color
    ctx.beginPath()
    ctx.arc(x.x, x.y, x.r * (0.4 + k * 0.6), 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

function drawElectricBeam(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  time: number,
  width: number,
) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)
  const steps = Math.max(3, Math.floor(length / 12))
  const px = length > 0 ? -dy / length : 0
  const py = length > 0 ? dx / length : 0
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.lineWidth = width + 2
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.globalAlpha = 0.95
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  for (let i = 1; i < steps; i++) {
    const k = i / steps
    const wave = Math.sin(time * 70 + i * 8.3 + x1 * 0.03) * 3.2
    ctx.lineTo(x1 + dx * k + px * wave, y1 + dy * k + py * wave)
  }
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#ecfeff'
  ctx.lineWidth = Math.max(0.7, width * 0.38)
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.restore()
}

function tracePath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(PATH[0].x, PATH[0].y)
  for (let i = 1; i < PATH.length; i++) ctx.lineTo(PATH[i].x, PATH[i].y)
}
