import React from 'react'
import { clsx } from 'clsx'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import { ButtonWrapper, Footer, HourglassLoader } from '@/components/base/Footer'
import { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import { Button } from '@/components/base/Button'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import usePlayer from '@/hooks/usePlayer'
import useLocation from '@/hooks/useLocation'
import useLocationInteraction from '@/hooks/useLocationInteraction'
import { IPFS_URL_PREFIX } from '@/global/constants'
import useNPCInteraction from '@/hooks/useNPCInteraction'
import { useMUD } from '@/MUDContext'
import { useComponentValue, useRows } from '@latticexyz/react'
import { useAtom } from 'jotai'
import { npcConversation_atom } from '@/states/global'

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

const options = {
  good: {
    choice: "Good Choice",
    effect: "Good Effect"
  },
  evil: {
    choice: "Evil Choice",
    effect: "Evil Effect"
  },
  neutral: {
    choice: "Neutral Choice",
    effect: "Neutral Effect"
  }
}

export default function CurrentLocationScreen() {
  const {
    network: {
      playerEntity
    },
  } = useMUD();


  const { player } = usePlayer()
  // const { location } = useLocation(player.location?.value ?? undefined)
  const { interactNPC, createNPCInteraction } = useNPCInteraction()
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)
  const [npcConversation, setNPCConversation] = useAtom(npcConversation_atom)

  // const { generateLocationInteraction, createLocationInteraction } = useLocationInteraction()
  // const isDataReady = !!player.config?.value && !!location.config?.value
  //
  // React.useEffect( () => {
  //   if (isDataReady) {
  //     generateLocationInteraction.mutate()
  //     createLocationInteraction.mutate({ choiceId: 0 })
  //   }
  // }, [isDataReady])
  //
  // const handleInteraction = (choiceId: number) => {
  //   createLocationInteraction.mutateAsync({choiceId})
  //     .then(() => generateLocationInteraction.mutate())
  // }

  // const buttonOptions: Array<ButtonPropType> = [
  //   {
  //     title: generateLocationInteraction.data && generateLocationInteraction.data?.options.good.choice,
  //     variant: player && player.karmaPoints !== undefined && player.karmaPoints.value <= -15 ?  'evil' : 'neutral',
  //     size: 'btnWithBgImg',
  //     action: () => handleInteraction(3),
  //   },
  //   {
  //     title: generateLocationInteraction.data && generateLocationInteraction.data?.options.neutral.choice,
  //     variant: 'neutral',
  //     size: 'btnWithBgImg',
  //     action: () => handleInteraction(2),
  //   },
  //   {
  //     title: generateLocationInteraction.data && generateLocationInteraction.data?.options.evil.choice,
  //     variant: 'neutral',
  //     size: 'btnWithBgImg',
  //     action: () => handleInteraction(1),
  //   },
  // ]

  // const handleInteractNPC = () => {
  //   if (!player.config) throw new Error('No generated Player')
  //   interactNPC.mutate({
  //     playerIpfsHash: [`${player.config.value}`],
  //     npcEntityId: '0x0000000000000000000000000000000000000000000000000000000000000002',
  //     npcIpfsHash: 'QmcNgZR321oGu1QKijDpEbbad9tpxAHRJiqFL7AnvKvJrf',
  //     playerEntityId: [`${playerEntity}`]
  //   })
  // }
  //
  // React.useEffect(() => {
  //   if (interactNPC.isSuccess) {
  //     console.log('[INTERACT-NPC]', interactNPC.data)
  //   }
  // }, [interactNPC.isSuccess])

  const npcId = '0x0000000000000000000000000000000000000000000000000000000000000002'
  const handleInteractNPC = () => {
    createNPCInteraction.mutate({ choiceId: 0, npcId })
    if (!player.config) throw new Error('No generated Player')
    console.info("interact npc running....")
    interactNPC.mutate({
      playerIpfsHash: [`${player.config.value}`],
      npcEntityId: npcId,
      npcIpfsHash: 'QmcNgZR321oGu1QKijDpEbbad9tpxAHRJiqFL7AnvKvJrf',
      playerEntityId: [`${playerEntity}`],
    })
  }

  React.useEffect(() => {
    if (interactNPC.isSuccess) {
      if (interactNPC.data !== undefined) {
        console.info("setting npc conversation ...")
        setNPCConversation({
          conversationHistory: interactNPC.data.conversationHistory.reverse(),
          option: interactNPC.data.option
        })
      }
    }
  }, [interactNPC.isSuccess])

  console.log({npcConversation})


  const buttonOptions: Array<ButtonPropType> = [
    {
      title: 'Test1',
      variant: 'neutral',
      size: 'btnWithBgImg',
    },
    {
      title: 'Test2',
      variant: 'neutral',
      size: 'btnWithBgImg',
    },
    {
      title: 'Test3',
      variant: 'neutral',
      size: 'btnWithBgImg',
    },
  ]

  return (
    <React.Fragment>
      {/*<SubLayout>*/}
      {/*  <SubLayout.VisualSummaryLayout summary={generateLocationInteraction.data?.scenario}*/}
      {/*                                 setIsOpen={() => setIsOpen(true)}>*/}
      {/*    {*/}
      {/*      location.imgHash === undefined || generateLocationInteraction.data === undefined ?*/}
      {/*        <div className={'bg-[#485476] flex items-center justify-center w-full h-full rounded-l-2xl animate-pulse'} >*/}
      {/*          <div className={'border border-4 rounded-full p-10 text-center'}>*/}
      {/*            <img src={'src/assets/svg/ai-logo.svg'} alt={'AI Logo'} className={'h-10 w-10'}/>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*        :*/}
      {/*        <img*/}
      {/*          src={`${IPFS_URL_PREFIX}/${location.imgHash.value}`}*/}
      {/*          alt={'Location'}*/}
      {/*          className={clsx([*/}
      {/*            'object-cover w-full h-full',*/}
      {/*            'rounded-l-2xl', '',*/}
      {/*          ])}*/}
      {/*        />*/}
      {/*    }*/}
      {/*  </SubLayout.VisualSummaryLayout>*/}
      {/*</SubLayout>*/}
      {/*<Footer>*/}
      {/*  {*/}
      {/*    generateLocationInteraction.isLoading || generateLocationInteraction.data === undefined ?*/}
      {/*      <HourglassLoader>Loading Resources...</HourglassLoader>*/}
      {/*      :*/}
      {/*      <ButtonWrapper>*/}
      {/*        {*/}
      {/*          buttonOptions.map((btn, key) => (*/}
      {/*            <Button key={key} variant={btn.variant} size={btn.size} onClick={btn.action}>{btn.title}</Button>*/}
      {/*          ))*/}
      {/*        }*/}
      {/*      </ButtonWrapper>*/}
      {/*  }*/}
      {/*</Footer>*/}
      <SubLayout>
        <SubLayout.VisualSummaryLayout summary={data} setIsOpen={() => {
          setIsOpen(true)
          handleInteractNPC()
        }}>
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
      <ConversationDialog
        isOpen={isOpen}
        setOpen={value => setIsOpen(value)}
        conversations={npcConversation}
      />
    </React.Fragment>
  )
}
