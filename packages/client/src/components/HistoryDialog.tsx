import React from 'react'

import { Dialog, DialogContent } from './base/Dialog'
import History from './historyContent/History'
import { clsx } from 'clsx'

type PropType = {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

const HistoryDialog = ({ isOpen, setOpen }: PropType) => {
  const [activeNav, setActiveNav] = React.useState<string>('history')

  const handleNavClick = (nav: string) => {
    setActiveNav(nav)
  }

  console.log(activeNav)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[70vw] p-8">
        <section className="relative min-h-[60vh]">
          <div className={clsx([
            'absolute left-[52%] top-2 flex gap-x-12',
            'text-xs',
            'font-jost font-medium uppercase tracking-widest',
          ])}>
            <span
              className={`cursor-pointer ${activeNav === 'history' ? 'text-white' : 'text-[#C79800]'}`}
              onClick={() => handleNavClick('history')}
            >
              History
            </span>
            <span
              className={`cursor-pointer ${activeNav === 'locations' ? 'text-white' : 'text-[#C79800]'}`}
              onClick={() => handleNavClick('locations')}
            >
              Locations
            </span>
            <span
              className={`cursor-pointer ${activeNav === 'npc' ? 'text-white' : 'text-[#C79800]'}`}
              onClick={() => handleNavClick('npc')}
            >
              NPC&apos;S
            </span>
            <span
              className={`cursor-pointer ${activeNav === 'players' ? 'text-white' : 'text-[#C79800]'}`}
              onClick={() => handleNavClick('players')}
            >
              Players
            </span>
          </div>
          { activeNav === 'history' && <History /> }
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default HistoryDialog
