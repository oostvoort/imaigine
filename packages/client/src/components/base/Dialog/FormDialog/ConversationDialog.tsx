import React from 'react'
import { Dialog } from '@/components/base/Dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import ConversationLayout from '@/components/layouts/MainLayout/ConversationLayout'
import useNPCInteraction from '@/hooks/useNPCInteraction'
import { useMUD } from '@/MUDContext'
import usePlayer from '@/hooks/v1/usePlayer'
import { currentLocation_atom, npcConversation_atom } from '@/states/global'
import { useAtomValue, useSetAtom } from 'jotai'
import useLocationInteraction from '@/hooks/useLocationInteraction'
import { IPFS_URL_PREFIX } from '@/global/constants'

type PropType = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  conversations?: any
}
export default function ConversationDialog({
  isOpen,
  setOpen,
  conversations,
}: PropType) {
  const { createNPCInteraction, interactNPC } = useNPCInteraction()
  const { createLocationInteraction } = useLocationInteraction()
  const { player } = usePlayer()
  const {
    network: {
      playerEntity,
    },
  } = useMUD()

  const setNPCConversation = useSetAtom(npcConversation_atom)
  const currentLocation = useAtomValue(currentLocation_atom)

  const handlePlayerResponse = (choiceId: number ,response: string) => {
    createNPCInteraction.mutate({ choiceId: choiceId, npcId: currentLocation.npc.npcId })
    setNPCConversation(prevConversation => ({
      ...prevConversation,
      conversationHistory: [
        {
          logId: prevConversation.conversationHistory.length + 2,
          by: 'player',
          text: response
        },
        ...prevConversation.conversationHistory,
      ]
    }))
  }

  React.useEffect(() => {
    if (createNPCInteraction.isSuccess) {
      if ((createNPCInteraction.data).toNumber() >= 1 && (createNPCInteraction.data).toNumber() <= 3) {
        if (!player.config) throw new Error('No generated Player')
        interactNPC.mutate({
          playerIpfsHash: [`${player.config.value}`],
          npcEntityId: currentLocation.npc.npcId,
          npcIpfsHash: currentLocation.npc.config.value,
          playerEntityId: [ `${playerEntity}` ],
        })
      }
    }
  }, [ createNPCInteraction.isSuccess ])

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

  const handleCloseInteraction = () => {
    createLocationInteraction.mutate({ choiceId: 0, })
  }

  React.useEffect(() => {
    if (createLocationInteraction.isSuccess) {
      console.log({createLocationInteraction})
    }
  }, [createLocationInteraction.isSuccess])


  return (
    <Dialog open={isOpen} onOpenChange={() => null}>
      <DialogPrimitive.Portal
        className={'fixed inset-0 z-50  flex items-start justify-center relative'}>
        <DialogPrimitive.Overlay
          style={{ backgroundImage: `url(${currentLocation.image ? `${IPFS_URL_PREFIX}/${currentLocation.image}` : '/src/assets/background/bg1.jpg' })` }}
          className={clsx([
            'fixed inset-0',
            'flex items-start justify-center',
            'bg-cover bg-no-repeat',
            'duration-[3000ms] delay-1000 ease-in-out',
          ])}
        >
          <div className={'backdrop-blur h-screen w-screen'} />

          <DialogPrimitive.Close
            className={'absolute right-4 top-4 p-1'}
            onClick={() => {
              handleCloseInteraction()
              setOpen && setOpen(false)
            }}
          >
            <img src={'/src/assets/svg/close.svg'} alt={'Close Icon'} />
          </DialogPrimitive.Close>

          {/*IF MULTIPLAYER*/}
          {/*<div className={clsx([ 'text-4xl absolute left-[4.5%] top-24', 'my-lg' ])}>*/}
          {/*  <div className={clsx([ 'h-[75%]', 'flex flex-col' ])}>*/}
          {/*    {*/}
          {/*      players.map((player, key) => (*/}
          {/*        <div key={key} className={'relative flex items-center z-10  justify-center my-sm border rounded-full w-[128px] h-[128px] border border-2 border-accent'}>*/}
          {/*          <Avatar className={'h-full w-full'}>*/}
          {/*            <AvatarImage src={player.imgSrc} alt={'Avatar Image'}/>*/}
          {/*            <AvatarFallback>{player.avatarFallBack}</AvatarFallback>*/}
          {/*          </Avatar>*/}
          {/*          <span className={'absolute -bottom-4 rounded-md py-0.5 px-1.5 bg-[#000000A8] text-[14px] leading-[32px] font-segoe tracking-[0.28]'}>{player.avatarName}</span>*/}

          {/*          <div className={'absolute -right-[15%] z-10 flex justify-center items-center  rounded-full h-11 w-11 bg-red-400 bg-accent'}>*/}
          {/*            <img src={'src/assets/svg/hourglass.svg'} alt={'Hourglass Icon'} className={'rotate-180'}/>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      ))*/}
          {/*    }*/}
          {/*  </div>*/}
          {/*</div>*/}


          <DialogPrimitive.Content
            className={clsx([
              'sm:min-w-[1479px] h-[75%] p-10 top-24',
              'rounded-3xl border border-option-10 !outline-0',
              'bg-modal bg-cover',
              'fixed bg-background p-md shadow-lg',
            ])}
          >

            <section className={clsx([
              'flex',
              'h-full h-full',
            ])}>
              <div className={clsx('w-4/12')}>
                <img
                  src={`${currentLocation.npc ? `${IPFS_URL_PREFIX}/${currentLocation.npc.image}` : '/src/assets/avatar/avatar1.jpg'}`}
                  alt={'NPC Image'}
                  className="w-full h-full rounded rounded-xl object-cover"
                />
              </div>

              <div className={clsx([
                'w-8/12 h-full',
                'flex flex-col items-center',
              ])}>
                <ConversationLayout>
                  {
                    createNPCInteraction.data?.toNumber() === 4 &&
                    <p className={clsx('text-3xl font-amiri tracking-wide text-center')}>
                      {currentLocation.npc.config.name} vanished into thin air.
                    </p>
                  }
                  {
                    interactNPC.isLoading && (
                      <ConversationLayout.TypingBubble
                        authorIcon={`${currentLocation ? `${IPFS_URL_PREFIX}/${currentLocation.npc.image}` : '/src/assets/avatar/avatar1.jpg'}`}
                      />
                    )
                  }
                  {
                    conversations?.conversationHistory?.map((conversation: any) => {
                      if (conversation.by === 'interactable') {
                        return (
                          <ConversationLayout.ReceiverBubble
                            key={conversation.logId}
                            authorName={currentLocation.npc.config.name ?? 'NPC Name'}
                            authorIcon={`${currentLocation ? `${IPFS_URL_PREFIX}/${currentLocation.npc.image}` : '/src/assets/avatar/avatar1.jpg'}`}
                            text={conversation.text}
                          />
                        )
                      } else if (conversation.by === 'player') {
                        return (
                          <ConversationLayout.SenderBubble
                            key={conversation.logId}
                            text={conversation.text}
                          />
                        )
                      } else {
                        return null
                      }
                    })
                  }
                </ConversationLayout>
              </div>
            </section>
          </DialogPrimitive.Content>

          <section className={clsx([
            'absolute bottom-8 w-full',
          ])}>
            <div className={'flex justify-center'}>
              {
                interactNPC.isLoading ? (
                  <p className={clsx('text-3xl font-amiri tracking-wide')}>
                    Waiting for {currentLocation.npc.config.name}
                  </p>
                ) : (
                  conversations.option && (
                    <div className={clsx('flex gap-x-3')}>
                      <Button
                        variant={'neutral'}
                        size={'btnWithBgImg'}
                        onClick={() => handlePlayerResponse(1, conversations.option.evil.evilChoise)}
                      >
                        {conversations.option.evil.evilChoise}
                      </Button>
                      <Button
                        variant={'neutral'}
                        size={'btnWithBgImg'}
                        onClick={() => handlePlayerResponse(2, conversations.option.good.goodChoise)}
                      >
                        {conversations.option.good.goodChoise}
                      </Button>
                      <Button
                        variant={'neutral'}
                        size={'btnWithBgImg'}
                        onClick={() => handlePlayerResponse(3, conversations.option.neutral.neutralChoise)}
                      >
                        {conversations.option.neutral.neutralChoise}
                      </Button>
                    </div>
                  )
                )
              }
            </div>
          </section>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
