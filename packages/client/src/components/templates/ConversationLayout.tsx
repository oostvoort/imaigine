import React from 'react'

const SenderBubble = ({
  text, author,
}: { text: string, author?: string }) => (
  <div
    className="rounded-lg p-3 bg-conversation-sender flex flex-col gap-1 text-start ml-auto max-w-prose">
    {
      author && (
        <h4 className="font-bold text-primary-foreground text-md">{author}</h4>
      )
    }
    <p className="font-normal text-primary-foreground text-sm">{text}</p>
  </div>
)

const ReceiverBubble = ({
  text, author,
}: { text: string, author?: string }) => (
  <div
    className="rounded-lg p-3 bg-conversation-receiver flex flex-col gap-1 text-start mr-auto max-w-prose">
    {
      author && (
        <h4 className="font-bold text-conversation-receiver-foreground text-md">{author}</h4>
      )
    }
    <p className="font-normal text-conversation-receiver-foreground text-sm">{text}</p>
  </div>
)

const Notification = ({ text }: { text: string }) => <p className="text-foreground text-xs text-center my-2 tracking-wider">{text}</p>

const ConversationLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse gap-3 h-auto max-h-[400px] overflow-y-auto">
    {children}
  </div>
)

export default ConversationLayout
ConversationLayout.SenderBubble = SenderBubble
ConversationLayout.ReceiverBubble = ReceiverBubble
ConversationLayout.Notification = Notification
