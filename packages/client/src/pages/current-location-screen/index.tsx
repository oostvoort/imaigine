import React from 'react'
import { clsx } from 'clsx'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import { ButtonWrapper, Footer, HourglassLoader } from '@/components/base/Footer'
import { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import { Button } from '@/components/base/Button'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import { IPFS_URL_PREFIX } from '@/global/constants'
import useNPCInteraction from '@/hooks/useNPCInteraction'
import { useMUD } from '@/MUDContext'
import { useAtom, useSetAtom } from 'jotai'
import { currentLocation_atom, npcConversation_atom } from '@/states/global'
import useLocation from '@/hooks/v1/useLocation'
import { SkeletonParagraph } from '@/components/base/Skeleton'
import usePlayer from '@/hooks/v1/usePlayer'
import useLocationInteraction from '@/hooks/v1/useLocationInteraction'
import useNpc from '@/hooks/v1/useNpc'

export default function CurrentLocationScreen() {
  const {
    network: {
      playerEntity
    },
  } = useMUD();

  const { player } = usePlayer()
  const { location } = useLocation(player.location?.value ?? undefined)
  const { npc } = useNpc(player && player.location ? player.location.value : undefined)

  const { generateLocationInteraction, createLocationInteraction } = useLocationInteraction()

  const { interactNPC, createNPCInteraction } = useNPCInteraction()

  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)
  const [npcConversation, setNPCConversation] = useAtom(npcConversation_atom)
  const setCurrentLocation = useSetAtom(currentLocation_atom)

  const isDataReady = !!player.config?.value && !!location.data?.config.value && !!npc.data

  const locationDetails = {
    scenario: generateLocationInteraction.data?.scenario,
    npc: { name: npc.data ? npc?.data[0]?.config.name : undefined }
  }

  const buttonOptions: Array<ButtonPropType> = [
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.choice.good,
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(3),
    },
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.choice.neutral,
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(2),
    },
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.choice.evil,
      variant: 'neutral',
      size: 'btnWithBgImg',
      action: () => handleInteraction(1),
    },
  ]

  const handleInteraction = (choiceId: number) => {
    createLocationInteraction.mutateAsync({choiceId})
      .then(() => generateLocationInteraction.mutate())
  }

  const handleInteractNPC = () => {
    if (!npc.isSuccess) throw new Error('There is no NPC')
    createNPCInteraction.mutate({ choiceId: 0, npcId: npc.data[0].npcId })
    if (!player.config) throw new Error('No generated Player')
    interactNPC.mutate({
      playerIpfsHash: [`${player.config.value}`],
      npcEntityId: npc.data[0].npcId,
      npcIpfsHash: npc.data[0].config.value,
      playerEntityId: [`${playerEntity}`],
    })
  }

  React.useEffect( () => {
    if (isDataReady) {
      generateLocationInteraction.mutate()
      createLocationInteraction.mutate({ choiceId: 0 })
    }
  }, [isDataReady])

  React.useEffect(() => {
    if (npc.data) {
      setCurrentLocation({
        name: npc.data[0]?.config.name,
        summary: npc.data[0]?.config.summary,
        image: location.data?.imgHash?.value,
        npc: { ...npc.data[0] }
      })
    }
  }, [npc.data])

  React.useEffect(() => {
    if (interactNPC.isSuccess) {
      if (interactNPC.data !== undefined) {
        setNPCConversation({
          conversationHistory: interactNPC.data.conversationHistory.reverse(),
          option: interactNPC.data.option
        })
      }
    }
  }, [interactNPC.isSuccess])

  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout>
            {
              location.data?.imgHash === undefined ?
                <div className={'bg-[#485476] flex items-center justify-center w-full h-full rounded-l-2xl animate-pulse'} >
                  <div className={'border border-4 rounded-full p-10 text-center'}>
                    <img src={'/assets/svg/ai-logo.svg'} alt={'AI Logo'} className={'h-10 w-10'}/>
                  </div>
                </div>
                :
                <img
                  src={`${IPFS_URL_PREFIX}/${location.data.imgHash.value}`}
                  alt={'Location'}
                  className={clsx([
                    'object-cover w-full h-full',
                    'rounded-l-2xl', '',
                  ])}
                />
            }
            {
              locationDetails.scenario === undefined ? (
                <SkeletonParagraph />
              ) : (
                <div className={clsx([
                  'text-[30px] text-[#BAC5F1]',
                  'font-amiri',
                ])}>
                  <p>{locationDetails.scenario}</p>
                  <p className={clsx('mt-8')}>
                    Nearby NPC :
                    <span
                      className={clsx('cursor-pointer text-[#24E1FF] ml-3')}
                      onClick={() => {
                        setIsOpen(true)
                        handleInteractNPC()
                      }}>
                      {locationDetails.npc.name}
                    </span>
                  </p>
                </div>
              )
            }
        </SubLayout.VisualSummaryLayout>
      </SubLayout>
      <Footer>
        {
          generateLocationInteraction.isLoading || generateLocationInteraction.data === undefined ?
            <HourglassLoader>Loading...</HourglassLoader>
            :
            <ButtonWrapper>
              {
                buttonOptions.map((btn, key) => (
                  <Button key={key} variant={btn.variant} size={btn.size} onClick={btn.action}>{btn.title}</Button>
                ))
              }
            </ButtonWrapper>
        }
      </Footer>
      <ConversationDialog
        isOpen={isOpen}
        setOpen={value => setIsOpen(value)}
        conversations={npcConversation}
      />
    </React.Fragment>
  )
}
