import React from 'react'
import { Dialog as DialogCore, Button } from './base'
const { Dialog, DialogContent } = DialogCore

type Props = {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  img: string,
  locationTitle: string,
  locationDescription: string,
  action: () => void
}

const LocationInfoDialog = ({ isOpen, setOpen, img, locationTitle, locationDescription, action }: Props) => (
  <Dialog open={isOpen} onOpenChange={(state) => setOpen(state)}>
    <DialogContent className='sm:max-w-5xl'>
      <section className='flex flex gap-6'>
        <div className='flex-grow-0'>
          <img src={img} alt={String(img)} className='w-[300px] h-[300px] rounded-lg' />
        </div>
        <div className='flex-1 flex flex-col gap-3'>
          <p className='text-2xl text-primary-foreground font-jost'>{ locationTitle }</p>
          <p className='text-sm text-foreground leading-relaxed tracking-wide'>{ locationDescription }</p>
          <Button onClick={action} size='xl' className='mt-auto'>Travel to {locationTitle}</Button>
        </div>
      </section>
    </DialogContent>
  </Dialog>
)

export default LocationInfoDialog
