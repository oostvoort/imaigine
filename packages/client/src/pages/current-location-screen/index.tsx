import { clsx } from 'clsx'
import React from 'react'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import { ButtonWrapper, Footer } from '@/components/base/Footer'
import { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import { Button } from '@/components/base/Button'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'


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

  const buttonOptions: Array<ButtonPropType> = [
    {
      title: 'Explore surroundings',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => console.log('Hello'),
    },
    {
      title: 'Follow the nearest trail',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => console.log('Hello'),
    },
    {
      title: 'Succumb to panic',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => console.log('Hello'),
    },
  ]

  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout summary={data} setIsOpen={() => setIsOpen(true)}>
          <img
            src={'/src/assets/background/bg1.jpg'}
            alt={'Location'}
            className={clsx([
              'object-cover w-full h-full',
              'rounded-l-2xl',
            ])}
          />
        </SubLayout.VisualSummaryLayout>
      </SubLayout>
      <Footer>
        {/*<HourglassLoader>Waiting for other players...</HourglassLoader>*/}
        <ButtonWrapper>
          {
            buttonOptions.map((btn, key) => (
              <Button key={key} variant={btn.variant} size={btn.size}>{btn.title}</Button>
            ))
          }
        </ButtonWrapper>
      </Footer>
      <ConversationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} />
    </React.Fragment>
  )
}
