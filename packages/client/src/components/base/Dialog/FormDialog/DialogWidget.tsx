import React from 'react'
import { clsx } from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogTrigger } from '@/components/base/Dialog'
import { Button, ButtonProps } from '@/components/base/Button'
import { IPFS_URL_PREFIX } from '@/global/constants'

type PropType = {
  children: React.ReactNode
  button: ButtonPropType
  isAvatar: boolean,
  avatar?: string,
}

export type ButtonPropType = {
  className?: string
  variant: ButtonProps['variant']
  size?: ButtonProps['size']
  title?: string
  imgSrc?: string
  imgAlt?: string
  imgClassName?: string
  action?: () => void
}

export default function DialogWidget({ children, button, isAvatar, avatar }: PropType) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          isAvatar ?
            <div className={clsx('relative flex items-center', 'h-full w-[142px]')}>
              {/* Inner Frame */}
              <div
                className={clsx([ 'absolute -bottom-16 w-36 h-36', 'bg-avatar-inner-frame opacity-100 bg-cover bg-no-repeat', 'cursor-pointer' ])}>
                {/* Outer Frame */}
                <div className={clsx([ 'absolute w-36 h-36', 'bg-avatar-outer-frame bg-cover bg-no-repeat' ])}>
                  {/* Avatar */}
                  {
                    avatar === undefined ? <div className={'absolute bg-[#485476] inset-6 w-24 h-24 rounded-full'} />
                      :
                      <img src={avatar && `${IPFS_URL_PREFIX}/${avatar}`}
                           alt="Profile"
                           className={clsx([ 'absolute w-24 h-24 object-cover object-center', 'z-50 inset-6 rounded-full'])}
                           draggable={false}
                      />
                  }


                </div>
                {/* Karma Gauge */}
                <div className={clsx([ 'absolute w-36 h-36', 'bg-cover bg-no-repeat' , {'hidden': !avatar}])} />
              </div>
              {/* End ofInner Frame */}
            </div>
            :
            <Button variant={button.variant} className={button.className} size={button.size}>
              <img src={button.imgSrc} alt={button.imgSrc}
                   className={clsx([ { 'hidden': button.imgSrc === '' }, button.imgClassName ])} draggable={false} />
              {button.title}
            </Button>
        }
      </DialogTrigger>

      <DialogPrimitive.Portal
        className={clsx([ 'fixed inset-0 z-50' ])}
      >
        <DialogPrimitive.Overlay
          className={clsx([ 'fixed inset-0 backdrop-blur', 'flex items-center justify-center' ])}
        >
          <DialogPrimitive.Close className={'absolute right-4 top-4 p-2'}>
            <img src={'/src/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>

          <DialogPrimitive.Content
            // onPointerDownOutside={e => e.preventDefault()}
            className={clsx([ 'min-h-[20%] max-h-[75%]', 'fixed z-50', 'bg-modal', 'rounded-[36px] shadow-lg', 'p-md', 'border border-option-10 !outline-0' ])}>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
