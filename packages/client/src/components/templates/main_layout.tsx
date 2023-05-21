import { ReactNode } from 'react'
import PlayerNav from '../shared/PlayerNav'
import { useAtomValue } from 'jotai'
import { activePage_atom } from '../../atoms/globalAtoms'

export default function MainLayout({ children }: { children: ReactNode }) {
  const activePage = useAtomValue(activePage_atom)

  return (
    <main className='flex flex-row-reverse flex-1 [&>div]:flex-1'>
      {
        // TODO: Nav to be shown here once the player is online or connected to the game
        activePage == 'game' && (
          <PlayerNav />
        )
      }
      {children}
    </main>
  )
}
