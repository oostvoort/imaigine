import React from 'react'
import { clsx } from 'clsx'
import DialogWidget from '@/components/base/Dialog/FormDialog/DialogWidget'
import Settings from '@/components/base/Dialog/FormDialog/DialogContent/Settings'
import History from '@/components/base/Dialog/FormDialog/DialogContent/History'
import { Profile } from '@/components/base/Dialog/FormDialog/DialogContent/Profile'
import usePlayer from '@/hooks/usePlayer'
import { activeScreen_atom, isTravelling_atom, SCREENS } from '@/states/global'
import { Button } from '@/components/base/Button'
import { useAtomValue, useSetAtom } from 'jotai'
import useGameState from '@/hooks/useGameState'
import usePlay from '@/hooks/minigame/usePlay'
import { Entity } from '@latticexyz/recs'
import useLeave from '@/hooks/minigame/useLeave'
import Leaderboard from '@/components/base/Dialog/FormDialog/DialogContent/Leaderboard'

export default function Header() {
  const { player } = usePlayer()
  const activeScreen = useGameState()
  const { play } = usePlay(player.location?.value as Entity)
  const { leave } = useLeave(player.location?.value as Entity)

  const setActiveScreen = useSetAtom(activeScreen_atom)
  const isTravelling = useAtomValue(isTravelling_atom)


  const handleButtonClick = () => {
    setActiveScreen(activeScreen === SCREENS.CURRENT_LOCATION ? SCREENS.WORLD_MAP : SCREENS.CURRENT_LOCATION)
  }

  const handleStartBattle = () => {
    try {
      play.mutate()
      setActiveScreen(SCREENS.MINIGAME)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLeaveBattle = () => {
    try {
      leave.mutate()
      setActiveScreen(SCREENS.CURRENT_LOCATION)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      className={clsx([ 'flex items-center', 'fixed top-0 pb-[2px]', 'w-full h-20', 'bg-gold-to-dark', 'z-20 opacity-80' ])}>
      <div className={clsx([ 'w-full h-full', 'bg-header-gradient', 'flex justify-between items-center', 'pl-md' ])}>
        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center first:space-x-[0]  space-x-md' ])}>
          <DialogWidget button={{
            variant: 'default',
            title: 'Profile',
            imgSrc: '',
            imgAlt: 'Avatar',
          }} isAvatar={true} avatar={player.image && player.image.value}>
            <Profile />
          </DialogWidget>

          <div className={'pl-md h-[67px]'}>
            <Button variant={'menu'} onClick={handleButtonClick} size={'menu'} disabled={isTravelling}>
              <img
                src={'/assets/svg/icon_map.png'}
                alt="Map/Story"
                className={'h-[67px] w-[68px]'}
                draggable={false}
              />
              {activeScreen === SCREENS.CURRENT_LOCATION ? 'World Map' : 'Story Mode'}
            </Button>
          </div>

          <DialogWidget  button={{
            variant: 'menu',
            size: 'menu',
            title: 'History',
            imgSrc: '/assets/svg/history.png',
            imgAlt: 'History',
            imgClassName: 'h-[59px] w-[71px]',
          }} isAvatar={false}>
            <History />
          </DialogWidget>

          <DialogWidget  button={{
            variant: 'menu',
            size: 'menu',
            title: 'Leaderboard',
            imgSrc: '/assets/minigame/icon_leaderboard.png',
            imgAlt: 'Leaderboard',
            imgClassName: 'h-[59px] w-[71px]',
          }} isAvatar={false}>
            <Leaderboard />
          </DialogWidget>

          <DialogWidget  button={{
            variant: 'menu',
            size: 'menu',
            title: 'Settings',
            imgSrc: '/assets/svg/settings.png',
            imgAlt: 'Settings',
            imgClassName: 'h-[59px] w-[59px]',
          }} isAvatar={false}>
            <Settings />
          </DialogWidget>


        </div>
        {/*End of Menu Wrapper*/}

          <Button
            variant={'battle'} size={'battle'}
            onClick={ activeScreen == SCREENS.MINIGAME ? handleLeaveBattle : handleStartBattle }
            disabled={isTravelling}
          >
            <img src={`${activeScreen === SCREENS.MINIGAME ? '/assets/minigame/icon_whiteFlag.png' : '/assets/minigame/icon_redFlag.png' }`} alt={'Battle Flag Icon'} className={'object-top ml-[10px]'}/>

            {activeScreen === SCREENS.MINIGAME ? 'LEAVE BATTLE' : 'START BATTLE'}
          </Button>
      </div>
    </div>
  )
}
