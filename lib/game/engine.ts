import {
  CELL,
  COLS,
  ENEMIES,
  HEIGHT,
  ROWS,
  TOWERS,
  TOWER_ELEMENTS,
  WIDTH,
  DEFAULT_MAP_ID,
  getMapDefinition,
  type MapId,
  buildWave,
  fusionResult,
  hpScale,
  type EnemyType,
  type TowerType,
  type TargetMode,
} from './data'
import { drawPremiumBug, drawPremiumTower, drawPremiumDrone, drawPremiumSpikeTrap, drawPremiumHelicopter } from './premium-art'

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
  routeIndex: number
  angle: number
  anim: number
  alive: boolean
  cocooning: boolean
  cocoonTimer: number
  carriedBy?: number
  segmentHp?: number[]
  segmentMaxHp?: number
  burrowTimer: number
  burrowCooldown: number
  burrowRemaining: number
  heatFuse: number
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
  hp: number
  maxHp: number
  recoil: number
  beamTargets: number[]
  targetMode: TargetMode
  chargeTargetId: number | null
  chargeTime: number
  incomeSignalsLeft: number
  incomeWave: number
  disabledTimer: number
  supportCooldown: number
  essence: number
  overclockTimer: number
  burstTimer: number
  burstShotsRemaining: number
  meteorDistance: number
  meteorTimer: number
  bankedMoney: number
  droneTimer: number
  helicopterX: number
  helicopterY: number
  helicopterCooldown: number
  helicopterMissileCooldown: number
}

type Projectile = (
  | {
      kind: 'hybrid'
      x: number; y: number; dirX: number; dirY: number; speed: number; traveled: number; maxDistance: number
      damage: number; splash: number; hitIds: number[]; hitLimit: number; bouncesLeft: number
      payloadType: TowerType; effectType: TowerType; slowDuration: number; freezeDuration: number
      chainCount: number; color: string; size: number
    }
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
      droneId?: number
    }
  | {
      kind: 'fire'
      x: number; y: number; dirX: number; dirY: number; traveled: number; maxDistance: number
      speed: number; damage: number; damageDecay: number; sizeDecay: number; hitLimit: number
      hitIds: number[]; color: string; size: number; alpha: number
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
      splitOnBounceEnd?: boolean; splash?: number
    }
  | {
      kind: 'fragment'
      x: number; y: number; dirX: number; dirY: number; speed: number; traveled: number
      maxDistance: number; damage: number; color: string; size: number; bouncesLeft?: number
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
      kind: 'blade'
      x: number; y: number; targetId: number; angle: number; orbitRadius: number; angularSpeed: number
      remaining: number; damagePerHit: number; damageCap: number; damageDealt: number
      hitCooldowns: Record<number, number>; flame: boolean; color: string; size: number
    }
  | {
      kind: 'singularity'
      x: number; y: number; tx: number; ty: number; t: number; duration: number
      damage: number; radius: number; capturedIds: number[]; color: string
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
      glacial?: boolean
      cascadeDepth?: number
      color: string
      size: number
    }
) & { sourceTowerId?: number; teleporterClone?: boolean; sourceType?: TowerType; ghostCheckedIds?: number[]; ghostEvadedIds?: number[] }

interface Drone { id: number; ownerId: number; x: number; y: number; hp: number; cooldown: number; targetId: number | null }
interface SpikeTrap { id: number; x: number; y: number; expiresWave: number; usedEnemyIds: number[] }

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
  blueDistance: number; purpleDistance: number; t: number; duration: number; usedEnemyIds: number[]; remainingHp: number
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
  style?: 'flame' | 'grow'
  delay?: number
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
  mapId: MapId
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
  drones: Drone[]
  spikeTraps: SpikeTrap[]
  money: number
  lives: number
  wave: number
  waveActive: boolean
  spawnQueue: { type: EnemyType; delay: number }[]
  spawnTimer: number
  routeSpawnIndex: number
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
  enemyHpMultiplier: number
}

export function createGame(mapId: MapId = DEFAULT_MAP_ID): GameState {
  return {
    mapId,
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
    drones: [],
    spikeTraps: [],
    money: 500,
    lives: 100,
    wave: 0,
    waveActive: false,
    spawnQueue: [],
    spawnTimer: 0,
    routeSpawnIndex: 0,
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
    enemyHpMultiplier: 1,
  }
}




function createEnemy(s: GameState, type: EnemyType, x?: number, y?: number, routeIndexOverride?: number): Enemy {
  const map = getMapGeometry(s.mapId)
  const routeIndex = routeIndexOverride ?? (s.routeSpawnIndex++ % map.routes.length)
  const route = map.routes[routeIndex] ?? map
  x ??= route.waypoints[0].x
  y ??= route.waypoints[0].y
  const def = ENEMIES[type]
  const boss = type === 'bugPrince' || type === 'bugQueen' || type === 'bugKing'
  const helmet = (s.bugPrinceDefeated || s.bugQueenDefeated) && s.seenEnemyTypes.includes(type)
  const queenArmor = s.bugQueenDefeated && s.seenEnemyTypes.includes(type)
  const hp = Math.max(1, Math.round((def.hp * (boss ? 1 : hpScale(Math.max(1, s.wave))) / 1.5) *
    (helmet ? 1.25 : 1) * (queenArmor ? 1.25 : 1) * (type === 'bugKing' ? 1 : s.enemyHpMultiplier)))
  if (!boss && !s.seenEnemyTypes.includes(type)) s.seenEnemyTypes.push(type)
  return {
    id: s.nextId++, type, x, y, hp, maxHp: hp, reviveHp: hp,
    frozenTimer: 0, slowTimer: 0, slowFactor: 1, plasmaDotTimer: 0, plasmaDotTick: 0,
    jumpCooldown: 1.25, airborneTimer: 0, healCooldown: 2, bossThreshold: 1,
    spawnCooldown: type === 'spitter' ? 1.5 : 3.5, helmet, queenArmor, splitGeneration: 0,
    bulbOn: false, bulbTimer: 3,
    attackCooldown: type === 'spitter' ? 1.5 : type === 'buguns' ? 2.2 : type === 'starbug' ? 2.8 : 3,
    wp: 1, dist: 0, routeIndex, angle: 0, anim: Math.random() * 10, alive: true,
    cocooning: false, cocoonTimer: 0,
    segmentHp: type === 'dirtBug' ? Array.from({ length: 4 }, () => hp / 4) : undefined,
    segmentMaxHp: type === 'dirtBug' ? hp / 4 : undefined,
    burrowTimer: 0, burrowCooldown: type === 'dirtBug' ? 2.2 + Math.random() * 1.8 : 0,
    burrowRemaining: 0, heatFuse: type === 'heatBug' ? 3.5 + Math.random() * 3 : 0,
  }
}

function launchHostileProjectile(s: GameState, x: number, y: number, angle: number, shape: 'spit' | 'bugun' | 'star', damage: number, speed = 190) {
  const color = shape === 'spit' ? '#67e8f9' : shape === 'bugun' ? '#fb923c' : '#fde047'
  s.projectiles.push({
    kind: 'hostile', x, y, dirX: Math.cos(angle), dirY: Math.sin(angle),
    speed, traveled: 0, maxDistance: 760, damage, color, size: shape === 'star' ? 7 : 6, shape,
  })
}

export function spawnDebugEnemy(s: GameState, type: EnemyType) {
  s.enemies.push(createEnemy(s, type))
  s.status = 'playing'
}

const INCOME_TOWERS: TowerType[] = ['incomeFarm', 'incomeTax', 'economyHouse', 'masterBank']
export const SOULSTORM_ESSENCE_REQUIRED = 10
const COMMS_BUILDING_OVERCLOCK_DURATION = 4
const COMMS_BUILDING_OVERCLOCK_INTERVAL = 12

export const isBuildable = (s: GameState, col: number, row: number, type?: TowerType) => {
  const cell = `${col},${row}`
  const map = getMapGeometry(s.mapId)
  const farmPad = map.farmCells.has(cell)
  return col >= 0 && row >= 0 && col < COLS && row < ROWS &&
    !map.pathCells.has(cell) &&
    !s.towers.some((t) => t.col === col && t.row === row) &&
    (type ? (INCOME_TOWERS.includes(type) ? farmPad : !farmPad) : true)
}

export const towerAt = (s: GameState, col: number, row: number) =>
  s.towers.find((t) => t.col === col && t.row === row)


export function getTowerMaxHp(type: TowerType) {
  return type === 'commsCenter' ? 12000 : 120 + TOWERS[type].tier * 100
}

export function damageTower(s: GameState, tower: Tower, amount: number, color = '#fb7185') {
  if (!s.towers.some(item => item.id === tower.id)) return
  if (tower.type !== 'commsCenter') {
    const protector = s.towers.find(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - tower.x, other.y - tower.y) <= TOWERS.commsCenter.range)
    if (protector) damageTower(s, protector, amount * 0.375, '#2dd4bf')
    amount *= protector ? 0.25 : 1
  }
  tower.hp = Math.max(0, tower.hp - amount)
  s.explosions.push({ x: tower.x, y: tower.y, r: 18 + amount * 0.12, t: 0, dur: 0.32, color })
  if (tower.hp <= 0) {
    s.towers = s.towers.filter(item => item.id !== tower.id)
    if (s.selectedId === tower.id) {
      s.selectedId = null
      s.fuseMode = false
    }
    s.explosions.push({ x: tower.x, y: tower.y, r: 38, t: 0, dur: 0.55, color: '#f97316' })
  }
}

export function repairTower(s: GameState, id: number) {
  const tower = s.towers.find(item => item.id === id)
  if (!tower) return 0
  const restored = Math.min(50, tower.maxHp - tower.hp)
  const cost = Math.ceil(restored)
  if (restored <= 0 || s.money < cost) return 0
  s.money -= cost
  tower.hp = Math.min(tower.maxHp, tower.hp + restored)
  s.explosions.push({ x: tower.x, y: tower.y, r: 28, t: 0, dur: 0.42, color: '#4ade80' })
  return restored
}

export function placeTower(s: GameState, type: TowerType, col: number, row: number, free = false) {
  const cost = free ? 0 : TOWERS[type].cost
  if ((!free && s.money < TOWERS[type].cost) || !isBuildable(s, col, row, type)) return false
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
    hp: getTowerMaxHp(type),
    maxHp: getTowerMaxHp(type),
    recoil: 0,
    beamTargets: [],
    targetMode: 'first',
    chargeTargetId: null,
    chargeTime: 0,
    incomeSignalsLeft: 0,
    incomeWave: -1,
    disabledTimer: 0,
    supportCooldown: type === 'teleporter' ? 2.2 : (type === 'meteorShower' || type === 'commsCenter') ? 15 : type === 'spikeLayer' ? 12 : 0,
    essence: 0,
    overclockTimer: 0,
    burstTimer: 0,
    burstShotsRemaining: 0,
    meteorDistance: -1,
    meteorTimer: 0,
    bankedMoney: 0,
    droneTimer: 20,
    helicopterX: col * CELL + CELL / 2,
    helicopterY: row * CELL + CELL / 2,
    helicopterCooldown: 0.25,
    helicopterMissileCooldown: 1.2,
  })
  return true
}

export function getFusionCost(a: Tower, b: Tower): number {
  const result = fusionResult(a.type, b.type)
  if (!result) return 0
  const tierMultiplier = TOWERS[result].tier * 1.2
  return Math.ceil((a.invested + b.invested) * (TOWERS[result].tier === 3 ? tierMultiplier * 0.5 : tierMultiplier))
}

export function fuseTowers(s: GameState, sourceId: number, targetId: number) {
  const a = s.towers.find((t) => t.id === sourceId)
  const b = s.towers.find((t) => t.id === targetId)
  if (!a || !b || a === b) return false
  const result = fusionResult(a.type, b.type)
  if (!result) return false
  const fusionCost = getFusionCost(a, b)
  if (s.money < fusionCost) return false
  s.money -= fusionCost
  s.towers = s.towers.filter((t) => t !== a)
  b.type = result
  b.maxHp = getTowerMaxHp(result)
  b.hp = Math.min(b.maxHp, b.hp + a.hp)
  b.invested += a.invested + fusionCost
  b.cooldown = 0.3
  b.beamTargets = []
  b.chargeTargetId = null
  b.chargeTime = 0
  s.explosions.push({ x: b.x, y: b.y, r: 40, t: 0, dur: 0.6, color: TOWERS[result].color })
  s.selectedId = b.id
  return true
}

export function collectMasterBank(s: GameState, id: number) {
  const tower = s.towers.find(item => item.id === id && item.type === 'masterBank')
  if (!tower || tower.bankedMoney <= 0) return 0
  const amount = Math.floor(tower.bankedMoney)
  tower.bankedMoney = 0
  s.money += amount
  s.explosions.push({ x: tower.x, y: tower.y, r: 32, t: 0, dur: 0.45, color: '#fbbf24' })
  return amount
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
  const farmCells = getMapGeometry(s.mapId).farmCells
  s.wave++
  s.waveActive = true
  s.routeSpawnIndex = 0
  for (const tower of s.towers) {
    if (tower.type === 'incomeFarm' && farmCells.has(`${tower.col},${tower.row}`)) { tower.incomeSignalsLeft = 5; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
    else if (tower.type === 'incomeTax' && farmCells.has(`${tower.col},${tower.row}`)) { tower.incomeSignalsLeft = 7; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
    else if (tower.type === 'economyHouse' && farmCells.has(`${tower.col},${tower.row}`)) { tower.incomeSignalsLeft = 8; tower.incomeWave = s.wave; tower.cooldown = 0.25 }
  }
  s.spawnQueue = buildWave(s.wave)
  s.spawnTimer = 0
}

function applyFreeze(e: Enemy, duration: number) {
  if (!e.alive || duration <= 0 || e.type === 'bugPrince' || e.burrowTimer > 0 || ENEMIES[e.type].immunities?.includes('ice')) return
  const wasFrozen = e.frozenTimer > 0
  e.frozenTimer = Math.max(e.frozenTimer, duration)
  if (e.type === 'healer' && !wasFrozen) e.healCooldown = 1.5
}

function applySlow(e: Enemy, duration: number, factor: number, sourceType?: TowerType) {
  if (!e.alive || duration <= 0 || e.type === 'bugPrince' || e.burrowTimer > 0) return
  if (sourceType && TOWER_ELEMENTS[sourceType] === 'ice' && ENEMIES[e.type].immunities?.includes('ice')) return
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

function isElementImmuneToTower(enemyType: EnemyType, towerType?: TowerType) {
  const element = towerType ? TOWER_ELEMENTS[towerType] : undefined
  return !!element && !!ENEMIES[enemyType].immunities?.includes(element)
}

function canTowerTargetEnemy(enemy: Enemy, towerType: TowerType, ignoreImmunity = false) {
  if (enemy.burrowTimer > 0) return false
  if (towerType === 'portalGun' && enemy.type === 'flyBug') return false
  const element = TOWER_ELEMENTS[towerType]
  if (enemy.type === 'ironBug' && element === 'normal') return true
  if (enemy.type === 'rubberBug' && element === 'electricity') return true
  return ignoreImmunity || !isElementImmuneToTower(enemy.type, towerType)
}

function projectilePassesGhost(p: Projectile, enemy: Enemy) {
  if (enemy.type !== 'ghostBug') return false
  if (p.ghostCheckedIds?.includes(enemy.id)) return !!p.ghostEvadedIds?.includes(enemy.id)
  ;(p.ghostCheckedIds ??= []).push(enemy.id)
  if (Math.random() < 0.2) {
    ;(p.ghostEvadedIds ??= []).push(enemy.id)
    return true
  }
  return false
}

function damageEnemy(s: GameState, e: Enemy, dmg: number, sourceType?: TowerType, sourceTowerId?: number, fromProjectile = false) {
  const map = getEnemyPath(getMapGeometry(s.mapId), e)
  if (!e.alive || isShielded(s,e) || e.burrowTimer > 0) return
  const element = sourceType ? TOWER_ELEMENTS[sourceType] : undefined
  if (e.type === 'ironBug' && element === 'normal' && fromProjectile && sourceTowerId && Math.random() < 0.1) {
    const tower = s.towers.find(item => item.id === sourceTowerId)
    if (tower) {
      damageTower(s, tower, 18, '#cbd5e1')
      s.lightningFlashes.push({ points: [{ x: e.x, y: e.y }, { x: tower.x, y: tower.y }], t: 0, dur: 0.24, color: '#cbd5e1' })
    }
    return
  }
  if (e.type === 'rubberBug' && element === 'electricity') {
    const recovered = Math.min(e.maxHp - e.hp, dmg)
    if (recovered > 0) {
      e.hp += recovered
      s.explosions.push({ x: e.x, y: e.y, r: 18, t: 0, dur: 0.3, color: '#fde047' })
    }
    return
  }
  const sourceTower = sourceTowerId !== undefined ? s.towers.find(item => item.id === sourceTowerId) : undefined
  const protectedByComms = !!sourceTower && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - sourceTower.x, other.y - sourceTower.y) <= TOWERS.commsCenter.range)
  if (isElementImmuneToTower(e.type, sourceType) && !protectedByComms) return
  if(e.queenArmor)dmg*=0.75
  if (element && ENEMIES[e.type].weaknesses?.includes(element)) dmg *= 1.5
  else if (element && ENEMIES[e.type].resistances?.includes(element) && !protectedByComms) dmg *= 0.5
  if(e.type==='jumper'&&e.airborneTimer>0&&sourceType&&['shooter','cannon','retarder'].includes(sourceType))return
  const previousHp=e.hp
  if (e.type === 'dirtBug' && e.segmentHp) {
    const segmentIndex = e.segmentHp.findIndex(segment => segment > 0)
    if (segmentIndex >= 0) e.segmentHp[segmentIndex] = Math.max(0, e.segmentHp[segmentIndex] - dmg)
    e.hp = e.segmentHp.reduce((sum, segment) => sum + segment, 0)
  } else {
    e.hp -= dmg
  }
  if (e.type === 'swarmer' && e.hp < previousHp) {
    const child = createEnemy(s, 'swarmBug', e.x + (Math.random() - 0.5) * 10, e.y + (Math.random() - 0.5) * 10, e.routeIndex)
    child.routeIndex = e.routeIndex
    const pathPosition = projectToPath(getEnemyPath(map, e), e.x, e.y)
    placeEnemyOnPath(getEnemyPath(map, child), child, pathPosition.distance)
    s.enemies.push(child)
    s.explosions.push({ x: e.x, y: e.y, r: 13, t: 0, dur: 0.16, color: '#fb7185' })
  }
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
    if (e.type === 'bombug') {
      const blastRadius = 112
      for (const tower of [...s.towers]) {
        if (Math.hypot(tower.x - e.x, tower.y - e.y) <= blastRadius) damageTower(s, tower, 105, '#ef4444')
      }
      s.explosions.push({ x: e.x, y: e.y, r: blastRadius, t: 0, dur: 0.72, color: '#ef4444' })
    }
    if (e.type === 'bugKing') {
      s.enemyHpMultiplier *= 2
      for (const ally of s.enemies) {
        if (!ally.alive || ally.id === e.id || !s.seenEnemyTypes.includes(ally.type)) continue
        ally.maxHp = Math.ceil(ally.maxHp * 2)
        ally.hp = Math.ceil(Math.max(1, ally.hp) * 2)
        if (ally.segmentHp) {
          ally.segmentHp = ally.segmentHp.map(segment => segment * 2)
          if (ally.segmentMaxHp) ally.segmentMaxHp *= 2
          ally.hp = ally.segmentHp.reduce((sum, segment) => sum + segment, 0)
        }
      }
      s.explosions.push({ x: e.x, y: e.y, r: 190, t: 0, dur: 1.5, color: '#c084fc' })
    }
    if(e.type==='bugPrince'||e.type==='bugQueen'){
      const queen=e.type==='bugQueen'
      if(queen)s.bugQueenDefeated=true;else s.bugPrinceDefeated=true
      for(const ally of s.enemies){
        if(!ally.alive||ally.id===e.id||!s.seenEnemyTypes.includes(ally.type))continue
        ally.maxHp=Math.ceil(ally.maxHp*1.25)
        ally.hp=Math.ceil(Math.max(1,ally.hp)*1.25)
        if (ally.segmentHp) {
          ally.segmentHp = ally.segmentHp.map(segment => segment * 1.25)
          if (ally.segmentMaxHp) ally.segmentMaxHp *= 1.25
          ally.hp = ally.segmentHp.reduce((sum, segment) => sum + segment, 0)
        }
        ally.helmet=true
        if(queen)ally.queenArmor=true
      }
      if(queen){
        const types:EnemyType[]=['grunt','tank','runner','vessel','jumper','healer','swarmBug','splitter','shadowBug','spitter','bulb','flyBug','ironBug','rubberBug','heatBug','ghostBug','dirtBug']
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
    if (sourceType && TOWER_ELEMENTS[sourceType] === 'electricity') {
      for (const tower of s.towers) {
        if (tower.type === 'soulstorm') {
          tower.essence = Math.min(SOULSTORM_ESSENCE_REQUIRED, tower.essence + 1)
        }
      }
    }
    s.money += Math.floor(ENEMIES[e.type].reward * (s.towers.some(tower => tower.type === 'economyHouse') ? 1.1 : 1))
    s.explosions.push({ x: e.x, y: e.y, r: ENEMIES[e.type].radius * 1.6, t: 0, dur: 0.35, color: ENEMIES[e.type].color })
  }
}

function explode(s: GameState, x: number, y: number, radius: number, dmg: number, color: string, sourceType?: TowerType, sourceTowerId?: number, projectile = false) {
  for (const e of s.enemies) {
    if (!e.alive || Math.hypot(e.x - x, e.y - y) > radius + ENEMIES[e.type].radius) continue
    if (projectile && e.type === 'ghostBug' && Math.random() < 0.2) continue
    damageEnemy(s, e, dmg, sourceType, sourceTowerId, projectile)
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
    const map = getMapGeometry(s.mapId)
    const progress = e.dist / Math.max(1, (map.routes[e.routeIndex] ?? map).totalLength)
    const bestProgress = best.dist / Math.max(1, (map.routes[best.routeIndex] ?? map).totalLength)
    const preferred =
      mode === 'first' ? progress > bestProgress
      : mode === 'last' ? progress < bestProgress
      : mode === 'strongest' ? e.hp > best.hp
      : mode === 'weakest' ? e.hp < best.hp
      : distance < bestDistance
    if (preferred) best = e
  }
  return best
}

function findChainTargets(s: GameState, first: Enemy, linkRange = 76, towerType?: TowerType) {
  const targets = [first]
  const used = new Set([first.id])
  while (targets.length < 3) {
    const from = targets[targets.length - 1]
    let nearest: Enemy | null = null
    let nearestDistance = linkRange
    for (const e of s.enemies) {
      if (!e.alive || used.has(e.id) || (towerType && !canTowerTargetEnemy(e, towerType))) continue
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

interface PathGeometry {
  waypoints: { x: number; y: number }[]
  pathCells: Set<string>
  smoothPath: { x: number; y: number }[]
  pathDistances: number[]
  distanceScale: number
  totalLength: number
}
interface MapGeometry extends PathGeometry {
  farmCells: Set<string>
  routes: PathGeometry[]
}
const mapGeometryCache = new Map<MapId, MapGeometry>()

function createSmoothedPath(points: readonly { x: number; y: number }[], samplesPerTurn = 20) {
  if (points.length < 3) return [...points]
  const smooth: { x: number; y: number }[] = [{ ...points[0] }]
  const unit = (x: number, y: number) => {
    const length = Math.hypot(x, y) || 1
    return { x: x / length, y: y / length, length }
  }
  const push = (point: { x: number; y: number }) => {
    const last = smooth[smooth.length - 1]
    if (Math.hypot(point.x - last.x, point.y - last.y) > 0.01) smooth.push(point)
  }
  for (let i = 1; i < points.length - 1; i++) {
    const previous = points[i - 1], corner = points[i], next = points[i + 1]
    const incoming = unit(corner.x - previous.x, corner.y - previous.y)
    const outgoing = unit(next.x - corner.x, next.y - corner.y)
    const dot = incoming.x * outgoing.x + incoming.y * outgoing.y
    if (dot > 0.995 || Math.abs(incoming.x * outgoing.y - incoming.y * outgoing.x) < 0.015) {
      push(corner)
      continue
    }
    const cut = Math.min(CELL * 0.52, incoming.length * 0.42, outgoing.length * 0.42)
    const start = { x: corner.x - incoming.x * cut, y: corner.y - incoming.y * cut }
    const end = { x: corner.x + outgoing.x * cut, y: corner.y + outgoing.y * cut }
    const control1 = { x: start.x + incoming.x * cut * 0.58, y: start.y + incoming.y * cut * 0.58 }
    const control2 = { x: end.x - outgoing.x * cut * 0.58, y: end.y - outgoing.y * cut * 0.58 }
    push(start)
    for (let sample = 1; sample <= samplesPerTurn; sample++) {
      const t = sample / samplesPerTurn, inverse = 1 - t
      const a = inverse * inverse * inverse, b = 3 * inverse * inverse * t
      const c = 3 * inverse * t * t, d = t * t * t
      push({
        x: a * start.x + b * control1.x + c * control2.x + d * end.x,
        y: a * start.y + b * control1.y + c * control2.y + d * end.y,
      })
    }
  }
  push({ ...points[points.length - 1] })
  return smooth
}
function pathMetrics(points: readonly { x: number; y: number }[]) {
  const lengths = [0]
  for (let i = 1; i < points.length; i++) {
    lengths[i] = lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  }
  return lengths
}
function buildPathGeometry(rawWaypoints: readonly (readonly [number, number])[]): PathGeometry {
  const waypoints = rawWaypoints.map(([col, row]) => ({ x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 }))
  const pathCells = new Set<string>()
  // Marca qualquer célula cujo centro fique sob a largura visual da pista,
  // inclusive nas diagonais e nas curvas suaves.
  for (let i = 0; i < rawWaypoints.length - 1; i++) {
    const [c1, r1] = rawWaypoints[i], [c2, r2] = rawWaypoints[i + 1]
    const dx = c2 - c1, dy = r2 - r1
    const lengthSq = dx * dx + dy * dy
    const minCol = Math.floor(Math.min(c1, c2) - 1), maxCol = Math.ceil(Math.max(c1, c2) + 1)
    const minRow = Math.floor(Math.min(r1, r2) - 1), maxRow = Math.ceil(Math.max(r1, r2) + 1)
    for (let row = minRow; row <= maxRow; row++) for (let col = minCol; col <= maxCol; col++) {
      const px = col - c1, py = row - r1
      const t = lengthSq ? Math.max(0, Math.min(1, (px * dx + py * dy) / lengthSq)) : 0
      const distance = Math.hypot(c1 + dx * t - col, r1 + dy * t - row)
      if (distance <= 0.48) pathCells.add(`${col},${row}`)
    }
  }
  const smoothPath = createSmoothedPath(waypoints)
  const rawLength = pathMetrics(waypoints).at(-1) ?? 0
  const smoothLengths = pathMetrics(smoothPath)
  const distanceScale = rawLength / (smoothLengths.at(-1) || 1)
  const pathDistances = smoothLengths.map(distance => distance * distanceScale)
  return { waypoints, pathCells, smoothPath, pathDistances, distanceScale, totalLength: pathDistances[pathDistances.length - 1] ?? 0 }
}
function getMapGeometry(mapId: MapId): MapGeometry {
  const cached = mapGeometryCache.get(mapId)
  if (cached) return cached
  const definition = getMapDefinition(mapId)
  const routeDefinitions = definition.routes?.length ? definition.routes : [{ id: 'main', waypoints: definition.waypoints }]
  const routes = routeDefinitions.map(route => buildPathGeometry(route.waypoints))
  const primary = routes[0]
  const pathCells = new Set<string>()
  for (const route of routes) for (const cell of route.pathCells) pathCells.add(cell)
  const geometry: MapGeometry = { ...primary, pathCells, farmCells: new Set(definition.farmCells), routes }
  mapGeometryCache.set(mapId, geometry)
  return geometry
}
function getEnemyPath(map: MapGeometry, enemy: Enemy): PathGeometry {
  return map.routes[enemy.routeIndex] ?? map
}
function pointOnPath(map: PathGeometry, distance: number) {
  const d = Math.max(0, Math.min(map.totalLength, distance))
  let i = 1
  while (i < map.pathDistances.length - 1 && map.pathDistances[i] < d) i++
  const span = map.pathDistances[i] - map.pathDistances[i - 1]
  const k = span > 0 ? (d - map.pathDistances[i - 1]) / span : 0
  return {
    x: map.smoothPath[i - 1].x + (map.smoothPath[i].x - map.smoothPath[i - 1].x) * k,
    y: map.smoothPath[i - 1].y + (map.smoothPath[i].y - map.smoothPath[i - 1].y) * k,
  }
}
function pathAngleAt(map: PathGeometry, distance: number) {
  const before = pointOnPath(map, Math.max(0, distance - 6))
  const after = pointOnPath(map, Math.min(map.totalLength, distance + 6))
  return Math.atan2(after.y - before.y, after.x - before.x)
}
function pathWaypointIndex(map: PathGeometry, distance: number) {
  let i = 1
  while (i < map.pathDistances.length - 1 && map.pathDistances[i] < distance) i++
  return i
}
function placeEnemyOnPath(map: PathGeometry, enemy: Enemy, distance: number) {
  const clamped = Math.max(0, Math.min(map.totalLength, distance))
  const point = pointOnPath(map, clamped)
  enemy.dist = clamped
  enemy.x = point.x
  enemy.y = point.y
  enemy.wp = pathWaypointIndex(map, clamped)
  enemy.angle = pathAngleAt(map, clamped)
}
function projectToPath(map: PathGeometry, x: number, y: number) {
  let best = { distance: 0, x: map.smoothPath[0].x, y: map.smoothPath[0].y, error: Infinity }
  for (let i = 1; i < map.smoothPath.length; i++) {
    const a = map.smoothPath[i - 1], b = map.smoothPath[i], dx = b.x - a.x, dy = b.y - a.y
    const lenSq = dx * dx + dy * dy
    const k = lenSq ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / lenSq)) : 0
    const px = a.x + dx * k, py = a.y + dy * k, error = Math.hypot(x - px, y - py)
    if (error < best.error) best = { distance: map.pathDistances[i - 1] + Math.sqrt(lenSq) * k * map.distanceScale, x: px, y: py, error }
  }
  return best
}

function findReversePathTarget(s: GameState, t: Tower, range: number) {
  const map = getMapGeometry(s.mapId)
  const projection = projectToPath(map, t.x, t.y)
  if (projection.error > range) return null
  return s.enemies.filter(e => e.alive && canTowerTargetEnemy(e, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range)) && e.dist <= projection.distance + 4)
    .sort((a, b) => b.dist - a.dist)[0] ?? null
}

function launchPathBoulder(s: GameState, t: Tower, def = TOWERS[t.type]) {
  const map = getMapGeometry(s.mapId)
  const projection = projectToPath(map, t.x, t.y)
  const point = pointOnPath(map, projection.distance)
  const towardStart = pointOnPath(map, Math.max(0, projection.distance - 3))
  const angle = Math.atan2(towardStart.y - point.y, towardStart.x - point.x)
  const rock = t.type === 'rockLauncher', pebble = t.type === 'pebblesLauncher', giant = t.type === 'boulderCannon'
  s.projectiles.push({
    kind: 'boulder', x: point.x, y: point.y, dirX: Math.cos(angle), dirY: Math.sin(angle),
    traveled: 0, pathDistance: projection.distance, maxDistance: projection.distance + 20,
    speed: def.projectileSpeed, damage: def.damage, damageDecay: rock || pebble ? 10 : 20,
    sizeDecay: rock ? 0.38 : pebble ? 0.55 : 0.82, hitLimit: rock ? 13 : pebble ? 10 : giant ? 1 : 10, hitIds: [],
    color: def.color, size: giant ? 17 : rock ? 7 : pebble ? 5 : 12, shatterOnHit: giant,
    fragmentDamage: giant ? 26 : undefined, fragmentCount: giant ? 8 : undefined,
    sourceType: t.type, sourceTowerId: t.id,
  })
}

function fire(s: GameState, t: Tower, target: Enemy, def = TOWERS[t.type]) {
  const map = getMapGeometry(s.mapId)
  t.recoil = 1

  if (t.type === 'gatlingGun') {
    const angle = Math.atan2(target.y - t.y, target.x - t.x)
    const perpendicularX = -Math.sin(angle), perpendicularY = Math.cos(angle)
    for (const side of [-1, 1]) {
      const dirX = Math.cos(angle + side * 0.12), dirY = Math.sin(angle + side * 0.12)
      const muzzleX = t.x + Math.cos(angle) * 17 + perpendicularX * side * 5
      const muzzleY = t.y + Math.sin(angle) * 17 + perpendicularY * side * 5
      s.projectiles.push({ kind: 'direct', x: muzzleX, y: muzzleY, tx: target.x + perpendicularX * side * 7, ty: target.y + perpendicularY * side * 7, targetId: target.id, speed: def.projectileSpeed, damage: def.damage, splash: 0, color: def.color, size: 4.2, sourceType: t.type, sourceTowerId: t.id })
    }
    return
  }
  if (t.type === 'bladeOfChaos' || t.type === 'ringOfFlames') {
    s.projectiles.push({ kind: 'blade', x: target.x, y: target.y, targetId: target.id, angle: 0, orbitRadius: 25, angularSpeed: t.type === 'ringOfFlames' ? 13 : 10, remaining: 5, damagePerHit: def.damage, damageCap: t.type === 'bladeOfChaos' ? 500 : Number.POSITIVE_INFINITY, damageDealt: 0, hitCooldowns: {}, flame: t.type === 'ringOfFlames', color: def.color, size: t.type === 'ringOfFlames' ? 9 : 11, sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'glacialCataclysm') {
    s.projectiles.push({ kind: 'arc', sx: t.x, sy: t.y, tx: target.x, ty: target.y, t: 0, duration: 1.15, height: 115, damage: def.damage, splash: def.splash, cluster: false, glacial: true, color: def.color, size: 13, sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'cannonadeBomber') {
    s.projectiles.push({ kind: 'arc', sx: t.x, sy: t.y, tx: target.x, ty: target.y, t: 0, duration: 1.05, height: 100, damage: def.damage, splash: def.splash, cluster: true, cascadeDepth: 2, color: def.color, size: 10, sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'boulderLauncher' || t.type === 'rockLauncher' || t.type === 'boulderCannon' || t.type === 'pebblesLauncher') {
    launchPathBoulder(s, t, def)
    return
  }
  if (t.type === 'singularity') {
    s.projectiles.push({ kind: 'singularity', x: t.x, y: t.y, tx: target.x, ty: target.y, t: 0, duration: 1.5, damage: def.damage, radius: 72, capturedIds: [], color: def.color, sourceType: t.type, sourceTowerId: t.id })
    return
  }
  if (t.type === 'mimic') {
    const payloadTypes: TowerType[] = ['shooter','cannon','dual','mortar','cluster','raygun','retarder','slingshot','rockLauncher','boulderCannon','teleporter','plasmaCannon','flamethrower','hyperLaser']
    const effectTypes: TowerType[] = ['slingshot','retarder','icicles','snowballer','lightning','tesla','thunderstorm','teleporter','plasmaCannon','cannon','cluster','flamethrower','boulderLauncher','rockLauncher','singularity']
    const payloadType = payloadTypes[Math.floor(Math.random() * payloadTypes.length)]
    const effectType = effectTypes[Math.floor(Math.random() * effectTypes.length)]
    const payload = TOWERS[payloadType]
    const effect = TOWERS[effectType]
    const angle = Math.atan2(target.y - t.y, target.x - t.x)
    const splash = payload.splash > 0 ? payload.splash : (payload.style === 'mortar' || payload.style === 'cluster' ? 34 : 0)
    const chainCount = effectType === 'lightning' || effectType === 'tesla' || effectType === 'thunderstorm' ? 2 : 0
    const freezeDuration = effectType === 'retarder' || effectType === 'ice' ? 0.65 : 0
    const slowDuration = effectType === 'icicles' || effectType === 'snowballer' || effectType === 'plasmaHypothermia' ? 1.8 : 0
    s.projectiles.push({
      kind: 'hybrid', x: t.x + Math.cos(angle) * 18, y: t.y + Math.sin(angle) * 18,
      dirX: Math.cos(angle), dirY: Math.sin(angle), speed: Math.max(220, payload.projectileSpeed || 300),
      traveled: 0, maxDistance: def.range * 2.4, damage: Math.max(12, payload.damage * 0.72),
      splash, hitIds: [], hitLimit: effectType === 'slingshot' || effectType === 'boulderLauncher' || effectType === 'rockLauncher' ? 6 : 1,
      bouncesLeft: effectType === 'slingshot' ? 3 : 0, payloadType, effectType,
      slowDuration, freezeDuration, chainCount, color: '#d8b4fe',
      size: payloadType === 'cannon' || payloadType === 'cluster' || payloadType === 'mortar' ? 7 : 5,
      sourceType: t.type, sourceTowerId: t.id,
    })
    s.explosions.push({ x: t.x, y: t.y, r: 16, t: 0, dur: 0.2, color: '#d8b4fe' })
    return
  }
  if (t.type === 'splitHeel') {
    const angle = Math.atan2(target.y - t.y, target.x - t.x)
    s.projectiles.push({ kind: 'slingshot', x: t.x, y: t.y, dirX: Math.cos(angle), dirY: Math.sin(angle), speed: def.projectileSpeed, traveled: 0, damage: def.damage, hitIds: [], hitLimit: 99, bouncesLeft: 3, color: def.color, size: 8, splitOnBounceEnd: true, splash: def.splash, sourceType: t.type, sourceTowerId: t.id })
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
    const projection = projectToPath(map, t.x, t.y), point = pointOnPath(map, projection.distance)
    const towardStart = pointOnPath(map, Math.max(0, projection.distance - 3))
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
    const total = map.totalLength
    const blueDistance = Math.max(160, Math.min(total - 80, target.dist + 20))
    const purpleDistance = blueDistance - 160
    s.portalPairs.push({ blueDistance, purpleDistance, t: 0, duration: 2, usedEnemyIds: [], remainingHp: 2000 })
    const blue = pointOnPath(map, blueDistance), purple = pointOnPath(map, purpleDistance)
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
    explode(s, x, y, def.splash, def.damage, def.color, t.type)
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
      sourceType: t.type,
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
    sourceType: t.type,
    size: def.style === 'mortar' ? 6 : 7,
    sourceTowerId: t.id,
  })
}

export function update(s: GameState, dt: number) {
  if (s.status !== 'playing') return
  const map = getMapGeometry(s.mapId)
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

  for (const drone of s.drones) {
    const owner = s.towers.find(tower => tower.id === drone.ownerId && tower.type === 'droneFactory')
    if (!owner) continue
    let target = s.enemies.find(enemy => enemy.id === drone.targetId && enemy.alive)
    if (!target) target = s.enemies.filter(enemy => enemy.alive).sort((a,b) => Math.hypot(a.x-drone.x,a.y-drone.y)-Math.hypot(b.x-drone.x,b.y-drone.y))[0] ?? null
    if (target) {
      drone.targetId = target.id
      const formation = s.drones.filter(item => item.ownerId === drone.ownerId).sort((a,b) => a.id-b.id)
      const slot = formation.findIndex(item => item.id === drone.id)
      const angle = (slot / Math.max(1, formation.length)) * Math.PI * 2
      const spacing = 38 + Math.floor(slot / 8) * 22
      const desiredX = target.x + Math.cos(angle) * spacing
      const desiredY = target.y + Math.sin(angle) * spacing
      const dx = desiredX-drone.x, dy = desiredY-drone.y, distance = Math.hypot(dx,dy)
      if (distance > 4) { drone.x += dx/distance*Math.min(distance,150*dt); drone.y += dy/distance*Math.min(distance,150*dt) }
      drone.cooldown -= dt
      if (drone.cooldown <= 0) {
        for (const side of [-1,1]) s.projectiles.push({kind:'direct',x:drone.x+side*4,y:drone.y,tx:target.x,ty:target.y,targetId:target.id,speed:430,damage:12,splash:0,color:'#cbd5e1',size:3.2,sourceType:'droneFactory',sourceTowerId:owner.id,droneId:drone.id})
        drone.cooldown = 0.5
      }
    }
  }
  s.drones = s.drones.filter(drone => drone.hp > 0 && s.towers.some(tower => tower.id === drone.ownerId && tower.type === 'droneFactory'))

  for (const trap of s.spikeTraps) {
    for (const enemy of s.enemies) {
      if (!enemy.alive || trap.usedEnemyIds.includes(enemy.id) || Math.hypot(enemy.x-trap.x,enemy.y-trap.y) > ENEMIES[enemy.type].radius+13) continue
      trap.usedEnemyIds.push(enemy.id)
      for (let k=0;k<4;k++) { const angle=k*Math.PI/2+Math.PI/4; s.projectiles.push({kind:'ice',x:trap.x,y:trap.y,dirX:Math.cos(angle),dirY:Math.sin(angle),traveled:0,maxDistance:74,speed:280,damage:22,color:'#cbd5e1',size:4,freezeDuration:0,slowDuration:0,slowFactor:1,hitLimit:1,hitIds:[],splitOnHit:false,explodeAtLimit:false,splash:0,splashFreezeDuration:0,sourceType:'spikeLayer'}) }
      s.explosions.push({x:trap.x,y:trap.y,r:20,t:0,dur:0.25,color:'#d1d5db'})
    }
  }

  if (s.waveActive && s.spawnQueue.length) {
    s.spawnTimer -= dt
    if (s.spawnTimer <= 0) {
      const next = s.spawnQueue.shift()!
      s.enemies.push(createEnemy(s, next.type))
      s.spawnTimer = next.delay
    }
  }

  for (const e of s.enemies) {
    if (!e.alive) continue
    const enemyMap = getEnemyPath(map, e)
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
      const healRatio = e.frozenTimer > 0 ? 0.05 : 0.2
      for (const ally of s.enemies) {
        if (!ally.alive || ally.id === e.id || ally.type === 'bugPrince' || ally.type === 'bugQueen') continue
        if (Math.hypot(ally.x-e.x,ally.y-e.y)<=110 && ally.hp<ally.maxHp) {
          const healAmount = Math.max(1, ally.hp * healRatio)
          if (ally.segmentHp && ally.segmentMaxHp) {
            let remainingHeal = healAmount
            for (let i = 0; i < ally.segmentHp.length && remainingHeal > 0; i++) {
              if (ally.segmentHp[i] <= 0) continue
              const restored = Math.min(remainingHeal, ally.segmentMaxHp - ally.segmentHp[i])
              ally.segmentHp[i] += restored
              remainingHeal -= restored
            }
            ally.hp = ally.segmentHp.reduce((sum, segment) => sum + segment, 0)
          } else {
            ally.hp = Math.min(ally.maxHp, ally.hp + healAmount)
          }
        }
      }
      s.explosions.push({x:e.x,y:e.y,r:92,t:0,dur:.25,color:e.frozenTimer>0?'#7dd3fc':'#4ade80'});e.healCooldown=1.25
    }
    if((e.type==='bugPrince'||e.type==='bugQueen')&&e.spawnCooldown<=0){
      const picks:EnemyType[]=e.type==='bugQueen'?['grunt','runner','tank','vessel','jumper','healer','splitter','shadowBug','spitter','bulb','flyBug','ironBug','rubberBug','heatBug','ghostBug','dirtBug']:['grunt','runner','tank','vessel','jumper','healer']
      s.spawnQueue.push({type:picks[Math.floor(Math.random()*picks.length)],delay:.05},{type:picks[Math.floor(Math.random()*picks.length)],delay:.05})
      e.spawnCooldown=e.type==='bugQueen'?2.3:2.8
    }
    if(e.type==='bulb'&&e.bulbTimer<=0){
      e.bulbOn=!e.bulbOn;e.bulbTimer=2.5
      s.explosions.push({x:e.x,y:e.y,r:e.bulbOn?88:30,t:0,dur:.35,color:e.bulbOn?'#fde047':'#64748b'})
    }
    if (e.type === 'spitter' && e.attackCooldown <= 0) {
      launchHostileProjectile(s, e.x, e.y, e.angle, 'spit', 28, 215)
      e.attackCooldown = 1.5
    }
    if (e.type === 'buguns' && e.attackCooldown <= 0) {
      for (let shot = 0; shot < 2; shot++) launchHostileProjectile(s, e.x, e.y, Math.random() * Math.PI * 2, 'bugun', 32, 185)
      e.attackCooldown = 2.2
    }
    if (e.type === 'starbug' && e.attackCooldown <= 0) {
      for (let shot = 0; shot < 5; shot++) launchHostileProjectile(s, e.x, e.y, e.angle + shot * (Math.PI * 2 / 5), 'star', 24, 205)
      e.attackCooldown = 2.8
    }
    if (e.type === 'heatBug') {
      e.heatFuse -= dt
      if (e.heatFuse <= 0) {
        const blastRadius = 132
        for (const tower of s.towers) {
          if (Math.hypot(tower.x - e.x, tower.y - e.y) <= blastRadius) tower.disabledTimer = Math.max(tower.disabledTimer, 4)
        }
        s.explosions.push({ x: e.x, y: e.y, r: blastRadius, t: 0, dur: 0.65, color: '#fb923c' })
        e.alive = false
        s.money += Math.floor(ENEMIES[e.type].reward * (s.towers.some(tower => tower.type === 'economyHouse') ? 1.1 : 1))
        continue
      }
    }
    if (e.type === 'dirtBug') {
      e.burrowCooldown -= dt
      if (e.burrowTimer > 0) {
        const travel = Math.min(e.burrowRemaining, 118 * dt)
        if (travel > 0) {
          placeEnemyOnPath(enemyMap, e, e.dist + travel)
          e.burrowRemaining -= travel
        }
        e.burrowTimer = Math.max(0, e.burrowTimer - dt)
        if (e.burrowTimer <= 0) {
          e.burrowRemaining = 0
          e.burrowCooldown = 3.6 + Math.random() * 2.2
          s.explosions.push({ x: e.x, y: e.y, r: 17, t: 0, dur: 0.28, color: '#a8a29e' })
        }
        if (e.dist >= enemyMap.totalLength) {
          e.alive = false
          s.lives -= def.damage
        }
        continue
      }
      if (e.burrowCooldown <= 0 && e.frozenTimer <= 0) {
        e.burrowTimer = 0.78
        e.burrowRemaining = 92
        s.explosions.push({ x: e.x, y: e.y, r: 20, t: 0, dur: 0.3, color: '#78716c' })
        continue
      }
    }
    if (e.frozenTimer > 0) continue
    const previousDist = e.dist
    if (e.type === 'flyBug') {
      const exit = enemyMap.waypoints[enemyMap.waypoints.length - 1]
      const dx = exit.x - e.x, dy = exit.y - e.y
      const distance = Math.hypot(dx, dy)
      const step = def.speed * (e.slowTimer > 0 ? e.slowFactor : 1) * dt
      if (distance > 0.001) e.angle = Math.atan2(dy, dx)
      if (distance <= step) {
        e.x = exit.x; e.y = exit.y; e.alive = false; s.lives -= def.damage
      } else if (distance > 0) {
        e.x += (dx / distance) * step
        e.y += (dy / distance) * step
        e.dist += step
      }
      continue
    }
    if(e.type==='jumper'&&e.jumpCooldown<=0&&e.frozenTimer<=0&&!e.cocooning){
      e.airborneTimer=.55;e.jumpCooldown=1;e.anim=0
    }
    if (e.type === 'jumper') {
      // Jumps still cover the same distance over the same airtime; only the route geometry is curved.
      if (e.airborneTimer > 0) {
        const nextDistance = Math.min(enemyMap.totalLength, e.dist + 82 * dt / 0.55)
        placeEnemyOnPath(enemyMap, e, nextDistance)
        if (nextDistance >= enemyMap.totalLength && e.alive) {
          e.alive = false
          s.lives -= def.damage
        }
      }
      if (e.alive && e.dist > previousDist) {
        const portal = e.type === 'flyBug' ? undefined : s.portalPairs.find(pair => !pair.usedEnemyIds.includes(e.id) && pair.remainingHp >= e.hp && previousDist < pair.blueDistance && e.dist >= pair.blueDistance)
        if (portal) {
          portal.usedEnemyIds.push(e.id)
          portal.remainingHp -= e.hp
          placeEnemyOnPath(enemyMap, e, portal.purpleDistance)
          const blue = pointOnPath(enemyMap, portal.blueDistance), purple = pointOnPath(enemyMap, portal.purpleDistance)
          s.explosions.push({ x: blue.x, y: blue.y, r: 20, t: 0, dur: 0.3, color: '#38bdf8' })
          s.explosions.push({ x: purple.x, y: purple.y, r: 23, t: 0, dur: 0.35, color: '#c084fc' })
        }
      }
      continue
    }
    const supportRadius = e.type === 'healer' ? 110 : e.type === 'shadowBug' ? 68 : e.type === 'bulb' ? 104 : 0
    const hasAlliesInSupportRange = supportRadius > 0 && s.enemies.some(other =>
      other.alive && other.id !== e.id &&
      (e.type !== 'shadowBug' || other.type !== 'shadowBug') &&
      (e.type !== 'bulb' || other.type !== 'bulb') &&
      other.type !== 'bugPrince' && other.type !== 'bugQueen' &&
      Math.hypot(other.x - e.x, other.y - e.y) <= supportRadius
    )
    const isolatedSupportSpeed = supportRadius > 0 && !hasAlliesInSupportRange ? 2.2 : 1
    const step = def.speed * isolatedSupportSpeed * (e.splitGeneration > 0 ? 2 : 1) * (e.type === 'bombug' ? 1.35 : 1) * (e.slowTimer > 0 ? e.slowFactor : 1) * dt
    const nextDistance = Math.min(enemyMap.totalLength, e.dist + step)
    placeEnemyOnPath(enemyMap, e, nextDistance)
    if (nextDistance >= enemyMap.totalLength && e.alive) {
      e.alive = false
      s.lives -= def.damage
    }
    if (e.alive && e.dist > previousDist) {
      const portal = e.type === 'flyBug' ? undefined : s.portalPairs.find(pair => !pair.usedEnemyIds.includes(e.id) && pair.remainingHp >= e.hp && previousDist < pair.blueDistance && e.dist >= pair.blueDistance)
      if (portal) {
        portal.usedEnemyIds.push(e.id)
        portal.remainingHp -= e.hp
        placeEnemyOnPath(enemyMap, e, portal.purpleDistance)
        const blue = pointOnPath(enemyMap, portal.blueDistance), purple = pointOnPath(enemyMap, portal.purpleDistance)
        s.explosions.push({ x: blue.x, y: blue.y, r: 20, t: 0, dur: 0.3, color: '#38bdf8' })
        s.explosions.push({ x: purple.x, y: purple.y, r: 23, t: 0, dur: 0.35, color: '#c084fc' })
      }
    }
  }

  for (const t of s.towers) {
    const baseDef = TOWERS[t.type]
    t.disabledTimer = Math.max(0,t.disabledTimer-dt)
    t.overclockTimer = Math.max(0, t.overclockTimer - dt)
    if(t.disabledTimer>0){t.beamTargets=[];continue}
    t.cooldown -= dt
    if ((t.type === 'rockLauncher' || t.type === 'pebblesLauncher') && t.burstShotsRemaining > 0) {
      t.burstTimer = Math.max(0, t.burstTimer - dt)
      if (t.burstTimer <= 0) {
        launchPathBoulder(s, t, baseDef)
        t.burstShotsRemaining--
        t.burstTimer = t.burstShotsRemaining > 0 ? 0.12 : 0
      }
      continue
    }
    if (t.type === 'plasmaBlaster') t.recoil = Math.min(1, t.recoil + dt * baseDef.fireRate * (t.overclockTimer > 0 ? 2 : 1))
    else t.recoil = Math.max(0, t.recoil - dt * 5)
    if (t.type === 'droneFactory') {
      t.droneTimer -= dt
      if (t.droneTimer <= 0) { s.drones.push({id:s.nextId++,ownerId:t.id,x:t.x,y:t.y-12,hp:500,cooldown:0.1,targetId:null}); t.droneTimer=20; s.explosions.push({x:t.x,y:t.y-12,r:18,t:0,dur:0.35,color:'#cbd5e1'}) }
      continue
    }
    if (t.type === 'spikeLayer') {
      t.supportCooldown -= dt
      if (t.supportCooldown <= 0) {
        const maxDistance = map.totalLength
        const candidates: { x: number; y: number }[] = []
        for (let attempt = 0; attempt < 80; attempt++) {
          const point = pointOnPath(map, Math.random() * maxDistance)
          if (Math.hypot(point.x - t.x, point.y - t.y) <= baseDef.range &&
              s.spikeTraps.every(trap => Math.hypot(trap.x - point.x, trap.y - point.y) > 72)) {
            candidates.push(point)
          }
        }
        if (candidates.length > 0) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)]
          s.spikeTraps.push({ id: s.nextId++, x: chosen.x, y: chosen.y, expiresWave: s.wave + 2, usedEnemyIds: [] })
        }
        t.supportCooldown = 12
      }
      continue
    }
    if (t.type === 'skybreaker') {
      if (s.hover) {
        const tx=s.hover.col*CELL+CELL/2,ty=s.hover.row*CELL+CELL/2
        t.helicopterX+=(tx-t.helicopterX)*Math.min(1,dt*1.4)
        t.helicopterY+=(ty-t.helicopterY)*Math.min(1,dt*1.4)
      }
      const target=s.enemies.filter(enemy=>enemy.alive&&Math.hypot(enemy.x-t.helicopterX,enemy.y-t.helicopterY)<=baseDef.range)
        .sort((a,b)=>Math.hypot(a.x-t.helicopterX,a.y-t.helicopterY)-Math.hypot(b.x-t.helicopterX,b.y-t.helicopterY))[0]
      t.helicopterCooldown -= dt
      if (target && t.helicopterCooldown <= 0) {
        const angle=Math.atan2(target.y-t.helicopterY,target.x-t.helicopterX)
        for(let k=0;k<4;k++){
          const a=angle+(k-1.5)*0.075
          s.projectiles.push({kind:'homing',x:t.helicopterX,y:t.helicopterY,dirX:Math.cos(a),dirY:Math.sin(a),traveled:0,maxDistance:baseDef.range+100,speed:520,turnRate:10,acquireAfter:0,targetId:target.id,hitIds:[],hitLimit:2,damage:baseDef.damage,color:'#fdba74',size:3.2,sourceType:t.type,sourceTowerId:t.id})
        }
        t.helicopterCooldown=0.25
      }
      const boss=s.enemies.filter(enemy=>enemy.alive&&['bugPrince','bugQueen','bugKing'].includes(enemy.type))
        .sort((a,b)=>Math.hypot(a.x-t.helicopterX,a.y-t.helicopterY)-Math.hypot(b.x-t.helicopterX,b.y-t.helicopterY))[0]
      t.helicopterMissileCooldown -= dt
      if (boss && t.helicopterMissileCooldown <= 0) {
        s.projectiles.push({kind:'homing',x:t.helicopterX,y:t.helicopterY,dirX:0,dirY:-1,traveled:0,maxDistance:950,speed:310,turnRate:8,acquireAfter:0,targetId:boss.id,hitIds:[],hitLimit:1,damage:260,color:'#fb923c',size:8,sourceType:t.type,sourceTowerId:t.id})
        t.helicopterMissileCooldown=1.2
      }
      continue
    }
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
          if (clone.ghostCheckedIds) clone.ghostCheckedIds = [...clone.ghostCheckedIds]
          if (clone.ghostEvadedIds) clone.ghostEvadedIds = [...clone.ghostEvadedIds]
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
    if (t.type === 'meteorShower') {
      if (t.meteorDistance < 0) {
        t.supportCooldown = Math.max(0, t.supportCooldown - dt)
        if (t.supportCooldown <= 0) {
          t.meteorDistance = map.totalLength
          t.meteorTimer = 0
        }
      } else {
        t.meteorTimer -= dt
        if (t.meteorTimer <= 0) {
          const point = pointOnPath(map, t.meteorDistance)
          s.projectiles.push({ kind: 'arc', sx: point.x + 18, sy: point.y - 190, tx: point.x, ty: point.y, t: 0, duration: 0.62, height: 24, damage: baseDef.damage, splash: baseDef.splash, cluster: false, color: baseDef.color, size: 10, sourceType: t.type, sourceTowerId: t.id })
          t.meteorDistance -= CELL
          t.meteorTimer = 0.11
          if (t.meteorDistance < 0) {
            t.meteorDistance = -1
            t.supportCooldown = 10
          }
        }
      }
      continue
    }
    if (t.type === 'commsCenter') {
      t.supportCooldown = Math.max(0, t.supportCooldown - dt)
      if (t.supportCooldown <= 0) {
        const candidates = s.towers.filter(other => other.id !== t.id && TOWERS[other.type].damage > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= baseDef.range)
        if (candidates.length) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)]
          chosen.overclockTimer = Math.max(chosen.overclockTimer, 5)
          s.explosions.push({ x: chosen.x, y: chosen.y, r: 34, t: 0, dur: 0.55, color: '#facc15' })
          t.supportCooldown = 15
        } else t.supportCooldown = 1
      }
      continue
    }
    if (t.type === 'commsBuilding') {
      t.supportCooldown = Math.max(0, t.supportCooldown - dt)
      if (t.supportCooldown <= 0) {
        const candidates = s.towers.filter(other =>
          other.id !== t.id && TOWERS[other.type].damage > 0 &&
          Math.hypot(other.x - t.x, other.y - t.y) <= baseDef.range,
        )
        if (candidates.length) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)]
          chosen.overclockTimer = Math.max(chosen.overclockTimer, COMMS_BUILDING_OVERCLOCK_DURATION)
          s.explosions.push({ x: chosen.x, y: chosen.y, r: 30, t: 0, dur: 0.45, color: '#facc15' })
          t.supportCooldown = COMMS_BUILDING_OVERCLOCK_INTERVAL
        } else {
          t.supportCooldown = 1
        }
      }
      continue
    }
    if (t.type === 'incomeFarm' || t.type === 'incomeTax' || t.type === 'economyHouse') {
      if (s.waveActive && map.farmCells.has(`${t.col},${t.row}`) && t.incomeWave === s.wave && t.incomeSignalsLeft > 0 && t.cooldown <= 0) {
        const baseIncome = t.type === 'incomeFarm' ? 30 : t.type === 'incomeTax' ? 70 : 80
        const stationNearby = s.towers.some(other => other.type === 'electricalStation' && Math.hypot(other.x-t.x,other.y-t.y) <= TOWERS.electricalStation.range)
        s.money += Math.round(baseIncome * (stationNearby ? 1.5 : 1))
        t.incomeSignalsLeft--
        t.cooldown = 0.75
        s.explosions.push({x:t.x,y:t.y,r:22,t:0,dur:.3,color:baseDef.color})
      }
      continue
    }
    if (t.type === 'buffer' || t.type === 'commsLanHouse' || t.type === 'commsBuilding' || t.type === 'commsCenter' || t.type === 'meteorShower' || t.type === 'electricalStation' || t.type === 'economyHouse') continue
    const buffSources = s.towers.filter(other => {
      const dist = Math.hypot(other.x-t.x,other.y-t.y)
      return dist <= TOWERS[other.type].range &&
        ((other.type === 'buffer') || (other.type === 'commsLanHouse') || (other.type === 'commsBuilding') || (other.type === 'commsCenter') || (other.type === 'electricalStation'))
    })
    const hasComms = buffSources.some(other => other.type === 'commsLanHouse')
    const hasCommsBuilding = buffSources.some(other => other.type === 'commsBuilding' || other.type === 'commsCenter')
    const hasBuffer = buffSources.some(other => other.type === 'buffer')
    const hasStation = buffSources.some(other => other.type === 'electricalStation')
    const buff = hasComms ? 1.2 : hasCommsBuilding ? 1.15 : hasBuffer ? 1.1 : hasStation ? 1.05 : 1
    const rangeBuff = hasComms ? 1.1 : hasCommsBuilding ? 1.15 : hasBuffer ? 1.06 : hasStation ? 1.03 : 1
    const overclockMultiplier = t.overclockTimer > 0 ? 2 : 1
    const def = {...baseDef, damage:baseDef.damage*buff, range:baseDef.range*rangeBuff*overclockMultiplier, fireRate:baseDef.fireRate*buff*overclockMultiplier, projectileSpeed:baseDef.projectileSpeed*buff, splash:baseDef.splash*rangeBuff}
    if (t.type === 'soulstorm') {
      t.beamTargets = []
      if (t.essence >= SOULSTORM_ESSENCE_REQUIRED && t.cooldown <= 0) {
        const target = findTarget(s, t, Infinity, t.targetMode, enemy => canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range)))
        if (target) {
          t.angle = Math.atan2(target.y - t.y, target.x - t.x)
          const dirX = Math.cos(t.angle), dirY = Math.sin(t.angle)
          const beamLength = Math.hypot(WIDTH, HEIGHT) * 2
          const hitWidth = 12
          const lineTargets = s.enemies.filter(enemy => {
            if (!enemy.alive || !canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range))) return false
            const dx = enemy.x - t.x, dy = enemy.y - t.y
            const along = dx * dirX + dy * dirY
            const across = Math.abs(dx * dirY - dy * dirX)
            return along > 0 && along <= beamLength && across <= hitWidth
          }).sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))
          if (lineTargets.length) {
            t.essence = Math.max(0, t.essence - SOULSTORM_ESSENCE_REQUIRED)
            const damagePerEnemy = def.damage / lineTargets.length
            for (const enemy of lineTargets) damageEnemy(s, enemy, damagePerEnemy, t.type, t.id)
            s.lightningFlashes.push({ points: [{ x: t.x, y: t.y }, { x: t.x + dirX * beamLength, y: t.y + dirY * beamLength }], t: 0, dur: 0.48, color: baseDef.color })
            s.explosions.push({ x: t.x, y: t.y, r: 38, t: 0, dur: 0.42, color: baseDef.color })
            t.beamTargets = lineTargets.map(enemy => enemy.id)
            t.cooldown = 0.7 / overclockMultiplier
            t.recoil = 1
          }
        }
      }
      continue
    }
    const foundTarget = (['boulderLauncher', 'rockLauncher', 'pebblesLauncher', 'boulderCannon', 'snowballLauncher', 'electricSyringe', 'portalGun'].includes(t.type))
      ? findReversePathTarget(s, t, def.range)
      : findTarget(
          s,
          t,
          def.range,
          t.targetMode,
          (enemy) => canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range)) && (t.type !== 'retarder' || enemy.frozenTimer <= 0),
        )
    const lockedTeslaTarget =
      t.type === 'tesla' && t.chargeTargetId !== null
        ? s.enemies.find(
            (e) =>
              e.id === t.chargeTargetId &&
              e.alive && canTowerTargetEnemy(e, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range)) &&
              Math.hypot(e.x - t.x, e.y - t.y) <= def.range,
          ) ?? null
        : null
    const target = lockedTeslaTarget ?? foundTarget

    if (t.type === 'flamethrower') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      if (t.cooldown <= 0) {
        const dirX = Math.cos(t.angle), dirY = Math.sin(t.angle)
        s.projectiles.push({
          kind: 'fire', x: t.x + dirX * 19, y: t.y + dirY * 19, dirX, dirY,
          traveled: 0, maxDistance: def.range, speed: def.projectileSpeed,
          damage: def.damage, damageDecay: 0.88, sizeDecay: 0.82, hitLimit: 10,
          hitIds: [], color: def.color, size: 8, alpha: 1,
          sourceType: t.type, sourceTowerId: t.id,
        })
        t.cooldown = 1 / def.fireRate
        t.recoil = 1
      }
      continue
    }

    if (t.type === 'hyperLaser') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      if (t.cooldown <= 0) {
        // Five rays sweep outward from the tower in a fan, like a scanning emitter.
        const fanAngles = [-0.9, -0.45, 0, 0.45, 0.9]
        fanAngles.forEach((offset, index) => {
          const angle = t.angle + offset
          const dirX = Math.cos(angle), dirY = Math.sin(angle)
          const lineTargets = s.enemies.filter(enemy => {
            if (!enemy.alive || !canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range))) return false
            const dx = enemy.x - t.x, dy = enemy.y - t.y
            const along = dx * dirX + dy * dirY
            const across = Math.abs(dx * dirY - dy * dirX)
            return along > 0 && along <= def.range && across <= 7
          })
          for (const enemy of lineTargets) damageEnemy(s, enemy, def.damage, t.type, t.id)
          s.plasmaBeams.push({
            x1: t.x, y1: t.y, x2: t.x + dirX * def.range, y2: t.y + dirY * def.range,
            width: 4.5, t: 0, delay: index * 0.045, duration: 0.22, color: def.color, style: 'grow',
          })
        })
        t.cooldown = 1 / def.fireRate
        t.recoil = 1
      }
      continue
    }

    if (t.type === 'plasmaBlaster' || t.type === 'plasmaRod') {
      t.beamTargets = []
      if (!target) continue
      t.angle = Math.atan2(target.y - t.y, target.x - t.x)
      const laserReady = t.type === 'plasmaBlaster' ? t.recoil >= 1 : t.cooldown <= 0
      if (laserReady) {
        const dirX = Math.cos(t.angle), dirY = Math.sin(t.angle)
        const hitWidth = t.type === 'plasmaBlaster' ? 9 : 5
        const lineTargets = s.enemies.filter(enemy => {
          if (!enemy.alive || !canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range))) return false
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
      for (const enemy of s.enemies) if (enemy.alive && Math.hypot(enemy.x-t.x,enemy.y-t.y)<=def.range) applySlow(enemy,0.45,0.65,'ice')
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
            if (!enemy.alive || !canTowerTargetEnemy(enemy, t.type, s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && Math.hypot(other.x - t.x, other.y - t.y) <= TOWERS.commsCenter.range))) return false
            const dx = enemy.x - t.x
            const dy = enemy.y - t.y
            const along = dx * dirX + dy * dirY
            const across = Math.abs(dx * dirY - dy * dirX)
            return along > 0 && along <= def.range && across <= 22
          })
          .sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))
        for (const enemy of lineTargets) {
          damageEnemy(s, enemy, def.damage, t.type)
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
        const chain = findChainTargets(s, target, 76, t.type)
        s.lightningFlashes.push({
          points: [{ x: t.x, y: t.y }, ...chain.map((enemy) => ({ x: enemy.x, y: enemy.y }))],
          t: 0,
          dur: 0.18,
          color: def.color,
        })
        const splitDamage = def.damage / chain.length
        for (const enemy of chain) damageEnemy(s, enemy, splitDamage, t.type)
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
        damageEnemy(s, target, def.damage * chargeMultiplier, t.type)
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
      if (t.type === 'pebblesLauncher') { t.burstShotsRemaining = 3; t.burstTimer = 0.12 }
      t.cooldown = 1 / def.fireRate
    }
  }

  for (const pool of s.plasmaPools) {
    pool.t += dt
    for (const enemy of s.enemies) {
      if (!enemy.alive || pool.usedEnemyIds.length >= 5 || pool.usedEnemyIds.includes(enemy.id)) continue
      if (Math.hypot(enemy.x - pool.x, enemy.y - pool.y) <= pool.radius + ENEMIES[enemy.type].radius) {
        pool.usedEnemyIds.push(enemy.id)
        applySlow(enemy, 2.4, 0.6, 'plasmaHypothermia')
        enemy.plasmaDotTimer = Math.max(enemy.plasmaDotTimer, 2.5)
        enemy.plasmaDotTick = 0
        s.explosions.push({ x: enemy.x, y: enemy.y, r: 12, t: 0, dur: 0.22, color: '#c084fc' })
      }
    }
  }
  s.plasmaPools = s.plasmaPools.filter(pool => pool.t < pool.duration && pool.usedEnemyIds.length < 5)

  const spawned: Projectile[] = []
  s.projectiles = s.projectiles.filter((p) => {
    if (p.kind === 'blade') {
      p.remaining -= dt
      const target = s.enemies.find(enemy => enemy.id === p.targetId && enemy.alive)
      if (target) {
        const dx = target.x - p.x, dy = target.y - p.y, distance = Math.hypot(dx, dy)
        const travel = Math.min(distance, 340 * dt)
        if (distance > 0.001) { p.x += dx / distance * travel; p.y += dy / distance * travel }
      } else {
        const next = s.enemies.filter(enemy => enemy.alive).sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]
        if (next) p.targetId = next.id
      }
      p.angle += p.angularSpeed * dt
      for (const id of Object.keys(p.hitCooldowns)) p.hitCooldowns[Number(id)] = Math.max(0, p.hitCooldowns[Number(id)] - dt)
      for (const enemy of s.enemies) {
        if (!enemy.alive || (p.hitCooldowns[enemy.id] ?? 0) > 0) continue
        // A shuriken damages on contact with any part of its rotating blade,
        // not only when a tiny tip happens to overlap the enemy.
        const contactRadius = p.orbitRadius + p.size + ENEMIES[enemy.type].radius
        if (Math.hypot(enemy.x - p.x, enemy.y - p.y) > contactRadius) continue
        const dealt = Math.min(p.damagePerHit, p.damageCap - p.damageDealt)
        if (dealt <= 0) break
        damageEnemy(s, enemy, dealt, p.sourceType, p.sourceTowerId, true)
        p.damageDealt += dealt
        p.hitCooldowns[enemy.id] = 0.22
        s.explosions.push({ x: enemy.x, y: enemy.y, r: p.flame ? 19 : 13, t: 0, dur: 0.2, color: p.flame ? '#fb923c' : p.color })
        if (p.damageDealt >= p.damageCap) break
      }
      return p.remaining > 0 && p.damageDealt < p.damageCap && s.enemies.some(enemy => enemy.alive)
    }
    if (p.kind === 'hostile') {
      const oldX = p.x, oldY = p.y
      const step = p.speed * dt
      p.x += p.dirX * step
      p.y += p.dirY * step
      p.traveled += step
      let hit: Tower | undefined
      let hitAlong = Infinity
      const dx = p.x - oldX, dy = p.y - oldY, lengthSq = dx * dx + dy * dy
      for (const tower of s.towers) {
        const along = lengthSq > 0 ? Math.max(0, Math.min(1, ((tower.x - oldX) * dx + (tower.y - oldY) * dy) / lengthSq)) : 0
        const nearX = oldX + along * dx, nearY = oldY + along * dy
        if (Math.hypot(tower.x - nearX, tower.y - nearY) <= 13 + p.size && along < hitAlong) {
          hit = tower
          hitAlong = along
        }
      }
      if (hit) {
        damageTower(s, hit, p.damage, p.color)
        s.explosions.push({ x: p.x, y: p.y, r: 15, t: 0, dur: 0.22, color: p.color })
        return false
      }
      return p.traveled < p.maxDistance && p.x > -20 && p.x < WIDTH + 20 && p.y > -20 && p.y < HEIGHT + 20
    }
    if (p.kind === 'hybrid') {
      const step = p.speed * dt
      const oldX = p.x, oldY = p.y
      p.x += p.dirX * step; p.y += p.dirY * step; p.traveled += step
      if (p.bouncesLeft > 0) {
        if (p.x < 8 || p.x > WIDTH - 8) { p.x = Math.max(8, Math.min(WIDTH - 8, p.x)); p.dirX *= -1; p.bouncesLeft-- }
        if (p.y < 8 || p.y > HEIGHT - 8) { p.y = Math.max(8, Math.min(HEIGHT - 8, p.y)); p.dirY *= -1; p.bouncesLeft-- }
      }
      const dx = p.x - oldX, dy = p.y - oldY, lenSq = dx * dx + dy * dy
      const hits = s.enemies.filter(enemy => {
        if (!enemy.alive || p.hitIds.includes(enemy.id) || !canTowerTargetEnemy(enemy, p.payloadType, !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range)))) return false
        const along = lenSq > 0 ? Math.max(0, Math.min(1, ((enemy.x - oldX) * dx + (enemy.y - oldY) * dy) / lenSq)) : 0
        return Math.hypot(enemy.x - (oldX + along * dx), enemy.y - (oldY + along * dy)) <= ENEMIES[enemy.type].radius + p.size + 2
      }).sort((a,b) => Math.hypot(a.x-oldX,a.y-oldY)-Math.hypot(b.x-oldX,b.y-oldY))
      for (const hit of hits) {
        if (p.hitIds.length >= p.hitLimit) break
        p.hitIds.push(hit.id)
        if (!projectilePassesGhost(p, hit)) {
          damageEnemy(s, hit, p.damage, p.payloadType, p.sourceTowerId, true)
          if (p.freezeDuration > 0) applyFreeze(hit, p.freezeDuration)
          if (p.slowDuration > 0) applySlow(hit, p.slowDuration, 0.58, p.effectType)
          if (p.splash > 0) explode(s, hit.x, hit.y, p.splash, p.damage * 0.55, p.color, p.payloadType, p.sourceTowerId, true)
          if (p.chainCount > 0) {
            const nearby = s.enemies.filter(other => other.alive && other.id !== hit.id && !p.hitIds.includes(other.id) && Math.hypot(other.x-hit.x,other.y-hit.y) <= 76)
              .sort((a,b) => Math.hypot(a.x-hit.x,a.y-hit.y)-Math.hypot(b.x-hit.x,b.y-hit.y)).slice(0,p.chainCount)
            for (const chained of nearby) { p.hitIds.push(chained.id); damageEnemy(s,chained,p.damage*0.42,p.effectType,p.sourceTowerId,true); s.lightningFlashes.push({points:[{x:hit.x,y:hit.y},{x:chained.x,y:chained.y}],t:0,dur:0.16,color:'#c084fc'}) }
          }
        }
        s.explosions.push({ x: hit.x, y: hit.y, r: p.splash > 0 ? Math.max(15,p.splash*0.45) : 10, t: 0, dur: 0.18, color: p.color })
      }
      const inBounds = p.x >= -16 && p.x <= WIDTH + 16 && p.y >= -16 && p.y <= HEIGHT + 16
      return p.traveled < p.maxDistance && inBounds && p.hitIds.length < p.hitLimit
    }
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
        if (p.splash > 0) explode(s, p.tx, p.ty, p.splash, p.damage, p.color, p.sourceType, p.sourceTowerId, true)
        else if (target) {
          if (projectilePassesGhost(p, target)) {
            const length = Math.max(1, d)
            const dirX = dx / length, dirY = dy / length
            p.targetId = -1
            p.tx = p.x + dirX * 620
            p.ty = p.y + dirY * 620
            return true
          }
          damageEnemy(s, target, p.damage, p.sourceType, p.sourceTowerId, true)
          if (p.droneId !== undefined) { const drone=s.drones.find(item=>item.id===p.droneId); if(drone) drone.hp=Math.max(0,drone.hp-p.damage) }
        }
        return false
      }
      p.x += (dx / d) * step
      p.y += (dy / d) * step
      return true
    }
    if (p.kind === 'fire') {
      const oldX = p.x, oldY = p.y
      const step = p.speed * dt
      p.x += p.dirX * step; p.y += p.dirY * step; p.traveled += step
      p.alpha = Math.max(0, p.alpha - dt * 1.35)
      p.size = Math.max(0.5, p.size - dt * 5.5)
      const hits = s.enemies.filter(enemy => {
        if (!enemy.alive || p.hitIds.includes(enemy.id) || !canTowerTargetEnemy(enemy, p.sourceType ?? 'flamethrower', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range)))) return false
        const dx = p.x - oldX, dy = p.y - oldY, lenSq = dx * dx + dy * dy
        const along = lenSq > 0 ? Math.max(0, Math.min(1, ((enemy.x - oldX) * dx + (enemy.y - oldY) * dy) / lenSq)) : 0
        const nearX = oldX + along * dx, nearY = oldY + along * dy
        return Math.hypot(enemy.x - nearX, enemy.y - nearY) <= ENEMIES[enemy.type].radius + p.size
      }).sort((a, b) => Math.hypot(a.x - oldX, a.y - oldY) - Math.hypot(b.x - oldX, b.y - oldY))
      for (const enemy of hits) {
        if (p.hitIds.length >= p.hitLimit || p.size <= 0.8 || p.alpha <= 0.05) break
        p.hitIds.push(enemy.id)
        if (!projectilePassesGhost(p, enemy)) damageEnemy(s, enemy, p.damage, p.sourceType, p.sourceTowerId, true)
        p.damage *= p.damageDecay
        p.size *= p.sizeDecay
        p.alpha *= 0.84
      }
      return p.traveled < p.maxDistance && p.alpha > 0.04 && p.size > 0.8 && p.hitIds.length < p.hitLimit
    }
    if (p.kind === 'homing') {
      let target = p.targetId === null ? null : s.enemies.find(enemy => enemy.id === p.targetId && enemy.alive && !p.hitIds.includes(enemy.id) && !p.ghostEvadedIds?.includes(enemy.id)) ?? null
      if (!target) {
        p.targetId = null
        if (p.traveled >= p.acquireAfter) {
          let nearest: Enemy | null = null
          let nearestDistance = p.sourceType === 'plasmaCannon' ? 340 : 170
          for (const enemy of s.enemies) {
            if (!enemy.alive || p.hitIds.includes(enemy.id) || (p.sourceType && !canTowerTargetEnemy(enemy, p.sourceType, !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))))) continue
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
      const hit = s.enemies.filter(enemy => enemy.alive && canTowerTargetEnemy(enemy, p.sourceType ?? 'teleporter', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))) && !p.hitIds.includes(enemy.id) && Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 2 && !projectilePassesGhost(p, enemy)).sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]
      if (hit) {
        p.hitIds.push(hit.id)
        damageEnemy(s, hit, p.damage, p.sourceType, p.sourceTowerId, true)
        p.targetId = null
        if (p.hitIds.length >= p.hitLimit) return false
      }
      return p.traveled < p.maxDistance && p.x >= -24 && p.x <= WIDTH + 24 && p.y >= -24 && p.y <= HEIGHT + 24
    }
    if (p.kind === 'singularity') {
      p.t += dt
      const dx = p.tx - p.x, dy = p.ty - p.y, distance = Math.hypot(dx, dy)
      if (distance > 5) { const step = Math.min(distance, 260 * dt); p.x += dx / distance * step; p.y += dy / distance * step; return true }
      for (const enemy of s.enemies) {
        if (!enemy.alive || p.capturedIds.length >= 10 || p.capturedIds.includes(enemy.id)) continue
        if (Math.hypot(enemy.x-p.x, enemy.y-p.y) <= p.radius + ENEMIES[enemy.type].radius) { p.capturedIds.push(enemy.id); enemy.carriedBy = -999 }
      }
      for (const id of p.capturedIds) { const enemy=s.enemies.find(item=>item.id===id&&item.alive); if(enemy){ const dx=p.x-enemy.x,dy=p.y-enemy.y,dist=Math.hypot(dx,dy)||1; enemy.x+=dx/dist*90*dt; enemy.y+=dy/dist*90*dt } }
      if (p.t >= p.duration) {
        const count=p.capturedIds.length
        for (const id of p.capturedIds) { const enemy=s.enemies.find(item=>item.id===id&&item.alive); if(enemy){enemy.carriedBy=undefined;damageEnemy(s,enemy,count?p.damage/count:0,'singularity',undefined,true)} }
        s.explosions.push({x:p.x,y:p.y,r:p.radius*1.6,t:0,dur:.8,color:'#a78bfa'}); return false
      }
      return true
    }
    if (p.kind === 'slingshot') {
      const step = p.speed * dt
      p.x += p.dirX * step
      p.y += p.dirY * step
      p.traveled += step
      let bounced = false
      if (p.x < 8 || p.x > WIDTH - 8) {
        if (p.bouncesLeft > 0) {
          p.x = Math.max(8, Math.min(WIDTH - 8, p.x))
          p.dirX *= -1
          p.bouncesLeft--
          bounced = true
        }
      }
      if (p.y < 8 || p.y > HEIGHT - 8) {
        if (p.bouncesLeft > 0) {
          p.y = Math.max(8, Math.min(HEIGHT - 8, p.y))
          p.dirY *= -1
          p.bouncesLeft--
          bounced = true
        }
      }
      if (p.splitOnBounceEnd && p.bouncesLeft <= 0 && bounced) {
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2
          spawned.push({
            kind: 'fragment', x: p.x, y: p.y,
            dirX: Math.cos(angle), dirY: Math.sin(angle),
            speed: 230, traveled: 0, maxDistance: 420,
            damage: p.damage, color: p.color, size: 6,
            bouncesLeft: 3, sourceType: 'splitHeel', sourceTowerId: p.sourceTowerId,
          })
        }
        s.explosions.push({ x: p.x, y: p.y, r: 24, t: 0, dur: 0.24, color: p.color })
        return false
      }
      if ((p.x < 8 || p.x > WIDTH - 8 || p.y < 8 || p.y > HEIGHT - 8) && p.bouncesLeft <= 0) {
        return false
      }
      const hit = s.enemies
        .filter(enemy => enemy.alive && canTowerTargetEnemy(enemy, p.sourceType ?? 'slingshot', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))) &&
          !p.hitIds.includes(enemy.id) &&
          Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 2 &&
          !projectilePassesGhost(p, enemy))
        .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0]
      if (hit) {
        p.hitIds.push(hit.id)
        damageEnemy(s, hit, p.damage, p.sourceType ?? 'slingshot', p.sourceTowerId, true)
        s.explosions.push({ x: hit.x, y: hit.y, r: 9, t: 0, dur: 0.14, color: p.color })
        if (p.hitIds.length >= p.hitLimit) return false
      }
      return p.traveled < 2200
    }
    if (p.kind === 'fragment') {
      const step = p.speed * dt
      p.x += p.dirX * step
      p.y += p.dirY * step
      p.traveled += step
      if (p.sourceType === 'splitHeel') {
        if (p.x < 8 || p.x > WIDTH - 8) {
          if ((p.bouncesLeft ?? 0) <= 0) return false
          p.x = Math.max(8, Math.min(WIDTH - 8, p.x))
          p.dirX *= -1
          p.bouncesLeft = (p.bouncesLeft ?? 0) - 1
        }
        if (p.y < 8 || p.y > HEIGHT - 8) {
          if ((p.bouncesLeft ?? 0) <= 0) return false
          p.y = Math.max(8, Math.min(HEIGHT - 8, p.y))
          p.dirY *= -1
          p.bouncesLeft = (p.bouncesLeft ?? 0) - 1
        }
      }
      const hit = s.enemies
        .filter(enemy => enemy.alive && canTowerTargetEnemy(enemy, p.sourceType ?? 'boulderCannon', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))) &&
          Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 1 &&
          !projectilePassesGhost(p, enemy))
        .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0]
      if (hit) {
        if (p.sourceType === 'splitHeel') explode(s, hit.x, hit.y, 38, p.damage, p.color, p.sourceType, p.sourceTowerId, true)
        else damageEnemy(s, hit, p.damage, p.sourceType ?? 'boulderCannon', p.sourceTowerId, true)
        s.explosions.push({ x: hit.x, y: hit.y, r: 12, t: 0, dur: 0.16, color: p.color })
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
      const next = pointOnPath(map, nextDistance)
      p.traveled += p.pathDistance - nextDistance; p.pathDistance = nextDistance
      p.x = next.x; p.y = next.y
      for (let i = 0; i < p.carriedIds.length; i++) {
        const carried = s.enemies.find(enemy => enemy.id === p.carriedIds[i] && enemy.alive)
        if (carried) placeEnemyOnPath(map, carried, p.pathDistance + (i - (p.carriedIds.length - 1) / 2) * 7)
      }
      const dx = p.x - old.x, dy = p.y - old.y, lenSq = dx * dx + dy * dy
      const hit = s.enemies.filter(enemy => enemy.alive && enemy.type !== 'flyBug' && canTowerTargetEnemy(enemy, 'snowballLauncher') && enemy.carriedBy == null && !p.carriedIds.includes(enemy.id) && !projectilePassesGhost(p, enemy))
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
            placeEnemyOnPath(map, carried, p.pathDistance + (i - (count - 1) / 2) * 18)
          }
        }
        explode(s, p.x, p.y, p.splash, p.damage, p.color, 'snowballLauncher', p.sourceTowerId, true)
        freezeInRadius(s, p.x, p.y, p.splash, 1)
        for (const enemy of s.enemies) {
          if (!enemy.alive || Math.hypot(enemy.x-p.x,enemy.y-p.y) > p.splash + ENEMIES[enemy.type].radius) continue
          placeEnemyOnPath(map, enemy, enemy.dist + (enemy.id % 3 - 1) * 7)
        }
        return false
      }
      return true
    }
    if (p.kind === 'boulder') {
      const old = { x: p.x, y: p.y }
      const nextDistance = Math.max(0, p.pathDistance - p.speed * dt)
      const next = pointOnPath(map, nextDistance)
      p.traveled += p.pathDistance - nextDistance
      p.pathDistance = nextDistance
      p.x = next.x; p.y = next.y
      const dx = p.x - old.x, dy = p.y - old.y, lenSq = dx * dx + dy * dy
      let hit: Enemy | null = null, hitAlong = Infinity
      for (const enemy of s.enemies) {
        if (!enemy.alive || p.hitIds.includes(enemy.id) || !canTowerTargetEnemy(enemy, p.sourceType ?? 'boulderLauncher', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))) || projectilePassesGhost(p, enemy)) continue
        const along = lenSq > 0 ? Math.max(0, Math.min(1, ((enemy.x - old.x) * dx + (enemy.y - old.y) * dy) / lenSq)) : 0
        const nearX = old.x + along * dx, nearY = old.y + along * dy
        if (Math.hypot(enemy.x - nearX, enemy.y - nearY) <= ENEMIES[enemy.type].radius + p.size && along < hitAlong) { hit = enemy; hitAlong = along }
      }
      if (hit) {
        p.hitIds.push(hit.id); damageEnemy(s, hit, p.damage, p.sourceType, p.sourceTowerId, true)
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
        if (!enemy.alive || !canTowerTargetEnemy(enemy, p.sourceType ?? 'teleporter', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range)))) continue
        const distance = Math.hypot(enemy.x - p.x, enemy.y - p.y)
        if (distance <= p.aura + ENEMIES[enemy.type].radius && !projectilePassesGhost(p, enemy)) {
          const remaining = p.hitTimers[enemy.id] ?? 0
          if (remaining <= 0) {
            // Aura damage is applied in small electric pulses while an enemy is inside it.
            damageEnemy(s, enemy, p.damage / 4, p.sourceType, p.sourceTowerId, true)
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
          canTowerTargetEnemy(enemy, p.sourceType ?? 'retarder', !!p.sourceTowerId && s.towers.some(other => other.type === 'commsCenter' && other.hp > 0 && s.towers.some(source => source.id === p.sourceTowerId && Math.hypot(other.x - source.x, other.y - source.y) <= TOWERS.commsCenter.range))) &&
          !p.hitIds.includes(enemy.id) &&
          Math.hypot(enemy.x - p.x, enemy.y - p.y) <= ENEMIES[enemy.type].radius + p.size + 2 &&
          !projectilePassesGhost(p, enemy),
      )
      if (hit) {
        p.hitIds.push(hit.id)
        if (p.freezeDuration > 0) applyFreeze(hit, p.freezeDuration)
        if (p.slowDuration > 0) applySlow(hit, p.slowDuration, p.slowFactor, p.sourceType)
        damageEnemy(s, hit, p.damage, p.sourceType, p.sourceTowerId, true)

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
            explode(s, p.x, p.y, p.splash, p.damage, p.color, p.sourceType, p.sourceTowerId, true)
            freezeInRadius(s, p.x, p.y, p.splash, p.splashFreezeDuration)
          }
          return false
        }
      }

      const stillInBounds =
        p.traveled < p.maxDistance && p.x >= -20 && p.x <= WIDTH + 20 && p.y >= -20 && p.y <= HEIGHT + 20
      if (!stillInBounds && p.explodeAtLimit) {
        explode(s, p.x, p.y, p.splash, p.damage, p.color, p.sourceType, p.sourceTowerId, true)
        freezeInRadius(s, p.x, p.y, p.splash, p.splashFreezeDuration)
      }
      return stillInBounds
    }
    p.t += dt
    if (p.t >= p.duration) {
      explode(s, p.tx, p.ty, p.splash, p.damage, p.color, p.sourceType, p.sourceTowerId, true)
      if (p.glacial) {
        freezeInRadius(s, p.tx, p.ty, p.splash, 0.8)
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3 + Math.PI / 6
          const distance = 38 + (i % 2) * 20
          const tx = p.tx + Math.cos(angle) * distance
          const ty = p.ty + Math.sin(angle) * distance
          spawned.push({
            kind: 'arc', sx: p.tx, sy: p.ty, tx, ty, t: 0, duration: 0.42,
            height: 42, damage: p.damage * 0.48, splash: p.splash * 0.62,
            cluster: false, cryo: true, color: '#a5f3fc', size: 8,
            sourceType: p.sourceType, sourceTowerId: p.sourceTowerId,
          })
        }
      }
      if (p.cryo) {
        freezeInRadius(s,p.tx,p.ty,p.splash,0.5)
        for(let i=0;i<8;i++) { const a=i*Math.PI/4; spawned.push({kind:'ice',x:p.tx,y:p.ty,dirX:Math.cos(a),dirY:Math.sin(a),traveled:0,maxDistance:125,speed:290,damage:p.damage*.45,color:p.teleporterClone?'#c084fc':'#a5f3fc',size:4,freezeDuration:0,slowDuration:0,slowFactor:1,hitLimit:4,hitIds:[],splitOnHit:false,explodeAtLimit:false,splash:0,splashFreezeDuration:0,sourceType:p.sourceType??'cryoMortar',sourceTowerId:p.sourceTowerId,teleporterClone:p.teleporterClone}) }
      }
      if (p.cluster) {
        const childCount = p.cascadeDepth ? 4 : 3
        for (let i = 0; i < childCount; i++) {
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
            cluster: !!p.cascadeDepth && p.cascadeDepth > 1,
            cascadeDepth: p.cascadeDepth ? p.cascadeDepth - 1 : undefined,
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

  s.plasmaBeams = s.plasmaBeams.filter(beam => { beam.t += dt; return beam.t < beam.duration + (beam.delay ?? 0) })
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
    s.spikeTraps = s.spikeTraps.filter(trap => trap.expiresWave > s.wave)
    for (const bank of s.towers.filter(tower => tower.type === 'masterBank')) {
      s.money += 800
      bank.bankedMoney = Math.min(100000, Math.floor((bank.bankedMoney + 200) * 1.2))
    }
    const commsCenters = s.towers.filter(tower => tower.type === 'commsCenter')
    for (const center of commsCenters) center.hp = Math.min(center.maxHp, center.hp + center.maxHp * 0.2)
    const buffers = s.towers.filter(tower => tower.type === 'buffer')
    for (const tower of s.towers) {
      if (tower.hp >= tower.maxHp) continue
      const covered = buffers.some(buffer => Math.hypot(buffer.x - tower.x, buffer.y - tower.y) <= TOWERS.buffer.range)
      if (covered) tower.hp = Math.min(tower.maxHp, tower.hp + 18)
    }
  }
  if (s.lives <= 0) {
    s.lives = 0
    s.status = 'over'
  }
}

/* ---------- Rendering ---------- */

export function drawBug(ctx: CanvasRenderingContext2D, type: EnemyType, x: number, y: number, angle: number, anim: number, cocooning = false, airborne = false, helmet = false, segmentHp?: number[], burrowing = false) {
  ctx.save()
  try {
    drawPremiumBug(ctx, type, x, y, angle, anim, cocooning, airborne, helmet, segmentHp, burrowing)
  } finally {
    ctx.restore()
  }
}

export function drawTower(ctx: CanvasRenderingContext2D, type: TowerType, x: number, y: number, angle: number, recoil = 0) {
  ctx.save()
  try {
    drawPremiumTower(ctx, type, x, y, angle, recoil)
  } finally {
    ctx.restore()
  }
}

export function render(ctx: CanvasRenderingContext2D, s: GameState) {
  const map = getMapGeometry(s.mapId)
  // Deep, layered arena floor with a restrained luminous grid.
  const backdrop = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  backdrop.addColorStop(0, '#0a1a2d')
  backdrop.addColorStop(0.48, '#071326')
  backdrop.addColorStop(1, '#091022')
  ctx.fillStyle = backdrop
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const ambient = ctx.createRadialGradient(WIDTH * 0.48, HEIGHT * 0.42, 20, WIDTH * 0.48, HEIGHT * 0.42, WIDTH * 0.72)
  ambient.addColorStop(0, 'rgba(14,116,144,0.12)')
  ambient.addColorStop(1, 'rgba(2,6,23,0)')
  ctx.fillStyle = ambient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = 'rgba(125,211,252,0.018)'
        ctx.fillRect(col * CELL, row * CELL, CELL, CELL)
      }
    }
  }
  ctx.strokeStyle = 'rgba(125,211,252,0.075)'
  ctx.lineWidth = 1
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, HEIGHT); ctx.stroke()
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(WIDTH, r * CELL); ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(56,189,248,0.13)'
  ctx.lineWidth = 1
  ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2)

  // Floating dust, tiny signal nodes and engraved floor markers give the arena depth.
  for (let i = 0; i < 26; i++) {
    const phase = i * 2.399
    const px = ((i * 83 + Math.sin(s.time * 0.22 + phase) * 13) % WIDTH + WIDTH) % WIDTH
    const py = ((i * 47 + Math.cos(s.time * 0.19 + phase) * 11) % HEIGHT + HEIGHT) % HEIGHT
    const pulse = 0.22 + (Math.sin(s.time * 1.8 + phase) + 1) * 0.13
    ctx.save()
    ctx.globalAlpha = pulse
    ctx.fillStyle = i % 4 === 0 ? '#a78bfa' : '#67e8f9'
    ctx.shadowColor = ctx.fillStyle
    ctx.shadowBlur = 7
    ctx.beginPath()
    ctx.arc(px, py, i % 5 === 0 ? 1.6 : 0.85, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.save()
  ctx.strokeStyle = 'rgba(103,232,249,0.09)'
  ctx.lineWidth = 1
  for (let row = 1; row < ROWS; row += 2) {
    for (let col = 1; col < COLS; col += 2) {
      const cx = col * CELL + CELL / 2, cy = row * CELL + CELL / 2
      ctx.beginPath()
      ctx.moveTo(cx - 4, cy - 3); ctx.lineTo(cx, cy - 5); ctx.lineTo(cx + 4, cy - 3)
      ctx.moveTo(cx - 4, cy + 3); ctx.lineTo(cx, cy + 5); ctx.lineTo(cx + 4, cy + 3)
      ctx.stroke()
    }
  }
  ctx.restore()

  // Pads verdes exclusivos para torres de renda.
  for (const cell of map.farmCells) {
    const [col, row] = cell.split(',').map(Number)
    const x = col * CELL, y = row * CELL
    ctx.fillStyle = 'rgba(34,197,94,0.2)'
    ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4)
    ctx.strokeStyle = 'rgba(74,222,128,0.9)'
    ctx.lineWidth = 2
    ctx.strokeRect(x + 4, y + 4, CELL - 8, CELL - 8)
    ctx.fillStyle = 'rgba(134,239,172,0.95)'
    ctx.font = 'bold 9px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FARM', x + CELL / 2, y + CELL / 2 + 3)
  }

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  // Desenha todas as rotas da arena, cada uma com entrada e saída próprias.
  for (const route of map.routes) {
    ctx.save()
    ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 22
    ctx.strokeStyle = 'rgba(56,189,248,0.28)'; ctx.lineWidth = CELL + 12
    tracePath(ctx, route); ctx.stroke()
    ctx.shadowBlur = 0; ctx.strokeStyle = '#152941'; ctx.lineWidth = CELL + 2
    tracePath(ctx, route); ctx.stroke()
    const lane = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
    lane.addColorStop(0, '#1c3048'); lane.addColorStop(.5, '#12243a'); lane.addColorStop(1, '#1a2d43')
    ctx.strokeStyle = lane; ctx.lineWidth = CELL - 5; tracePath(ctx, route); ctx.stroke()
    ctx.strokeStyle = 'rgba(148,197,224,0.17)'; ctx.lineWidth = CELL - 9
    ctx.setLineDash([2, 12]); ctx.lineDashOffset = -s.time * 14; tracePath(ctx, route); ctx.stroke()
    ctx.setLineDash([]); ctx.strokeStyle = 'rgba(103,232,249,0.52)'; ctx.lineWidth = 1.5
    ctx.setLineDash([7, 13]); ctx.lineDashOffset = -s.time * 25; tracePath(ctx, route); ctx.stroke()
    ctx.setLineDash([]); ctx.restore()
  }

  // Small animated lane chevrons reinforce direction without covering the track.
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (let distance = 34; distance < map.totalLength - 22; distance += 58) {
    const point = pointOnPath(map, distance)
    ctx.save()
    ctx.translate(point.x, point.y)
    ctx.rotate(pathAngleAt(map, distance))
    ctx.globalAlpha = 0.24 + (Math.sin(s.time * 2.4 - distance * 0.025) + 1) * 0.07
    ctx.strokeStyle = '#a5f3fc'
    ctx.lineWidth = 1.25
    ctx.beginPath()
    ctx.moveTo(-5, -4)
    ctx.lineTo(0, 0)
    ctx.lineTo(-5, 4)
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()

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
    const blue = pointOnPath(map, pair.blueDistance), purple = pointOnPath(map, pair.purpleDistance)
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
    const ok = isBuildable(s, s.hover.col, s.hover.row, s.buildType) && s.money >= TOWERS[s.buildType].cost
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

  for (const trap of s.spikeTraps) drawPremiumSpikeTrap(ctx, trap.x, trap.y, s.time)
  for (const drone of s.drones) drawPremiumDrone(ctx, drone.x, drone.y, s.time)
  for (const t of s.towers) {
    if (t.type === 'skybreaker') drawPremiumHelicopter(ctx, t.helicopterX, t.helicopterY, s.time)
    if (t.overclockTimer > 0) {
      ctx.save()
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 2
      ctx.shadowColor = '#facc15'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(t.x, t.y, 25 + Math.sin(s.time * 12) * 2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    drawTower(ctx, t.type, t.x, t.y, t.angle, t.recoil)
    if (t.hp < t.maxHp) {
      const barWidth = 36
      ctx.fillStyle = 'rgba(15,23,42,0.92)'
      ctx.fillRect(t.x - barWidth / 2, t.y + 23, barWidth, 5)
      ctx.fillStyle = t.hp / t.maxHp > 0.5 ? '#4ade80' : t.hp / t.maxHp > 0.25 ? '#facc15' : '#fb7185'
      ctx.fillRect(t.x - barWidth / 2, t.y + 23, barWidth * (t.hp / t.maxHp), 5)
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 0.7
      ctx.strokeRect(t.x - barWidth / 2, t.y + 23, barWidth, 5)
    }
    if (t.type === 'soulstorm') {
      const barWidth = 34
      ctx.fillStyle = 'rgba(15,23,42,0.95)'
      ctx.fillRect(t.x - barWidth / 2, t.y + 23, barWidth, 4)
      ctx.fillStyle = '#c084fc'
      ctx.fillRect(t.x - barWidth / 2, t.y + 23, barWidth * (t.essence / SOULSTORM_ESSENCE_REQUIRED), 4)
    }
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
    const progress = Math.min(1, Math.max(0, (beam.t - (beam.delay ?? 0)) / beam.duration))
    const alpha = Math.max(0, 1 - progress)
    const endX = beam.style === 'grow' ? beam.x1 + (beam.x2 - beam.x1) * progress : beam.x2
    const endY = beam.style === 'grow' ? beam.y1 + (beam.y2 - beam.y1) * progress : beam.y2
    ctx.save(); ctx.globalAlpha = beam.style === 'flame' ? 0.82 : alpha; ctx.lineCap = 'round'
    if (beam.style === 'flame') {
      const dx = endX - beam.x1, dy = endY - beam.y1
      for (let segment = 0; segment < 10; segment++) {
        const from = segment / 10, to = (segment + 1) / 10
        const taper = 1 - segment * 0.075
        ctx.strokeStyle = segment % 2 ? '#f97316' : '#fb923c'
        ctx.shadowColor = '#fb923c'; ctx.shadowBlur = 18 * taper
        ctx.lineWidth = beam.width * taper
        ctx.beginPath()
        ctx.moveTo(beam.x1 + dx * from, beam.y1 + dy * from)
        ctx.lineTo(beam.x1 + dx * to, beam.y1 + dy * to)
        ctx.stroke()
      }
      ctx.strokeStyle = '#fbbf24'; ctx.shadowBlur = 8; ctx.lineWidth = beam.width * 0.34
      ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(endX, endY); ctx.stroke()
      ctx.strokeStyle = '#fff7ed'; ctx.shadowBlur = 0; ctx.lineWidth = beam.width * 0.12
      ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(endX, endY); ctx.stroke()
    } else {
      ctx.strokeStyle = beam.color; ctx.shadowColor = beam.color; ctx.shadowBlur = beam.width * 2.5; ctx.lineWidth = beam.width
      ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(endX, endY); ctx.stroke()
      ctx.strokeStyle = '#f5eaff'; ctx.shadowBlur = 0; ctx.lineWidth = Math.max(1, beam.width * 0.32)
      ctx.beginPath(); ctx.moveTo(beam.x1, beam.y1); ctx.lineTo(endX, endY); ctx.stroke()
    }
    ctx.restore()
  }

  for (const e of s.enemies) {
    const enemyRadius = ENEMIES[e.type].radius
    // Small contact shadow anchors ground units; airborne enemies get a soft aura instead.
    ctx.save()
    ctx.globalAlpha = e.airborneTimer > 0 || e.type === 'flyBug' ? 0.16 : 0.34
    ctx.fillStyle = '#020617'
    ctx.beginPath()
    ctx.ellipse(e.x, e.y + (e.airborneTimer > 0 || e.type === 'flyBug' ? 9 : enemyRadius * 0.55), enemyRadius * 1.25, enemyRadius * 0.42, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    if (e.type === 'bugPrince' || e.type === 'bugQueen' || e.type === 'bugKing') {
      const pulse = 0.5 + Math.sin(s.time * 4.5) * 0.16
      const bossColor = e.type === 'bugKing' ? '#fbbf24' : e.type === 'bugQueen' ? '#f472b6' : '#c084fc'
      ctx.save()
      ctx.globalAlpha = pulse
      ctx.strokeStyle = bossColor
      ctx.shadowColor = bossColor
      ctx.shadowBlur = 13
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(e.x, e.y, enemyRadius + 8 + Math.sin(s.time * 5) * 1.5, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    drawBug(ctx, e.type, e.x, e.y-(e.type==='flyBug'?10:e.airborneTimer>0?14:0), e.angle, e.anim, e.cocooning, e.airborneTimer>0 || e.type==='flyBug', e.helmet, e.segmentHp, e.burrowTimer > 0)
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
    if (e.hp < e.maxHp || e.cocooning || e.type === 'bugPrince' || e.type === 'bugQueen' || e.type === 'bugKing') {
      const r = ENEMIES[e.type].radius
      const barY = e.y - r - 10
      ctx.save()
      ctx.fillStyle = 'rgba(2,6,23,0.9)'
      ctx.beginPath(); ctx.roundRect(e.x - r - 1, barY - 1, r * 2 + 2, 6, 3); ctx.fill()
      const ratio = e.cocooning ? Math.max(0, e.cocoonTimer / 5) : e.hp / e.maxHp
      const hpGradient = ctx.createLinearGradient(e.x - r, 0, e.x + r, 0)
      hpGradient.addColorStop(0, e.cocooning ? '#f59e0b' : '#22c55e')
      hpGradient.addColorStop(1, e.cocooning ? '#fde68a' : '#86efac')
      ctx.fillStyle = hpGradient
      ctx.shadowColor = e.cocooning ? '#f59e0b' : '#22c55e'
      ctx.shadowBlur = 5
      ctx.beginPath(); ctx.roundRect(e.x - r, barY, r * 2 * ratio, 4, 2); ctx.fill()
      ctx.restore()
    }
  }

  for (const p of s.projectiles) {
    if (p.kind === 'hostile') {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(Math.atan2(p.dirY, p.dirX))
      ctx.fillStyle = p.color
      ctx.strokeStyle = '#fff7ed'
      ctx.lineWidth = 1.2
      ctx.shadowColor = p.color
      ctx.shadowBlur = 9
      if (p.shape === 'star') {
        ctx.beginPath()
        for (let point = 0; point < 10; point++) {
          const radius = point % 2 === 0 ? p.size * 1.55 : p.size * 0.58
          const angle = -Math.PI / 2 + point * Math.PI / 5
          const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius
          if (point === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 1.45, p.size * 0.85, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        if (p.shape === 'spit') {
          ctx.fillStyle = '#cffafe'
          ctx.beginPath(); ctx.arc(p.size * 0.35, 0, p.size * 0.32, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.restore()
      continue
    }
    // Directional energy trail: keeps fast shots readable without changing projectile motion.
    if ('dirX' in p && 'dirY' in p && 'x' in p && 'y' in p && 'color' in p && p.color) {
      ctx.save()
      const trail = ctx.createLinearGradient(p.x - p.dirX * 24, p.y - p.dirY * 24, p.x, p.y)
      trail.addColorStop(0, 'rgba(255,255,255,0)')
      trail.addColorStop(1, p.color)
      ctx.globalAlpha = p.kind === 'energy' ? 0.28 : 0.48
      ctx.strokeStyle = trail
      ctx.lineWidth = Math.max(1.2, ('size' in p ? p.size : 3) * 0.9)
      ctx.lineCap = 'round'
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(p.x - p.dirX * 24, p.y - p.dirY * 24)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      ctx.restore()
    }
    if (p.kind === 'hybrid') {
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(Math.atan2(p.dirY,p.dirX))
      ctx.shadowColor = p.color; ctx.shadowBlur = 13; ctx.fillStyle = p.color; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.ellipse(0,0,p.size*1.55,p.size,0,0,Math.PI*2); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.size*0.35,0,Math.max(1.5,p.size*0.3),0,Math.PI*2); ctx.fill()
      ctx.restore()
      continue
    }
    if (p.teleporterClone) {
      const vx = 'x' in p ? p.x : p.sx + (p.tx - p.sx) * (p.t / p.duration)
      const vy = 'y' in p ? p.y : p.sy + (p.ty - p.sy) * (p.t / p.duration)
      ctx.save(); ctx.globalAlpha = 0.32; ctx.fillStyle = '#c084fc'; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(vx, vy, ('size' in p ? p.size : 5) + 7, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }
    if (p.kind === 'fire') {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.translate(p.x, p.y)
      ctx.rotate(Math.atan2(p.dirY, p.dirX))
      ctx.shadowColor = '#f97316'; ctx.shadowBlur = 16 * p.alpha
      const gradient = ctx.createLinearGradient(-p.size * 1.8, 0, p.size * 1.4, 0)
      gradient.addColorStop(0, 'rgba(239,68,68,0)')
      gradient.addColorStop(0.35, '#f97316')
      gradient.addColorStop(0.72, '#facc15')
      gradient.addColorStop(1, '#fff7ed')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(p.size * 1.5, 0)
      ctx.quadraticCurveTo(p.size * 0.2, -p.size * 0.9, -p.size * 1.7, -p.size * 0.2)
      ctx.quadraticCurveTo(-p.size * 0.7, 0, -p.size * 1.7, p.size * 0.2)
      ctx.quadraticCurveTo(p.size * 0.2, p.size * 0.9, p.size * 1.5, 0)
      ctx.fill()
      ctx.fillStyle = '#fff7ed'
      ctx.beginPath(); ctx.ellipse(p.size * 0.25, 0, p.size * 0.65, p.size * 0.32, 0, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
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
    } else if (p.kind === 'blade') {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.shadowColor = p.flame ? '#f97316' : '#c084fc'
      ctx.shadowBlur = p.flame ? 24 : 18
      // Four-point shuriken silhouette.
      for (let blade = 0; blade < 4; blade++) {
        ctx.save()
        ctx.rotate(blade * Math.PI / 2)
        ctx.beginPath()
        ctx.moveTo(0, -4)
        ctx.lineTo(p.orbitRadius - 7, -p.size * 0.62)
        ctx.lineTo(p.orbitRadius + p.size + 8, 0)
        ctx.lineTo(p.orbitRadius - 7, p.size * 0.62)
        ctx.lineTo(0, 4)
        ctx.lineTo(5, 0)
        ctx.closePath()
        ctx.fillStyle = p.flame ? '#f97316' : '#a78bfa'
        ctx.strokeStyle = p.flame ? '#ffedd5' : '#ede9fe'
        ctx.lineWidth = 1.8
        ctx.fill()
        ctx.stroke()
        if (p.flame) {
          // Visible tongues of fire surrounding each shuriken point.
          ctx.shadowColor = '#fb923c'
          ctx.shadowBlur = 15
          ctx.fillStyle = '#facc15'
          ctx.beginPath()
          ctx.moveTo(p.orbitRadius + 5, -4)
          ctx.quadraticCurveTo(p.orbitRadius + 19, -13, p.orbitRadius + 23, -2)
          ctx.quadraticCurveTo(p.orbitRadius + 17, 2, p.orbitRadius + 5, 4)
          ctx.fill()
          ctx.fillStyle = '#fb923c'
          ctx.beginPath()
          ctx.moveTo(p.orbitRadius + 7, 3)
          ctx.quadraticCurveTo(p.orbitRadius + 22, 15, p.orbitRadius + 18, 22)
          ctx.quadraticCurveTo(p.orbitRadius + 10, 15, p.orbitRadius + 7, 3)
          ctx.fill()
        }
        ctx.restore()
      }
      ctx.shadowBlur = 10
      ctx.fillStyle = p.flame ? '#fbbf24' : '#e9d5ff'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    } else if (p.kind === 'singularity') {
      ctx.save(); ctx.globalAlpha = 0.75 + Math.sin(s.time * 9) * 0.15; ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 24; ctx.fillStyle = '#1e1b4b'; ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * (0.72 + Math.sin(s.time * 7) * 0.05), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.42, s.time * 3, s.time * 3 + Math.PI * 1.5); ctx.stroke(); ctx.restore()
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
    const k = Math.min(1, x.t / x.dur)
    const fade = 1 - k
    const radius = x.r * (0.25 + k * 0.95)
    ctx.save()
    ctx.globalAlpha = fade * 0.16
    ctx.fillStyle = x.color
    ctx.shadowColor = x.color
    ctx.shadowBlur = 18
    ctx.beginPath(); ctx.arc(x.x, x.y, radius * 0.72, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = fade
    ctx.strokeStyle = x.color
    ctx.shadowBlur = 12
    ctx.lineWidth = Math.max(1, 3 * fade)
    ctx.beginPath(); ctx.arc(x.x, x.y, radius, 0, Math.PI * 2); ctx.stroke()
    ctx.globalAlpha = fade * 0.8
    ctx.strokeStyle = '#f8fafc'
    ctx.lineWidth = Math.max(1, 1.4 * fade)
    ctx.beginPath(); ctx.arc(x.x, x.y, radius * 0.72, 0, Math.PI * 2); ctx.stroke()
    ctx.restore()
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

function tracePath(ctx: CanvasRenderingContext2D, map: PathGeometry) {
  ctx.beginPath()
  ctx.moveTo(map.smoothPath[0].x, map.smoothPath[0].y)
  for (let i = 1; i < map.smoothPath.length; i++) ctx.lineTo(map.smoothPath[i].x, map.smoothPath[i].y)
}
