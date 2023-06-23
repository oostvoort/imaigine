import React from 'react'
import { clsx } from 'clsx'
import DialogWidget, { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import Settings from '@/components/base/Dialog/FormDialog/DialogContent/Settings'
import History from '@/components/base/Dialog/FormDialog/DialogContent/History'
import Location from '@/components/base/Dialog/FormDialog/DialogContent/Location'

type PropType = {
  children: React.ReactNode
  button: ButtonPropType
}

const menus: Array<PropType> = [
  {
    children: <History/>,
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
    children: <Settings/>,
    button: {
      className: '',
      variant: 'menu',
      title: 'Settings',
      imgSrc: '/src/assets/svg/settings.png',
      imgAlt: 'Settings Icon',
      imgClassName: 'h-[59px] w-[59px]',
    },
  },
  {
    children: <Location/>,
    button: {
      className: '',
      variant: 'menu',
      title: 'Location',
      imgSrc: '',
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
        {/*Avatar Wrapper*/}
        <div className={clsx('relative flex items-center', 'h-full w-[142px]')}>
          {/* Inner Frame */}
          <div
            className={clsx([ 'absolute -bottom-16 w-36 h-36', 'bg-avatar-inner-frame bg-cover bg-no-repeat', 'cursor-pointer' ])}>
            {/* Outer Frame */}
            <div className={clsx([ 'absolute z-50 w-36 h-36', 'bg-avatar-outer-frame bg-cover bg-no-repeat' ])}>
              {/* Avatar */}
              <img src={'src/assets/avatar/avatar1.jpg'} alt="Profile"
                   className={clsx([ 'absolute w-24', 'z-50 inset-6 rounded-full' ])} />
            </div>
            {/* Karma Gauge */}
            <div className={clsx([ 'absolute w-36 h-36', 'bg-avatar-karma-gauge bg-cover bg-no-repeat' ])} />
          </div>
          {/* End ofInner Frame */}

        </div>
        {/*End of Avatar Wrapper*/}

        {/*Menu Wrapper*/}
        <div className={clsx([ 'flex items-center space-x-2', 'ml-md' ])}>
          {
            menus.map((menu, key) => (
              <DialogWidget key={key} button={menu.button}>
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
