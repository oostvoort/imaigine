import React from 'react'
import { Dialog, DialogContent } from '@/components/base/Dialog'
import { Button } from '@/components/base/Button'
import { clsx } from 'clsx'

type PropType = {
  isOpen: boolean
  setOpen: (value: boolean) => void
  //todo: add types for location info
  locationInfo: any
}

const LocationDialog = ({ isOpen, setOpen, locationInfo }: PropType) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[1193px] h-[604px] !rounded-3xl !border-option-10 bg-modal">
          <section className="flex flex gap-6 min-h-[450px]">
            <div className="w-[430px]">
              <img
                className="w-full h-full rounded rounded-xl object-cover"
                src={'/src/assets/background/bg1.jpg'}
                alt={'RPG 40 Image'}
              />
            </div>
            <div className="w-7/12 flex flex-col justify-between">
              <div>
                <h1 className={clsx(['text-4xl text-option-9 font-amiri font-bold leading-[48px]', 'mb-3'])}>Everpeak Mountain</h1>
                <p className="text-3xl text-option-11 font-amiri leading-10">
                  A majestic range reaching towards the sky, their rugged peaks kissed by snow. Towering cliffs and deep
                  valleys carve the landscape, while ancient pines cling to the slopes. A realm of awe and mystery, where
                  echoes of legends and the whispers of nature intertwine in harmony.
                </p>
              </div>
              <Button variant={'neutral'} size={'btnWithBgImg'}>Travel to Everpeak Mountains</Button>
            </div>
          </section>
        </DialogContent>
    </Dialog>
  )
}

export default LocationDialog
