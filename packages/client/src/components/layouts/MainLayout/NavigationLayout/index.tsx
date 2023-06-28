import React from 'react'
import { clsx } from 'clsx'
import DialogWidget, { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import Settings from '@/components/base/Dialog/FormDialog/DialogContent/Settings'
import History from '@/components/base/Dialog/FormDialog/DialogContent/History'
import { Profile } from '@/components/base/Dialog/FormDialog/DialogContent/Profile'
import usePlayer from '@/hooks/usePlayer'
import { activeScreen_atom } from '@/global/states'
import { useSetAtom } from 'jotai/index'

type PropType = {
  children: React.ReactNode
  button: ButtonPropType
  isAvatar: boolean
}

const menus: Array<PropType> = [
  {
    children: <Profile />,
    isAvatar: true,
    button: {
      variant: 'default',
      title: 'Profile',
      imgSrc: '',
      imgAlt: '',
    },
  },
  {
    children: <>World Map</>,
    isAvatar: false,
    button: {
      variant: 'menu',
      title: 'World Map',
      imgSrc: '/src/assets/svg/icon_map.png',
      imgAlt: '',
      imgClassName: 'h-[59px] w-[59px]',
    },
  },
  {
    children: <History />,
    isAvatar: false,
    button: {
      className: '',
      variant: 'menu',
      title: 'History',
      imgSrc: '/src/assets/svg/history.png',
      imgAlt: 'History Icon',
      imgClassName: 'h-[59px] w-[59px]',
    },
  },
  {
    children: <Settings />,
    isAvatar: false,
    button: {
      className: '',
      variant: 'menu',
      title: 'Settings',
      imgSrc: '/src/assets/svg/settings.png',
      imgAlt: 'Settings Icon',
      imgClassName: 'h-[59px] w-[59px]',
    },
  },
]

export default function Header() {
  const { player } = usePlayer()
  const setActiveScreen = useSetAtom(activeScreen_atom)

  return (
    <div
      className={clsx([ 'flex items-center', 'fixed top-0 pb-[2px]', 'w-full h-20', 'bg-gold-to-dark', 'opacity-80' ])}>
      <div className={clsx([ 'w-full h-full', 'bg-header-gradient', 'flex justify-between', 'px-md' ])}>
        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center space-x-md' ])}>
          {
            menus.map((menu, key) => (
              <DialogWidget key={key} button={menu.button} isAvatar={menu.isAvatar} avatar={player.image?.value}>
                {menu.children}
              </DialogWidget>
            ))
          }
        </div>
         <div className={'flex gap-x-8 px-18'}>
           <button onClick={() => setActiveScreen('travelScreen')}>World Map</button>
           <button onClick={() => setActiveScreen('currentLocationScreen')}>Story</button>
         </div>
        {/*End of Menu Wrapper*/}
      </div>
    </div>
  )
}
