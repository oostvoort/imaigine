import React from 'react'
import { clsx } from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogTrigger } from '@/components/base/Dialog'
import { Button, ButtonProps } from '@/components/base/Button'
import usePlayer from '@/hooks/usePlayer'
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
  const { player } = usePlayer()

  const karmaPoints = player.karmaPoints?.value ?? 0
  const percentage = (Math.abs(karmaPoints) / 128).toFixed(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          isAvatar ?
            <div
              className={'relative flex justify-center items-center overflow-hidden rounded-full w-[128px] h-[128px] mt-16'}>
              <img src={'/src/assets/avatar/frames/frame_bg.png'} alt={'frame background'}
                   className={'absolute z-10'} draggable={false} />
              <img src={'/src/assets/avatar/frames/outer_frame.png'} alt={'frame background'}
                   className={'absolute z-50'} draggable={false} />
              <img
                src={`/src/assets/avatar/frames/${karmaPoints < 0 ? 'bg_karmaMeter_evil' : 'bg_karmaMeter_good'}.svg`}
                alt={''}
                className={clsx([ { hidden: !avatar } ], `z-20 w-full h-[128px] absolute top-[calc(118px*${1 - Number(percentage)})]`)}
                draggable={false} />

              {
                !avatar ? <div className={'h-[94px] w-[94px] absolute animate-pulse rounded-full bg-[#485476] z-20'} /> :
                  <img src={avatar && `${IPFS_URL_PREFIX}/${avatar}`} alt={''}
                       className={'h-[94px] w-[94px] absolute rounded-full object-cover z-20'} draggable={false} />
              }
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
