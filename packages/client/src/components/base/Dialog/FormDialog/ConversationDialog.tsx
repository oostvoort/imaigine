import React from 'react'
import { Dialog } from '@/components/base/Dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import ConversationLayout from '@/components/layouts/ConversationLayout'

type PropType = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  fetchedUrl?: string
}
export default function ConversationDialog({
  isOpen,
  setOpen,
  fetchedUrl = '/src/assets/background/bg1.jpg',
}: PropType) {
  return (
    <Dialog open={isOpen} onOpenChange={() => null}>
      <DialogPrimitive.Portal
        className={'fixed inset-0 z-50  flex items-start justify-center '}>
        <DialogPrimitive.Overlay
          style={{ backgroundImage: `url(${fetchedUrl})` }}
          className={clsx([ 'fixed inset-0 bg-cover bg-no-repeat flex items-start justify-center  duration-[3000ms] delay-1000 ease-in-out' ])}>
          <div className={'backdrop-blur h-screen w-screen'} />

          <DialogPrimitive.Close className={'absolute right-4 top-4 p-2'} onClick={() => setOpen && setOpen(false)}>
            <img src={'/src/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>

          <DialogPrimitive.Content
            className={clsx([
              'sm:min-w-[1479px] h-[75%] p-10 top-24',
              'rounded-3xl border border-option-10 !outline-0',
              'bg-modal bg-cover',
              'fixed z-50 bg-background p-md shadow-lg',
            ])}
          >

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
                'w-8/12 h-full',
                'flex flex-col items-center',
              ])}>
                <p className={clsx('text-3xl font-amiri')}>
                  Alice: approaches Eleanor with a smile
                </p>

                <ConversationLayout>
                  <ConversationLayout.TypingBubble authorIcon={'/src/assets/avatar/avatar1.jpg'} />

                  <ConversationLayout.ReceiverBubble authorName={'Eleanor the Dryad'} authorIcon={'/src/assets/avatar/avatar1.jpg'} text={'Yes, I am Eleanor. And who might you be?'} />
                  <ConversationLayout.SenderBubble text={'Excuse me, are you Eleanor? I\'ve heard great things about you.'} />

                  <ConversationLayout.ReceiverBubble authorName={'Eleanor the Dryad'} authorIcon={'/src/assets/avatar/avatar1.jpg'} text={'Yes, I am Eleanor. And who might you be?'} />
                  <ConversationLayout.SenderBubble text={'Excuse me, are you Eleanor? I\'ve heard great things about you.'} />

                  <ConversationLayout.ReceiverBubble authorName={'Eleanor the Dryad'} authorIcon={'/src/assets/avatar/avatar1.jpg'} text={'Yes, I am Eleanor. And who might you be?'} />
                  <ConversationLayout.SenderBubble text={'Excuse me, are you Eleanor? I\'ve heard great things about you.'} />

                  <ConversationLayout.ReceiverBubble authorName={'Eleanor the Dryad'} authorIcon={'/src/assets/avatar/avatar1.jpg'} text={'Yes, I am Eleanor. And who might you be?'} />
                  <ConversationLayout.SenderBubble text={'Excuse me, are you Eleanor? I\'ve heard great things about you.'} />
                </ConversationLayout>
              </div>


            </section>
          </DialogPrimitive.Content>

          <section className={clsx([
            'absolute bottom-8 w-full',
          ])}>
            <div className={'flex justify-center'}>
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
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
