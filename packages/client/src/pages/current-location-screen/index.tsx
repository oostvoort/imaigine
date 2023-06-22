import { clsx } from 'clsx'
import React from 'react'
import { Button } from '@/components/base/Button'
import Header from '@/components/layouts/Header'
import ConversationDialog from '@/components/ConversationDialog'

export default function CurrentLocationScreen() {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)
  return (
    <div className={clsx([
      'flex flex-col items-center',
      'h-screen w-screen',
      'px-10 pt-28',
      'bg-main-bg-neutral bg-no-repeat bg-cover',
    ])}>
      <Header />
      <div className={clsx([
        'flex',
        'w-full h-[820px]',
        'border border-[#AB8200]',
        'rounded-2xl',
      ])}>
        <div className={clsx([
          'aspect-video w-1/2',
          'border-r-[1px] border-[#AB8200]',
        ])}>
          <img
            src={'/src/assets/background/bg1.jpg'}
            alt={'Location'}
            className={clsx([
              'object-cover w-full h-full',
              'rounded-l-2xl',
            ])}
          />
        </div>
        <div className={clsx([
          'w-1/2 p-[30px]',
          'bg-content-bg-gray bg-no-repeat bg-cover',
          'rounded-r-2xl',
        ])}>
          <p className={clsx([
            'font-amiri',
            'text-[30px]',
          ])} onClick={() => setIsOpen(true)}>
            Alice opened her eyes, finding herself in Mystic Forest an unfamiliar land.
            She stood at the foot of a towering mountain range known as the Everpeak Mountains,
            it&apos;s snow-capped peaks reaching for the heavens. Nearby, a babbling river called the Silverstream
            flowed gracefully through the lush green fields. A friendly NPC named Eleanor the Dryad approached,
            offering a warm smile and a map of the realm.
          </p>
        </div>
      </div>
      <div className={clsx([
        'flex gap-x-3 my-8',
      ])}>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Explore Surroundings
        </Button>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Follow the nearest trail
        </Button>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Succumb to panic
        </Button>
      </div>
      <ConversationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)}/>
    </div>
  )
}
