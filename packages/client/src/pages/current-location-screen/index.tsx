import { clsx } from 'clsx'
import React from 'react'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import LocationContent from '@/components/shared/LocationContent'
import LocationLayout from '@/components/layouts/LocationLayout'

const TARGETS = [ 'location', 'npc', 'item', 'animal' ] as const
const data = {
  text: 'Alice opened her eyes, finding herself in Mystic Forest an unfamiliar land.\n' +
    '            She stood at the foot of a towering mountain range known as the Everpeak Mountains,\n' +
    '            its snow-capped peaks reaching for the heavens. Nearby, a babbling river called the Silverstream\n' +
    '            flowed gracefully through the lush green fields. A friendly NPC named Eleanor the Dryad approached,\n' +
    '            offering a warm smile and a map of the realm.',
  target: [ {
    id: '1',
    name: 'Eleanor the Dryad',
    type: TARGETS[1],
  } ],
}

export default function CurrentLocationScreen() {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)
  return (
    <LocationLayout>
      <div className={clsx([
        'flex',
        'w-full h-[820px]',
        'border border-[#AB8200]',
        'rounded-2xl',
      ])}>
        <div className={clsx([
          'aspect-video w-1/2',
          'border-r-[1px] border-[#AB8200]',
          'flex'
        ])}>
          <img
            src={'/src/assets/background/bg1.jpg'}
            alt={'Location'}
            className={clsx([
              'object-top w-full h-full',
              'rounded-l-2xl',
            ])}
          />
        </div>
        <div className={clsx([
          'w-1/2 p-[30px]',
          'bg-content-bg-gray bg-no-repeat bg-cover',
          'rounded-r-2xl',
        ])}>
          <LocationContent
            content={data.text}
            target={data.target}
            onTarget={() => setIsOpen(true)}
          />
        </div>
      </div>
      <ConversationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} />
    </LocationLayout>
  )
}
