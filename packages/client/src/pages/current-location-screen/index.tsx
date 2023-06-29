import { clsx } from 'clsx'
import React from 'react'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import { ButtonWrapper, Footer } from '@/components/base/Footer'
import { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import { Button } from '@/components/base/Button'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import usePlayer from '@/hooks/usePlayer'
import { IPFS_URL_PREFIX } from '@/global/constants'
import useLocation from '@/hooks/useLocation'
import useLocationInteraction from '@/hooks/useLocationInteraction'


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
  const { player } = usePlayer()
  const { location } = useLocation(player.location?.value ?? undefined)
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)

  const { generateLocationInteraction, createLocationInteraction } = useLocationInteraction()
  const isDataReady = !!player.config?.value && !!location.config?.value

  React.useEffect( () => {
    if (isDataReady) {
      generateLocationInteraction.mutate()
      createLocationInteraction.mutate({ choiceId: 0 })
    }
  }, [isDataReady])

  const handleInteraction = (choiceId: number) => {
    createLocationInteraction.mutateAsync({choiceId})
      .then(() => generateLocationInteraction.mutate())
  }

  const buttonOptions: Array<ButtonPropType> = [
    {
      title: generateLocationInteraction.data?.options.good.choice ?? 'Good',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(3),
    },
    {
      title: generateLocationInteraction.data?.options.neutral.choice ?? 'Neutral',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(2),
    },
    {
      title: generateLocationInteraction.data?.options.evil.choice ?? 'Evil',
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(1),
    },
  ]

  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout summary={generateLocationInteraction.data?.scenario} setIsOpen={() => setIsOpen(true)}>
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
        <ButtonWrapper>
          {
            buttonOptions.map((btn, key) => (
              <Button key={key} variant={btn.variant} size={btn.size} onClick={btn.action}>{btn.title}</Button>
            ))
          }
        </ButtonWrapper>
      </Footer>
      <ConversationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} />
    </React.Fragment>
  )
}
