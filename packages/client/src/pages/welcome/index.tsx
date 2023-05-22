import React, { useEffect } from 'react'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import { Button } from '../../components/base/Button'
import { Dialog, DialogContent, DialogTrigger } from '../../components/base/Dialog'
import { Input } from '../../components/base/Input'
import { useSetAtom } from 'jotai'
import { activePage_atom } from '../../atoms/globalAtoms'
import { clsx } from 'clsx'
import useLocalStorageState from '../../hooks/useLocalStorageState'
import useGame from '../../hooks/useGame'
import { Simulate } from 'react-dom/test-utils'
import play = Simulate.play
import { useMUD } from '../../MUDContext'

export default function Welcome() {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)
  const setActivePage = useSetAtom(activePage_atom)
  const [ mudBurnerWallet, setMudBurnerWallet ] = useLocalStorageState('mud:burnerWallet', window?.localStorage?.getItem('mud:burnerWallet'))

  return (
    <div
      className={clsx([
        'flex flex-col justify-center items-center bg-gray-400 gap-10',
        'bg-cover bg-center bg-opacity-10 bg-no-repeat relative',
      ])}>
      <section className="flex flex-col gap-2 z-10">
        <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[300px] mx-auto" />
        <p className="font-rancho text-2xl tracking-wider text-center">Imagination Engine</p>
        <Button size="xl" variant="accent" onClick={() => setActivePage('create')}
                className="rounded-full px-14 mt-8 uppercase">Create New</Button>
        <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
          <Button size="xl" variant="outline" onClick={() => setIsOpen(true)} className="rounded-full px-14 mt-2 uppercase">Load Existing</Button>
          <DialogContent>
            <p className='font-jost text-accent-3'>Paste your existing burner address here:</p>
            <Input placeholder={mudBurnerWallet ?? '0x1234...'} onChange={e => setMudBurnerWallet(e.target.value)} />
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
