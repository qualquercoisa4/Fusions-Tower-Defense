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
  plasmaDotTimer: number
  plasmaDotTick: number
  jumpCooldown: number
  airborneTimer: number
  healCooldown: number
  bossThreshold: number
  spawnCooldown: number
  helmet: boolean
  queenArmor: boolean
  splitGeneration: number
  bulbOn: boolean
  bulbTimer: number
  attackCooldown: number
  wp: number
  dist: number
  angle: number
  anim: number
  alive: boolean
  cocooning: boolean
  cocoonTimer: number
  carriedBy?: number
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
  incomeSignalsLeft: number
  incomeWave: number
  disabledTimer: number
  supportCooldown: number
  burstTimer: number
  burstShotsRemaining: number
}

type Projectile = (
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
      kind: 'boulder'
      x: number
      y: number
      dirX: number
      dirY: number
      traveled: number
      pathDistance: number
      maxDistance: number
      speed: number
      damage: number
      damageDecay: number
      sizeDecay: number
      hitLimit: number
      hitIds: number[]
      color: string
      size: number
      shatterOnHit?: boolean; fragmentDamage?: number; fragmentCount?: number
    }
  | {
      kind: 'slingshot'
      x: number; y: number; dirX: number; dirY: number; speed: number; traveled: number
      damage: number; hitIds: number[]; hitLimit: number; bouncesLeft: number; color: string; size: number
    }
  | {
      kind: 'fragment'
      x: number; y: number; dirX: number; dirY: number; speed: number; traveled: number
      maxDistance: number; damage: number; color: string; size: number
    }
  | {
      kind: 'syringe'
      x: number; y: number; tx: number; ty: number; speed: number; damage: number; radius: number; color: string; size: number
    }
  | {
      kind: 'snowball'
      x: number; y: number; dirX: number; dirY: number; traveled: number; pathDistance: number
      speed: number; damage: number; splash: number; carriedIds: number[]; carrierId: number; color: string; size: number
    }
  | {
      kind: 'homing'
      x: number
      y: number
      dirX: number
      dirY: number
      traveled: number
      maxDistance: number
      speed: number
      turnRate: number
      acquireAfter: number
      targetId: number | null
      hitIds: number[]
      hitLimit: number
      damage: number
      color: string
      size: number
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
      cryo?: boolean
      color: string
      size: number
    }
) & { sourceTowerId?: number; teleporterClone?: boolean; sourceType?: TowerType }

interface PlasmaPool {
  x: number
  y: number
  radius: number
  t: number
  duration: number
  usedEnemyIds: number[]
}

interface ElectricTrap {
  x: number; y: number; radius: number; t: number; duration: number; tickTimer: number; damage: number
}
interface PortalPair {
  blueDistance: number; purpleDistance: number; t: number; duration: number; usedEnemyIds: number[]
}
interface PlasmaBeam {
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  t: number
  duration: number
  color: string
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
  plasmaPools: PlasmaPool[]
  plasmaBeams: PlasmaBeam[]
  electricTraps: ElectricTrap[]
  portalPairs: PortalPair[]
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
  bugQueenDefeated: boolean
}

export function createGame(): GameState {
  return {
    enemies: [],
    towers: [],
    projectiles: [],
    explosions: [],
    strikes: [],
    lightningFlashes: [],
    plasmaPools: [],
    plasmaBeams: [],
    electricTraps: [],
    portalPairs: [],
    money: 500,
    lives: 100,
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
    bugQueenDefeated: false,
  }
}



export function spawnDebugEnemy(s: GameState, type: EnemyType) {
  const def = ENEMIES[type]
  const boss = type === 'bugPrince' || type === 'bugQueen'
  const helmet = (s.bugPrinceDefeated || s.bugQueenDefeated) && s.seenEnemyTypes.includes(type)
  const queenArmor = s.bugQueenDefeated && s.seenEnemyTypes.includes(type)
  const hp = Math.max(1, Math.round((def.hp * (boss ? 1 : hpScale(Math.max(1, s.wave))) / 1.5) * (helmet ? 1.25 : 1) * (queenArmor ? 1.25 : 1)))
  if (!boss && !s.seenEnemyTypes.includes(type)) s.seenEnemyTypes.push(type)
  s.enemies.push({ id: s.nextId++, type, x: PATH[0].x, y: PATH[0].y, hp, maxHp: hp, reviveHp: hp, frozenTimer: 0, slowTimer: 0, slowFactor: 1, plasmaDotTimer: 0, plasmaDotTick: 0, jumpCooldown: 1.25, airborneTimer: 0, healCooldown: 2, bossThreshold: 1, spawnCooldown: type === 'spitter' ? 0.8 : 3.5, helmet, queenArmor, splitGeneration: 0, bulbOn: false, bulbTimer: 3, attackCooldown: 3, wp: 1, dist: 0, angle: 0, anim: Math.random() * 10, alive: true, cocooning: false, cocoonTimer: 0 })
  s.status = 'playing'
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

export function placeTower(s: GameState, type: TowerType, col: number, row: number, free = false) {
  const cost = free ? 0 : TOWERS[type].cost
  if ((!free && s.money < TOWERS[type].cost) || !isBuildable(s, col, row)) return false
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
    incomeSignalsLeft: 0,
    incomeWave: -1,
    disabledTimer: 0,
    supportCooldown: type === 'teleporter' ? 2.2 : 0,
    burstTimer: 0,
    burstShotsRemaining: 0,
  })
  return true
}

export function fuseTowers(s: GameState, sourceId: number, targetId: number) {
  const a = s.towers.find((t) => t.id === sourceId)
  const b = s.towers.find((t) => t.id === targetId)
  if (!a || !b || a === b) return false
  const result = fusionResult(a.type, b.type)
  if (!result) return false
  const fusionCost = Math.ceil((a.invested + b.invested) * 1.1)
  if (s.money < fusionCost) return false
  s.money -= fusionCost
  s.towers = s.towers.filter((t) => t !== a)
  b.type = result
  b.invested += a.invested + fusionCost
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
  for (const tower of s.towers) {
    if (tower.type === 'incomeFarm') { tower.incomeSignalsLeft = 5; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
    else if (tower.type === 'incomeTax') { tower.incomeSignalsLeft = 7; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
    else if (tower.type === 'economyHouse') { tower.incomeSignalsLeft = 8; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
  }
  s.spawnQueue = buildWave(s.wave)
  s.spawnTimer = 0
}

function applyFreeze(e: Enemy, duration: number) {
  if (!e.alive || duration <= 0 || e.type === 'bugPrince') return
  const wasFrozen = e.frozenTimer > 0
  e.frozenTimer = Math.max(e.frozenTimer, duration)
  if (e.type === 'healer' && !wasFrozen) e.healCooldown = 1.5
}

function applySlow(e: Enemy, duration: number, factor: number) {
  if (!e.alive || duration <= 0 || e.type === 'bugPrince') return
  e.slowTimer = Math.max(e.slowTimer, duration)
  e.slowFactor = Math.min(e.slowFactor, factor)
}

function freezeInRadius(s: GameState, x: number, y: number, radius: number, duration: number) {
  for (const e of s.enemies) {
    if (e.alive && Math.hypot(e.x - x, e.y - y) <= radius + ENEMIES[e.type].radius) applyFreeze(e, duration)
  }
}

function isShielded(s: GameState, e: Enemy) {
  if (e.type === 'shadowBug') return s.enemies.some(other => other.alive && other.id !== e.id && other.type !== 'shadowBug' && Math.hypot(other.x-e.x,other.y-e.y) <= 68)
  if (e.type === 'bulb' && e.bulbOn) return false
  return s.enemies.some(other => other.alive && other.id !== e.id && other.type === 'bulb' && other.bulbOn && Math.hypot(other.x-e.x,other.y-e.y) <= 104)
}

function damageEnemy(s: GameState, e: Enemy, dmg: number, sourceType?: TowerType) {
  if (!e.alive || isShielded(s,e)) return
  if(e.queenArmor)dmg*=0.75
  if(e.type==='jumper'&&e.airborneTimer>0&&sourceType&&['shooter','cannon','retarder'].includes(sourceType))return
  const previousHp=e.hp;e.hp-=dmg
  if(e.type==='bugPrince'||e.type==='bugQueen'){
    const lostThirds=Math.floor((e.maxHp-e.hp)/(e.maxHp/3))
    while(e.bossThreshold<=3&&lostThirds>=e.bossThreshold){
      const count=e.type==='bugQueen'?16+s.swarmCounter*4:11+s.swarmCounter*3, types:EnemyType[]=['grunt','runner','jumper','splitter','shadowBug','spitter','bulb']
      for(let i=0;i<count;i++)s.spawnQueue.push({type:types[i%types.length],delay:.06})
      s.swarmCounter++;e.bossThreshold++
    }
    if(e.hp>0&&previousHp>e.hp)s.explosions.push({x:e.x,y:e.y,r:18,t:0,dur:.15,color:'#fbbf24'})
  }
  if (e.hp <= 0) {
    if(e.type==='bugPrince'||e.type==='bugQueen'){
      const queen=e.type==='bugQueen'
      if(queen)s.bugQueenDefeated=true;else s.bugPrinceDefeated=true
      for(const ally of s.enemies){
        if(!ally.alive||ally.id===e.id||!s.seenEnemyTypes.includes(ally.type))continue
        ally.maxHp=Math.ceil(ally.maxHp*1.25)
        ally.hp=Math.ceil(Math.max(1,ally.hp)*1.25)
        ally.helmet=true
        if(queen)ally.queenArmor=true
      }
      if(queen){
        const types:EnemyType[]=['grunt','tank','runner','vessel','jumper','healer','swarmBug','splitter','shadowBug','spitter','bulb']
        for(const type of types)s.spawnQueue.push({type,delay:.08})
      }
      s.explosions.push({x:e.x,y:e.y,r:queen?140:100,t:0,dur:1.2,color:queen?'#f0abfc':'#fbbf24'})
    }
    if (e.type === 'vessel' && !e.cocooning) {
      const nextReviveHp = e.reviveHp * 0.8
      // Regrowth compounds: 75% of the previous regenerated amount each time.
      if (nextReviveHp >= 1) {
        e.reviveHp = nextReviveHp
        e.cocooning = true
        e.cocoonTimer = 4.2
        e.hp = e.reviveHp
        e.anim = 0
        s.explosions.push({ x: e.x, y: e.y, r: ENEMIES[e.type].radius * 1.8, t: 0, dur: 0.45, color: '#d97706' })
        return
      }
    }
    if(e.type==='splitter'&&e.splitGeneration===0){
      for(let i=0;i<2;i++){
        const childHp=Math.max(1,Math.ceil(e.maxHp/2))
        s.enemies.push({...e,id:s.nextId++,hp:childHp,maxHp:childHp,reviveHp:childHp,alive:true,splitGeneration:1,helmet:e.helmet,queenArmor:e.queenArmor,spawnCooldown:3.5,attackCooldown:3,bulbOn:false,bulbTimer:3,anim:e.anim+i*.3})
      }
    }
    e.alive = false
    s.money += Math.floor(ENEMIES[e.type].reward * (s.towers.some(tower => tower.type === 'economyHouse') ? 1.1 : 1))
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

function pathMetrics() {
  const lengths = [0]
  for (let i = 1; i < PATH.length; i++) lengths[i] = lengths[i - 1] + Math.hypot(PATH[i].x - PATH[i - 1].x, PATH[i].y - PATH[i - 1].y)
  return lengths
}
const REVERSE_PATH_LENGTHS = pathMetrics()
function pointOnPath(distance: number) {
  const d = Math.max(0, Math.min(REVERSE_PATH_LENGTHS[REVERSE_PATH_LENGTHS.length - 1], distance))
  let i = 1
  while (i < REVERSE_PATH_LENGTHS.length - 1 && REVERSE_PATH_LENGTHS[i] < d) i++
  const span = REVERSE_PATH_LENGTHS[i] - REVERSE_PATH_LENGTHS[i - 1]
  const k = span > 0 ? (d - REVERSE_PATH_LENGTHS[i - 1]) / span : 0
  return { x: PATH[i - 1].x + (PATH[i].x - PATH[i - 1].x) * k, y: PATH[i - 1].y + (PATH[i].y - PATH[i - 1].y) * k }
}
function pathWaypointIndex(distance: number) {
  let i = 1
  while (i < REVERSE_PATH_LENGTHS.length - 1 && REVERSE_PATH_LENGTHS[i] < distance) i++
  return i
}
function placeEnemyOnPath(enemy: Enemy, distance: number) {
  const clamped = Math.max(0, Math.min(REVERSE_PATH_LENGTHS[REVERSE_PATH_LENGTHS.length - 1], distance))
  const point = pointOnPath(clamped)
  enemy.dist = clamped; enemy.x = point.x; enemy.y = point.y; enemy.wp = pathWaypointIndex(clamped)
}
function projectToPath(x: number, y: number) {
  let best = { distance: 0, x: PATH[0].x, y: PATH[0].y, error: Infinity }
  for (let i = 1; i < PATH.length; i++) {
    const a = PATH[i - 1], b = PATH[i], dx = b.x - a.x, dy = b.y - a.y
    const lenSq = dx * dx + dy * dy
    const k = lenSq ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / lenSq)) : 0
    const px = a.x + dx * k, py = a.y + dy * k, error = Math.hypot(x - px, y - py)
    if (error < best.error) best = { distance: REVERSE_PATH_LENGTHS[i - 1] + Math.sqrt(lenSq) * k, x: px, y: py, error }
  }
  return best
}
function findReversePathTarget(s: GameState, t: Tower, range: number) {
  const projection = projectToPath(t.x, t.y)
  if (projection.error > range) return null
  return s.enemies.filter(e => e.alive && e.dist <= projection.distance + 4)
    .sort((a, b) => b.dist - a.dist)[0] ?? null
}

function launchPathBoulder(s: GameState, t: Tower, def = TOWERS[t.type]) {
  const projection = projectToPath(t.x, t.y)
  const point = pointOnPath(projection.distance)
  const towardStart = pointOnPath(Math.max(0, projection.distance - 3))
  const angle = Math.atan2(towardStart.y - point.y, towardStart.x - point.x)
  const rock = t.type === 'rockLauncher', giant = t.type === 'boulderCannon'
  s.projectiles.push({
    kind: 'boulder', x: point.x, y: point.y, dirX: Math.cos(angle), dirY: Math.sin(angle),
    traveled: 0, pathDistance: projection.distance, maxDistance: projection.distance + 20,
    speed: def.projectileSpeed, damage: def.damage, damageDecay: rock ? 10 : 20,
    sizeDecay: rock ? 0.38 : 0.82, hitLimit: rock ? 13 : giant ? 1 : 10, hitIds: [],
    color: def.color, size: giant ? 17 : rock ? 7 : 12, shatterOnHit: giant,
    fragmentDamage: giant ? 26 : undefined, fragmentCount: giant ? 8 : undefined,
    sourceType: t.type, sourceTowerId: t.id,
  })
}

function fire(s: GameState, t: Tower, target: Enemy, def = TOWERS[t.type]) {
  t.recoil = 1

  if (t.type === 'boulderLauncher' || t.type === 'rockLauncher' || t.type === 'boulderCannon') {
    launchPathBoulder(s, t, def)
    return
  }
  if (t.type === 'slingshot') {
    const angle = Math.atan2(target.y - t.y, target.x - t.x)
    s.projectiles.push({ kind: 'slingshot', x: t.x + Math.cos(angle) * 18, y: t.y + Math.sin(angle) * 18,
      dirX: Math.cos(angle), dirY: Math.sin(angle), speed: def.projectileSpeed, traveled: 0,
      damage: def.damage, hitIds: [], hitLimit: 5, bouncesLeft: 3, color: def.color, size: 7,
      sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'snowballLauncher') {
    const projection = projectToPath(t.x, t.y), point = pointOnPath(projection.distance)
    const towardStart = pointOnPath(Math.max(0, projection.distance - 3))
    const angle = Math.atan2(towardStart.y - point.y, towardStart.x - point.x)
    s.projectiles.push({ kind: 'snowball', x: point.x, y: point.y, dirX: Math.cos(angle), dirY: Math.sin(angle),
      traveled: 0, pathDistance: projection.distance, speed: def.projectileSpeed, damage: def.damage,
      splash: def.splash, carriedIds: [], carrierId: s.nextId++, color: def.color, size: 12,
      sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'electricSyringe') {
    s.projectiles.push({ kind: 'syringe', x: t.x, y: t.y, tx: target.x, ty: target.y,
      speed: def.projectileSpeed, damage: def.damage, radius: def.splash, color: def.color, size: 7,
      sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'portalGun') {
    const total = REVERSE_PATH_LENGTHS[REVERSE_PATH_LENGTHS.length - 1]
    const blueDistance = Math.max(0, Math.min(total - 160, target.dist + 20))
    s.portalPairs.push({ blueDistance, purpleDistance: blueDistance + 160, t: 0, duration: 2, usedEnemyIds: [] })
    const blue = pointOnPath(blueDistance), purple = pointOnPath(blueDistance + 160)
    s.explosions.push({ x: blue.x, y: blue.y, r: 25, t: 0, dur: 0.45, color: '#38bdf8' })
    s.explosions.push({ x: purple.x, y: purple.y, r: 25, t: 0, dur: 0.45, color: '#c084fc' })
    return
  }

  if (t.type === 'teleporter') {
    const dirX = Math.cos(t.angle), dirY = Math.sin(t.angle)
    s.projectiles.push({ kind: 'homing', x: t.x + dirX * 17, y: t.y + dirY * 17, dirX, dirY, traveled: 0, maxDistance: def.range + 35, speed: def.projectileSpeed, turnRate: 12, acquireAfter: 0, targetId: target.id, hitIds: [], hitLimit: 4, damage: def.damage, color: def.color, size: 4.5, sourceType: t.type, sourceTowerId: t.id })
    return
  }

  if (t.type === 'plasmaCannon') {
    for (const angle of [Math.PI / 4, Math.PI * 1.25]) {
      const dirX = Math.cos(angle), dirY = Math.sin(angle)
      s.projectiles.push({ kind: 'homing', x: t.x + dirX * 17, y: t.y + dirY * 17, dirX, dirY, traveled: 0, maxDistance: def.range * 4 + 220, speed: def.projectileSpeed, turnRate: 5.6, acquireAfter: 18, targetId: null, hitIds: [], hitLimit: 4, damage: def.damage, color: def.color, size: 4, sourceType: t.type, sourceTowerId: t.id })
    }
    return
  }

  if (t.type === 'plasmaHypothermia') {
    s.plasmaPools.push({ x: target.x, y: target.y, radius: def.splash, t: 0, duration: 4.8, usedEnemyIds: [] })
    s.explosions.push({ x: target.x, y: target.y, r: def.splash, t: 0, dur: 0.38, color: def.color })
    return
  }

  if (t.type === 'retarder' || t.type === 'icicles' || t.type === 'snowballer' || t.type === 'ice') {
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
      size: t.type === 'snowballer' ? 7 : t.type === 'icicles' ? 4 : t.type === 'ice' ? 6 : 4.5,
      freezeDuration: t.type === 'retarder' ? 1 : t.type === 'ice' ? 0.5 : 0,
      slowDuration: t.type === 'icicles' ? 2 : 0,
      slowFactor: 0.5,
      hitLimit: t.type === 'retarder' ? 3 : t.type === 'snowballer' ? 5 : t.type === 'ice' ? 8 : 1,
      hitIds: [],
      splitOnHit: t.type === 'icicles',
      explodeAtLimit: t.type === 'snowballer',
      splash: def.splash,
      splashFreezeDuration: t.type === 'snowballer' ? 1 : 0,
      sourceType: t.type,
      sourceTowerId: t.id,
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
      sourceTowerId: t.id,
    })
    return
  }

  if (def.style === 'bullet' || def.style === 'shell') {
    const offsets = t.type === 'tripleShooter' ? [-7, 0, 7] : t.type === 'dual' ? [-4, 4] : [0]
    for (const side of offsets) {
      const px = Math.cos(t.angle + Math.PI / 2) * side, py = Math.sin(t.angle + Math.PI / 2) * side
      s.projectiles.push({kind:'direct',x:t.x+Math.cos(t.angle)*18+px,y:t.y+Math.sin(t.angle)*18+py,tx:target.x,ty:target.y,targetId:target.id,speed:def.projectileSpeed,damage:def.damage,splash:def.splash,color:def.color,size:def.style==='shell'?5:3,sourceType:t.type,sourceTowerId:t.id})
    }
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
    cryo: t.type === 'cryoMortar',
    color: def.color,
    size: def.style === 'mortar' ? 6 : 7,
    sourceTowerId: t.id,
  })
}

export function update(s: GameState, dt: number) {
  if (s.status !== 'playing') return
  s.time += dt

  for (const trap of s.electricTraps) {
    trap.t += dt
    trap.tickTimer -= dt
    if (trap.tickTimer <= 0) {
      for (const enemy of s.enemies) {
        if (enemy.alive && Math.hypot(enemy.x - trap.x, enemy.y - trap.y) <= trap.radius + ENEMIES[enemy.type].radius) {
          damageEnemy(s, enemy, trap.damage, 'electricSyringe')
          s.explosions.push({ x: enemy.x, y: enemy.y, r: 10, t: 0, dur: 0.14, color: '#67e8f9' })
        }
      }
      trap.tickTimer = 0.35
    }
  }
  s.electricTraps = s.electricTraps.filter(trap => trap.t < trap.duration)
  for (const pair of s.portalPairs) pair.t += dt
  s.portalPairs = s.portalPairs.filter(pair => pair.t < pair.duration)

  if (s.waveActive && s.spawnQueue.length) {
    s.spawnTimer -= dt
    if (s.spawnTimer <= 0) {
      const next = s.spawnQueue.shift()!
      const def = ENEMIES[next.type]
      const boss = next.type === 'bugPrince' || next.type === 'bugQueen'
      const helmet = (s.bugPrinceDefeated || s.bugQueenDefeated) && s.seenEnemyTypes.includes(next.type)
      const queenArmor = s.bugQueenDefeated && s.seenEnemyTypes.includes(next.type)
      const hp = Math.max(1, Math.round((def.hp * (boss ? 1 : hpScale(s.wave)) / 1.5) * (helmet ? 1.25 : 1) * (queenArmor ? 1.25 : 1)))
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
        plasmaDotTimer: 0,
        plasmaDotTick: 0,
        jumpCooldown: 1.25,
        airborneTimer: 0,
        healCooldown: 2,
        bossThreshold: 1,
        spawnCooldown: next.type==='spitter'?0.8:3.5,
        helmet,
        queenArmor,
        splitGeneration: 0,
        bulbOn: false,
        bulbTimer: 3,
        attackCooldown: 3,
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
    e.attackCooldown -= dt
    e.bulbTimer -= dt
    e.slowTimer = Math.max(0, e.slowTimer - dt)
    if (e.slowTimer <= 0) e.slowFactor = 1
    if (e.plasmaDotTimer > 0) {
      e.plasmaDotTimer = Math.max(0, e.plasmaDotTimer - dt)
      e.plasmaDotTick -= dt
      if (e.plasmaDotTick <= 0) {
        damageEnemy(s, e, 2, 'plasmaHypothermia')
        e.plasmaDotTick = 0.5
      }
      if (!e.alive) continue
    }
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
    if (e.carriedBy != null) continue
    if (e.type === 'healer' && e.healCooldown <= 0) {
      // Frozen healers still heal, but at only 25% of their normal strength.
      const healRatio = e.frozenTimer > 0 ? 0.05 : 0.2
      for (const ally of s.enemies) {
        if (!ally.alive || ally.id === e.id || ally.type === 'bugPrince') continue
        if (Math.hypot(ally.x-e.x,ally.y-e.y)<=110 && ally.hp<ally.maxHp) ally.hp=Math.min(ally.maxHp,ally.hp+Math.max(1,ally.hp*healRatio))
      }
      s.explosions.push({x:e.x,y:e.y,r:92,t:0,dur:.25,color:e.frozenTimer>0?'#7dd3fc':'#4ade80'});e.healCooldown=1.25
    }
    if((e.type==='bugPrince'||e.type==='bugQueen')&&e.spawnCooldown<=0){
      const picks:EnemyType[]=e.type==='bugQueen'?['grunt','runner','tank','vessel','jumper','healer','splitter','shadowBug','spitter','bulb']:['grunt','runner','tank','vessel','jumper','healer']
      s.spawnQueue.push({type:picks[Math.floor(Math.random()*picks.length)],delay:.05},{type:picks[Math.floor(Math.random()*picks.length)],delay:.05})
      e.spawnCooldown=e.type==='bugQueen'?2.3:2.8
    }
    if(e.type==='bulb'&&e.bulbTimer<=0){
      e.bulbOn=!e.bulbOn;e.bulbTimer=2.5
      s.explosions.push({x:e.x,y:e.y,r:e.bulbOn?88:30,t:0,dur:.35,color:e.bulbOn?'#fde047':'#64748b'})
    }
    if(e.type==='spitter'&&e.attackCooldown<=0){
      const tower=s.towers.filter(t=>t.disabledTimer<=0).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0]
      if(tower){tower.disabledTimer=3.5;s.explosions.push({x:tower.x,y:tower.y,r:24,t:0,dur:.35,color:'#22d3ee'})}
      e.attackCooldown=2.5
    }
    if(e.type==='jumper'&&e.jumpCooldown<=0&&e.frozenTimer<=0&&!e.cocooning){
      e.airborneTimer=.55;e.jumpCooldown=1;e.anim=0
    }
    if (e.frozenTimer > 0) continue
    const previousDist = e.dist
    if (e.type === 'jumper') {
      // Each jump covers up to 70 world units over 0.52s, smoothly following
      // the waypoint path instead of teleporting. Crossing a waypoint never stalls it.
      if(e.airborneTimer>0){
        let step=82*dt/.55
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
      if (e.alive && e.dist > previousDist) {
        const portal = s.portalPairs.find(pair => !pair.usedEnemyIds.includes(e.id) && previousDist < pair.blueDistance && e.dist >= pair.blueDistance)
        if (portal) {
          portal.usedEnemyIds.push(e.id)
          placeEnemyOnPath(e, portal.purpleDistance)
          const blue = pointOnPath(portal.blueDistance), purple = pointOnPath(portal.purpleDistance)
          s.explosions.push({ x: blue.x, y: blue.y, r: 20, t: 0, dur: 0.3, color: '#38bdf8' })
          s.explosions.push({ x: purple.x, y: purple.y, r: 23, t: 0, dur: 0.35, color: '#c084fc' })
        }
      }
      continue
    }
    let step = def.speed * (e.splitGeneration > 0 ? 2 : 1) * (e.slowTimer > 0 ? e.slowFactor : 1) * dt
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
    if (e.alive && e.dist > previousDist) {
      const portal = s.portalPairs.find(pair => !pair.usedEnemyIds.includes(e.id) && previousDist < pair.blueDistance && e.dist >= pair.blueDistance)
      if (portal) {
        portal.usedEnemyIds.push(e.id)
        placeEnemyOnPath(e, portal.purpleDistance)
        const blue = pointOnPath(portal.blueDistance), purple = pointOnPath(portal.purpleDistance)
        s.explosions.push({ x: blue.x, y: blue.y, r: 20, t: 0, dur: 0.3, color: '#38bdf8' })
        s.explosions.push({ x: purple.x, y: purple.y, r: 23, t: 0, dur: 0.35, color: '#c084fc' })
      }
    }
  }

  for (const t of s.towers) {
    const baseDef = TOWERS[t.type]
    t.disabledTimer = Math.max(0,t.disabledTimer-dt)
    if(t.disabledTimer>0){t.beamTargets=[];continue}
    t.cooldown -= dt
    if (t.type === 'rockLauncher' && t.burstShotsRemaining > 0) {
      t.burstTimer = Math.max(0, t.burstTimer - dt)
      if (t.burstTimer <= 0) {
        launchPathBoulder(s, t, baseDef)
        t.burstShotsRemaining = 0
        t.burstTimer = 0
      }
      continue
    }
    if (t.type === 'plasmaBlaster') t.recoil = Math.min(1, t.recoil + dt * baseDef.fireRate)
    else t.recoil = Math.max(0, t.recoil - dt * 5)
    if (t.type === 'teleporter') {
      t.supportCooldown = Math.max(0, t.supportCooldown - dt)
      if (t.supportCooldown <= 0) {
        const nearbyIds = new Set(s.towers.filter(other => other.id !== t.id && TOWERS[other.type].tier <= 3 && Math.hypot(other.x - t.x, other.y - t.y) <= baseDef.range).map(other => other.id))
        const available = s.projectiles.filter(projectile => projectile.sourceTowerId !== undefined && nearbyIds.has(projectile.sourceTowerId) && !projectile.teleporterClone)
        if (available.length) {
          const sourceIds = [...new Set(available.map(projectile => projectile.sourceTowerId!))]
          const selectedSource = sourceIds[Math.floor(Math.random() * sourceIds.length)]
          const options = available.filter(projectile => projectile.sourceTowerId === selectedSource)
          const original = options[Math.floor(Math.random() * options.length)]
          const clone = { ...original, color: '#c084fc', teleporterClone: true } as Projectile
          if (clone.kind === 'energy') clone.hitTimers = { ...clone.hitTimers }
          if ('hitIds' in clone) clone.hitIds = [...clone.hitIds]
          if (clone.kind === 'snowball') { clone.carriedIds = [...clone.carriedIds]; clone.carrierId = s.nextId++ }
          s.projectiles.push(clone)
          const px = 'x' in original ? original.x : original.sx + (original.tx - original.sx) * (original.t / original.duration)
          const py = 'y' in original ? original.y : original.sy + (original.ty - original.sy) * (original.t / original.duration)
          s.explosions.push({ x: px, y: py, r: 17, t: 0, dur: 0.28, color: '#c084fc' })
          t.supportCooldown = 3.6
        } else {
          t.supportCooldown = 0.25
        }
      }
    }
    if (t.type === 'incomeFarm' || t.type === 'incomeTax' || t.type === 'economyHouse') {
      if (s.waveActive && t.incomeWave === s.wave && t.incomeSignalsLeft > 0 && t.cooldown <= 0) {
        const baseIncome = t.type === 'incomeFarm' ? 30 : t.type === 'incomeTax' ? 70 : 80
        const stationNearby = s.towers.some(other => other.type === 'electricalStation' && Math.hypot(other.x-t.x,other.y-t.y) <= TOWERS.electricalStation.range)
        s.money += Math.round(baseIncome * (stationNearby ? 1.5 : 1))
        t.incomeSignalsLeft--
        t.cooldown = 0.75
        s.explosions.push({x:t.x,y:t.y,r:22,t:0,dur:.3,color:baseDef.color})
      }
      continue
    }
    if (t.type === 'buffer' || t.type === 'commsLanHouse' || t.type === 'electricalStation' || t.type === 'economyHouse') continue
    const buffSources = s.towers.filter(other => {
      const dist = Math.hypot(other.x-t.x,other.y-t.y)
      return dist <= TOWERS[other.type].range &&
        ((other.type === 'buffer') || (other.type === 'commsLanHouse') || (other.type === 'electricalStation'))
    })
    const hasComms = buffSources.some(other => other.type === 'commsLanHouse')
    const hasBuffer = buffSources.some(other => other.type === 'buffer')
    const hasStation = buffSources.some(other => other.type === 'electricalStation')
    const buff = hasComms ? 1.2 : hasBuffer ? 1.1 : hasStation ? 1.05 : 1
    const def = {...baseDef, damage:baseDef.damage*buff, range:baseDef.range*(1+(hasComms ? 0.1 : hasBuffer ? 0.06 : hasStation ? 0.03 : 0)), fireRate:baseDef.fireRate*buff, projectileSpeed:baseDef.projectileSpeed*buff, splash:baseDef.splash*(1+(hasComms ? 0.1 : hasBuffer ? 0.06 : hasStation ? 0.03 : 0))}
    const foundTarget = (['boulderLauncher', 'rockLauncher', 'boulderCannon', 'snowballLauncher', 'electricSyringe', 'portalGun'].includes(t.type))
      ? findReversePathTarget(s, t, def.range)
      : findTarget(
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

    if (t.type === 'plasmaBlaster' || t.type === 'plasmaRod') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      const laserReady = t.type === 'plasmaBlaster' ? t.recoil >= 1 : t.cooldown <= 0
      if (laserReady) {
        const dirX = Math.cos(t.angle), dirY = Math.sin(t.angle)
        const hitWidth = t.type === 'plasmaBlaster' ? 9 : 5
        const lineTargets = s.enemies.filter(enemy => {
          if (!enemy.alive) return false
          const dx = enemy.x - t.x, dy = enemy.y - t.y
          const along = dx * dirX + dy * dirY
          const across = Math.abs(dx * dirY - dy * dirX)
          return along > 0 && along <= def.range && across <= hitWidth
        }).sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))
        if (lineTargets.length) {
          const perEnemyDamage = t.type === 'plasmaBlaster' ? def.damage / lineTargets.length : def.damage
          for (const enemy of lineTargets) damageEnemy(s, enemy, perEnemyDamage, t.type)
        }
        s.plasmaBeams.push({ x1: t.x, y1: t.y, x2: t.x + dirX * def.range, y2: t.y + dirY * def.range, width: t.type === 'plasmaBlaster' ? 8 : 3.2, t: 0, duration: t.type === 'plasmaBlaster' ? 0.46 : 0.2, color: def.color })
        if (t.type === 'plasmaBlaster') t.recoil = 0
        else { t.cooldown = 1 / def.fireRate; t.recoil = 0.5 }
      }
      continue
    }

    if (t.type === 'ice') {
      for (const enemy of s.enemies) if (enemy.alive && Math.hypot(enemy.x-t.x,enemy.y-t.y)<=def.range) applySlow(enemy,0.45,0.65)
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
          applyFreeze(enemy, 0.5)
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
      fire(s, t, target, def)
      if (t.type === 'rockLauncher') { t.burstShotsRemaining = 1; t.burstTimer = 0.5 }
      t.cooldown = 1 / def.fireRate
    }
  }

  for (const pool of s.plasmaPools) {
    pool.t += dt
    for (const enemy of s.enemies) {
      if (!enemy.alive || pool.usedEnemyIds.length >= 5 || pool.usedEnemyIds.includes(enemy.id)) continue
      if (Math.hypot(enemy.x - pool.x, enemy.y - pool.y) <= pool.radius + ENEMIES[enemy.type].radius) {
        pool.usedEnemyIds.push(enemy.id)
        applySlow(enemy, 2.4, 0.6)
        enemy.plasmaDotTimer = Math.max(enemy.plasmaDotTimer, 2.5)
        enemy.plasmaDotTick = 0
        s.explosions.push({ x: enemy.x, y: enemy.y, r: 12, t: 0, dur: 0.22, color: '#c084fc' })
      }
    }
  }
  s.plasmaPools = s.plasmaPools.filter(pool => pool.t < pool.duration && pool.usedEnemyIds.length < 5)

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
    if (p.kind === 'homing') {
      let target = p.targetId === null ? null : s.enemies.find(enemy => enemy.id === p.targetId && enemy.alive && !p.hitIds.includes(enemy.id)) ?? null
      if (!target) {
        p.targetId = null
        if (p.traveled >= p.acquireAfter) {
          let nearest: Enemy | null = null
          let nearestDistance = p.sourceType === 'plasmaCannon' ? 340 : 170
          for (const enemy of s.enemies) {
            if (!enemy.alive || p.hitIds.includes(enemy.id)) continue
            const distance = Math.hypot(enemy.x - p.x, enemy.y - p.y)
            if (distance < nearestDistance) { nearest = enemy; nearestDistance = distance }
          }
          target = nearest
          if (target) p.targetId = target.id
        }
      }
      if (target) {
        const desired = Math.atan2(target.y - p.y, target.x - p.x)
        const current = Math.atan2(p.dirY, p.dirX)
        let delta = Math.atan2(Math.sin(desired - current), Math.cos(desired - current))
        delta = Math.max(-p.turnRate * dt, Math.min(p.turnRate * dt, delta))
        const nextAngle = current + delta
        p.dirX = Math.cos(nextAngle); p.dirY = Math.sin(nextAngle)
      }
      const step = p.speed * dt
      p.x += p.dirX * step; p.y += p.dirY * step; p.traveled += step
      const hit = s.enemies.filter(enemy => enemy.alive && !p.hitIds.includes(enemy.id) && Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 2).sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]
      if (hit) {
        p.hitIds.push(hit.id)
        damageEnemy(s, hit, p.damage, p.sourceType)
        p.targetId = null
        if (p.hitIds.length >= p.hitLimit) return false
      }
      return p.traveled < p.maxDistance && p.x >= -24 && p.x <= WIDTH + 24 && p.y >= -24 && p.y <= HEIGHT + 24
    }
    if (p.kind === 'slingshot') {
      const step = p.speed * dt
      p.x += p.dirX * step; p.y += p.dirY * step; p.traveled += step
      if (p.x < 8 || p.x > WIDTH - 8) {
        if (p.bouncesLeft <= 0) return false
        p.x = Math.max(8, Math.min(WIDTH - 8, p.x)); p.dirX *= -1; p.bouncesLeft--
      }
      if (p.y < 8 || p.y > HEIGHT - 8) {
        if (p.bouncesLeft <= 0) return false
        p.y = Math.max(8, Math.min(HEIGHT - 8, p.y)); p.dirY *= -1; p.bouncesLeft--
      }
      const hit = s.enemies.filter(enemy => enemy.alive && !p.hitIds.includes(enemy.id) && Math.hypot(enemy.x-p.x, enemy.y-p.y) <= ENEMIES[enemy.type].radius + p.size + 2)
        .sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]
      if (hit) {
        p.hitIds.push(hit.id); damageEnemy(s, hit, p.damage, 'slingshot')
        s.explosions.push({ x: hit.x, y: hit.y, r: 9, t: 0, dur: 0.14, color: p.color })
        if (p.hitIds.length >= p.hitLimit) return false
      }
      return p.traveled < 2200
    }
    if (p.kind === 'fragment') {
      const step = p.speed * dt
      p.x += p.dirX * step; p.y += p.dirY * step; p.traveled += step
      const hit = s.enemies.filter(enemy => enemy.alive && Math.hypot(enemy.x-p.x, enemy.y-p.y) <= ENEMIES[enemy.type].radius + p.size + 1)
        .sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]
      if (hit) {
        damageEnemy(s, hit, p.damage, 'boulderCannon')
        s.explosions.push({ x: hit.x, y: hit.y, r: 7, t: 0, dur: 0.12, color: p.color })
        return false
      }
      return p.traveled < p.maxDistance && p.x >= -10 && p.x <= WIDTH + 10 && p.y >= -10 && p.y <= HEIGHT + 10
    }
    if (p.kind === 'syringe') {
      const dx = p.tx - p.x, dy = p.ty - p.y, distance = Math.hypot(dx, dy), step = p.speed * dt
      if (distance <= step + 2) {
        p.x = p.tx; p.y = p.ty
        s.electricTraps.push({ x: p.x, y: p.y, radius: p.radius, t: 0, duration: 7, tickTimer: 0, damage: p.damage })
        s.explosions.push({ x: p.x, y: p.y, r: p.radius, t: 0, dur: 0.42, color: '#67e8f9' })
        return false
      }
      p.x += (dx / distance) * step; p.y += (dy / distance) * step
      return true
    }
    if (p.kind === 'snowball') {
      const old = { x: p.x, y: p.y }
      const nextDistance = Math.max(0, p.pathDistance - p.speed * dt)
      const next = pointOnPath(nextDistance)
      p.traveled += p.pathDistance - nextDistance; p.pathDistance = nextDistance
      p.x = next.x; p.y = next.y
      for (let i = 0; i < p.carriedIds.length; i++) {
        const carried = s.enemies.find(enemy => enemy.id === p.carriedIds[i] && enemy.alive)
        if (carried) placeEnemyOnPath(carried, p.pathDistance + (i - (p.carriedIds.length - 1) / 2) * 7)
      }
      const dx = p.x - old.x, dy = p.y - old.y, lenSq = dx * dx + dy * dy
      const hit = s.enemies.filter(enemy => enemy.alive && enemy.carriedBy == null && !p.carriedIds.includes(enemy.id))
        .map(enemy => {
          const along = lenSq > 0 ? Math.max(0, Math.min(1, ((enemy.x-old.x)*dx+(enemy.y-old.y)*dy)/lenSq)) : 0
          return { enemy, along, distance: Math.hypot(enemy.x-(old.x+along*dx), enemy.y-(old.y+along*dy)) }
        })
        .filter(item => item.distance <= ENEMIES[item.enemy.type].radius + p.size)
        .sort((a,b) => a.along-b.along)[0]?.enemy
      if (hit) {
        hit.carriedBy = p.carrierId; p.carriedIds.push(hit.id)
        s.explosions.push({ x: hit.x, y: hit.y, r: 12, t: 0, dur: 0.16, color: p.color })
      }
      if (p.carriedIds.length >= 5 || p.pathDistance <= 0) {
        const count = p.carriedIds.length
        for (let i = 0; i < count; i++) {
          const carried = s.enemies.find(enemy => enemy.id === p.carriedIds[i])
          if (carried) {
            carried.carriedBy = undefined
            placeEnemyOnPath(carried, p.pathDistance + (i - (count - 1) / 2) * 18)
          }
        }
        explode(s, p.x, p.y, p.splash, p.damage, p.color, 'snowballLauncher')
        freezeInRadius(s, p.x, p.y, p.splash, 1)
        for (const enemy of s.enemies) {
          if (!enemy.alive || Math.hypot(enemy.x-p.x,enemy.y-p.y) > p.splash + ENEMIES[enemy.type].radius) continue
          placeEnemyOnPath(enemy, enemy.dist + (enemy.id % 3 - 1) * 7)
        }
        return false
      }
      return true
    }
    if (p.kind === 'boulder') {
      const old = { x: p.x, y: p.y }
      const nextDistance = Math.max(0, p.pathDistance - p.speed * dt)
      const next = pointOnPath(nextDistance)
      p.traveled += p.pathDistance - nextDistance
      p.pathDistance = nextDistance
      p.x = next.x; p.y = next.y
      const dx = p.x - old.x, dy = p.y - old.y, lenSq = dx * dx + dy * dy
      let hit: Enemy | null = null, hitAlong = Infinity
      for (const enemy of s.enemies) {
        if (!enemy.alive || p.hitIds.includes(enemy.id)) continue
        const along = lenSq > 0 ? Math.max(0, Math.min(1, ((enemy.x - old.x) * dx + (enemy.y - old.y) * dy) / lenSq)) : 0
        const nearX = old.x + along * dx, nearY = old.y + along * dy
        if (Math.hypot(enemy.x - nearX, enemy.y - nearY) <= ENEMIES[enemy.type].radius + p.size && along < hitAlong) { hit = enemy; hitAlong = along }
      }
      if (hit) {
        p.hitIds.push(hit.id); damageEnemy(s, hit, p.damage, p.sourceType)
        s.explosions.push({ x: hit.x, y: hit.y, r: p.size + 5, t: 0, dur: 0.16, color: p.color })
        if (p.shatterOnHit) {
          for (let i = 0; i < (p.fragmentCount ?? 8); i++) {
            const angle = Math.random() * Math.PI * 2, speed = 180 + Math.random() * 100
            spawned.push({ kind: 'fragment', x: hit.x, y: hit.y, dirX: Math.cos(angle), dirY: Math.sin(angle),
              speed, traveled: 0, maxDistance: 115 + Math.random() * 35,
              damage: p.fragmentDamage ?? 26, color: '#a8a29e', size: 4 + Math.random() * 1.5,
              sourceType: 'boulderCannon', sourceTowerId: p.sourceTowerId })
          }
          s.explosions.push({ x: hit.x, y: hit.y, r: 34, t: 0, dur: 0.28, color: '#d6d3d1' })
          return false
        }
        p.damage = Math.max(0, p.damage - p.damageDecay); p.size = Math.max(0, p.size - p.sizeDecay)
        if (p.damage <= 0 || p.size <= 0 || p.hitIds.length >= p.hitLimit) return false
      }
      return p.pathDistance > 0 && p.damage > 0 && p.size > 0
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
              sourceType: p.sourceType,
              sourceTowerId: p.sourceTowerId,
              teleporterClone: p.teleporterClone,
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
      if (p.cryo) {
        freezeInRadius(s,p.tx,p.ty,p.splash,0.5)
        for(let i=0;i<8;i++) { const a=i*Math.PI/4; spawned.push({kind:'ice',x:p.tx,y:p.ty,dirX:Math.cos(a),dirY:Math.sin(a),traveled:0,maxDistance:125,speed:290,damage:p.damage*.45,color:p.teleporterClone?'#c084fc':'#a5f3fc',size:4,freezeDuration:0,slowDuration:0,slowFactor:1,hitLimit:4,hitIds:[],splitOnHit:false,explodeAtLimit:false,splash:0,splashFreezeDuration:0,sourceType:p.sourceType??'cryoMortar',sourceTowerId:p.sourceTowerId,teleporterClone:p.teleporterClone}) }
      }
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
            color: p.teleporterClone ? '#c084fc' : '#fb7185',
            size: 4,
            sourceType: p.sourceType,
            sourceTowerId: p.sourceTowerId,
            teleporterClone: p.teleporterClone,
          })
        }
      }
      return false
    }
    return true
  })
  s.projectiles.push(...spawned)

  s.plasmaBeams = s.plasmaBeams.filter(beam => { beam.t += dt; return beam.t < beam.duration })
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
  if(type==='splitter'){ctx.strokeStyle='#ffedd5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.7,-r*.5);ctx.lineTo(r*.2,r*.5);ctx.moveTo(-r*.7,r*.5);ctx.lineTo(r*.2,-r*.5);ctx.stroke()}
  if(type==='shadowBug'){ctx.strokeStyle='#c4b5fd';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.95,0,Math.PI*2);ctx.stroke()}
  if(type==='spitter'){ctx.fillStyle='#a5f3fc';ctx.beginPath();ctx.arc(r*.75,-r*.35,r*.25,0,Math.PI*2);ctx.fill()}
  if(type==='bulb'){ctx.fillStyle='#fef08a';ctx.shadowColor='#fde047';ctx.shadowBlur=anim%6<3?12:0;ctx.beginPath();ctx.arc(0,0,r*.45,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
  if(type==='healer'){ctx.strokeStyle='#dcfce7';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-r*.35,-r*.3);ctx.lineTo(-r*.35,r*.3);ctx.moveTo(-r*.65,0);ctx.lineTo(-r*.05,0);ctx.stroke()}
  if(type==='bugPrince'||type==='bugQueen'){ctx.fillStyle=type==='bugQueen'?'#f5d0fe':'#fef3c7';ctx.strokeStyle='#92400e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.5,-r*.45);ctx.lineTo(-r*.6,-r*1.05);ctx.lineTo(-r*.15,-r*.78);ctx.lineTo(0,-r*(type==='bugQueen'?1.55:1.25));ctx.lineTo(r*.2,-r*.78);ctx.lineTo(r*.6,-r*1.05);ctx.lineTo(r*.48,-r*.42);ctx.closePath();ctx.fill();ctx.stroke()}
  if(helmet||type==='bugQueen'){ctx.fillStyle=type==='bugQueen'?'#f5d0fe':'#cbd5e1';ctx.strokeStyle='#475569';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(r*.25,-r*.35,r*.42,Math.PI,Math.PI*2);ctx.lineTo(r*.67,-r*.1);ctx.lineTo(-r*.17,-r*.1);ctx.closePath();ctx.fill();ctx.stroke()}
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
  if (['incomeFarm','incomeTax','economyHouse'].includes(type)) {
    ctx.fillStyle = def.color
    ctx.fillRect(-11, -11, 22, 22)
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(type === 'economyHouse' ? '\u0024\u0024\u0024' : type === 'incomeTax' ? '\u0024\u0024' : '\u0024', 0, 0)
    ctx.restore()
    return
  }
  if (['buffer','commsLanHouse','electricalStation'].includes(type)) {
    ctx.strokeStyle = def.color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, type === 'commsLanHouse' ? 13 : 10, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-7, 0)
    ctx.lineTo(7, 0)
    ctx.moveTo(0, -7)
    ctx.lineTo(0, 7)
    ctx.stroke()
    ctx.restore()
    return
  }
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

  if (type === 'slingshot') {
    ctx.strokeStyle = def.color; ctx.lineWidth = 4; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-8, -11); ctx.lineTo(1, 0); ctx.lineTo(-8, 11)
    ctx.moveTo(1, 0); ctx.lineTo(13, 0); ctx.stroke()
    ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(-7, -10); ctx.quadraticCurveTo(3, 0, -7, 10); ctx.stroke()
    ctx.restore(); return
  }
  if (type === 'boulderLauncher' || type === 'rockLauncher' || type === 'boulderCannon' || type === 'snowballLauncher') {
    ctx.rotate(angle); ctx.fillStyle = def.accent; ctx.fillRect(-5, -5, 21, 10)
    ctx.fillStyle = def.color; ctx.strokeStyle = '#e7e5e4'; ctx.lineWidth = 1.5
    const r = type === 'boulderCannon' ? 14 : type === 'boulderLauncher' ? 10 : type === 'snowballLauncher' ? 9 : 7
    ctx.beginPath(); ctx.arc(14, 0, r + recoil, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#f5f5f4'; ctx.beginPath(); ctx.arc(11, -3, r * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return
  }
  if (type === 'electricSyringe') {
    ctx.rotate(angle); ctx.fillStyle = def.accent; ctx.fillRect(-8, -6, 23, 12)
    ctx.fillStyle = def.color; ctx.fillRect(8, -4, 12, 8)
    ctx.strokeStyle = '#cffafe'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(25, 0); ctx.stroke()
    ctx.restore(); return
  }
  if (type === 'portalGun') {
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 12
    ctx.beginPath(); ctx.ellipse(-5, 0, 6, 11, -0.25, 0, Math.PI * 2); ctx.stroke()
    ctx.strokeStyle = '#c084fc'; ctx.beginPath(); ctx.ellipse(7, 0, 6, 11, 0.25, 0, Math.PI * 2); ctx.stroke()
    ctx.restore(); return
  }
  if (type === 'teleporter') {
    ctx.rotate(angle); ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 13
    ctx.beginPath(); ctx.ellipse(2, 0, 13, 8, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(3, 0, 7, 12, 0.4, 0, Math.PI * 2); ctx.stroke()
    ctx.shadowBlur = 0; ctx.fillStyle = '#e9d5ff'; ctx.beginPath(); ctx.arc(4, 0, 4.5 + recoil * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return
  }
  if (type === 'plasmaCannon') {
    ctx.fillStyle = def.accent; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = def.color; ctx.lineWidth = 5; ctx.lineCap = 'round'
    for (const a of [Math.PI / 4, Math.PI * 1.25]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 19); ctx.stroke() }
    ctx.fillStyle = '#f5eaff'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return
  }
  if (type === 'plasmaBlaster' || type === 'plasmaRod') {
    ctx.rotate(angle); ctx.fillStyle = def.accent; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = def.color; ctx.lineCap = 'round'; ctx.lineWidth = type === 'plasmaBlaster' ? 8 : 4; ctx.shadowColor = def.color; ctx.shadowBlur = type === 'plasmaBlaster' ? 5 + recoil * 18 : 11
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(21 - (type === 'plasmaBlaster' ? 0 : recoil * 3), 0); ctx.stroke(); ctx.shadowBlur = 0
    if (type === 'plasmaBlaster') {
      ctx.globalAlpha = 0.25 + recoil * 0.75; ctx.strokeStyle = '#e9d5ff'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(0, 0, 10 + recoil * 6, 0, Math.PI * 2 * recoil); ctx.stroke(); ctx.globalAlpha = 1
    }
    ctx.fillStyle = '#f5eaff'; ctx.beginPath(); ctx.arc(0, 0, type === 'plasmaBlaster' ? 4 + recoil * 4 : 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return
  }
  if (type === 'plasmaHypothermia') {
    ctx.fillStyle = def.accent; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = def.color; ctx.lineWidth = 2.5; ctx.shadowColor = def.color; ctx.shadowBlur = 8
    for (const [dx, dy, r] of [[-7,-3,5],[5,-5,4],[4,6,6]] as const) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.stroke() }
    ctx.restore(); return
  }

  if (type === 'mortar' || type === 'cryoMortar') {
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
  } else if (type === 'tripleShooter') {
    ctx.fillRect(2 - back, -9, 18, 4)
    ctx.fillRect(2 - back, -2, 18, 4)
    ctx.fillRect(2 - back, 5, 18, 4)
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

  for (const trap of s.electricTraps) {
    const pulse = 0.78 + Math.sin(s.time * 14) * 0.12
    ctx.save(); ctx.globalAlpha = pulse; ctx.fillStyle = 'rgba(34,211,238,0.12)'; ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 2
    ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 15
    ctx.beginPath(); ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    ctx.shadowBlur = 0; ctx.strokeStyle = '#cffafe'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(trap.x - 7, trap.y); ctx.lineTo(trap.x + 7, trap.y); ctx.moveTo(trap.x, trap.y - 7); ctx.lineTo(trap.x, trap.y + 7); ctx.stroke()
    ctx.restore()
  }

  for (const pair of s.portalPairs) {
    const blue = pointOnPath(pair.blueDistance), purple = pointOnPath(pair.purpleDistance)
    const fade = Math.max(0.25, 1 - pair.t / pair.duration)
    for (const item of [{ point: blue, color: '#38bdf8', rotation: s.time * 2 }, { point: purple, color: '#c084fc', rotation: -s.time * 2 }]) {
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(item.point.x, item.point.y); ctx.rotate(item.rotation)
      ctx.shadowColor = item.color; ctx.shadowBlur = 18; ctx.strokeStyle = item.color; ctx.lineWidth = 4
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 20, 0, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = '#f5f3ff'; ctx.lineWidth = 1.3
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 14, 0, 0, Math.PI * 2); ctx.stroke()
      ctx.restore()
    }
  }

  for (const pool of s.plasmaPools) {
    const fade = Math.max(0.18, 1 - pool.t / pool.duration)
    ctx.save(); ctx.globalAlpha = fade * 0.8; ctx.fillStyle = '#a855f7'; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 16
    ctx.beginPath(); ctx.ellipse(pool.x, pool.y, pool.radius * 1.12, pool.radius * 0.72, Math.sin(s.time * 1.3) * 0.12, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0; ctx.strokeStyle = '#e9d5ff'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.ellipse(pool.x, pool.y, pool.radius * 0.88, pool.radius * 0.55, 0, s.time * 0.7, s.time * 0.7 + Math.PI * 1.5); ctx.stroke(); ctx.restore()
  }

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

  for (const beam of s.plasmaBeams) {
    const alpha = Math.max(0, 1 - beam.t / beam.duration)
    ctx.save(); ctx.globalAlpha = alpha; ctx.lineCap = 'round'; ctx.strokeStyle = beam.color; ctx.shadowColor = beam.color; ctx.shadowBlur = beam.width * 2.5; ctx.lineWidth = beam.width
    ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(beam.x2, beam.y2); ctx.stroke()
    ctx.strokeStyle = '#f5eaff'; ctx.shadowBlur = 0; ctx.lineWidth = Math.max(1, beam.width * 0.32)
    ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(beam.x2, beam.y2); ctx.stroke(); ctx.restore()
  }

  for (const e of s.enemies) {
    drawBug(ctx, e.type, e.x, e.y-(e.airborneTimer>0?14:0), e.angle, e.anim, e.cocooning, e.airborneTimer>0, e.helmet)
    if (e.plasmaDotTimer > 0) {
      ctx.save(); ctx.strokeStyle = '#d8b4fe'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(e.x, e.y, ENEMIES[e.type].radius + 7, s.time * 2, s.time * 2 + Math.PI * 1.5); ctx.stroke(); ctx.restore()
    }
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
    if (p.teleporterClone) {
      const vx = 'x' in p ? p.x : p.sx + (p.tx - p.sx) * (p.t / p.duration)
      const vy = 'y' in p ? p.y : p.sy + (p.ty - p.sy) * (p.t / p.duration)
      ctx.save(); ctx.globalAlpha = 0.32; ctx.fillStyle = '#c084fc'; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(vx, vy, ('size' in p ? p.size : 5) + 7, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }
    if (p.kind === 'boulder' || p.kind === 'snowball') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.dirY, p.dirX)); ctx.fillStyle = p.color; ctx.strokeStyle = '#e7e5e4'; ctx.lineWidth = 1.5; ctx.shadowColor = p.color; ctx.shadowBlur = 8
      if (p.kind === 'snowball') {
        ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.strokeStyle = '#7dd3fc'; ctx.beginPath(); ctx.arc(-3, -3, 3, 0, Math.PI * 2); ctx.stroke()
      } else {
        ctx.beginPath(); ctx.moveTo(p.size, 0); ctx.lineTo(p.size * 0.55, -p.size * 0.72); ctx.lineTo(-p.size * 0.7, -p.size * 0.85); ctx.lineTo(-p.size, 0); ctx.lineTo(-p.size * 0.45, p.size * 0.75); ctx.lineTo(p.size * 0.65, p.size * 0.62); ctx.closePath(); ctx.fill(); ctx.stroke()
      }
      ctx.restore()
    } else if (p.kind === 'slingshot') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color; ctx.strokeStyle = '#f5f5f4'; ctx.lineWidth = 1.2; ctx.shadowColor = p.color; ctx.shadowBlur = 9
      ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore()
    } else if (p.kind === 'fragment') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.dirY, p.dirX)); ctx.fillStyle = p.color
      ctx.beginPath(); ctx.moveTo(p.size, 0); ctx.lineTo(-p.size, -p.size * 0.55); ctx.lineTo(-p.size * 0.4, p.size * 0.8); ctx.closePath(); ctx.fill(); ctx.restore()
    } else if (p.kind === 'syringe') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.ty-p.y, p.tx-p.x)); ctx.fillStyle = '#cffafe'; ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 1.3
      ctx.fillRect(-6, -3, 12, 6); ctx.strokeRect(-6, -3, 12, 6); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(12, 0); ctx.stroke()
      ctx.fillStyle = p.color; ctx.fillRect(-7, -4, 3, 8); ctx.restore()
    } else if (p.kind === 'homing') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.dirY, p.dirX)); ctx.shadowColor = p.color; ctx.shadowBlur = 13; ctx.fillStyle = p.color; ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(-4, -3.5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 3.5); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#f5eaff'; ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    } else if (p.kind === 'energy') {
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
