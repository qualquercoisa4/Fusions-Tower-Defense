'use client'

import { useCallback, useState } from 'react'
import { GameScreen } from '@/components/game/game-screen'
import { MainMenu, MapSelectScreen, TitleScreen, TowersCodex } from '@/components/game/menus'
import { DEFAULT_MAP_ID, type MapId } from '@/lib/game/data'

type Screen = 'title' | 'menu' | 'maps' | 'game' | 'towers'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('title')
  const [selectedMap, setSelectedMap] = useState<MapId>(DEFAULT_MAP_ID)
  const toMenu = useCallback(() => setScreen('menu'), [])

  if (screen === 'title') return <TitleScreen onStart={toMenu} />
  if (screen === 'maps') return <MapSelectScreen onBack={toMenu} onSelect={(mapId) => { setSelectedMap(mapId); setScreen('game') }} />
  if (screen === 'game') return <GameScreen mapId={selectedMap} onExit={() => setScreen('maps')} />
  if (screen === 'towers') return <TowersCodex onBack={toMenu} />
  return <MainMenu onPlay={() => setScreen('maps')} onTowers={() => setScreen('towers')} />
}
