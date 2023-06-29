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

export default function Header() {
  const { player } = usePlayer()
  const [activeScreen, setActiveScreen] = useAtom(activeScreen_atom)

  const handleButtonClick = () => {
    setActiveScreen(activeScreen === SCREENS.CURRENT_LOCATION ? SCREENS.WORLD_MAP : SCREENS.CURRENT_LOCATION)
  }

  return (
    <div
      className={clsx([ 'flex items-center', 'fixed top-0 pb-[2px]', 'w-full h-20', 'bg-gold-to-dark', 'opacity-80' ])}>
      <div className={clsx([ 'w-full h-full', 'bg-header-gradient', 'flex justify-between', 'px-md' ])}>
        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center space-x-md' ])}>
          <DialogWidget  button={{
            variant: 'default',
            title: 'Profile',
            imgSrc: '',
            imgAlt: 'Avatar',
          }} isAvatar={true}>
            <Profile />
          </DialogWidget>

          <Button variant={'menu'} onClick={handleButtonClick} size={'menu'}>
            <img
              src="/src/assets/svg/icon_map.png"
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
      </div>
    </div>
  )
}
