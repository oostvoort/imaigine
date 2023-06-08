import React from 'react'
import { Dialog as DialogCore } from './base'

const { Dialog, DialogContent } = DialogCore

type PropType = {
  isOpen: boolean
  setOpen: (value: boolean) => void
  itemInfo: any
}

const AnimalDialog = ({ isOpen, setOpen, itemInfo }: PropType) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[80%]">
        <section className="flex flex gap-6 min-h-[600px] max-h-[600px]">
          <div className="w-4/12">
            <img
              className="w-full h-full"
              src={'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (1).jpg'}
            />
          </div>
          <div className="w-8/12 flex flex-col">
            <h1 className="text-3xl text-[#FF4DFF] font-amiri mt-5 mb-3">{itemInfo?.target?.name}</h1>
            <div className="overflow-auto h-full">
              <p className="text-2xl text-[#BAC5F1] font-amiri leading-10">
                 Content ...
              </p>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default AnimalDialog
