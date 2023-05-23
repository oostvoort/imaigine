import React from 'react'
import { Dialog, Button } from './base'
import ConversationLayout from './templates/ConversationLayout'
import { generateIpfsImageLink } from '../lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import useGame from '../hooks/useGame'
import { useMUD } from '../MUDContext'
import { clsx } from 'clsx'
import useSaveInteraction from '../hooks/useSaveInteraction'
import envs from '../env'

type Props = {
  isOpen?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CharacterConversationDialog({ isOpen, setOpen }: Props) {
  const {
    systemCalls,
    network: { playerEntity }
  } = useMUD()
  const {
    player,
    story,
    currentInteraction,
    currentLocation,
  } = useGame()

  const saveIntertactionMutation = useSaveInteraction()

  async function onClickSaveInteractionTest(text: string, index: number) {
    if (!playerEntity) return
    await systemCalls.saveInteraction({
      mode: 'interactable',
      storySummary: story.summary.value,
      location: {
        name: currentLocation.name.value,
        summary: currentLocation.summary.value,
      },
      action: text,
      activeEntity: {
        isAlive: player.alive,
        summary: player.summary.value,
        name: player.name.value,
      },
      logHash: currentInteraction.logHash?.value ?? '',
      otherEntities: [
        {
          name: currentInteraction.entity.name,
          summary: currentInteraction.entity.name,
          isAlive: currentInteraction.entity.alive,
        },
        ...currentInteraction.otherParticipants.map(participant => {
          return {
            name: participant.name,
            summary: participant.summary,
            isAlive: participant.alive,
          }
        }),
      ],
    }, String(index), currentInteraction.entity.entity, [ playerEntity, ...currentInteraction.otherParticipants.map(participant => participant.entity) ])
  }

  const log = useQuery({
    queryKey: ['log', JSON.stringify(currentInteraction)],
    queryFn: async () => {
      const response = await (await fetch(`${envs.API_IPFS_URL_PREFIX}/${currentInteraction.logHash.value}`)).json()
      console.log({ response })
      return response
    },
    enabled: Boolean(currentInteraction)
  })


  const character = currentInteraction?.entity

  if (character == null) return <></>

  return (
    <Dialog.Dialog open={Boolean(character)} onOpenChange={open => setOpen?.(open)}>
      <Dialog.DialogContent className="flex gap-5 w-full sm:max-w-[90vw] border border-accent !rounded-2xl">
        <section className="flex-grow-0">
          <img src={generateIpfsImageLink(character.image)} alt={String(character.image)} className="w-[500px] rounded-xl my-auto h-full object-cover" draggable={false} />
        </section>
        <section className="flex-1 flex flex-col">
          {/* Conversation box */}
          <div className="flex-1">
            <ConversationLayout>
              {/* NOTE: when inserting a new chat from anyone, new ones should be on top of position */}
              {/*<ConversationLayout.TypingBubble authorIcon={generateIpfsImageLink(character.image)} />*/}
              {/*<ConversationLayout.ReceiverBubble*/}
              {/*  authorIcon={generateIpfsImageLink(character.image)}*/}
              {/*  text="I see. This sword has a history, then. I can fix it, but it won't be cheap. I'll need some rare materials and a few days to do it right."*/}
              {/*/>*/}
              {
                saveIntertactionMutation.isPending && <ConversationLayout.TypingBubble authorIcon={generateIpfsImageLink(character.image)} />
              }
              {
                log.isSuccess &&
                log.data
                  .reverse()
                  .map(item => (
                  <ConversationLayout.Notification
                    key={JSON.stringify(item)}
                    text={item}
                  />
                ))
              }
              {/*<ConversationLayout.SenderBubble*/}
              {/*  text="My sword needs repairing. It&apos;s taken a beating in a recent battle, and I need it to be sharp and*/}
              {/*  strong again."*/}
              {/*/>*/}
              {/*<ConversationLayout.ReceiverBubble*/}
              {/*  authorIcon={generateIpfsImageLink(character.image)}*/}
              {/*  authorName="Silverio of Khazad-dûm"*/}
              {/*  text="I&apos;m Silverio, and I&apos;m the best blacksmith in this village. What can I do for you?"*/}
              {/*/>*/}
              {/*<ConversationLayout.SenderBubble*/}
              {/*  text="Hello, are you Silverio? I&apos;m in need of your services."*/}
              {/*/>*/}
              <ConversationLayout.ReceiverBubble authorName={character.name} authorIcon={generateIpfsImageLink(character.image)} text={currentInteraction.initialMsg} />
            </ConversationLayout>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-3 flex-grow-0">
            {
              currentInteraction.possible.map((action, index) => {
                const isAction = action.mode == 'action'
                return <Button
                  key={JSON.stringify(action)}
                  size="lg"
                  className={clsx(([
                    {
                      'border border-accent/50':isAction
                    }
                  ]))}
                  onClick={() => saveIntertactionMutation.mutate({ text: action.content, index })}
                >
                  {`${!isAction ? '"' : ''}${action.content}${!isAction ? '"' : ''}`}
                </Button>
              })
            }
          </div>
        </section>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}
