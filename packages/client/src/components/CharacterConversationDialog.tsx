import React from 'react'
import { Dialog, Button } from './base'
import ConversationLayout from './templates/ConversationLayout'
import blacksmithIcon from '../assets/blacksmith.jpeg'
import { useAtomValue } from 'jotai'
import { selectedCharacter_atom } from '../atoms/globalAtoms'
import { generateIpfsImageLink } from '../lib/utils'

type Props = {
  isOpen: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CharacterConversationDialog({ isOpen, setOpen }: Props) {
  const character = useAtomValue(selectedCharacter_atom)

  if (character == null) return <></>

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <Dialog.DialogContent className="flex gap-5 w-full sm:max-w-7xl border border-accent !rounded-2xl">
        <section className="flex-grow-0">
          <img src={generateIpfsImageLink(character.image.value)} alt={String(character.image.value)} className="w-[500px] rounded-xl" />
        </section>
        <section className="flex-1 flex flex-col">
          {/* Conversation box */}
          <div className="flex-1">
            <ConversationLayout>
              {/* NOTE: when inserting a new chat from anyone, new ones should be on top of position */}
              <ConversationLayout.TypingBubble authorIcon={generateIpfsImageLink(character.image.value)} />
              <ConversationLayout.ReceiverBubble
                authorIcon={generateIpfsImageLink(character.image.value)}
                text="I see. This sword has a history, then. I can fix it, but it won't be cheap. I'll need some rare materials and a few days to do it right."
              />
              <ConversationLayout.Notification
                text="Milena channels her dark magic, casting a curse that drains 20 HP from Alicia."
              />
              <ConversationLayout.SenderBubble
                text="My sword needs repairing. It&apos;s taken a beating in a recent battle, and I need it to be sharp and
                strong again."
              />
              <ConversationLayout.ReceiverBubble
                authorIcon={generateIpfsImageLink(character.image.value)}
                authorName="Silverio of Khazad-dûm"
                text="I&apos;m Silverio, and I&apos;m the best blacksmith in this village. What can I do for you?"
              />
              <ConversationLayout.SenderBubble
                text="Hello, are you Silverio? I&apos;m in need of your services."
              />
            </ConversationLayout>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-3 flex-grow-0">
            <Button size="xl">Ask how much</Button>
            <Button size="xl">Say money&apos;s not an issue</Button>
            <Button size="xl">Ask where to find the materials</Button>
          </div>
        </section>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}
