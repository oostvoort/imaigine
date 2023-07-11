import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog } from '@/components/base/Dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'

type PropType = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function LocationDialog({ isOpen, setOpen }: PropType) {
  const handleTravel = () => {
    console.info('Travelling...')
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => null}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={clsx([
            'fixed inset-0 z-50',
            'flex items-center justify-center',
            'bg-cover bg-no-repeat',
            'duration-[3000ms] delay-1000 ease-in-out',
          ])}
        >
          <div className={'backdrop-blur h-screen w-screen'} />
          <DialogPrimitive.Close
            className={'absolute right-4 top-4 p-1'}
            onClick={() => setOpen && setOpen(false)}
          >
            <img src={'/src/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>
          <DialogPrimitive.Content
            className={clsx([
              'sm:min-w-[1192px] max-w-[1192px] h-[604px] p-10',
              'rounded-3xl border border-option-10 !outline-0',
              'bg-modal bg-no-repeat bg-cover',
              'fixed p-md shadow-lg',
            ])}
          >
            <div className={clsx('flex h-full gap-x-6')}>
              <div className={clsx('w-5/12')}>
                <img
                  src={'/src/assets/background/bg1.jpg'}
                  alt={'Location'}
                  className={clsx([
                    'w-full h-full object-cover',
                    'rounded rounded-xl',
                  ])}
                />
              </div>
              <div className={clsx('flex flex-col justify-between w-7/12')}>
                <div>
                  <h1 className={clsx([
                    'text-4xl text-option-9',
                    'font-amiri',
                    'leading-[48px] my-3',
                  ])}>
                    Everpeak Mountain
                  </h1>
                  <p className={clsx('text-3xl text-option-11 font-amiri leading-10')}>
                    A majestic range reaching towards the sky, their rugged peaks kissed by snow. Towering cliffs and deep
                    valleys carve the landscape, while ancient pines cling to the slopes. A realm of awe and mystery, where
                    echoes of legends and the whispers of nature intertwine in harmony.
                  </p>
                </div>
                <div className={'flex justify-center'}>
                  <Button
                    variant={'neutral'}
                    size={'btnWithBgImg'}
                    onClick={handleTravel}
                  >
                    Travel to Everpeak Mountains
                  </Button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
