export type TowerType =
  | 'shooter'
  | 'cannon'
  | 'dual'
  | 'mortar'
  | 'cluster'
  | 'lightning'
  | 'raygun'
  | 'bolt'
  | 'tesla'
export type EnemyType = 'grunt' | 'tank' | 'runner' | 'vessel'
export type ProjectileStyle = 'bullet' | 'shell' | 'mortar' | 'cluster' | 'beam' | 'energy' | 'lightning' | 'tesla'

export interface TowerDef {
  name: string
  tier: number
  damage: number
  range: number
  fireRate: number
  splash: number
  style: ProjectileStyle
  projectileSpeed: number
  inaccuracy: number
  cost: number
  color: string
  accent: string
  description: string
}

export const TOWERS: Record<TowerType, TowerDef> = {
  shooter: {
    name: 'Shooter',
    tier: 0,
    damage: 10,
    range: 120,
    fireRate: 1.5,
    splash: 0,
    style: 'bullet',
    projectileSpeed: 420,
    inaccuracy: 0,
    cost: 50,
    color: '#38bdf8',
    accent: '#0c4a6e',
    description: 'Equilibrada. Todos os atributos medianos.',
  },
  cannon: {
    name: 'Cannon',
    tier: 0,
    damage: 32,
    range: 110,
    fireRate: 0.5,
    splash: 45,
    style: 'shell',
    projectileSpeed: 300,
    inaccuracy: 0,
    cost: 80,
    color: '#f97316',
    accent: '#7c2d12',
    description: 'Dano alto em área, alcance médio, disparo lento.',
  },
  lightning: {
    name: 'Lightning Rod',
    tier: 0,
    damage: 12,
    range: 132,
    fireRate: 2.4,
    splash: 0,
    style: 'beam',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 70,
    color: '#67e8f9',
    accent: '#155e75',
    description: 'Feixe contínuo que encadeia até 3 inimigos. O dano total é dividido entre os alvos.',
  },
  dual: {
    name: 'Dual Shooter',
    tier: 1,
    damage: 10,
    range: 125,
    fireRate: 3,
    splash: 0,
    style: 'bullet',
    projectileSpeed: 460,
    inaccuracy: 0,
    cost: 0,
    color: '#22d3ee',
    accent: '#164e63',
    description: 'Atira 2x mais rápido que o Shooter.',
  },
  mortar: {
    name: 'Mortar',
    tier: 1,
    damage: 45,
    range: 180,
    fireRate: 0.35,
    splash: 75,
    style: 'mortar',
    projectileSpeed: 0,
    inaccuracy: 30,
    cost: 0,
    color: '#a3e635',
    accent: '#365314',
    description: 'Disparo parabólico com área enorme. Mais lento e impreciso.',
  },
  cluster: {
    name: 'Cluster Cannon',
    tier: 1,
    damage: 30,
    range: 125,
    fireRate: 0.32,
    splash: 45,
    style: 'cluster',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 0,
    color: '#f43f5e',
    accent: '#881337',
    description: 'Bombas lentas que explodem e soltam 3 bombas em direções aleatórias.',
  },
  raygun: {
    name: 'Raygun',
    tier: 1,
    damage: 24,
    range: 150,
    fireRate: 0.48,
    splash: 34,
    style: 'energy',
    projectileSpeed: 155,
    inaccuracy: 0,
    cost: 0,
    color: '#c084fc',
    accent: '#6b21a8',
    description: 'Dispara uma esfera de energia lenta e penetrante que eletrocuta inimigos dentro da aura.',
  },
  bolt: {
    name: 'Bolt Launcher',
    tier: 1,
    damage: 38,
    range: 152,
    fireRate: 0.58,
    splash: 38,
    style: 'lightning',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 0,
    color: '#facc15',
    accent: '#854d0e',
    description: 'Invoca trovões no alcance: 50% de chance de mirar um inimigo e 50% de atingir um ponto aleatório.',
  },
  tesla: {
    name: 'Tesla Rod',
    tier: 1,
    damage: 5,
    range: 130,
    fireRate: 1.6,
    splash: 0,
    style: 'tesla',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 0,
    color: '#38bdf8',
    accent: '#1d4ed8',
    description: 'Feixe concentrado sem encadeamento. Quanto mais mantém o alvo, mais rápido pulsa o dano.',
  },
}

export const BUILDABLE: TowerType[] = ['shooter', 'cannon', 'lightning']

const FUSIONS: Record<string, TowerType> = {
  'cannon+shooter': 'mortar',
  'shooter+shooter': 'dual',
  'cannon+cannon': 'cluster',
  'lightning+shooter': 'raygun',
  'lightning+lightning': 'tesla',
  'cannon+lightning': 'bolt',
}

export function fusionResult(a: TowerType, b: TowerType): TowerType | undefined {
  if (TOWERS[a].tier !== TOWERS[b].tier) return undefined
  return FUSIONS[[a, b].sort().join('+')]
}

export const FUSION_LIST: { a: TowerType; b: TowerType; result: TowerType }[] = [
  { a: 'shooter', b: 'shooter', result: 'dual' },
  { a: 'cannon', b: 'shooter', result: 'mortar' },
  { a: 'cannon', b: 'cannon', result: 'cluster' },
  { a: 'lightning', b: 'shooter', result: 'raygun' },
  { a: 'lightning', b: 'cannon', result: 'bolt' },
  { a: 'lightning', b: 'lightning', result: 'tesla' },
]

export interface EnemyDef {
  name: string
  hp: number
  speed: number
  reward: number
  radius: number
  damage: number
  color: string
  dark: string
  description: string
}

export const ENEMIES: Record<EnemyType, EnemyDef> = {
  grunt: {
    name: 'Grunt',
    hp: 40,
    speed: 48,
    reward: 5,
    radius: 9,
    damage: 1,
    color: '#ef4444',
    dark: '#7f1d1d',
    description: 'Inseto vermelho comum.',
  },
  tank: {
    name: 'Tank',
    hp: 160,
    speed: 26,
    reward: 12,
    radius: 13,
    damage: 3,
    color: '#a16207',
    dark: '#422006',
    description: 'Inseto marrom blindado e lento.',
  },
  runner: {
    name: 'Runner',
    hp: 22,
    speed: 95,
    reward: 6,
    radius: 7,
    damage: 1,
    color: '#facc15',
    dark: '#713f12',
    description: 'Inseto amarelo muito rápido.',
  },
  vessel: {
    name: 'Vessel',
    hp: 230,
    speed: 23,
    reward: 18,
    radius: 14,
    damage: 4,
    color: '#92400e',
    dark: '#451a03',
    description: 'Inseto marrom cascudo. Ao ser derrotado, entra em um casulo por 2 segundos e revive com 75% da vida se sobreviver.',
  },
}

export const CELL = 48
export const COLS = 16
export const ROWS = 10
export const WIDTH = CELL * COLS
export const HEIGHT = CELL * ROWS

const WAYPOINT_CELLS: [number, number][] = [
  [-1, 2],
  [4, 2],
  [4, 7],
  [9, 7],
  [9, 2],
  [13, 2],
  [13, 7],
  [16, 7],
]

export const PATH = WAYPOINT_CELLS.map(([c, r]) => ({
  x: c * CELL + CELL / 2,
  y: r * CELL + CELL / 2,
}))

export const PATH_CELLS = (() => {
  const set = new Set<string>()
  for (let i = 0; i < WAYPOINT_CELLS.length - 1; i++) {
    const [c1, r1] = WAYPOINT_CELLS[i]
    const [c2, r2] = WAYPOINT_CELLS[i + 1]
    const steps = Math.max(Math.abs(c2 - c1), Math.abs(r2 - r1))
    for (let s = 0; s <= steps; s++) {
      const c = c1 + Math.sign(c2 - c1) * s
      const r = r1 + Math.sign(r2 - r1) * s
      set.add(`${c},${r}`)
    }
  }
  return set
})()

export function buildWave(n: number): { type: EnemyType; delay: number }[] {
  const queue: { type: EnemyType; delay: number }[] = []
  const pace = Math.max(0.55, 1 - n * 0.03)
  const grunts = 5 + n * 2
  const runners = n >= 2 ? 1 + n : 0
  const tanks = n >= 3 ? Math.floor((n - 1) / 2) : 0
  const vessels = n >= 5 ? 1 + Math.floor((n - 5) / 4) : 0
  for (let i = 0; i < grunts; i++) {
    queue.push({ type: 'grunt', delay: 0.75 * pace })
    if (runners && i % 2 === 1 && queue.filter((q) => q.type === 'runner').length < runners) {
      queue.push({ type: 'runner', delay: 0.4 * pace })
    }
  }
  while (queue.filter((q) => q.type === 'runner').length < runners) {
    queue.push({ type: 'runner', delay: 0.4 * pace })
  }
  for (let i = 0; i < tanks; i++) queue.push({ type: 'tank', delay: 1.4 * pace })
  for (let i = 0; i < vessels; i++) queue.push({ type: 'vessel', delay: 1.8 * pace })
  return queue
}

export const hpScale = (wave: number) => 1 + 0.18 * (wave - 1) + 0.01 * (wave - 1) ** 2
