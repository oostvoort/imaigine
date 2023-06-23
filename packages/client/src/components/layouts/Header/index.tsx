import React from 'react'
import { clsx } from 'clsx'
import DialogWidget, { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import Settings from '@/components/base/Dialog/FormDialog/DialogContent/Settings'
import History from '@/components/base/Dialog/FormDialog/DialogContent/History'
import { Profile } from '@/components/base/Dialog/FormDialog/DialogContent/Profile'

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
  return (
    <div
      className={clsx([ 'flex items-center', 'fixed top-0 pb-[2px]', 'w-full h-20', 'bg-gold-to-dark', 'opacity-80' ])}>
      <div className={clsx([ 'w-full h-full', 'bg-header-gradient', 'flex', 'px-md' ])}>
        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center space-x-md' ])}>
          {
            menus.map((menu, key) => (
              <DialogWidget key={key} button={menu.button} isAvatar={menu.isAvatar}>
                {menu.children}
              </DialogWidget>
            ))
          }
        </div>
        {/*End of Menu Wrapper*/}
      </div>
    </div>
  )
}
