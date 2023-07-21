import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog } from '@/components/base/Dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { LocationType } from '@/pages/world-map-screen'
import AILoader from '@/components/shared/AILoader'

type PropType = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  location: LocationType,
  travelFunc: () => void
}

export default function LocationDialog({ isOpen, setOpen, location, travelFunc }: PropType) {
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
          <div className={'backdrop-blur h-screen w-screen'} onClick={() => setOpen && setOpen(false)} />
          <DialogPrimitive.Close
            className={'absolute right-4 top-4 p-1'}
            onClick={() => setOpen && setOpen(false)}
          >
            <img src={'/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>
          <DialogPrimitive.Content
            className={clsx([
              'sm:min-w-[1192px] max-w-[1192px] h-[604px] p-10',
              'rounded-3xl border border-option-10 !outline-0',
              'bg-modal bg-no-repeat bg-cover',
              'fixed p-md shadow-lg',
            ])}
          >
            {
              !location.name ? (
                <div className={clsx([
                  'w-full h-full mx-auto p-10',
                  'flex flex-col justify-center items-center gap-10',
                ])}>
                 <AILoader message={'Fetching Location...'} />
                </div>
              ) : (
                <div className={clsx('flex h-full gap-x-6')}>
                  <div className={clsx('w-5/12')}>
                    <img
                      src={`${location.imgHash ? `${IPFS_URL_PREFIX}/${location.imgHash}` : '/assets/background/bg1.jpg'}`}
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
                        {location.name}
                      </h1>
                      <div className={clsx('overflow-y-auto h-[350px]')}>
                        <p className={clsx('text-3xl text-option-11 font-amiri leading-10')}>
                          {location.summary}
                        </p>
                      </div>
                    </div>
                    <div className={'flex justify-center'}>
                      <Button
                        variant={'neutral'}
                        size={'btnWithBgImg'}
                        onClick={travelFunc}
                      >
                        Travel to {location.name}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            }
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
