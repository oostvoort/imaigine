import React from 'react'
import { Dialog, DialogContent } from '@/components/base/Dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'

type PropType = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ConversationDialog({ isOpen, setOpen }: PropType) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className={clsx([
        'sm:max-w-[1479px] h-[75%] p-10 top-24',
        '!rounded-3xl !border-option-10',
        'bg-modal bg-cover',
      ])}>
        <section className={clsx([
          'flex',
          'h-full h-full',
        ])}>
          <div className={clsx('w-4/12')}>
            <img
              src={'/src/assets/avatar/avatar3.jpg'}
              alt={'RPG 40 Image'}
              className="w-full h-full rounded rounded-xl object-cover"
            />
          </div>
          <div className={clsx([
            'w-8/12',
            'flex flex-col items-center',
          ])}>
            <p className={clsx('text-3xl font-amiri')}>
              Alice: approaches Eleanor with a smile
            </p>
          </div>
        </section>
        <section className={clsx([
          'absolute bottom-[-120px] flex justify-center w-full',
        ])}>
          <div className={''}>
            {/*<p className={clsx('text-3xl font-amiri tracking-wide')}>*/}
            {/*  Waiting for Eleanor the Dryad!*/}
            {/*</p>*/}
            <div className={clsx('flex gap-x-3')}>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Share Name
              </Button>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Politely decline
              </Button>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Give a false name
              </Button>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
