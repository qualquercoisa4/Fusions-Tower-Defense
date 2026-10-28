'use client'

import { useCallback, useState } from 'react'
import { GameScreen } from '@/components/game/game-screen'
import { MainMenu, TitleScreen, TowersCodex } from '@/components/game/menus'

type Screen = 'title' | 'menu' | 'game' | 'towers'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('title')
  const toMenu = useCallback(() => setScreen('menu'), [])

  if (screen === 'title') return <TitleScreen onStart={toMenu} />
  if (screen === 'game') return <GameScreen onExit={toMenu} />
  if (screen === 'towers') return <TowersCodex onBack={toMenu} />
  return <MainMenu onPlay={() => setScreen('game')} onTowers={() => setScreen('towers')} />
}
