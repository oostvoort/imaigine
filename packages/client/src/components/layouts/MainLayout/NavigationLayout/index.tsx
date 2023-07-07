import React from 'react'
import { clsx } from 'clsx'
import DialogWidget from '@/components/base/Dialog/FormDialog/DialogWidget'
import Settings from '@/components/base/Dialog/FormDialog/DialogContent/Settings'
import History from '@/components/base/Dialog/FormDialog/DialogContent/History'
import { Profile } from '@/components/base/Dialog/FormDialog/DialogContent/Profile'
import usePlayer from '@/hooks/usePlayer'
import { activeScreen_atom, SCREENS } from '@/states/global'
import { Button } from '@/components/base/Button'
import { useAtom } from 'jotai'
import useGameState from '@/hooks/useGameState'
import useQueue from '@/hooks/minigame/useQueue'
import { Entity } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'

export default function Header() {
  const { player } = usePlayer()
  const { setLocationEntity, setQueue, battleQueue } = useQueue()
  const { setPlayerId, setLocationId, setMatch } = useBattle()
  const [ , setActiveScreen ] = useAtom(activeScreen_atom)

  const activeScreen = useGameState()

  //Todo: change this to dynamic value
  React.useEffect(() => {
    setLocationEntity('0x0000000000000000000000000000000000000000000000000000000000000002' as Entity)
    setLocationId('0x0000000000000000000000000000000000000000000000000000000000000002' as Entity)
  }, [])

  const handleButtonClick = () => {
    setActiveScreen(activeScreen === SCREENS.CURRENT_LOCATION ? SCREENS.WORLD_MAP : SCREENS.CURRENT_LOCATION)
  }

  const handleButtonClickOnStartBattle = async () => {
      try {
        //initial queing
        if (battleQueue.playerId == undefined) {
          await setQueue.mutateAsync({
            playerId: player.id as Entity,
            locationId: '0x0000000000000000000000000000000000000000000000000000000000000002' as Entity,
          })
          setActiveScreen(SCREENS.MINIGAME)
        }

        //Set match to the player queing
        if (battleQueue.playerId?.playerId && battleQueue.playerId?.playerId != player.id) {
          setPlayerId(player.id)

          await setMatch.mutateAsync({
            opponentId: battleQueue.playerId?.playerId as Entity,
          })
          setActiveScreen(SCREENS.MINIGAME)
        }
      } catch (e) {
        console.error(e)
      }
  }

  return (
    <div
      className={clsx([ 'flex items-center', 'fixed top-0 pb-[2px]', 'w-full h-20', 'bg-gold-to-dark', 'z-20 opacity-80'])}>
      <div className={clsx([ 'w-full h-full', 'bg-header-gradient', 'flex justify-between items-center', 'px-md' ])}>
        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center space-x-md' ])}>
          <DialogWidget  button={{
            variant: 'default',
            title: 'Profile',
            imgSrc: '',
            imgAlt: 'Avatar',
          }} isAvatar={true} avatar={player.image && player.image.value}>
            <Profile />
          </DialogWidget>

          <Button variant={'menu'} onClick={handleButtonClick} size={'menu'}>
            <img
              src={'/src/assets/svg/icon_map.png'}
              alt="Map/Story"
              className={'h-[67px] w-[68px]'}
              draggable={false}
            />
            {activeScreen === SCREENS.CURRENT_LOCATION ? 'World Map' : 'Story Mode'}
          </Button>

          <DialogWidget  button={{
            variant: 'menu',
            size: 'menu',
            title: 'History',
            imgSrc: '/src/assets/svg/history.png',
            imgAlt: 'History',
            imgClassName: 'h-[59px] w-[71px]',
          }} isAvatar={false}>
            <History />
          </DialogWidget>

          <DialogWidget  button={{
            variant: 'menu',
            size: 'menu',
            title: 'Settings',
            imgSrc: '/src/assets/svg/settings.png',
            imgAlt: 'Settings',
            imgClassName: 'h-[59px] w-[59px]',
          }} isAvatar={false}>
            <Settings />
          </DialogWidget>


        </div>
        {/*End of Menu Wrapper*/}

        <Button
            variant={'outline'}
            onClick={handleButtonClickOnStartBattle}
        >
          START BATTLE
        </Button>
      </div>


    </div>
  )
}
