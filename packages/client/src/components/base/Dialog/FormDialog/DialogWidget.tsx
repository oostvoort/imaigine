import React from 'react'
import { clsx } from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogTrigger } from '@/components/base/Dialog'
import { Button, ButtonProps } from '@/components/base/Button'

type PropType = {
  children: React.ReactNode
  button: ButtonPropType
}

export type ButtonPropType = {
  className?: string
  variant: ButtonProps['variant']
  title: string
  imgSrc: string
  imgAlt: string
  imgClassName?: string
}

export default function DialogWidget({ children, button }: PropType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={button.variant} className={button.className}>
          <img src={button.imgSrc} alt={button.imgSrc}
               className={clsx([ { 'hidden': button.imgSrc === '' }, button.imgClassName ])} />
          {button.title}
        </Button>
      </DialogTrigger>

      <DialogPrimitive.Portal
        className={clsx([ 'fixed inset-0 z-50' ])}
      >
        <DialogPrimitive.Overlay
          className={clsx([ 'fixed inset-0 backdrop-blur', 'flex items-center justify-center' ])}
          onClick={event => event.stopPropagation()}
        >
          <DialogPrimitive.Close className={'absolute right-4 top-4 p-2'}>
            <img src={'/src/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>

          <DialogPrimitive.Content
            className={clsx([ 'min-h-[20%+] max-h-[75%]', 'fixed z-50', 'bg-modal', 'border border-option-10 rounded-[36px] shadow-lg', 'p-md' ])}>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
