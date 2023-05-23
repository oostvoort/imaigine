import React from 'react'
import { clsx } from 'clsx'

const SenderBubble = ({
  text, author,
}: { text: string, author?: { icon: string, name: string } }) => (
  <div
    className="rounded-lg p-3 bg-conversation-sender flex flex-col gap-1 text-start ml-auto max-w-prose">
    {
      author && (
        <h4 className="font-bold text-primary-foreground text-md">{author.name}</h4>
      )
    }
    <p className="font-normal text-primary-foreground text-xl">{text}</p>
  </div>
)

const ReceiverBubble = ({
  text, authorIcon, authorName,
}: { text: string, authorIcon: string, authorName?: string, isTyping?: boolean }) => (
  <div className="flex items-center gap-3 justify-start">
    <img src={authorIcon} alt={JSON.stringify(authorIcon)}
         className="w-12 aspect-square rounded-full object-cover object-top" />
    <div
      className="rounded-lg p-3 bg-conversation-receiver flex flex-col gap-1 text-start mr-auto max-w-prose">
      {
        authorName && (
          <h4 className="font-bold text-conversation-receiver-foreground text-xl">{ authorName }</h4>
        )
      }
      <p className="font-normal text-conversation-receiver-foreground text-xl">{text}</p>
    </div>
  </div>
)

const TypingBubble = ({
  authorIcon
}: { authorIcon: string }) => (
  <div className="flex items-center gap-3 justify-start">
    <img src={authorIcon} alt={JSON.stringify(authorIcon)}
         className="w-10 aspect-square rounded-full object-cover object-top" />
    <div
      className={clsx([
        "rounded-lg px-3 py-1 bg-conversation-receiver gap-1 text-start mr-auto",
      ])}>
      <svg className='w-10 scale-[1.4] translate-x-[13px]' version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px"
           y="0px"
           viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
        <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1" />
        </circle>
        <circle fill="#fff" stroke="none" cx="26" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2" />
        </circle>
        <circle fill="#fff" stroke="none" cx="46" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3" />
        </circle>
      </svg>
    </div>
  </div>
)

const Notification = ({ text }: { text: string }) => <p
  className="text-foreground text-md text-center my-2 tracking-wider">{text}</p>

const ConversationLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse gap-3 h-auto max-h-[700px] overflow-y-auto">
    {children}
  </div>
)

export default ConversationLayout
ConversationLayout.SenderBubble = SenderBubble
ConversationLayout.ReceiverBubble = ReceiverBubble
ConversationLayout.Notification = Notification
ConversationLayout.TypingBubble = TypingBubble
