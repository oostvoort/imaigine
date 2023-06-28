import React from 'react'
import { clsx } from 'clsx'
import Header from '@/components/layouts/MainLayout/NavigationLayout'
import ConversationLayout from '@/components/layouts/MainLayout/ConversationLayout'

const Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx([ 'flex flex-row-reverse flex-1 [&>div]:flex-1' ])}>
      {children}
    </div>
  )
}

const FullScreenLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={clsx([ 'w-screen h-screen' ])}>{children}</div>
}

const ContentLayout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div
    className={clsx([ 'flex flex-col items-center', 'h-screen w-screen', 'bg-main-bg-neutral bg-no-repeat bg-cover', `${className}` ])}>
    <Header />
    {children}
  </div>
}

export default Template
Template.Template = Template
Template.FullScreenLayout = FullScreenLayout
Template.ContentLayout = ContentLayout
Template.ConversationLayout = ConversationLayout
