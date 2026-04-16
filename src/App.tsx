// src/App.tsx
import { useCallback } from 'react'
import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { HomeScreen } from './components/screens/HomeScreen'
import { GameScreen } from './components/screens/GameScreen'
import { RewardScreen } from './components/screens/RewardScreen'
import { ShopScreen } from './components/screens/ShopScreen'
import { ProfileScreen } from './components/screens/ProfileScreen'
import { ParticlesOverlay } from './components/ui/ParticlesOverlay'
import { MysteryChest } from './components/ui/MysteryChest'
import { LuckyWheel } from './components/ui/LuckyWheel'
import { LevelUpOverlay } from './components/ui/LevelUpOverlay'
import { COMBO_THRESHOLDS } from './data/config'

const SLIDE = {
  initial:  { opacity: 0, x: 60 },
  animate:  { opacity: 1, x: 0  },
  exit:     { opacity: 0, x: -60 },
  transition: { duration: 0.22, ease: 'easeInOut' } as Transition,
}

export default function App() {
  const { currentScreen, currentWorldId, navigateTo, wheelPending, chestPending, levelUpPending, collectWheelReward, collectChestReward, combo, resetCombo } = useGameStore()

  const handleRewardDone = useCallback(() => {
    navigateTo('game')
  }, [navigateTo])

  function handleWheelCollectGlobal(reward: any) {
    collectWheelReward(reward)
    if (combo >= COMBO_THRESHOLDS.mania) {
      resetCombo()
      navigateTo('home')
    }
  }

  return (
    <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', width: '100%' }}>
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" className="screen" {...SLIDE}>
            <HomeScreen />
          </motion.div>
        )}
        {currentScreen === 'game' && currentWorldId && (
          <motion.div key="game" className="screen" {...SLIDE}>
            <GameScreen />
          </motion.div>
        )}
        {currentScreen === 'reward' && (
          <motion.div key="reward" className="screen" {...SLIDE}>
            <RewardScreen onDone={handleRewardDone} />
          </motion.div>
        )}
        {currentScreen === 'shop' && (
          <motion.div key="shop" className="screen" {...SLIDE}>
            <ShopScreen />
          </motion.div>
        )}
        {currentScreen === 'profile' && (
          <motion.div key="profile" className="screen" {...SLIDE}>
            <ProfileScreen />
          </motion.div>
        )}
      </AnimatePresence>
      <ParticlesOverlay />
      <AnimatePresence>
        {wheelPending && <LuckyWheel onCollect={handleWheelCollectGlobal} />}
        {chestPending && <MysteryChest onCollect={collectChestReward} />}
        {levelUpPending && <LevelUpOverlay />}
      </AnimatePresence>
    </div>
  )
}
