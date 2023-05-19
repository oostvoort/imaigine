import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import PlayerNav from '../shared/PlayerNav'

export default function MainLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  console.log({ pathname })

  return (
    <main className='flex flex-row-reverse flex-1 [&>div]:flex-1'>
      {
        // TODO: Nav to be shown here once the player is online or connected to the game
        pathname == '/game' && (
          <PlayerNav />
        )
      }
      {children}
    </main>
  )
}
