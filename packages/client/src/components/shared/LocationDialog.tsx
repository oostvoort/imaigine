import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog } from '@/components/base/Dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { LocationType } from '@/pages/world-map-screen'

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
            {
              !location.name ? (
                <div className={clsx([
                  'w-full h-full mx-auto p-10',
                  'flex flex-col justify-center items-center gap-10',
                ])}>
                  <div className="loader-wrapper">
                    <div className="loader">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <svg className="aiLogo" xmlns="http://www.w3.org/2000/svg" width="92.61" height="86.204"
                         viewBox="0 0 92.61 86.204">
                      <path id="Path_4" data-name="Path 4"
                            d="M37.045-41.673a21.966,21.966,0,0,1,16.106,6.711A21.865,21.865,0,0,1,59.8-18.917a21.865,21.865,0,0,1-6.65,16.045,22.067,22.067,0,0,1-16.106,6.65A21.865,21.865,0,0,1,21-2.872a21.865,21.865,0,0,1-6.65-16.045A21.865,21.865,0,0,1,21-34.962,21.766,21.766,0,0,1,37.045-41.673Zm0,54.785A30.892,30.892,0,0,0,59.8,3.656v8.6h9.334V-50.214H59.8v8.663a30.892,30.892,0,0,0-22.756-9.456,30.851,30.851,0,0,0-22.634,9.4,30.922,30.922,0,0,0-9.4,22.7,30.851,30.851,0,0,0,9.4,22.634A30.851,30.851,0,0,0,37.045,13.112ZM86.705-50.336H96.04V12.258H86.705Zm4.637-10.249a5.991,5.991,0,0,1-4.393-1.83,5.991,5.991,0,0,1-1.83-4.393,6.062,6.062,0,0,1,1.83-4.454,5.991,5.991,0,0,1,4.393-1.83,6.062,6.062,0,0,1,4.454,1.83,6.062,6.062,0,0,1,1.83,4.454,5.991,5.991,0,0,1-1.83,4.393A6.062,6.062,0,0,1,91.342-60.586Z"
                            transform="translate(-5.016 73.092)" fill="#fff" />
                    </svg>
                  </div>
                  <p className={clsx([
                    'font-segoe font-semibold',
                    'text-white text-xl tracking-wide',
                  ])}>
                    Fetching location ...
                  </p>
                </div>
              ) : (
                <div className={clsx('flex h-full gap-x-6')}>
                  <div className={clsx('w-5/12')}>
                    <img
                      src={`${location.imgHash ? `${IPFS_URL_PREFIX}/${location.imgHash}` : '/src/assets/background/bg1.jpg'}`}
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
