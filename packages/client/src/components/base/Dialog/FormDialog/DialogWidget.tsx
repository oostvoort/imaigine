import React from 'react'
import { clsx } from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogTrigger } from '@/components/base/Dialog'
import { Button, ButtonProps } from '@/components/base/Button'

type PropType = {
  children: React.ReactNode
  button: ButtonPropType
  isAvatar: boolean
}

export type ButtonPropType = {
  className?: string
  variant: ButtonProps['variant']
  title: string
  imgSrc: string
  imgAlt: string
  imgClassName?: string
}

export default function DialogWidget({ children, button, isAvatar }: PropType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          isAvatar ?
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
            :
            <Button variant={button.variant} className={button.className}>
              <img src={button.imgSrc} alt={button.imgSrc}
                   className={clsx([ { 'hidden': button.imgSrc === '' }, button.imgClassName ])} />
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
            onPointerDownOutside={e => e.preventDefault()}
            className={clsx([ 'min-h-[20%+] max-h-[75%]', 'fixed z-50', 'bg-modal', 'rounded-[36px] shadow-lg', 'p-md', 'border border-option-10 !outline-0' ])}>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
