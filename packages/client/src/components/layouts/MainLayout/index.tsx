import React from 'react'
import { clsx } from 'clsx'
import Header from '@/components/layouts/MainLayout/NavigationLayout'
import ConversationLayout from '@/components/layouts/MainLayout/ConversationLayout'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { useAtomValue } from 'jotai'
import { currentLocation_atom } from '@/states/global'

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

const MinigameLayout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const currentLocation = useAtomValue(currentLocation_atom)

  const minigameLayoutRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if(minigameLayoutRef.current){
      if(currentLocation.image){
        minigameLayoutRef.current.style.backgroundImage = `url(${IPFS_URL_PREFIX}/${currentLocation.image})`
      }else{
        minigameLayoutRef.current.style.backgroundImage = `url('/assets/background/bg1.jpg')`
      }
    }
  }, [currentLocation.image])

  return (
    <React.Fragment>
      <div
        ref={minigameLayoutRef}
        className={clsx([ 'flex items-center', 'h-screen w-screen', 'bg-no-repeat bg-cover', 'relative', className ])}>
        <div className={'absolute h-full w-full backdrop-blur inset-0 '} />
        <Header />
        {children}
      </div>
    </React.Fragment>
  )
}

const WaitingForOpponent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={clsx([ 'waiting-for-opponent-wrapper', className ])}>
      {children}
    </div>
  )
}

const ChooseWeapon = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <React.Fragment>
      <div className={clsx([ 'choosing-weapon-wrapper', className ])}>
        {children}
      </div>
    </React.Fragment>
  )
}

const MatchComparison = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <React.Fragment>
      <div className={clsx([ 'comparison-of-weapons-wrapper', className ])}>
        {children}
      </div>
    </React.Fragment>
  )
}

const MatchStatus = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <React.Fragment>
      <div className={clsx([ 'status-of-match-wrapper', className ])}>
        {children}
      </div>
    </React.Fragment>
  )
}



export default Template
Template.Template = Template
Template.FullScreenLayout = FullScreenLayout
Template.ContentLayout = ContentLayout
Template.ConversationLayout = ConversationLayout
Template.MinigameLayout = MinigameLayout
MinigameLayout.WaitingForOpponent = WaitingForOpponent
MinigameLayout.ChooseWeapon = ChooseWeapon
MinigameLayout.MatchComparison = MatchComparison
MinigameLayout.MatchStatus = MatchStatus

