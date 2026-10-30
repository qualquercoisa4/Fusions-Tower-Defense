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
  | 'retarder'
  | 'icicles'
  | 'snowballer'
  | 'thunderstorm'
  | 'ice'
  | 'incomeFarm'
  | 'buffer'
  | 'commsLanHouse'
  | 'incomeTax'
  | 'electricalStation'
  | 'cryoMortar'
  | 'tripleShooter'
  | 'economyHouse'
  | 'teleporter'
  | 'boulderLauncher'
  | 'rockLauncher'
  | 'plasmaCannon'
  | 'plasmaBlaster'
  | 'plasmaRod'
  | 'plasmaHypothermia'
  | 'slingshot'
  | 'boulderCannon'
  | 'electricSyringe'
  | 'snowballLauncher'
  | 'portalGun'
export type EnemyType = 'grunt' | 'tank' | 'runner' | 'vessel' | 'jumper' | 'healer' | 'bugPrince' | 'swarmBug' | 'splitter' | 'shadowBug' | 'spitter' | 'bulb' | 'bugQueen'

export type TargetMode = 'first' | 'last' | 'strongest' | 'weakest' | 'closest'
export const TARGET_MODES: { value: TargetMode; label: string }[] = [
  { value: 'first', label: 'Primeiro na rota' },
  { value: 'last', label: 'Último na rota' },
  { value: 'strongest', label: 'Mais vida' },
  { value: 'weakest', label: 'Menos vida' },
  { value: 'closest', label: 'Mais próximo' },
]
export type ProjectileStyle = 'bullet' | 'shell' | 'mortar' | 'cluster' | 'beam' | 'energy' | 'lightning' | 'tesla' | 'support'

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
    cost: 210,
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
    cost: 320,
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
    cost: 270,
    color: '#67e8f9',
    accent: '#155e75',
    description: 'Dispara relâmpagos em flashes rápidos, atingindo até 3 inimigos próximos. O dano é dividido entre eles.',
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
    projectileSpeed: 75,
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
    damage: 8,
    range: 130,
    fireRate: 0.9,
    splash: 0,
    style: 'tesla',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 0,
    color: '#38bdf8',
    accent: '#1d4ed8',
    description: 'Feixe concentrado em um único inimigo. Cada pulso causa mais dano quanto mais tempo mantém o mesmo alvo.',
  },
  retarder: {
    name: 'Retarder',
    tier: 0,
    damage: 8,
    range: 128,
    fireRate: 0.95,
    splash: 0,
    style: 'bullet',
    projectileSpeed: 280,
    inaccuracy: 0,
    cost: 360,
    color: '#7dd3fc',
    accent: '#075985',
    description: 'Dispara um projétil perfurante que congela até 3 inimigos por 1 segundo. Prioriza inimigos ainda não congelados.',
  },
  teleporter: {
    name: 'Teleporter', tier: 0, damage: 16, range: 150, fireRate: 0.85, splash: 0,
    style: 'energy', projectileSpeed: 370, inaccuracy: 0, cost: 425,
    color: '#c084fc', accent: '#6b21a8',
    description: 'Dispara projéteis de plasma perfurantes que perseguem inimigos. Ocasionalmente duplica um projétil de uma torre aliada próxima, deixando-o roxo e com uma aura dimensional.',
  },
  boulderLauncher: {
    name: 'Boulder Launcher', tier: 0, damage: 200, range: 165, fireRate: 0.08, splash: 0,
    style: 'shell', projectileSpeed: 65, inaccuracy: 0, cost: 500,
    color: '#a8a29e', accent: '#57534e',
    description: 'Lança uma pedra pesada que atravessa até 10 inimigos. Começa causando 200 de dano; a cada impacto, perde 20 de dano e diminui de tamanho. Desaparece quando o dano chega a zero.',
  },
  rockLauncher: {
    name: 'Rock Launcher', tier: 1, damage: 125, range: 170, fireRate: 0.1, splash: 0,
    style: 'shell', projectileSpeed: 70, inaccuracy: 0, cost: 0,
    color: '#d6d3d1', accent: '#78716c',
    description: 'Dispara duas pedras menores. Cada uma começa causando 125 de dano e perde 10 de dano e um pouco de tamanho por inimigo atingido, atravessando até 13 inimigos antes de se desfazer.',
  },
  slingshot: {
    name: 'Slingshot', tier: 1, damage: 38, range: 165, fireRate: 0.42, splash: 0,
    style: 'shell', projectileSpeed: 310, inaccuracy: 0, cost: 0,
    color: '#c4a484', accent: '#713f12',
    description: 'Dispara uma pedra que perfura até 5 inimigos e quica nas bordas do mapa 3 vezes antes de desaparecer.',
  },
  boulderCannon: {
    name: 'Boulder Cannon', tier: 1, damage: 180, range: 170, fireRate: 0.16, splash: 0,
    style: 'shell', projectileSpeed: 58, inaccuracy: 0, cost: 0,
    color: '#78716c', accent: '#292524',
    description: 'Lança uma pedra enorme pelo caminho. Ao atingir o primeiro inimigo, ela se despedaça em 8 pedrinhas que voam em direções aleatórias.',
  },
  electricSyringe: {
    name: 'Electric Syringe', tier: 1, damage: 16, range: 165, fireRate: 0.1, splash: 34,
    style: 'shell', projectileSpeed: 260, inaccuracy: 0, cost: 0,
    color: '#67e8f9', accent: '#164e63',
    description: 'A cada 10 segundos, dispara uma seringa que se fixa no chão por 7 segundos, causando dano elétrico em área a todos os inimigos que passam por ela.',
  },
  snowballLauncher: {
    name: 'Snowball Launcher', tier: 1, damage: 62, range: 170, fireRate: 0.12, splash: 58,
    style: 'shell', projectileSpeed: 88, inaccuracy: 0, cost: 0,
    color: '#e0f2fe', accent: '#0369a1',
    description: 'Lança uma bola de neve que captura até 5 inimigos e os carrega para trás pelo caminho. Ao explodir, causa dano em área, espalha os inimigos e congela por 1 segundo.',
  },
  portalGun: {
    name: 'Portal Gun', tier: 1, damage: 0, range: 170, fireRate: 0.5, splash: 0,
    style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0,
    color: '#a78bfa', accent: '#4c1d95',
    description: 'Abre um portal azul e um roxo no caminho por 2 segundos. Inimigos que atravessam o portal azul saem pelo portal roxo.',
  },
  plasmaCannon: {
    name: 'Plasma Cannon', tier: 1, damage: 9, range: 150, fireRate: 0.95, splash: 0,
    style: 'bullet', projectileSpeed: 390, inaccuracy: 0, cost: 0,
    color: '#d8b4fe', accent: '#7e22ce',
    description: 'Dispara quatro projéteis de plasma em direções diferentes. Eles avançam primeiro em linha reta e depois perseguem suavemente os inimigos, com uma curva rápida e menos agressiva.',
  },
  plasmaBlaster: {
    name: 'Plasma Blaster', tier: 1, damage: 100, range: 180, fireRate: 0.12, splash: 0,
    style: 'beam', projectileSpeed: 0, inaccuracy: 0, cost: 0,
    color: '#e9d5ff', accent: '#7e22ce',
    description: 'Carrega um laser de linha reta que causa 100 de dano total, com perfuração infinita. O dano é dividido igualmente entre todos os inimigos atingidos. Cadência extremamente baixa.',
  },
  plasmaRod: {
    name: 'Plasma Rod', tier: 1, damage: 20, range: 170, fireRate: 0.95, splash: 0,
    style: 'beam', projectileSpeed: 0, inaccuracy: 0, cost: 0,
    color: '#c084fc', accent: '#6b21a8',
    description: 'Dispara raios finos de plasma em linha reta. Atinge todos os inimigos alinhados, com dano menor e disparos mais frequentes que o Plasma Blaster.',
  },
  plasmaHypothermia: {
    name: 'Plasma Hypothermia', tier: 1, damage: 4, range: 150, fireRate: 0.28, splash: 28,
    style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0,
    color: '#a855f7', accent: '#581c87',
    description: 'Cria poças de plasma na pista. Cada poça pode afetar até 5 insetos, retardando-os e causando dano contínuo fraco, semelhante a veneno.',
  },
  icicles: {
    name: 'Icicles',
    tier: 1,
    damage: 15,
    range: 142,
    fireRate: 0.72,
    splash: 0,
    style: 'bullet',
    projectileSpeed: 260,
    inaccuracy: 0,
    cost: 0,
    color: '#a5f3fc',
    accent: '#0e7490',
    description: 'Ao acertar, divide-se em 3 estilhaços aleatórios. Cada projétil causa dano médio e reduz a velocidade em 50% por 2 segundos.',
  },
  snowballer: {
    name: 'Snowballer',
    tier: 1,
    damage: 26,
    range: 155,
    fireRate: 0.26,
    splash: 54,
    style: 'shell',
    projectileSpeed: 92,
    inaccuracy: 0,
    cost: 0,
    color: '#e0f2fe',
    accent: '#0369a1',
    description: 'Arremessa uma bola de neve lenta que atravessa até 5 inimigos antes de explodir, causando dano e congelando a área por 1 segundo.',
  },
  thunderstorm: {
    name: 'Thunderstorm',
    tier: 1,
    damage: 27,
    range: 166,
    fireRate: 0.34,
    splash: 0,
    style: 'beam',
    projectileSpeed: 0,
    inaccuracy: 0,
    cost: 0,
    color: '#c4b5fd',
    accent: '#5b21b6',
    description: 'Invoca trovões em uma linha de inimigos, causando dano e congelando cada alvo por 0,5 segundo. Disparo lento.',
  },
  ice: {
    name: 'Ice Tower', tier: 1, damage: 9, range: 108, fireRate: 0.85, splash: 0,
    style: 'bullet', projectileSpeed: 260, inaccuracy: 0, cost: 0, color: '#67e8f9', accent: '#155e75',
    description: 'Retarda inimigos em área e dispara bolas de gelo que congelam por 0,5 s e atravessam até 8 inimigos.',
  },
  incomeFarm: {
    name: 'Income Farm', tier: 0, damage: 0, range: 105, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 300, color: '#facc15', accent: '#854d0e',
    description: 'Gera 30 créditos por sinal, 5 sinais por onda.',
  },
  buffer: {
    name: 'Buffer', tier: 0, damage: 0, range: 112, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 340, color: '#34d399', accent: '#065f46',
    description: 'Concede um pequeno aumento de dano, alcance e velocidade de ataque às torres próximas. Buffs iguais não acumulam.',
  },
  commsLanHouse: {
    name: 'Comms Lan House', tier: 1, damage: 0, range: 125, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#2dd4bf', accent: '#134e4a',
    description: 'Concede buffs fortes de dano, alcance e velocidade de ataque às torres próximas. Buffs iguais não acumulam.',
  },
  incomeTax: {
    name: 'Income Tax', tier: 1, damage: 0, range: 105, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#f97316', accent: '#7c2d12',
    description: 'Gera 70 créditos por sinal, 7 sinais por onda.',
  },
  cryoMortar: { name: 'Cryogenic Mortar', tier: 2, damage: 38, range: 190, fireRate: 0.32, splash: 58, style: 'mortar', projectileSpeed: 0, inaccuracy: 22, cost: 0, color: '#67e8f9', accent: '#164e63', description: 'Lança uma bomba de gelo que congela por 0,5 s e se divide em 8 estilhaços perfurantes em todas as direções.' },
  tripleShooter: { name: 'Triple Shooter', tier: 2, damage: 10, range: 130, fireRate: 3.45, splash: 0, style: 'bullet', projectileSpeed: 480, inaccuracy: 0, cost: 0, color: '#38bdf8', accent: '#075985', description: 'Dispara 3 balas por salva, 2,3 vezes mais rápido que o Shooter.' },
  economyHouse: { name: 'Economy House', tier: 2, damage: 0, range: 118, fireRate: 1, splash: 0, style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#fbbf24', accent: '#78350f', description: 'Gera 80 créditos por sinal, 8 sinais por onda, e aumenta em 10% o dinheiro recebido por inimigos derrotados.' },
  electricalStation: {
    name: 'Electrical Station', tier: 1, damage: 0, range: 112, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#a78bfa', accent: '#4c1d95',
    description: 'Aumenta em 50% a renda das torres de renda próximas e concede um pequeno bônus de combate. Buffs não acumulam.',
  },
}

export const BUILDABLE: TowerType[] = ['shooter', 'cannon', 'lightning', 'retarder', 'incomeFarm', 'buffer', 'teleporter', 'boulderLauncher']

const FUSIONS: Record<string, TowerType> = {
  'cannon+shooter': 'mortar',
  'shooter+shooter': 'dual',
  'cannon+cannon': 'cluster',
  'lightning+shooter': 'raygun',
  'lightning+lightning': 'tesla',
  'cannon+lightning': 'bolt',
  'retarder+shooter': 'icicles',
  'cannon+retarder': 'snowballer',
  'lightning+retarder': 'thunderstorm',
  'retarder+retarder': 'ice',
  'boulderLauncher+boulderLauncher': 'rockLauncher',
  'boulderLauncher+shooter': 'slingshot',
  'boulderLauncher+cannon': 'boulderCannon',
  'boulderLauncher+lightning': 'electricSyringe',
  'boulderLauncher+retarder': 'snowballLauncher',
  'boulderLauncher+teleporter': 'portalGun',
  'shooter+teleporter': 'plasmaCannon',
  'cannon+teleporter': 'plasmaBlaster',
  'lightning+teleporter': 'plasmaRod',
  'retarder+teleporter': 'plasmaHypothermia',
  'buffer+buffer': 'commsLanHouse',
  'incomeFarm+incomeFarm': 'incomeTax',
  'buffer+incomeFarm': 'electricalStation',
  'icicles+mortar': 'cryoMortar',
  'dual+dual': 'tripleShooter',
  'incomeTax+incomeTax': 'economyHouse',
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
  { a: 'shooter', b: 'retarder', result: 'icicles' },
  { a: 'cannon', b: 'retarder', result: 'snowballer' },
  { a: 'lightning', b: 'retarder', result: 'thunderstorm' },
  { a: 'retarder', b: 'retarder', result: 'ice' },
  { a: 'boulderLauncher', b: 'boulderLauncher', result: 'rockLauncher' },
  { a: 'boulderLauncher', b: 'shooter', result: 'slingshot' },
  { a: 'boulderLauncher', b: 'cannon', result: 'boulderCannon' },
  { a: 'boulderLauncher', b: 'lightning', result: 'electricSyringe' },
  { a: 'boulderLauncher', b: 'retarder', result: 'snowballLauncher' },
  { a: 'boulderLauncher', b: 'teleporter', result: 'portalGun' },
  { a: 'shooter', b: 'teleporter', result: 'plasmaCannon' },
  { a: 'cannon', b: 'teleporter', result: 'plasmaBlaster' },
  { a: 'lightning', b: 'teleporter', result: 'plasmaRod' },
  { a: 'retarder', b: 'teleporter', result: 'plasmaHypothermia' },
  { a: 'buffer', b: 'buffer', result: 'commsLanHouse' },
  { a: 'incomeFarm', b: 'incomeFarm', result: 'incomeTax' },
  { a: 'incomeFarm', b: 'buffer', result: 'electricalStation' },
  { a: 'mortar', b: 'icicles', result: 'cryoMortar' },
  { a: 'dual', b: 'dual', result: 'tripleShooter' },
  { a: 'incomeTax', b: 'incomeTax', result: 'economyHouse' },
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
    name: 'Vessel', hp: 230, speed: 23, reward: 18, radius: 14, damage: 4, color: '#92400e', dark: '#451a03',
    description: 'Inseto marrom cascudo. Ao ser derrotado, entra em um casulo e revive com 80% da vida anterior; cada regeneração seguinte é 80% da anterior.',
  },
  jumper: { name: 'Jumper', hp: 95, speed: 70, reward: 10, radius: 10, damage: 2, color: '#c084fc', dark: '#581c87', description: 'Salta para a frente a cada 1 segundo, avançando mais distância. No ar, é imune a Shooter, Cannon e Retarder.' },
  healer: { name: 'Healer', hp: 115, speed: 30, reward: 14, radius: 11, damage: 2, color: '#4ade80', dark: '#166534', description: 'A cada 1,25 segundo, cura inimigos próximos em 20% da vida atual, ou 5% quando congelado. Congelá-lo reinicia o cooldown. Não se cura nem cura os chefes.' },
  bugPrince: { name: 'Bug Prince', hp: 18000, speed: 13, reward: 500, radius: 25, damage: 600, color: '#fbbf24', dark: '#78350f', description: 'Chefe da onda 25: invoca reforços e chama enxames. Ao morrer, dá armadura e +25% de vida aos tipos encontrados.' },
  swarmBug: { name: 'Swarm Bug', hp: 14, speed: 180, reward: 1, radius: 4.5, damage: 1, color: '#fb7185', dark: '#881337', description: 'Inseto muito frágil e veloz. Surge em enxames progressivamente maiores a partir da onda 30.' },
  splitter: { name: 'Splitter', hp: 520, speed: 30, reward: 18, radius: 13, damage: 4, color: '#f97316', dark: '#7c2d12', description: 'Tem muita vida e, ao morrer, divide-se em dois insetos com metade da vida e o dobro da velocidade.' },
  shadowBug: { name: 'Shadow Bug', hp: 145, speed: 58, reward: 14, radius: 10, damage: 2, color: '#a78bfa', dark: '#312e81', description: 'Fica invulnerável enquanto houver outros tipos de inseto em um raio maior por perto. Outros Shadow Bugs não concedem proteção.' },
  spitter: { name: 'Spitter', hp: 210, speed: 32, reward: 20, radius: 12, damage: 3, color: '#22d3ee', dark: '#164e63', description: 'A cada 2,5 segundos, desativa por 3,5 segundos a torre mais próxima.' },
  bulb: { name: 'Bulb', hp: 260, speed: 25, reward: 24, radius: 13, damage: 3, color: '#fde047', dark: '#854d0e', description: 'Alterna a cada 2,5 segundos entre ligado e desligado. Quando ligado, protege os outros insetos em uma área maior.' },
  bugQueen: { name: 'Bug Queen', hp: 72000, speed: 11, reward: 1500, radius: 32, damage: 600, color: '#f0abfc', dark: '#701a75', description: 'Chefe da onda 50: invoca novos insetos, possui quatro vezes a vida do Bug Prince e deixa um de cada tipo para trás ao morrer. Concede armadura real e +25% de vida.' },
}

export const CELL = 48
export const COLS = 18
export const ROWS = 12
export const WIDTH = CELL * COLS
export const HEIGHT = CELL * ROWS

// Percurso sinuoso no estilo original, com um único cruzamento central.
const WAYPOINT_CELLS: [number, number][] = [
  [-1, 6],
  [15, 6],
  [15, 9],
  [4, 9],
  [4, 3],
  [13, 3],
  [13, 10],
  [18, 10],
]

// Oito espaços de farms: dois em cada canto/extremidade do tabuleiro.
export const FARM_CELLS = new Set([
  '0,0', '1,0',
  '0,11', '1,11',
  '16,0', '17,0',
  '16,11', '17,11',
])

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

type WaveGroup = { type: EnemyType; count: number; spacing: number; gapAfter?: number }

// Cada grupo é um envio independente. spacing controla o intervalo entre
// insetos do mesmo grupo; gapAfter controla a pausa antes do próximo grupo.
const WAVE_GROUPS: Record<number, WaveGroup[]> = {
  1: [{type:'grunt',count:12,spacing:.75}],
  2: [{type:'grunt',count:10,spacing:.65},{type:'runner',count:3,spacing:.45}],
  3: [{type:'grunt',count:8,spacing:.55},{type:'runner',count:5,spacing:.4},{type:'grunt',count:6,spacing:.55}],
  4: [{type:'grunt',count:10,spacing:.55},{type:'tank',count:2,spacing:1.2},{type:'grunt',count:6,spacing:.5}],
  5: [{type:'grunt',count:10,spacing:.5},{type:'runner',count:6,spacing:.38},{type:'vessel',count:1,spacing:1.4},{type:'grunt',count:8,spacing:.5}],
  6: [{type:'runner',count:8,spacing:.32},{type:'tank',count:2,spacing:1},{type:'runner',count:8,spacing:.32}],
  7: [{type:'grunt',count:12,spacing:.5},{type:'vessel',count:2,spacing:1.25},{type:'grunt',count:8,spacing:.48}],
  8: [{type:'jumper',count:4,spacing:.85},{type:'grunt',count:10,spacing:.5},{type:'jumper',count:3,spacing:.8}],
  9: [{type:'runner',count:10,spacing:.3},{type:'tank',count:3,spacing:.9},{type:'grunt',count:8,spacing:.48}],
  10: [{type:'grunt',count:10,spacing:.45},{type:'jumper',count:5,spacing:.75},{type:'vessel',count:2,spacing:1.2}],
  11: [{type:'grunt',count:10,spacing:.45},{type:'healer',count:1,spacing:0},{type:'grunt',count:10,spacing:.45},{type:'healer',count:1,spacing:0}],
  12: [{type:'runner',count:8,spacing:.28},{type:'healer',count:1,spacing:0},{type:'runner',count:8,spacing:.28},{type:'grunt',count:8,spacing:.45}],
  13: [{type:'tank',count:3,spacing:.85},{type:'jumper',count:5,spacing:.7},{type:'tank',count:3,spacing:.85}],
  14: [{type:'vessel',count:2,spacing:1.1},{type:'grunt',count:10,spacing:.42},{type:'healer',count:2,spacing:.85},{type:'runner',count:6,spacing:.3}],
  15: [{type:'runner',count:10,spacing:.26},{type:'jumper',count:5,spacing:.65},{type:'runner',count:10,spacing:.26}],
  16: [{type:'grunt',count:12,spacing:.4},{type:'healer',count:1,spacing:0},{type:'tank',count:4,spacing:.75},{type:'grunt',count:10,spacing:.4},{type:'healer',count:2,spacing:.75}],
  17: [{type:'jumper',count:6,spacing:.62},{type:'tank',count:4,spacing:.72},{type:'jumper',count:6,spacing:.62},{type:'runner',count:8,spacing:.26}],
  18: [{type:'grunt',count:10,spacing:.42},{type:'healer',count:1,spacing:0},{type:'bulb',count:1,spacing:0},{type:'grunt',count:10,spacing:.42},{type:'jumper',count:5,spacing:.7},{type:'spitter',count:1,spacing:0},{type:'runner',count:10,spacing:.28}],
  19: [{type:'runner',count:12,spacing:.24},{type:'tank',count:4,spacing:.68},{type:'healer',count:2,spacing:.75},{type:'runner',count:10,spacing:.24}],
  20: [{type:'jumper',count:8,spacing:.58},{type:'healer',count:2,spacing:.7},{type:'vessel',count:3,spacing:.9},{type:'runner',count:12,spacing:.24},{type:'jumper',count:5,spacing:.58}],
  21: [{type:'grunt',count:12,spacing:.36},{type:'healer',count:2,spacing:.65},{type:'tank',count:4,spacing:.65},{type:'grunt',count:12,spacing:.36},{type:'runner',count:10,spacing:.24}],
  22: [{type:'runner',count:14,spacing:.22},{type:'jumper',count:7,spacing:.52},{type:'runner',count:14,spacing:.22},{type:'healer',count:2,spacing:.65}],
  23: [{type:'tank',count:5,spacing:.58},{type:'bulb',count:1,spacing:0},{type:'shadowBug',count:4,spacing:.42},{type:'healer',count:2,spacing:.65},{type:'grunt',count:14,spacing:.34},{type:'spitter',count:1,spacing:0}],
  24: [{type:'vessel',count:4,spacing:.72},{type:'jumper',count:8,spacing:.48},{type:'bulb',count:1,spacing:0},{type:'vessel',count:4,spacing:.72},{type:'healer',count:3,spacing:.6},{type:'runner',count:12,spacing:.22}],
  26: [{type:'grunt',count:16,spacing:.32},{type:'splitter',count:3,spacing:.8},{type:'runner',count:12,spacing:.2},{type:'healer',count:2,spacing:.55},{type:'tank',count:5,spacing:.55}],
  27: [{type:'runner',count:18,spacing:.18},{type:'shadowBug',count:5,spacing:.34},{type:'grunt',count:16,spacing:.3},{type:'jumper',count:8,spacing:.45}],
  28: [{type:'vessel',count:5,spacing:.62},{type:'healer',count:3,spacing:.5},{type:'jumper',count:10,spacing:.42},{type:'splitter',count:4,spacing:.72},{type:'runner',count:12,spacing:.2}],
  29: [{type:'tank',count:7,spacing:.5},{type:'bulb',count:2,spacing:.65},{type:'vessel',count:5,spacing:.55},{type:'spitter',count:2,spacing:.7},{type:'healer',count:3,spacing:.5},{type:'grunt',count:18,spacing:.3}],
  30: [{type:'swarmBug',count:35,spacing:.07},{type:'tank',count:5,spacing:.5},{type:'swarmBug',count:35,spacing:.07},{type:'splitter',count:4,spacing:.7},{type:'grunt',count:18,spacing:.28}],
  31: [{type:'runner',count:20,spacing:.17},{type:'shadowBug',count:6,spacing:.32},{type:'grunt',count:18,spacing:.28},{type:'bulb',count:2,spacing:.6},{type:'swarmBug',count:45,spacing:.065}],
  32: [{type:'splitter',count:5,spacing:.65},{type:'swarmBug',count:45,spacing:.065},{type:'healer',count:3,spacing:.48},{type:'tank',count:7,spacing:.48},{type:'runner',count:18,spacing:.17}],
  33: [{type:'grunt',count:20,spacing:.26},{type:'spitter',count:3,spacing:.6},{type:'jumper',count:12,spacing:.4},{type:'shadowBug',count:7,spacing:.3},{type:'swarmBug',count:50,spacing:.06}],
  34: [{type:'vessel',count:7,spacing:.52},{type:'healer',count:4,spacing:.45},{type:'bulb',count:2,spacing:.55},{type:'runner',count:20,spacing:.16},{type:'swarmBug',count:55,spacing:.06}],
  35: [{type:'tank',count:9,spacing:.44},{type:'splitter',count:6,spacing:.6},{type:'grunt',count:22,spacing:.24},{type:'spitter',count:3,spacing:.55},{type:'swarmBug',count:60,spacing:.055}],
  36: [{type:'jumper',count:14,spacing:.36},{type:'shadowBug',count:8,spacing:.28},{type:'bulb',count:3,spacing:.5},{type:'runner',count:22,spacing:.15},{type:'swarmBug',count:65,spacing:.055}],
  37: [{type:'vessel',count:8,spacing:.48},{type:'healer',count:5,spacing:.42},{type:'splitter',count:7,spacing:.55},{type:'grunt',count:24,spacing:.22},{type:'swarmBug',count:70,spacing:.05}],
  38: [{type:'runner',count:24,spacing:.14},{type:'spitter',count:4,spacing:.5},{type:'tank',count:9,spacing:.42},{type:'shadowBug',count:9,spacing:.26},{type:'swarmBug',count:75,spacing:.05}],
  39: [{type:'splitter',count:8,spacing:.52},{type:'bulb',count:3,spacing:.48},{type:'vessel',count:9,spacing:.45},{type:'healer',count:5,spacing:.4},{type:'jumper',count:14,spacing:.34},{type:'swarmBug',count:80,spacing:.048}],
  40: [{type:'tank',count:10,spacing:.4},{type:'bulb',count:3,spacing:.45},{type:'vessel',count:8,spacing:.42},{type:'healer',count:5,spacing:.38},{type:'spitter',count:4,spacing:.48},{type:'splitter',count:8,spacing:.5},{type:'swarmBug',count:85,spacing:.045}],
  41: [{type:'runner',count:28,spacing:.13},{type:'shadowBug',count:10,spacing:.24},{type:'jumper',count:16,spacing:.32},{type:'swarmBug',count:90,spacing:.045}],
  42: [{type:'splitter',count:9,spacing:.48},{type:'healer',count:6,spacing:.36},{type:'tank',count:11,spacing:.38},{type:'bulb',count:4,spacing:.42},{type:'swarmBug',count:95,spacing:.043}],
  43: [{type:'vessel',count:10,spacing:.4},{type:'spitter',count:5,spacing:.44},{type:'shadowBug',count:11,spacing:.22},{type:'runner',count:26,spacing:.13},{type:'swarmBug',count:100,spacing:.042}],
  44: [{type:'jumper',count:18,spacing:.3},{type:'bulb',count:4,spacing:.4},{type:'splitter',count:10,spacing:.45},{type:'healer',count:6,spacing:.34},{type:'swarmBug',count:105,spacing:.04}],
  45: [{type:'tank',count:12,spacing:.36},{type:'vessel',count:10,spacing:.38},{type:'healer',count:6,spacing:.32},{type:'spitter',count:5,spacing:.4},{type:'grunt',count:26,spacing:.2},{type:'swarmBug',count:110,spacing:.04}],
  46: [{type:'runner',count:30,spacing:.12},{type:'shadowBug',count:12,spacing:.2},{type:'bulb',count:4,spacing:.38},{type:'jumper',count:18,spacing:.28},{type:'swarmBug',count:115,spacing:.038}],
  47: [{type:'splitter',count:11,spacing:.42},{type:'vessel',count:11,spacing:.36},{type:'healer',count:7,spacing:.3},{type:'spitter',count:6,spacing:.38},{type:'swarmBug',count:120,spacing:.037}],
  48: [{type:'tank',count:14,spacing:.34},{type:'bulb',count:5,spacing:.36},{type:'shadowBug',count:13,spacing:.18},{type:'jumper',count:20,spacing:.26},{type:'splitter',count:11,spacing:.4},{type:'swarmBug',count:125,spacing:.035}],
  49: [{type:'vessel',count:12,spacing:.34},{type:'healer',count:8,spacing:.28},{type:'bulb',count:5,spacing:.34},{type:'spitter',count:7,spacing:.34},{type:'shadowBug',count:14,spacing:.17},{type:'splitter',count:12,spacing:.38},{type:'runner',count:30,spacing:.11},{type:'swarmBug',count:135,spacing:.032}],
}

export function buildWave(n: number): { type: EnemyType; delay: number }[] {
  if (n === 25) return [{ type: 'bugPrince', delay: 0 }]
  if (n === 50) return [{ type: 'bugQueen', delay: 0 }]

  const groups = WAVE_GROUPS[Math.max(1, Math.min(49, Math.floor(n)))] ?? WAVE_GROUPS[1]
  const queue: { type: EnemyType; delay: number }[] = []

  groups.forEach((group, groupIndex) => {
    for (let i = 0; i < group.count; i++) {
      const isLastInGroup = i === group.count - 1
      const isLastGroup = groupIndex === groups.length - 1
      queue.push({
        type: group.type,
        // A pausa entre grupos é aplicada depois do último inseto do envio.
        delay: isLastInGroup && !isLastGroup ? (group.gapAfter ?? 0.35) : group.spacing,
      })
    }
  })

  return queue
}

export const hpScale = (_wave: number) => 1
