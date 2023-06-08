import React from 'react'
import { Dialog as DialogCore } from './base'

const { Dialog, DialogContent } = DialogCore

type PropType = {
  isOpen: boolean
  setOpen: (value: boolean) => void
  locationInfo: any
}

const LocationDialog = ({ isOpen, setOpen, locationInfo }: PropType) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl !rounded-3xl">
        <section className="flex flex gap-6 min-h-[450px]">
          <div className="w-5/12">
            <img
              className="w-full h-full rounded rounded-xl"
              src={'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (1).jpg'}
            />
          </div>
          <div className="w-7/12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl text-[#FFBB00] font-amiri mb-3">{locationInfo?.target?.name}</h1>
              <p className="text-2xl text-[#BAC5F1] font-amiri leading-10">
                A majestic range reaching towards the sky, their rugged peaks kissed by snow. Towering cliffs and deep valleys carve the landscape, while ancient pines cling to the slopes. A realm of awe and mystery, where echoes of legends and the whispers of nature intertwine in harmony.
              </p>
            </div>
            <p>Travel to Everpeak Mountains</p>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default LocationDialog
