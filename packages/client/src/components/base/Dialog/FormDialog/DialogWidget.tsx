import React, { useRef } from 'react'
import { clsx } from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogTrigger } from '@/components/base/Dialog'
import { Button, ButtonProps } from '@/components/base/Button'
import usePlayer from '@/hooks/usePlayer'
import { IPFS_URL_PREFIX } from '@/global/constants'
import useIpfs from '@/hooks/useIpfs'

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
  const avatarRef = useRef<HTMLImageElement>(null)

  const karmaPoints = player.karmaPoints?.value ?? 0

  const ipfs = useIpfs<{name: string, summary: string}>(player.config?.value ?? '')

  const percentage = (Math.abs(karmaPoints) / 100).toFixed(1)

  React.useEffect(() => {
    if(avatarRef.current){
      avatarRef.current.style.height = `calc(118px*${Number(percentage)})`
      avatarRef.current.style.transition = ''
    }
  }, [karmaPoints])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          isAvatar ?
            <React.Fragment>
              <div
                className={clsx([ 'relative', 'mt-16 text-center', 'flex items-center', 'h-[128px] w-[128px]', 'rounded-full', 'z-50', 'overflow-hidden' ])}>
                <img src={'/assets/avatar/frames/frame_bg.png'} alt={'frame background'}
                     className={clsx([ 'h-[128px] w-[128px]' ])} />

                {/*karma points*/}
                <img ref={avatarRef}
                     src={`/assets/avatar/frames/${karmaPoints < 0 ? 'bg_karmaMeter_evil' : 'bg_karmaMeter_good'}.svg`}
                     alt={'frame background'}
                     className={clsx([ 'absolute left-0 right-0 bottom-[5px] w-full object-cover transition-all duration-500' ])} />

                {
                  !avatar
                    ?
                    <div
                      className={'h-[94px] w-[94px] mx-auto absolute left-[17px] animate-pulse rounded-full bg-[#485476]'} />
                    :
                    <>
                      <img src={avatar && `${IPFS_URL_PREFIX}/${avatar}`} alt={'Avatar Icon'}
                           className={'h-[94px] w-[94px] mx-auto absolute left-[17px] rounded-full object-cover'}
                           draggable={false} />
                    </>

                }

                <img src={'/assets/avatar/frames/outer_frame.png'} alt={'frame background'}
                     className={'absolute z-50'} draggable={false} />
              </div>

              <p className={clsx(['ml-2 text-option-8 text-left text-xl', 'font-amiri', 'leading-8'])}>{ipfs.data?.name ?? 'Loading Name'}</p>
            </React.Fragment>

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
            <img src={'/assets/svg/close.svg'} alt={'Close Icon'} />
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
