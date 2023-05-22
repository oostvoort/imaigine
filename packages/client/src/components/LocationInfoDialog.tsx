import React from 'react'
import { Dialog as DialogCore, Button } from './base'
import { Entity } from '@latticexyz/recs'
import { useAtomValue } from 'jotai'
import { selectedLocation_atom } from '../atoms/globalAtoms'
import { useMUD } from '../MUDContext'
import { generateIpfsImageLink } from '../lib/utils'
const { Dialog, DialogContent } = DialogCore

type Props = {
  isOpen: boolean
  setOpen: () => void
}

const LocationInfoDialog = ({ isOpen, setOpen }: Props) => {
  const location = useAtomValue(selectedLocation_atom)

  if (location == null) return <></>

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-5xl'>
        <section className='flex flex gap-6'>
          <div className='flex-grow-0'>
            <img src={generateIpfsImageLink(location.image.value)} alt={generateIpfsImageLink(location.image.value)} className='w-[300px] h-[300px] rounded-lg object-cover' />
          </div>
          <div className='flex-1 flex flex-col gap-3'>
            <p className='text-2xl text-primary-foreground font-jost'>{ location.name.value }</p>
            <p className='text-sm text-foreground leading-relaxed tracking-wide'>{ location.summary.value }</p>
            <Button size='xl' className='mt-auto'>Travel to {location.name.value}</Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default LocationInfoDialog
