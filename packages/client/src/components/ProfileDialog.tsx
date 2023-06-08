import React from 'react'
import { Dialog as DialogCore } from './base'

const { Dialog, DialogContent } = DialogCore

type PropType = {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

const LocationDialog = ({ isOpen, setOpen }: PropType) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1200px] p-0">
        <section className="flex flex min-h-[550px]">
          <div className="w-[45%] relative">
            <img
              className="w-full h-full rounded rounded-xl"
              src={'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'}
            />
            <div className="absolute top-0 w-full h-full bg-transparent-to-dark"></div>
          </div>
          <div className="w-[55%] flex flex-col">
            <div className="bg-[#181C1E] mx-5 mt-10 p-5 rounded rounded-xl">
              <p className="text-md text-[#BAC5F1]">Name : <span className="text-white"> Alice</span></p>
            </div>
            <p className="mx-5 mt-5 mb-1 text-[#C79800] text-sm font-jost font-medium">DESCRIPTION</p>
            <div className="bg-[#181C1E] mx-5 p-5 rounded rounded-xl">
              <p className="text-md text-[#BAC5F1] leading-8">Alice is a young woman with a spirited nature and an adventurous spark in her eyes. Her wavy chestnut hair cascades down her shoulders, complementing her warm hazel eyes that shine with determination. Freckles dance across her fair skin, adding to her youthful appearance. Alice's attire reflects her connection to nature, adorned with earthy tones and practical garments suitable for her travels. She carries a staff adorned with intricate nature-themed carvings, a symbol of her magical prowess and connection to the natural world.</p>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default LocationDialog
