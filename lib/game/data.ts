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
  | 'commsBuilding'
  | 'soulstorm'
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
  | 'pebblesLauncher'
  | 'flamethrower'
  | 'hyperLaser'
  | 'cannonadeBomber'
  | 'splitHeel'
  | 'singularity'
  | 'mimic'
  | 'gatlingGun'
  | 'commsCenter'
  | 'meteorShower'
  | 'glacialCataclysm'
  | 'masterBank'
  | 'bladeOfChaos'
  | 'ringOfFlames'
  | 'droneFactory'
  | 'spikeLayer'
  | 'skybreaker'
export type EnemyType =
  | 'grunt' | 'tank' | 'runner' | 'vessel' | 'jumper' | 'healer'
  | 'bugPrince' | 'swarmBug' | 'splitter' | 'shadowBug' | 'spitter' | 'bulb' | 'bugQueen'
  | 'flyBug' | 'ironBug' | 'rubberBug' | 'heatBug' | 'ghostBug' | 'dirtBug'
  | 'swarmer' | 'buguns' | 'starbug' | 'bombug' | 'bugKing'

export type ElementClass = 'normal' | 'fire' | 'electricity' | 'ice' | 'earth' | 'plasma' | 'air' | 'explosive'

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
    name: 'Portal Gun', tier: 1, damage: 0, range: 170, fireRate: 0.1, splash: 0,
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
    description: 'Concede um pequeno aumento de dano, alcance e velocidade de ataque às torres próximas. Também repara 18 HP das torres ao alcance ao fim de cada rodada. Buffs iguais não acumulam.',
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
  commsBuilding: { name: 'Comms Building', tier: 2, damage: 0, range: 145, fireRate: 1, splash: 0, style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#2dd4bf', accent: '#134e4a', description: 'Concede bônus médios de 15% ao dano, alcance e velocidade de ataque das torres próximas. A cada 12 segundos, ativa Overclock em uma torre aliada aleatória no alcance por 4 segundos, dobrando sua velocidade de ataque e alcance.' },
  soulstorm: { name: 'Soulstorm', tier: 2, damage: 300, range: 170, fireRate: 1, splash: 0, style: 'beam', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#a78bfa', accent: '#4c1d95', description: 'Acumula Essência sempre que uma torre elétrica elimina um inimigo. Ao atingir 10 eliminações, dispara um raio de alcance e perfuração infinitos que distribui 300 de dano total entre todos os inimigos alinhados.' },
  pebblesLauncher: {
    name: 'Pebbles Launcher', tier: 2, damage: 100, range: 170, fireRate: 0.1, splash: 0,
    style: 'shell', projectileSpeed: 70, inaccuracy: 0, cost: 0,
    color: '#a3a3a3', accent: '#57534e',
    description: 'Dispara quatro pedras pequenas em sequência pelo caminho. Cada pedra causa 80% do dano da Rock Launcher, perfura até 10 inimigos e perde dano e tamanho a cada impacto.',
  },
  flamethrower: {
    name: 'Flamethrower', tier: 2, damage: 1.2, range: 145, fireRate: 22, splash: 0,
    style: 'projectile', projectileSpeed: 280, inaccuracy: 0, cost: 0,
    color: '#fb923c', accent: '#9a3412',
    description: 'Dispara uma sequência rapidíssima de pequenas chamas. Cada projétil causa pouco dano, atravessa até 10 inimigos e perde dano, tamanho e transparência ao longo do percurso.',
  },
  hyperLaser: {
    name: 'HyperLaser', tier: 2, damage: 7, range: 180, fireRate: 3.2, splash: 0,
    style: 'beam', projectileSpeed: 0, inaccuracy: 0, cost: 0,
    color: '#d8b4fe', accent: '#6b21a8',
    description: 'Varre uma abertura com cinco raios de plasma em sequência, partindo da torre e abrindo em leque. Os raios atravessam todos os inimigos alinhados.'
  },
  electricalStation: {
    name: 'Electrical Station', tier: 1, damage: 0, range: 112, fireRate: 1, splash: 0, style: 'support',
    projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#a78bfa', accent: '#4c1d95',
    description: 'Aumenta em 50% a renda das torres de renda próximas e concede um pequeno bônus de combate. Buffs não acumulam.',
  },
  cannonadeBomber: { name: 'Cannonade Bomber', tier: 2, damage: 58, range: 170, fireRate: 0.18, splash: 42, style: 'mortar', projectileSpeed: 0, inaccuracy: 18, cost: 0, color: '#fb7185', accent: '#881337', description: 'Lança uma bomba que se divide em 4 bombas em todas as direções. Cada uma dessas bombas também se divide em outras 4.' },
  splitHeel: { name: 'Split Heel', tier: 2, damage: 46, range: 175, fireRate: 0.3, splash: 38, style: 'shell', projectileSpeed: 330, inaccuracy: 0, cost: 0, color: '#f97316', accent: '#7c2d12', description: 'Lança uma pedra que quica nas bordas do mapa 3 vezes. Ao terminar os quiques, divide-se em 4 pedras explosivas que detonam no primeiro inimigo atingido.' },
  singularity: { name: 'Singularity', tier: 2, damage: 380, range: 180, fireRate: 0.12, splash: 90, style: 'energy', projectileSpeed: 220, inaccuracy: 0, cost: 0, color: '#a78bfa', accent: '#312e81', description: 'Lança um buraco negro na pista que suga até 10 inimigos. Depois explode, distribuindo 380 de dano entre os inimigos capturados.' },
  mimic: { name: 'Mimic', tier: 2, damage: 32, range: 165, fireRate: 0.5, splash: 30, style: 'energy', projectileSpeed: 300, inaccuracy: 0, cost: 0, color: '#d8b4fe', accent: '#581c87', description: 'A cada 2 segundos, combina aleatoriamente o ataque de uma torre com o efeito de outra, criando projéteis híbridos.' },
  gatlingGun: { name: 'Gatling Gun', tier: 3, damage: 8, range: 155, fireRate: 8.5, splash: 0, style: 'bullet', projectileSpeed: 560, inaccuracy: 0, cost: 0, color: '#38bdf8', accent: '#075985', description: 'Dispara em cadência extrema, lançando dois projéteis simultaneamente a cada salva.' },
  commsCenter: { name: 'Comms Center', tier: 3, damage: 0, range: 175, fireRate: 1, splash: 0, style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#2dd4bf', accent: '#134e4a', description: 'Possui HP massivo. Torres no alcance recebem apenas 25% do dano: o Comms Center absorve 75%, mas sofre somente metade desse valor. Recupera 20% do HP máximo ao fim de cada onda, concede buffs médios, ignora resistências e imunidades dos insetos e concede um grande Overclock aleatório por 5 s a cada 15 s.' },
  meteorShower: { name: 'Meteor Shower', tier: 3, damage: 60, range: 999, fireRate: 0.1, splash: 48, style: 'mortar', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#c084fc', accent: '#713f12', description: 'A cada 10 segundos, lança uma chuva de meteoros em posições fixas por toda a rota, espaçadas a cada 1 célula.' },
  glacialCataclysm: { name: 'Glacial Cataclysm', tier: 3, damage: 85, range: 190, fireRate: 0.16, splash: 64, style: 'mortar', projectileSpeed: 0, inaccuracy: 18, cost: 0, color: '#67e8f9', accent: '#164e63', description: 'Dispara uma enorme bomba de gelo que se divide em bombas menores congelantes. Cada bomba menor explode e dispara 8 projéteis de gelo.' },
  masterBank: { name: 'Master Bank', tier: 3, damage: 0, range: 118, fireRate: 1, splash: 0, style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#fbbf24', accent: '#78350f', description: 'Gera 1.000 créditos por rodada: 800 vão diretamente para sua conta e 200 são depositados no banco. O saldo depositado rende juros compostos de 20% por rodada até ser sacado.' },
  bladeOfChaos: { name: 'Blade Of Chaos', tier: 2, damage: 20, range: 180, fireRate: 0.45, splash: 0, style: 'energy', projectileSpeed: 310, inaccuracy: 0, cost: 0, color: '#c084fc', accent: '#581c87', description: 'Lança uma lâmina giratória que persegue inimigos e causa dano a cada giro. Permanece ativa por até 5 segundos ou até causar 500 de dano.' },
  ringOfFlames: { name: 'Ring Of Flames', tier: 3, damage: 14, range: 185, fireRate: 0.45, splash: 0, style: 'energy', projectileSpeed: 320, inaccuracy: 0, cost: 0, color: '#fb923c', accent: '#9a3412', description: 'Lança uma lâmina giratória que persegue inimigos e lança chamas pelas duas pontas. Permanece ativa por até 5 segundos.' },
  droneFactory: { name: 'Drone Factory', tier: 2, damage: 12, range: 180, fireRate: 2, splash: 0, style: 'bullet', projectileSpeed: 430, inaccuracy: 0, cost: 0, color: '#94a3b8', accent: '#334155', description: 'A cada 20 segundos, fabrica um drone aliado. Cada drone suporta até 1.000 de dano acumulado e dispara duas balas por salva, duas vezes por segundo.' },
  spikeLayer: { name: 'Spike Layer', tier: 2, damage: 22, range: 110, fireRate: 1/12, splash: 0, style: 'support', projectileSpeed: 0, inaccuracy: 0, cost: 0, color: '#a3a3a3', accent: '#44403c', description: 'A cada 12 segundos, instala espinhos aleatoriamente em um trecho do caminho dentro de seu alcance. Eles duram 2 rodadas e, quando um inimigo passa por cima, explodem em 4 estilhaços de gelo.' },
  skybreaker: { name: 'Skybreaker', tier: 3, damage: 38, range: 185, fireRate: 4, splash: 0, style: 'bullet', projectileSpeed: 520, inaccuracy: 0, cost: 0, color: '#f97316', accent: '#7c2d12', description: 'Invoca um helicóptero permanente que segue o cursor e dispara quatro rajadas por segundo, cada uma com quatro balas perfurantes. Quando um chefe aparece, troca para mísseis teleguiados de alto dano. O helicóptero desaparece quando a torre é vendida ou destruída.' },
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
  'commsLanHouse+commsLanHouse': 'commsBuilding',
  'plasmaRod+tesla': 'soulstorm',
  'rockLauncher+rockLauncher': 'pebblesLauncher',
  'cluster+dual': 'flamethrower',
  'plasmaBlaster+plasmaRod': 'hyperLaser',
  'cluster+cluster': 'cannonadeBomber',
  'cluster+slingshot': 'splitHeel',
  'plasmaCannon+portalGun': 'singularity',
  'teleporter+teleporter': 'mimic',
  'tripleShooter+tripleShooter': 'gatlingGun',
  'commsBuilding+commsBuilding': 'commsCenter',
  'pebblesLauncher+singularity': 'meteorShower',
  'cannonadeBomber+cryoMortar': 'glacialCataclysm',
  'economyHouse+economyHouse': 'masterBank',
  'plasmaCannon+raygun': 'bladeOfChaos',
  'bladeOfChaos+flamethrower': 'ringOfFlames',
  'dual+rockLauncher': 'droneFactory',
  'cluster+rockLauncher': 'spikeLayer',
  'droneFactory+spikeLayer': 'skybreaker',
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
  { a: 'commsLanHouse', b: 'commsLanHouse', result: 'commsBuilding' },
  { a: 'plasmaRod', b: 'tesla', result: 'soulstorm' },
  { a: 'rockLauncher', b: 'rockLauncher', result: 'pebblesLauncher' },
  { a: 'dual', b: 'cluster', result: 'flamethrower' },
  { a: 'plasmaRod', b: 'plasmaBlaster', result: 'hyperLaser' },
  { a: 'cluster', b: 'cluster', result: 'cannonadeBomber' },
  { a: 'cluster', b: 'slingshot', result: 'splitHeel' },
  { a: 'plasmaCannon', b: 'portalGun', result: 'singularity' },
  { a: 'teleporter', b: 'teleporter', result: 'mimic' },
  { a: 'tripleShooter', b: 'tripleShooter', result: 'gatlingGun' },
  { a: 'commsBuilding', b: 'commsBuilding', result: 'commsCenter' },
  { a: 'pebblesLauncher', b: 'singularity', result: 'meteorShower' },
  { a: 'cannonadeBomber', b: 'cryoMortar', result: 'glacialCataclysm' },
  { a: 'economyHouse', b: 'economyHouse', result: 'masterBank' },
  { a: 'plasmaCannon', b: 'raygun', result: 'bladeOfChaos' },
  { a: 'bladeOfChaos', b: 'flamethrower', result: 'ringOfFlames' },
  { a: 'rockLauncher', b: 'dual', result: 'droneFactory' },
  { a: 'rockLauncher', b: 'cluster', result: 'spikeLayer' },
  { a: 'droneFactory', b: 'spikeLayer', result: 'skybreaker' },
]

export const TOWER_ELEMENTS: Partial<Record<TowerType, ElementClass>> = {
  shooter: 'normal', cannon: 'fire', lightning: 'electricity', retarder: 'ice',
  boulderLauncher: 'earth', teleporter: 'plasma',
  dual: 'normal', tripleShooter: 'normal',
  mortar: 'fire', cluster: 'fire',
  raygun: 'electricity', bolt: 'electricity', tesla: 'electricity', electricSyringe: 'electricity',
  icicles: 'ice', snowballer: 'ice', snowballLauncher: 'ice', thunderstorm: 'electricity', ice: 'ice', cryoMortar: 'ice',
  rockLauncher: 'earth', slingshot: 'earth', boulderCannon: 'earth',
  portalGun: 'plasma', plasmaCannon: 'plasma', plasmaBlaster: 'plasma', plasmaRod: 'plasma', plasmaHypothermia: 'plasma',
  soulstorm: 'electricity', commsLanHouse: 'normal', incomeTax: 'earth', electricalStation: 'electricity', commsBuilding: 'electricity', economyHouse: 'earth',
  gatlingGun: 'normal', commsCenter: 'normal',
  meteorShower: 'plasma', glacialCataclysm: 'ice',
  masterBank: 'earth', bladeOfChaos: 'normal', ringOfFlames: 'fire',
  pebblesLauncher: 'earth', flamethrower: 'fire', hyperLaser: 'plasma',
  cannonadeBomber: 'fire', splitHeel: 'fire', singularity: 'plasma', mimic: 'plasma',
  droneFactory: 'normal', spikeLayer: 'earth', skybreaker: 'explosive',
}

export const TOWER_SECONDARY_ELEMENTS: Partial<Record<TowerType, ElementClass>> = {
  dual: 'air', mortar: 'explosive', cluster: 'explosive', raygun: 'normal', bolt: 'explosive', tesla: 'electricity',
  icicles: 'air', snowballer: 'explosive', thunderstorm: 'ice', ice: 'air', rockLauncher: 'air', slingshot: 'air',
  boulderCannon: 'explosive', electricSyringe: 'earth', snowballLauncher: 'earth', portalGun: 'earth', plasmaCannon: 'air',
  plasmaBlaster: 'explosive', plasmaRod: 'electricity', plasmaHypothermia: 'ice', commsLanHouse: 'electricity', incomeTax: 'earth',
  electricalStation: 'electricity', cryoMortar: 'explosive', tripleShooter: 'air', economyHouse: 'explosive', commsBuilding: 'electricity',
  soulstorm: 'plasma', pebblesLauncher: 'air', flamethrower: 'air', hyperLaser: 'electricity', cannonadeBomber: 'explosive',
  splitHeel: 'earth', singularity: 'explosive', mimic: 'normal', gatlingGun: 'air', meteorShower: 'explosive',
  glacialCataclysm: 'explosive', masterBank: 'earth', commsCenter: 'electricity', bladeOfChaos: 'electricity', ringOfFlames: 'air',
  droneFactory: 'air', spikeLayer: 'explosive', skybreaker: 'air',
}

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
  immunities?: ElementClass[]
  resistances?: ElementClass[]
  weaknesses?: ElementClass[]
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
  spitter: { name: 'Spitter', hp: 210, speed: 32, reward: 20, radius: 12, damage: 3, color: '#22d3ee', dark: '#164e63', description: 'A cada 1,5 segundo, cospe um projétil na direção em que está andando. O cuspe causa dano à primeira torre atingida.' },
  bulb: { name: 'Bulb', hp: 260, speed: 25, reward: 24, radius: 13, damage: 3, color: '#fde047', dark: '#854d0e', description: 'Alterna a cada 2,5 segundos entre ligado e desligado. Quando ligado, protege os outros insetos em uma área maior.' },
  flyBug: { name: 'Fly Bug', hp: 90, speed: 82, reward: 10, radius: 8, damage: 1, color: '#bae6fd', dark: '#075985', immunities: ['fire', 'earth'], weaknesses: ['electricity'], description: 'Ignora o percurso e voa em linha reta diretamente da entrada até a saída. Não é afetado por portais; fogo e terra não conseguem atingi-lo.' },
  ironBug: { name: 'Ironbug', hp: 155, speed: 27, reward: 16, radius: 13, damage: 3, color: '#94a3b8', dark: '#334155', immunities: ['normal'], weaknesses: ['fire'], description: 'Sua carapaça bloqueia projéteis normais. Cada projétil normal tem 10% de chance de ser refletido para a torre que o disparou, causando 18 de dano.' },
  rubberBug: { name: 'Rubberbug', hp: 112, speed: 48, reward: 14, radius: 10, damage: 2, color: '#facc15', dark: '#713f12', immunities: ['electricity'], weaknesses: ['normal', 'fire'], description: 'Absorve ataques elétricos e recupera vida na mesma quantidade de dano que receberia. É vulnerável a ataques normais e de fogo.' },
  heatBug: { name: 'Heatbug', hp: 165, speed: 34, reward: 18, radius: 12, damage: 3, color: '#fb923c', dark: '#9a3412', immunities: ['ice'], weaknesses: ['electricity', 'plasma'], description: 'Depois de um tempo aleatório, explode e desativa todas as torres próximas por 4 segundos. É imune a gelo, congelamento e lentidão causada por frio.' },
  ghostBug: { name: 'Ghostbug', hp: 130, speed: 62, reward: 16, radius: 10, damage: 2, color: '#c4b5fd', dark: '#5b21b6', immunities: ['plasma'], weaknesses: ['normal', 'electricity'], description: 'Tem 20% de chance de deixar qualquer projétil atravessar seu corpo sem sofrer dano.' },
  dirtBug: { name: 'Dirtbug', hp: 205, speed: 25, reward: 20, radius: 14, damage: 3, color: '#a8a29e', dark: '#44403c', immunities: ['earth'], weaknesses: ['fire', 'plasma'], description: 'Seu corpo é dividido em segmentos, cada um com vida própria. Periodicamente escava o solo, avança algumas unidades e fica invulnerável enquanto está subterrâneo.' },
  bugQueen: { name: 'Bug Queen', hp: 72000, speed: 11, reward: 1500, radius: 32, damage: 600, color: '#f0abfc', dark: '#701a75', description: 'Chefe da onda 50: invoca novos insetos, possui quatro vezes a vida do Bug Prince e deixa um de cada tipo para trás ao morrer. Concede armadura real e +25% de vida.' },
  swarmer: { name: 'Swarmer', hp: 260, speed: 44, reward: 22, radius: 12, damage: 3, color: '#fb7185', dark: '#9f1239', description: 'Quando recebe dano, gera um Swarm Bug. Quanto mais você ataca, maior fica o enxame.' },
  buguns: { name: 'Buguns', hp: 520, speed: 36, reward: 32, radius: 14, damage: 4, color: '#f97316', dark: '#9a3412', description: 'Dispara dois projéteis em direções aleatórias ao mesmo tempo. Cada cuspe pode danificar uma torre.' },
  starbug: { name: 'Starbug', hp: 900, speed: 29, reward: 48, radius: 16, damage: 5, color: '#facc15', dark: '#854d0e', description: 'Dispara cinco projéteis em uma salva radial, formando uma estrela. Cada projétil causa dano às torres.' },
  bombug: { name: 'Bombug', hp: 1250, speed: 118, reward: 55, radius: 16, damage: 8, color: '#ef4444', dark: '#7f1d1d', description: 'Corre rapidamente pela rota. Ao ser derrotado, explode e causa dano elevado às torres próximas.' },
  bugKing: { name: 'Bug King', hp: 240000, speed: 9, reward: 6000, radius: 40, damage: 1000, color: '#c084fc', dark: '#581c87', description: 'Chefe final da onda 75. Possui vida colossal. Ao morrer, dobra permanentemente a vida máxima de todos os tipos de insetos já encontrados e dos que surgirem depois.' },
}

export const CELL = 30
export const COLS = 32
export const ROWS = 28
export const WIDTH = CELL * COLS
export const HEIGHT = CELL * ROWS

// Percurso conforme o esboço: dois retornos retangulares ligados
// por um trecho inferior longo, com dois cruzamentos do traçado.
const WAYPOINT_CELLS: [number, number][] = [
  [-1, 6],
  [3, 6],
  [3, 2],
  [7, 2],
  [7, 6],
  [3, 6],
  [3, 10],
  [14, 10],
  [14, 6],
  [11, 6],
  [11, 3],
  [14, 2],
  [14, 6],
  [18, 6],
]

// Oito espaços de farms: dois em cada canto/extremidade do tabuleiro.
export const FARM_CELLS = new Set([
  '0,0', '1,0',
  '0,27', '1,27',
  '30,0', '31,0',
  '30,27', '31,27',
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


export type MapId =
  | 'original'
  | 'meadow'
  | 'frostline'
  | 'emberCrossing'
  | 'quarrySpiral'
  | 'neonGauntlet'
  | 'voidLabyrinth'
  | 'infernoCircuit'

export type MapDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert'

export interface GameMap {
  id: MapId
  name: string
  difficulty: MapDifficulty
  description: string
  hpMultiplier: number
  speedMultiplier: number
  colors: {
    background: string
    grid: string
    pathGlow: string
    path: string
    pathDash: string
    farmFill: string
    farmStroke: string
    farmText: string
    preview: string
    accent: string
  }
  path: { x: number; y: number }[]
  pathLengths: number[]
  pathWidth: number
  sandOnly: boolean
  pathCells: Set<string>
  buildableCells: Set<string>
  terrainPatches: { points: [number, number][]; color: string }[]
  routes: { path: { x: number; y: number }[]; pathLengths: number[]; pathCells: Set<string> }[]
  farmCells: Set<string>
  blockedCells: Set<string>
  theme: 'grass' | 'water' | 'stone' | 'desert' | 'lava' | 'crystal' | 'classic'
}

export const MAP_SCALE_X = (CELL * COLS) / 256
export const MAP_SCALE_Y = (CELL * ROWS) / 224

function buildRoute(waypoints: [number, number][], pixelCoordinates = false) {
  const rawPath = waypoints.map(([col, row]) => pixelCoordinates
    ? ({ x: col * MAP_SCALE_X, y: row * MAP_SCALE_Y })
    : ({ x: (col / 18) * WIDTH, y: (row / 12) * HEIGHT }))
  const path: { x: number; y: number }[] = [rawPath[0]]
  if (pixelCoordinates && rawPath.length > 2) {
    // Catmull-Rom: reproduz as curvas orgânicas dos desenhos de referência.
    for (let i = 0; i < rawPath.length - 1; i++) {
      const p0 = rawPath[Math.max(0, i - 1)], p1 = rawPath[i]
      const p2 = rawPath[i + 1], p3 = rawPath[Math.min(rawPath.length - 1, i + 2)]
      for (let step = 1; step <= 24; step++) {
        const t = step / 24, t2 = t * t, t3 = t2 * t
        const sample = (a: number, b: number, c: number, d: number) =>
          0.5 * ((2 * b) + (-a + c) * t + (2*a - 5*b + 4*c - d) * t2 + (-a + 3*b - 3*c + d) * t3)
        path.push({ x: sample(p0.x,p1.x,p2.x,p3.x), y: sample(p0.y,p1.y,p2.y,p3.y) })
      }
    }
  } else {
    for (let i = 1; i < rawPath.length - 1; i++) {
      const prev = rawPath[i - 1], corner = rawPath[i], next = rawPath[i + 1]
      const inX = prev.x - corner.x, inY = prev.y - corner.y
      const outX = next.x - corner.x, outY = next.y - corner.y
      const inLength = Math.hypot(inX, inY), outLength = Math.hypot(outX, outY)
      const dot = (inX * outX + inY * outY) / Math.max(1, inLength * outLength)
      const radius = dot < -0.92 ? 0 : Math.min(CELL * 0.58, inLength * 0.38, outLength * 0.38)
      if (radius < 1) { path.push(corner); continue }
      const start = { x: corner.x + inX / inLength * radius, y: corner.y + inY / inLength * radius }
      const finish = { x: corner.x + outX / outLength * radius, y: corner.y + outY / outLength * radius }
      path.push(start)
      for (let sample = 1; sample <= 8; sample++) {
        const t = sample / 8, inv = 1 - t
        path.push({ x: inv * inv * start.x + 2 * inv * t * corner.x + t * t * finish.x, y: inv * inv * start.y + 2 * inv * t * corner.y + t * t * finish.y })
      }
    }
    path.push(rawPath[rawPath.length - 1])
  }
  const pathLengths = [0], pathCells = new Set<string>()
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i]
    pathLengths[i] = pathLengths[i - 1] + Math.hypot(b.x - a.x, b.y - a.y)
    const samples = Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/(CELL/5))
    for (let n=0;n<=samples;n++) {
      const t=samples?n/samples:0, x=a.x+(b.x-a.x)*t, y=a.y+(b.y-a.y)*t
      pathCells.add(`${Math.floor(x/CELL)},${Math.floor(y/CELL)}`)
    }
  }
  return { path, pathLengths, pathCells }
}

function pointInPolygon(x: number, y: number, polygon: [number, number][]) {
  let inside = false
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const [xi,yi]=polygon[i], [xj,yj]=polygon[j]
    if (((yi>y)!==(yj>y)) && x < (xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside
  }
  return inside
}

function distanceToRoutes(x: number, y: number, routes: {path:{x:number;y:number}[]}[]) {
  let best=Infinity
  for (const route of routes) for(let i=1;i<route.path.length;i++) {
    const a=route.path[i-1],b=route.path[i],dx=b.x-a.x,dy=b.y-a.y
    const len=dx*dx+dy*dy, t=len?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/len)):0
    best=Math.min(best,Math.hypot(x-a.x-dx*t,y-a.y-dy*t))
  }
  return best
}

function defineMap(
  id: MapId, name: string, difficulty: MapDifficulty, description: string,
  hpMultiplier: number, speedMultiplier: number, colors: GameMap['colors'],
  waypoints: [number, number][], options: {
    extraRoutes?: [number, number][][]
    farms?: string[]
    theme?: GameMap['theme']
    blocked?: [number, number, number, number][]
    pixelCoordinates?: boolean
    terrainPatches?: { points: [number, number][]; color: string }[]
    sandOnly?: boolean
    pathWidth?: number
    waterBuildable?: { minDistance: number; maxDistance: number; boat: [number, number][]; bankRadius: number }
  } = {},
): GameMap {
  const routes = [waypoints, ...(options.extraRoutes ?? [])].map(points => buildRoute(points, options.pixelCoordinates))
  const pathCells = new Set(routes.flatMap(route => [...route.pathCells]))
  const farmCells = new Set(options.farms ?? [])
  const terrainPatches = [...(options.terrainPatches ?? [])]
  if (options.waterBuildable) {
    const route = routes[0].path
    const left: [number, number][] = [], right: [number, number][] = []
    for (let i=0;i<route.length;i++) {
      const prev=route[Math.max(0,i-1)], next=route[Math.min(route.length-1,i+1)]
      const dx=next.x-prev.x, dy=next.y-prev.y, length=Math.hypot(dx,dy)||1
      const nx=-dy/length*options.waterBuildable.bankRadius, ny=dx/length*options.waterBuildable.bankRadius
      left.push([route[i].x+nx,route[i].y+ny])
      right.push([route[i].x-nx,route[i].y-ny])
    }
    terrainPatches.unshift({points:[...left,...right.reverse()],color:'#0b6040'})
    terrainPatches.push({points:options.waterBuildable.boat,color:'#176747'})
  }
  const blockedCells = new Set<string>()
  for (let row=0;row<ROWS;row++) for(let col=0;col<COLS;col++) {
    const cell=`${col},${row}`
    const px=(col+0.5)*CELL/MAP_SCALE_X, py=(row+0.5)*CELL/MAP_SCALE_Y
    const boatBuildable=!!options.waterBuildable && pointInPolygon(px,py,options.waterBuildable.boat)
    const rockStart=options.waterBuildable ? 1 : 0
    const rockEnd=options.waterBuildable ? (options.terrainPatches?.length ?? 0) : terrainPatches.length
    if (terrainPatches.some((patch,index) => index >= rockStart && index <= rockEnd && pointInPolygon(px,py,patch.points))) blockedCells.add(cell)
    if (options.waterBuildable) {
      const distance=distanceToRoutes(px,py,routes)
      if (!boatBuildable && (distance < options.waterBuildable.minDistance || distance > options.waterBuildable.maxDistance)) blockedCells.add(cell)
    }
    if (options.sandOnly) {
      const distance=distanceToRoutes(px,py,routes)/MAP_SCALE_X
      // Areia: faixa clara ao redor da trilha verde. Água e trilha não aceitam torres.
      if (distance < 8.2 || distance > 20.5) blockedCells.add(cell)
    }
  }
  for (const [left, top, width, height] of options.blocked ?? []) {
    for (let row=top;row<top+height;row++) for(let col=left;col<left+width;col++) {
      if(col>=0&&row>=0&&col<COLS&&row<ROWS) blockedCells.add(`${col},${row}`)
    }
  }
  for (const cell of pathCells) blockedCells.add(cell)
  for (const cell of farmCells) blockedCells.delete(cell)
  const buildableCells = new Set<string>()
  for(let row=0;row<ROWS;row++) for(let col=0;col<COLS;col++) {
    const cell=`${col},${row}`
    if(!blockedCells.has(cell)) buildableCells.add(cell)
  }
  const primary = routes[0]
  const scaledFarms = options.farms ? farmCells : new Set<string>()
  return { id, name, difficulty, description, hpMultiplier, speedMultiplier, colors,
    path: primary.path, pathLengths: primary.pathLengths, pathWidth: options.pathWidth ?? 42, sandOnly: !!options.sandOnly, pathCells, routes,
    farmCells: scaledFarms, blockedCells, buildableCells, terrainPatches, theme: options.theme ?? 'classic' }
}

const MAP_COLORS = {
  original: { background: '#070d1f', grid: 'rgba(56,189,248,0.07)', pathGlow: 'rgba(56,189,248,0.35)', path: '#0f1a33', pathDash: 'rgba(56,189,248,0.25)', farmFill: 'rgba(34,197,94,0.2)', farmStroke: 'rgba(74,222,128,0.9)', farmText: 'rgba(134,239,172,0.95)', preview: '#10243a', accent: '#38bdf8' },
  meadow: { background: '#102018', grid: 'rgba(134,239,172,0.09)', pathGlow: 'rgba(74,222,128,0.35)', path: '#273c2d', pathDash: 'rgba(190,242,100,0.38)', farmFill: 'rgba(163,230,53,0.18)', farmStroke: 'rgba(190,242,100,0.9)', farmText: '#d9f99d', preview: '#1c3828', accent: '#86efac' },
  frostline: { background: '#0b1c2d', grid: 'rgba(125,211,252,0.09)', pathGlow: 'rgba(56,189,248,0.4)', path: '#20394e', pathDash: 'rgba(186,230,253,0.42)', farmFill: 'rgba(103,232,249,0.16)', farmStroke: 'rgba(165,243,252,0.9)', farmText: '#cffafe', preview: '#15334b', accent: '#7dd3fc' },
  emberCrossing: { background: '#26130f', grid: 'rgba(251,146,60,0.09)', pathGlow: 'rgba(249,115,22,0.42)', path: '#48251c', pathDash: 'rgba(253,186,116,0.42)', farmFill: 'rgba(251,191,36,0.15)', farmStroke: 'rgba(253,186,116,0.9)', farmText: '#fed7aa', preview: '#492219', accent: '#fb923c' },
  quarrySpiral: { background: '#201b18', grid: 'rgba(214,211,209,0.09)', pathGlow: 'rgba(168,162,158,0.38)', path: '#39332e', pathDash: 'rgba(231,229,228,0.4)', farmFill: 'rgba(163,163,163,0.15)', farmStroke: 'rgba(212,212,212,0.85)', farmText: '#e5e5e5', preview: '#40352b', accent: '#d6d3d1' },
  neonGauntlet: { background: '#180e2b', grid: 'rgba(232,121,249,0.1)', pathGlow: 'rgba(217,70,239,0.42)', path: '#34204b', pathDash: 'rgba(196,181,253,0.45)', farmFill: 'rgba(192,132,252,0.16)', farmStroke: 'rgba(232,121,249,0.9)', farmText: '#f5d0fe', preview: '#321b4a', accent: '#e879f9' },
  voidLabyrinth: { background: '#0d1028', grid: 'rgba(167,139,250,0.11)', pathGlow: 'rgba(129,140,248,0.45)', path: '#25284a', pathDash: 'rgba(196,181,253,0.48)', farmFill: 'rgba(129,140,248,0.15)', farmStroke: 'rgba(165,180,252,0.9)', farmText: '#e0e7ff', preview: '#20254c', accent: '#a5b4fc' },
  infernoCircuit: { background: '#260d13', grid: 'rgba(251,113,133,0.1)', pathGlow: 'rgba(244,63,94,0.45)', path: '#4a1c28', pathDash: 'rgba(253,164,175,0.48)', farmFill: 'rgba(249,115,22,0.15)', farmStroke: 'rgba(251,146,60,0.9)', farmText: '#fed7aa', preview: '#4a1821', accent: '#fb7185' },
} satisfies Record<MapId, GameMap['colors']>


const ARENA_COLORS: Record<MapId, GameMap['colors']> = {
  original: MAP_COLORS.original,
  meadow: { background:'#173d2b',grid:'rgba(143,205,151,0.10)',pathGlow:'#503d2c',path:'#d9bd91',pathDash:'#fff1d1',farmFill:'#205c3b',farmStroke:'#53d77a',farmText:'#e5ffe9',preview:'#173d2b',accent:'#55c979' },
  frostline: { background:'#174a36',grid:'rgba(120,220,170,0.10)',pathGlow:'#51432e',path:'#d8bd98',pathDash:'#fff0d5',farmFill:'#1b6043',farmStroke:'#63d9a1',farmText:'#e8fff4',preview:'#174a36',accent:'#65d6a0' },
  emberCrossing: { background:'#555b5d',grid:'rgba(230,235,232,0.10)',pathGlow:'#765039',path:'#e8c99e',pathDash:'#fff0d2',farmFill:'#626a6c',farmStroke:'#b4c2c4',farmText:'#f1f5f5',preview:'#555b5d',accent:'#d6a96d' },
  quarrySpiral: { background:'#153d32',grid:'rgba(135,210,174,0.10)',pathGlow:'#544431',path:'#ddc49d',pathDash:'#fff0d7',farmFill:'#1d5942',farmStroke:'#66d69a',farmText:'#e8fff1',preview:'#153d32',accent:'#62cf91' },
  neonGauntlet: { background:'#e96b19',grid:'rgba(255,226,155,0.13)',pathGlow:'#f7a42a',path:'#612d22',pathDash:'#f08a32',farmFill:'#8e3d20',farmStroke:'#ffbd56',farmText:'#fff1d0',preview:'#e96b19',accent:'#ffb13e' },
  voidLabyrinth: { background:'#d9b45b',grid:'rgba(255,248,218,0.16)',pathGlow:'#68432f',path:'#895036',pathDash:'#d99a61',farmFill:'#b28b4b',farmStroke:'#f0d28d',farmText:'#fff4d7',preview:'#d9b45b',accent:'#a56b3d' },
  infernoCircuit: { background:'#078fa6',grid:'rgba(181,244,247,0.15)',pathGlow:'#d9c58a',path:'#e8d89f',pathDash:'#fff4d1',farmFill:'#086d7b',farmStroke:'#7edfe4',farmText:'#e9ffff',preview:'#078fa6',accent:'#b5e6a1' },
}
export const MAPS: Record<MapId, GameMap> = {
  original: defineMap('original','Circuito Original','Iniciante','O percurso clássico original, preservado.',1,1,ARENA_COLORS.original,WAYPOINT_CELLS,{
    farms:['0,0','1,0','0,27','1,27','30,0','31,0','30,27','31,27'],theme:'classic',pathWidth:22
  }),

  // Referência 1: uma estrada em U alongado, com duas pernas paralelas
  // e um retorno circular largo no canto inferior esquerdo.
  meadow: defineMap('meadow','Retorno Paralelo','Iniciante','Uma estrada em U com retorno circular e duas retas diagonais paralelas.',1.04,1.02,{
      background:'#102d1b',grid:'rgba(146,214,140,0.13)',pathGlow:'rgba(95,255,126,0.5)',path:'#d9c3a4',pathDash:'#fff5df',
      farmFill:'rgba(30,90,48,0.35)',farmStroke:'#4ade80',farmText:'#dcfce7',preview:'#102d1b',accent:'#35e878'
    },
    [[212,-8],[212,35],[210,48],[202,56],[188,59],[171,61],[155,70],[139,84],[120,100],[101,116],[82,132],[64,148],[49,163],[40,176],[38,187],[42,198],[52,204],[63,202],[70,194],[71,183],[66,171],[57,159],[69,146],[85,130],[103,114],[122,98],[141,82],[160,67],[179,57],[198,54],[216,53],[230,46],[239,35],[240,18], [240,-8]],
    {pixelCoordinates:true,theme:'grass',pathWidth:38,farms:['2,2','29,2','2,25','29,25'],
      terrainPatches:[
        {points:[[0,0],[53,0],[53,7],[48,12],[39,13],[39,21],[31,27],[18,27],[13,33],[0,33]],color:'#164d2b'},
        {points:[[0,201],[12,201],[17,207],[17,224],[0,224]],color:'#164d2b'},
        {points:[[147,224],[147,215],[157,209],[166,209],[166,201],[178,196],[190,196],[190,187],[204,183],[214,183],[214,174],[228,168],[256,168],[256,224]],color:'#164d2b'},
        {points:[[238,145],[246,145],[250,139],[256,139],[256,178],[248,178],[244,171],[238,171]],color:'#164d2b'},
        {points:[[100,54],[112,53],[119,47],[132,47],[135,39],[147,39],[150,32],[164,32],[166,25],[181,25],[184,33],[178,39],[166,40],[163,49],[150,50],[147,58],[133,59],[130,68],[117,69],[114,78],[101,79],[97,71],[97,63]],color:'#52666a'},
        {points:[[120,151],[134,151],[140,145],[151,145],[154,137],[169,137],[172,130],[185,130],[189,139],[185,147],[174,148],[171,157],[157,158],[154,166],[140,167],[137,175],[122,175],[118,167],[112,164]],color:'#52666a'},
        {points:[[30,84],[41,84],[44,91],[42,98],[31,99],[27,94]],color:'#52666a'},
        {points:[[17,96],[26,96],[28,103],[25,109],[16,109],[13,104]],color:'#52666a'},
        {points:[[90,80],[99,80],[101,86],[98,91],[89,91],[87,86]],color:'#52666a'},
        {points:[[102,88],[107,88],[109,92],[106,96],[101,95]],color:'#52666a'},
        {points:[[0,0],[53,0],[53,7],[48,12],[39,13],[39,21],[31,27],[18,27],[13,33],[0,33]],color:'#164d2b'}
      ]}),

  // Referência 2: serpentina contínua, com grandes curvas em S e sem cruzamentos.
  frostline: defineMap('frostline','Serpentina Longa','Intermediário','Uma estrada sinuosa atravessa um arquipélago sobre águas azuis.',1.16,1.06,{
      background:'#168fbd',grid:'rgba(210,247,255,0.16)',pathGlow:'rgba(83,255,203,0.5)',path:'#dfc5a4',pathDash:'#fff4df',
      farmFill:'rgba(22,101,76,0.3)',farmStroke:'#4adea0',farmText:'#dcfce7',preview:'#168fbd',accent:'#67e8f9'
    },
    [[52,-8],[52,25],[55,39],[66,48],[84,51],[110,51],[140,51],[174,51],[197,51],[207,58],[208,73],[202,86],[190,93],[174,95],[159,101],[151,113],[139,121],[121,125],[101,122],[80,122],[59,122],[43,126],[35,137],[34,151],[39,163],[53,171],[76,173],[102,173],[126,176],[149,173],[174,166],[194,168],[208,179],[216,194],[224,211],[229,232]],
    {pixelCoordinates:true,theme:'water',pathWidth:38,farms:[],
      terrainPatches:[
        // Margens de terra em segmentos, acompanhando o traçado sem formar uma faixa sólida.
        {points:[[28,0],[64,0],[65,20],[70,31],[88,37],[111,37],[129,34],[147,35],[165,35],[184,34],[196,38],[203,48],[201,58],[190,62],[177,61],[164,64],[153,75],[142,83],[124,87],[103,84],[83,83],[65,86],[47,82],[34,69]],color:'#176b49'},
        {points:[[19,109],[35,105],[52,107],[70,108],[90,108],[108,112],[126,112],[143,106],[157,96],[169,89],[188,88],[198,96],[195,107],[181,112],[169,121],[157,136],[143,145],[125,148],[106,143],[88,142],[69,143],[50,138],[34,131]],color:'#176b49'},
        {points:[[20,147],[34,144],[49,150],[66,153],[85,154],[104,155],[124,157],[145,155],[164,149],[181,146],[198,151],[209,163],[215,178],[225,191],[241,200],[248,216],[224,224],[197,216],[178,207],[158,204],[138,209],[116,210],[96,205],[76,202],[57,194],[40,180],[25,166]],color:'#176b49'},
        {points:[[214,108],[230,101],[244,106],[250,116],[244,127],[224,130],[213,123]],color:'#176b49'},
        // Rochas, vegetação e pequenas pedras nas margens e na água.
        {points:[[0,0],[18,0],[18,18],[10,24],[0,24]],color:'#547b80'},
        {points:[[237,0],[256,0],[256,25],[246,22],[239,14]],color:'#547b80'},
        {points:[[0,190],[16,190],[22,201],[34,205],[37,224],[0,224]],color:'#547b80'},
        {points:[[235,199],[256,193],[256,224],[239,224],[232,214]],color:'#547b80'},
        {points:[[10,65],[25,63],[29,71],[24,79],[12,80],[8,74]],color:'#547b80'},
        {points:[[105,82],[117,81],[121,87],[116,93],[104,93],[100,88]],color:'#547b80'},
        {points:[[139,6],[146,6],[148,11],[144,15],[138,12]],color:'#547b80'},
        {points:[[242,15],[249,15],[251,20],[247,24],[241,21]],color:'#547b80'},
        {points:[[231,153],[238,153],[240,158],[236,162],[230,159]],color:'#547b80'},
        {points:[[142,201],[150,201],[152,206],[147,210],[141,207]],color:'#547b80'},
        {points:[[85,207],[92,207],[94,212],[90,216],[84,213]],color:'#547b80'},
        // Barco: casco construível, mastro e vela.
        {points:[[214,111],[229,105],[244,111],[249,120],[243,128],[224,130],[213,124]],color:'#176747'},
        {points:[[236.5,78],[238.5,78],[238.5,122],[236.5,122]],color:'#d1fae5'},
        {points:[[236,81],[222,91],[236,96]],color:'#f8fafc'}
      ]}),

  // Referência 3: espiral ampla, afunilando até o centro e saindo pela parte inferior.
  emberCrossing: defineMap('emberCrossing','Espiral Central','Intermediário','Uma rota única percorre um grande anel externo, espirala para o centro e termina na saída inferior.',1.2,1.08,{
      background:'#073b28',grid:'rgba(94,190,129,0.13)',pathGlow:'rgba(74,222,128,0.48)',path:'#dfc5a4',pathDash:'#fff4df',
      farmFill:'rgba(22,101,52,0.3)',farmStroke:'#4ade80',farmText:'#dcfce7',preview:'#073b28',accent:'#4ade80'
    },
    [[56,-8],[56,22],[56,50],[60,82],[70,108],[88,128],[112,142],[137,148],[160,141],[178,123],[187,99],[188,73],[180,48],[163,29],[141,18],[116,15],[94,20],[78,33],[69,51],[70,71],[80,90],[96,103],[116,110],[137,109],[153,99],[162,83],[163,66],[155,51],[141,42],[126,40],[114,46],[110,57],[115,68],[127,76],[128,88],[128,112],[128,145],[128,180],[128,232]],
    {pixelCoordinates:true,theme:'grass',pathWidth:34,farms:['2,2','29,2','2,25','29,25'],
      terrainPatches:[
        {points:[[0,0],[28,0],[28,8],[23,12],[23,24],[16,28],[12,38],[0,39]],color:'#526d70'},
        {points:[[230,0],[256,0],[256,38],[244,38],[238,31],[238,12],[232,10]],color:'#526d70'},
        {points:[[0,88],[10,88],[13,96],[13,108],[7,112],[0,112]],color:'#526d70'},
        {points:[[0,171],[20,171],[24,181],[38,184],[40,196],[54,200],[58,214],[75,218],[76,224],[0,224]],color:'#526d70'},
        {points:[[205,224],[207,213],[220,210],[224,198],[239,195],[243,181],[256,177],[256,224]],color:'#526d70'},
        {points:[[237,111],[256,111],[256,123],[248,127],[237,125]],color:'#164d2b'},
        {points:[[160,5],[181,5],[188,10],[187,17],[169,17],[164,12]],color:'#164d2b'},
        {points:[[64,185],[79,184],[84,190],[82,198],[68,199],[63,194]],color:'#164d2b'},
        {points:[[188,157],[204,157],[210,164],[208,171],[193,173],[186,166]],color:'#164d2b'},
        {points:[[108,4],[116,4],[119,9],[115,13],[108,11]],color:'#526d70'},
        {points:[[122,5],[128,5],[130,10],[126,13],[121,10]],color:'#526d70'},
        {points:[[220,9],[228,9],[230,14],[226,18],[219,15]],color:'#526d70'},
        {points:[[18,37],[25,37],[27,42],[23,47],[17,44]],color:'#526d70'},
        {points:[[237,85],[244,85],[246,90],[242,94],[236,91]],color:'#526d70'},
        {points:[[61,130],[67,130],[69,135],[65,139],[60,136]],color:'#526d70'},
        {points:[[45,150],[52,150],[54,155],[50,159],[44,156]],color:'#526d70'},
        {points:[[170,184],[178,184],[180,189],[176,193],[169,190]],color:'#526d70'},
        {points:[[160,194],[166,194],[168,199],[164,203],[159,200]],color:'#526d70'}
      ]}),

  // Referência 4: percurso em oito, com duas alças largas e um cruzamento central.
  quarrySpiral: defineMap('quarrySpiral','Oito Entrelaçado','Avançado','Uma rota em formato de oito cruza duas alças amplas entre clareiras e lagoas.',1.3,1.1,{
      background:'#062d22',grid:'rgba(109,190,139,0.13)',pathGlow:'rgba(74,222,128,0.42)',path:'#dfc5a4',pathDash:'#fff4df',
      farmFill:'rgba(20,83,48,0.2)',farmStroke:'#4ade80',farmText:'#86efac',preview:'#062d22',accent:'#4ade80'
    },
    [[-8,22],[18,22],[38,15],[60,12],[82,16],[101,29],[115,46],
      [119,63],[112,79],[97,91],[79,96],[61,91],[48,78],[43,61],[49,45],[62,33],[79,27],[97,31],[111,42],[119,57],
      [137,64],[155,73],[171,88],[181,107],[184,128],[177,147],[161,160],[141,164],[122,157],[108,142],[102,123],[106,104],[119,89],[137,81],[156,83],[171,95],[179,111],[180,129],[187,150],[200,171],[222,194],[264,224]],
    {pixelCoordinates:true,theme:'grass',pathWidth:37,farms:['25,2','29,2','2,21','6,21'],
      terrainPatches:[
        // Lagoa superior direita e enseada inferior esquerda.
        {points:[[180,0],[256,0],[256,80],[244,80],[235,75],[229,64],[220,58],[205,57],[194,51],[188,40],[185,25]],color:'#087b86'},
        {points:[[0,122],[18,122],[25,130],[25,143],[36,150],[49,151],[61,159],[69,173],[75,187],[88,194],[99,205],[100,224],[0,224]],color:'#087b86'},
        // Clareiras verdes e pequenas elevações junto às bordas.
        {points:[[0,0],[20,0],[20,9],[14,15],[0,17]],color:'#124d32'},
        {points:[[0,207],[18,207],[25,215],[25,224],[0,224]],color:'#124d32'},
        {points:[[226,190],[256,190],[256,224],[241,224],[234,214]],color:'#124d32'},
        // Pedras decorativas distribuídas fora da estrada.
        {points:[[137,6],[151,5],[157,12],[154,20],[140,21],[134,14]],color:'#526f73'},
        {points:[[161,20],[168,20],[170,25],[166,29],[160,26]],color:'#526f73'},
        {points:[[139,164],[151,161],[159,166],[157,175],[146,180],[137,174]],color:'#526f73'},
        {points:[[17,49],[29,47],[34,53],[31,62],[19,64],[13,58]],color:'#526f73'},
        {points:[[33,67],[39,67],[41,72],[37,76],[32,73]],color:'#526f73'},
        {points:[[208,105],[220,102],[226,108],[223,116],[211,118],[205,112]],color:'#526f73'},
        {points:[[243,153],[250,153],[252,158],[248,162],[242,159]],color:'#526f73'},
        {points:[[99,207],[109,205],[114,211],[111,218],[101,219],[96,213]],color:'#526f73'},
        {points:[[157,201],[166,200],[170,206],[166,212],[156,211],[152,206]],color:'#526f73'},
        // Arbustos em pequenos grupos geométricos.
        {points:[[104,8],[108,8],[108,12],[112,12],[112,16],[108,16],[108,20],[104,20],[104,16],[100,16],[100,12],[104,12]],color:'#36a85c'},
        {points:[[38,42],[42,42],[42,46],[46,46],[46,50],[42,50],[42,54],[38,54],[38,50],[34,50],[34,46],[38,46]],color:'#36a85c'},
        {points:[[181,45],[185,45],[185,49],[189,49],[189,53],[185,53],[185,57],[181,57],[181,53],[177,53],[177,49],[181,49]],color:'#36a85c'},
        {points:[[228,110],[232,110],[232,114],[236,114],[236,118],[232,118],[232,122],[228,122],[228,118],[224,118],[224,114],[228,114]],color:'#36a85c'},
        {points:[[85,142],[89,142],[89,146],[93,146],[93,150],[89,150],[89,154],[85,154],[85,150],[81,150],[81,146],[85,146]],color:'#36a85c'},
        {points:[[111,186],[115,186],[115,190],[119,190],[119,194],[115,194],[115,198],[111,198],[111,194],[107,194],[107,190],[111,190]],color:'#36a85c'}
      ]}),

  // Referência 5: três faixas independentes em zigue-zague; inimigos alternam
  // entre as rotas em sequência, sem grupos simultâneos por trilha.
  neonGauntlet: defineMap('neonGauntlet','Zigue-zague Triplo','Expert','Três pistas paralelas em zigue-zague exigem cobertura distribuída.',1.42,1.14,ARENA_COLORS.neonGauntlet,
    [[-8,48],[42,48],[76,29],[116,29],[150,48],[190,29],[230,48],[264,48]],
    {pixelCoordinates:true,extraRoutes:[
      [[-8,112],[42,112],[76,93],[116,93],[150,112],[190,93],[230,112],[264,112]],
      [[-8,176],[42,176],[76,157],[116,157],[150,176],[190,157],[230,176],[264,176]]
    ],theme:'lava',pathWidth:31,farms:['2,2','29,2','2,25','29,25'],
      terrainPatches:[
        {points:[[78,77],[99,75],[106,91],[96,105],[78,100],[71,88]],color:'#a13f26'},
        {points:[[155,128],[177,126],[184,143],[172,158],[153,153],[147,139]],color:'#a13f26'},
        {points:[[31,181],[53,178],[60,194],[48,208],[30,204],[24,191]],color:'#a13f26'},
        {points:[[0,0],[24,0],[31,15],[17,25],[0,18]],color:'#78311d'},
        {points:[[230,0],[256,0],[256,20],[239,27],[226,17]],color:'#78311d'},
        {points:[[0,204],[35,198],[47,212],[44,224],[0,224]],color:'#78311d'},
        {points:[[215,204],[256,197],[256,224],[222,224]],color:'#78311d'}
      ]}),

  // Alternativa adicional: um circuito de curvas largas com retorno lateral.
  voidLabyrinth: defineMap('voidLabyrinth','Trilha do Deserto','Avançado','Uma pista de curvas fechadas contorna formações rochosas no deserto.',1.34,1.12,ARENA_COLORS.voidLabyrinth,
    [[-8,55],[18,55],[39,48],[57,35],[78,31],[99,38],[112,54],[116,75],[108,95],[91,108],[70,112],[51,105],[39,90],[39,72],[50,57],[68,49],[89,52],[108,65],[128,83],[148,101],[168,116],[189,123],[211,119],[230,107],[244,90],[250,70],[244,51],[230,39],[210,35],[190,40],[174,53],[164,72],[164,93],[175,111],[193,127],[214,145],[236,164],[264,178]],
    {pixelCoordinates:true,theme:'desert',pathWidth:35,farms:['2,2','29,2','2,25','29,25'],
      terrainPatches:[
        {points:[[81,75],[101,70],[113,85],[104,101],[84,100],[75,87]],color:'#b18a55'},
        {points:[[154,128],[177,126],[187,142],[175,157],[154,151],[147,138]],color:'#b18a55'},
        {points:[[34,157],[56,152],[66,169],[54,185],[35,181],[27,168]],color:'#b18a55'},
        {points:[[0,0],[36,0],[35,21],[18,28],[0,21]],color:'#9a6a36'},
        {points:[[220,0],[256,0],[256,26],[239,31],[222,19]],color:'#9a6a36'},
        {points:[[0,194],[28,188],[43,204],[42,224],[0,224]],color:'#9a6a36'}
      ]}),

  // Alternativa adicional: duas rotas sinuosas independentes com alternância 1:1.
  infernoCircuit: defineMap('infernoCircuit','Duas Correntes','Expert','Duas rotas sinuosas se cruzam pelo mapa, cada uma com entrada e saída próprias.',1.52,1.16,{
      background:'#062f24',grid:'rgba(103,190,139,0.13)',pathGlow:'rgba(74,222,128,0.46)',path:'#dfc5a4',pathDash:'#fff4df',
      farmFill:'rgba(20,83,48,0.2)',farmStroke:'#4ade80',farmText:'#86efac',preview:'#062f24',accent:'#4ade80'
    },
    [[-8,160],[14,160],[28,151],[42,133],[57,127],[72,132],[86,128],[99,109],[111,88],[126,81],[140,86],[153,77],[160,58],[160,34],[160,-8]],
    {pixelCoordinates:true,extraRoutes:[
      [[264,85],[244,85],[229,91],[216,105],[203,117],[188,119],[174,111],[164,96],[158,80],[151,65],[139,55],[124,55],[111,64],[102,79],[91,94],[78,109],[65,126],[59,145],[61,163],[70,177],[83,183],[99,180],[113,169],[128,157],[142,150],[155,153],[169,164],[185,176],[205,190],[225,207],[244,224]]
    ],theme:'grass',pathWidth:34,farms:['25,2','29,2','2,21','6,21'],
      terrainPatches:[
        // Vegetação de borda e pequenas formações rochosas, sem bloquear as rotas.
        {points:[[0,0],[30,0],[30,10],[23,17],[12,18],[0,12]],color:'#124d32'},
        {points:[[0,197],[20,197],[28,207],[28,224],[0,224]],color:'#124d32'},
        {points:[[222,0],[256,0],[256,23],[244,28],[229,19]],color:'#124d32'},
        {points:[[220,195],[256,190],[256,224],[230,224]],color:'#124d32'},
        {points:[[96,14],[109,10],[117,16],[115,25],[101,29],[93,22]],color:'#526f73'},
        {points:[[136,6],[145,6],[149,12],[144,17],[135,14]],color:'#526f73'},
        {points:[[15,48],[27,45],[33,52],[29,61],[17,63],[11,56]],color:'#526f73'},
        {points:[[32,67],[38,67],[40,72],[36,76],[31,73]],color:'#526f73'},
        {points:[[205,128],[218,124],[225,131],[221,140],[208,143],[201,136]],color:'#526f73'},
        {points:[[242,151],[250,151],[252,157],[247,161],[241,158]],color:'#526f73'},
        {points:[[99,190],[110,187],[116,194],[112,202],[100,203],[94,197]],color:'#526f73'},
        {points:[[158,199],[168,197],[174,204],[169,212],[158,211],[153,205]],color:'#526f73'},
        {points:[[42,17],[46,17],[46,21],[50,21],[50,25],[46,25],[46,29],[42,29],[42,25],[38,25],[38,21],[42,21]],color:'#36a85c'},
        {points:[[182,38],[186,38],[186,42],[190,42],[190,46],[186,46],[186,50],[182,50],[182,46],[178,46],[178,42],[182,42]],color:'#36a85c'},
        {points:[[16,111],[20,111],[20,115],[24,115],[24,119],[20,119],[20,123],[16,123],[16,119],[12,119],[12,115],[16,115]],color:'#36a85c'},
        {points:[[185,170],[189,170],[189,174],[193,174],[193,178],[189,178],[189,182],[185,182],[185,178],[181,178],[181,174],[185,174]],color:'#36a85c'},
        {points:[[110,204],[114,204],[114,208],[118,208],[118,212],[114,212],[114,216],[110,216],[110,212],[106,212],[106,208],[110,208]],color:'#36a85c'}
      ]}),
}

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
  9: [{type:'runner',count:10,spacing:.3},{type:'tank',count:3,spacing:.9},{type:'grunt',count:8,spacing:.48},{type:'ironBug',count:1,spacing:0}],
  10: [{type:'grunt',count:10,spacing:.45},{type:'jumper',count:5,spacing:.75},{type:'vessel',count:2,spacing:1.2}],
  11: [{type:'grunt',count:10,spacing:.45},{type:'healer',count:1,spacing:0},{type:'grunt',count:10,spacing:.45},{type:'healer',count:1,spacing:0}],
  12: [{type:'runner',count:8,spacing:.28},{type:'healer',count:1,spacing:0},{type:'runner',count:8,spacing:.28},{type:'grunt',count:8,spacing:.45},{type:'flyBug',count:1,spacing:0}],
  13: [{type:'tank',count:3,spacing:.85},{type:'jumper',count:5,spacing:.7},{type:'tank',count:3,spacing:.85}],
  14: [{type:'vessel',count:2,spacing:1.1},{type:'grunt',count:10,spacing:.42},{type:'healer',count:2,spacing:.85},{type:'runner',count:6,spacing:.3},{type:'rubberBug',count:1,spacing:0}],
  15: [{type:'runner',count:10,spacing:.26},{type:'jumper',count:5,spacing:.65},{type:'runner',count:10,spacing:.26}],
  16: [{type:'grunt',count:12,spacing:.4},{type:'healer',count:1,spacing:0},{type:'tank',count:4,spacing:.75},{type:'grunt',count:10,spacing:.4},{type:'healer',count:2,spacing:.75}],
  17: [{type:'jumper',count:6,spacing:.62},{type:'tank',count:4,spacing:.72},{type:'jumper',count:6,spacing:.62},{type:'runner',count:8,spacing:.26},{type:'heatBug',count:1,spacing:0}],
  18: [{type:'grunt',count:10,spacing:.42},{type:'healer',count:1,spacing:0},{type:'bulb',count:1,spacing:0},{type:'grunt',count:10,spacing:.42},{type:'jumper',count:5,spacing:.7},{type:'spitter',count:1,spacing:0},{type:'runner',count:10,spacing:.28}],
  19: [{type:'runner',count:12,spacing:.24},{type:'tank',count:4,spacing:.68},{type:'healer',count:2,spacing:.75},{type:'runner',count:10,spacing:.24}],
  20: [{type:'jumper',count:8,spacing:.58},{type:'healer',count:2,spacing:.7},{type:'vessel',count:3,spacing:.9},{type:'runner',count:12,spacing:.24},{type:'jumper',count:5,spacing:.58}],
  21: [{type:'grunt',count:12,spacing:.36},{type:'healer',count:2,spacing:.65},{type:'tank',count:4,spacing:.65},{type:'grunt',count:12,spacing:.36},{type:'runner',count:10,spacing:.24},{type:'ghostBug',count:1,spacing:0}],
  22: [{type:'runner',count:14,spacing:.22},{type:'jumper',count:7,spacing:.52},{type:'runner',count:14,spacing:.22},{type:'healer',count:2,spacing:.65}],
  23: [{type:'tank',count:5,spacing:.58},{type:'bulb',count:1,spacing:0},{type:'shadowBug',count:4,spacing:.42},{type:'healer',count:2,spacing:.65},{type:'grunt',count:14,spacing:.34},{type:'spitter',count:1,spacing:0},{type:'dirtBug',count:1,spacing:0}],
  24: [{type:'vessel',count:4,spacing:.72},{type:'jumper',count:8,spacing:.48},{type:'bulb',count:1,spacing:0},{type:'vessel',count:4,spacing:.72},{type:'healer',count:3,spacing:.6},{type:'runner',count:12,spacing:.22}],
  26: [{type:'grunt',count:16,spacing:.32},{type:'splitter',count:3,spacing:.8},{type:'runner',count:12,spacing:.2},{type:'healer',count:2,spacing:.55},{type:'tank',count:5,spacing:.55},{type:'flyBug',count:2,spacing:.65}],
  27: [{type:'runner',count:18,spacing:.18},{type:'shadowBug',count:5,spacing:.34},{type:'grunt',count:16,spacing:.3},{type:'jumper',count:8,spacing:.45},{type:'ironBug',count:2,spacing:.8}],
  28: [{type:'vessel',count:5,spacing:.62},{type:'healer',count:3,spacing:.5},{type:'jumper',count:10,spacing:.42},{type:'splitter',count:4,spacing:.72},{type:'runner',count:12,spacing:.2},{type:'rubberBug',count:2,spacing:.7}],
  29: [{type:'tank',count:7,spacing:.5},{type:'bulb',count:2,spacing:.65},{type:'vessel',count:5,spacing:.55},{type:'spitter',count:2,spacing:.7},{type:'healer',count:3,spacing:.5},{type:'grunt',count:18,spacing:.3},{type:'heatBug',count:2,spacing:.8}],
  30: [{type:'swarmBug',count:35,spacing:.07},{type:'tank',count:5,spacing:.5},{type:'swarmBug',count:35,spacing:.07},{type:'splitter',count:4,spacing:.7},{type:'grunt',count:18,spacing:.28},{type:'ghostBug',count:2,spacing:.7}],
  31: [{type:'runner',count:20,spacing:.17},{type:'shadowBug',count:6,spacing:.32},{type:'grunt',count:18,spacing:.28},{type:'bulb',count:2,spacing:.6},{type:'swarmBug',count:45,spacing:.065},{type:'dirtBug',count:2,spacing:.8}],
  32: [{type:'splitter',count:5,spacing:.65},{type:'swarmBug',count:45,spacing:.065},{type:'healer',count:3,spacing:.48},{type:'tank',count:7,spacing:.48},{type:'runner',count:18,spacing:.17},{type:'flyBug',count:3,spacing:.55},{type:'ironBug',count:2,spacing:.8}],
  33: [{type:'grunt',count:20,spacing:.26},{type:'spitter',count:3,spacing:.6},{type:'jumper',count:12,spacing:.4},{type:'shadowBug',count:7,spacing:.3},{type:'swarmBug',count:50,spacing:.06},{type:'rubberBug',count:3,spacing:.65}],
  34: [{type:'vessel',count:7,spacing:.52},{type:'healer',count:4,spacing:.45},{type:'bulb',count:2,spacing:.55},{type:'runner',count:20,spacing:.16},{type:'swarmBug',count:55,spacing:.06},{type:'heatBug',count:3,spacing:.7},{type:'ghostBug',count:2,spacing:.7}],
  35: [{type:'tank',count:9,spacing:.44},{type:'splitter',count:6,spacing:.6},{type:'grunt',count:22,spacing:.24},{type:'spitter',count:3,spacing:.55},{type:'swarmBug',count:60,spacing:.055},{type:'dirtBug',count:3,spacing:.7}],
  36: [{type:'jumper',count:14,spacing:.36},{type:'shadowBug',count:8,spacing:.28},{type:'bulb',count:3,spacing:.5},{type:'runner',count:22,spacing:.15},{type:'swarmBug',count:65,spacing:.055},{type:'flyBug',count:3,spacing:.5},{type:'rubberBug',count:2,spacing:.65}],
  37: [{type:'vessel',count:8,spacing:.48},{type:'healer',count:5,spacing:.42},{type:'splitter',count:7,spacing:.55},{type:'grunt',count:24,spacing:.22},{type:'swarmBug',count:70,spacing:.05},{type:'ironBug',count:3,spacing:.7},{type:'heatBug',count:2,spacing:.65}],
  38: [{type:'runner',count:24,spacing:.14},{type:'spitter',count:4,spacing:.5},{type:'tank',count:9,spacing:.42},{type:'shadowBug',count:9,spacing:.26},{type:'swarmBug',count:75,spacing:.05},{type:'ghostBug',count:3,spacing:.65},{type:'dirtBug',count:2,spacing:.7}],
  39: [{type:'splitter',count:8,spacing:.52},{type:'bulb',count:3,spacing:.48},{type:'vessel',count:9,spacing:.45},{type:'healer',count:5,spacing:.4},{type:'jumper',count:14,spacing:.34},{type:'swarmBug',count:80,spacing:.048},{type:'flyBug',count:4,spacing:.45},{type:'ironBug',count:3,spacing:.6}],
  40: [{type:'tank',count:10,spacing:.4},{type:'bulb',count:3,spacing:.45},{type:'vessel',count:8,spacing:.42},{type:'healer',count:5,spacing:.38},{type:'spitter',count:4,spacing:.48},{type:'splitter',count:8,spacing:.5},{type:'swarmBug',count:85,spacing:.045},{type:'rubberBug',count:4,spacing:.55},{type:'heatBug',count:3,spacing:.6}],
  41: [{type:'runner',count:28,spacing:.13},{type:'shadowBug',count:10,spacing:.24},{type:'jumper',count:16,spacing:.32},{type:'swarmBug',count:90,spacing:.045},{type:'ghostBug',count:4,spacing:.5},{type:'dirtBug',count:3,spacing:.6}],
  42: [{type:'splitter',count:9,spacing:.48},{type:'healer',count:6,spacing:.36},{type:'tank',count:11,spacing:.38},{type:'bulb',count:4,spacing:.42},{type:'swarmBug',count:95,spacing:.043},{type:'flyBug',count:4,spacing:.42},{type:'rubberBug',count:3,spacing:.55}],
  43: [{type:'vessel',count:10,spacing:.4},{type:'spitter',count:5,spacing:.44},{type:'shadowBug',count:11,spacing:.22},{type:'runner',count:26,spacing:.13},{type:'swarmBug',count:100,spacing:.042},{type:'ironBug',count:4,spacing:.55},{type:'heatBug',count:3,spacing:.55}],
  44: [{type:'jumper',count:18,spacing:.3},{type:'bulb',count:4,spacing:.4},{type:'splitter',count:10,spacing:.45},{type:'healer',count:6,spacing:.34},{type:'swarmBug',count:105,spacing:.04},{type:'ghostBug',count:4,spacing:.48},{type:'dirtBug',count:3,spacing:.55}],
  45: [{type:'tank',count:12,spacing:.36},{type:'vessel',count:10,spacing:.38},{type:'healer',count:6,spacing:.32},{type:'spitter',count:5,spacing:.4},{type:'grunt',count:26,spacing:.2},{type:'swarmBug',count:110,spacing:.04},{type:'flyBug',count:5,spacing:.38},{type:'ironBug',count:4,spacing:.5}],
  46: [{type:'runner',count:30,spacing:.12},{type:'shadowBug',count:12,spacing:.2},{type:'bulb',count:4,spacing:.38},{type:'jumper',count:18,spacing:.28},{type:'swarmBug',count:115,spacing:.038},{type:'rubberBug',count:5,spacing:.45},{type:'heatBug',count:4,spacing:.5}],
  47: [{type:'splitter',count:11,spacing:.42},{type:'vessel',count:11,spacing:.36},{type:'healer',count:7,spacing:.3},{type:'spitter',count:6,spacing:.38},{type:'swarmBug',count:120,spacing:.037},{type:'ghostBug',count:5,spacing:.42},{type:'dirtBug',count:4,spacing:.5}],
  48: [{type:'tank',count:14,spacing:.34},{type:'bulb',count:5,spacing:.36},{type:'shadowBug',count:13,spacing:.18},{type:'jumper',count:20,spacing:.26},{type:'splitter',count:11,spacing:.4},{type:'swarmBug',count:125,spacing:.035},{type:'flyBug',count:5,spacing:.36},{type:'rubberBug',count:4,spacing:.45},{type:'ironBug',count:4,spacing:.48}],
  49: [{type:'vessel',count:12,spacing:.34},{type:'healer',count:8,spacing:.28},{type:'bulb',count:5,spacing:.34},{type:'spitter',count:7,spacing:.34},{type:'shadowBug',count:14,spacing:.17},{type:'splitter',count:12,spacing:.38},{type:'runner',count:30,spacing:.11},{type:'swarmBug',count:135,spacing:.032},{type:'heatBug',count:5,spacing:.4},{type:'ghostBug',count:4,spacing:.42},{type:'dirtBug',count:4,spacing:.45}],
  51: [{type:'swarmer',count:7,spacing:.9},{type:'swarmBug',count:45,spacing:.055},{type:'runner',count:22,spacing:.16}],
  52: [{type:'buguns',count:7,spacing:1.1},{type:'tank',count:8,spacing:.42},{type:'swarmer',count:5,spacing:.75}],
  53: [{type:'starbug',count:5,spacing:1.4},{type:'swarmBug',count:65,spacing:.045},{type:'shadowBug',count:10,spacing:.23}],
  54: [{type:'bombug',count:4,spacing:1.8},{type:'runner',count:28,spacing:.13},{type:'healer',count:5,spacing:.38}],
  55: [{type:'swarmer',count:10,spacing:.62},{type:'buguns',count:7,spacing:.9},{type:'starbug',count:3,spacing:1.5},{type:'swarmBug',count:75,spacing:.04}],
  56: [{type:'bombug',count:5,spacing:1.5},{type:'splitter',count:12,spacing:.38},{type:'buguns',count:8,spacing:.8},{type:'heatBug',count:5,spacing:.48}],
  57: [{type:'starbug',count:7,spacing:1.1},{type:'swarmer',count:12,spacing:.55},{type:'shadowBug',count:14,spacing:.18},{type:'swarmBug',count:90,spacing:.035}],
  58: [{type:'bombug',count:6,spacing:1.3},{type:'buguns',count:9,spacing:.72},{type:'starbug',count:4,spacing:1.1},{type:'healer',count:8,spacing:.3}],
  59: [{type:'swarmer',count:18,spacing:.38},{type:'swarmBug',count:130,spacing:.028},{type:'buguns',count:8,spacing:.65},{type:'bombug',count:4,spacing:1.1}],
  60: [{type:'swarmer',count:10,spacing:.45},{type:'buguns',count:7,spacing:.7},{type:'starbug',count:4,spacing:1.1},{type:'bombug',count:4,spacing:1.2}],
  61: [{type:'buguns',count:10,spacing:.58},{type:'swarmer',count:14,spacing:.4},{type:'runner',count:38,spacing:.1}],
  62: [{type:'starbug',count:8,spacing:.9},{type:'bombug',count:5,spacing:1.1},{type:'swarmBug',count:140,spacing:.025}],
  63: [{type:'swarmer',count:18,spacing:.34},{type:'buguns',count:10,spacing:.52},{type:'starbug',count:5,spacing:.9},{type:'heatBug',count:7,spacing:.38}],
  64: [{type:'bombug',count:7,spacing:.95},{type:'splitter',count:16,spacing:.32},{type:'buguns',count:10,spacing:.48},{type:'healer',count:8,spacing:.28}],
  65: [{type:'swarmer',count:22,spacing:.3},{type:'starbug',count:7,spacing:.8},{type:'bombug',count:6,spacing:.85},{type:'swarmBug',count:170,spacing:.02}],
  66: [{type:'buguns',count:12,spacing:.42},{type:'starbug',count:8,spacing:.72},{type:'shadowBug',count:18,spacing:.15},{type:'heatBug',count:8,spacing:.32}],
  67: [{type:'bombug',count:9,spacing:.75},{type:'swarmer',count:24,spacing:.26},{type:'buguns',count:12,spacing:.4},{type:'ghostBug',count:8,spacing:.32}],
  68: [{type:'starbug',count:10,spacing:.6},{type:'bombug',count:8,spacing:.7},{type:'swarmBug',count:190,spacing:.018},{type:'dirtBug',count:8,spacing:.32}],
  69: [{type:'swarmer',count:28,spacing:.22},{type:'buguns',count:14,spacing:.34},{type:'starbug',count:8,spacing:.62},{type:'bombug',count:8,spacing:.62}],
  71: [{type:'bombug',count:10,spacing:.6},{type:'swarmer',count:28,spacing:.2},{type:'starbug',count:10,spacing:.52},{type:'swarmBug',count:210,spacing:.016}],
  72: [{type:'buguns',count:16,spacing:.28},{type:'bombug',count:10,spacing:.52},{type:'starbug',count:10,spacing:.48},{type:'heatBug',count:10,spacing:.28}],
  73: [{type:'swarmer',count:34,spacing:.17},{type:'starbug',count:12,spacing:.42},{type:'buguns',count:16,spacing:.26},{type:'ghostBug',count:10,spacing:.28}],
  74: [{type:'bombug',count:14,spacing:.38},{type:'swarmer',count:30,spacing:.16},{type:'starbug',count:12,spacing:.4},{type:'buguns',count:16,spacing:.24},{type:'swarmBug',count:230,spacing:.014}],
  75: [{type:'swarmer',count:14,spacing:.3},{type:'buguns',count:10,spacing:.45},{type:'starbug',count:8,spacing:.6},{type:'bombug',count:8,spacing:.75}],
}

export function buildWave(n: number): { type: EnemyType; delay: number }[] {
  if (n === 25) return [{ type: 'bugPrince', delay: 0 }]
  if (n === 50) return [{ type: 'bugQueen', delay: 0 }]
  if (n === 60 || n === 70 || n === 75) {
    const boss: EnemyType = n === 60 ? 'bugPrince' : n === 70 ? 'bugQueen' : 'bugKing'
    const escortGroups = WAVE_GROUPS[n] ?? []
    const queue: { type: EnemyType; delay: number }[] = [{ type: boss, delay: 0 }]
    escortGroups.forEach((group, groupIndex) => {
      for (let i = 0; i < group.count; i++) {
        queue.push({ type: group.type, delay: i === group.count - 1 && groupIndex < escortGroups.length - 1 ? (group.gapAfter ?? 0.35) : group.spacing })
      }
    })
    return queue
  }

  const groups = WAVE_GROUPS[Math.max(1, Math.min(75, Math.floor(n)))] ?? WAVE_GROUPS[1]
  const queue: { type: EnemyType; delay: number }[] = []
  groups.forEach((group, groupIndex) => {
    for (let i = 0; i < group.count; i++) {
      const isLastInGroup = i === group.count - 1
      const isLastGroup = groupIndex === groups.length - 1
      queue.push({ type: group.type, delay: isLastInGroup && !isLastGroup ? (group.gapAfter ?? 0.35) : group.spacing })
    }
  })
  return queue
}

export const hpScale = (_wave: number) => 1
