import React, { useState } from 'react'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { useSetAtom } from 'jotai'
import { activeScreen_atom, SCREENS } from '@/states/global'
import useLocalStorage from '@/hooks/useLocalStorage'
import { verifyPrivateKey } from '@/global/utils'

const DUMMY_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
export default function TitleScreen() {
  const setActiveScreen = useSetAtom(activeScreen_atom)

  const [, setPrivateKey] = useLocalStorage('mud:burnerWallet', DUMMY_PRIVATE_KEY)

  const [isLoadExisting, setIsLoadExisting] = useState(false)

  const [input, setInput] = useState('')

  const handleLoadExisting = (privateKey: string) => {
    const isValid = verifyPrivateKey(privateKey)
    if (isValid) {
      setPrivateKey(privateKey)
      window.location.reload()
    }
    setIsLoadExisting(false)
  }

  return (
    <div className={clsx([
      'flex flex-col justify-center items-center bg-gray-900 gap-10 h-screen',
      'bg-cover bg-center bg-no-repeat relative',
    ])}>
      <BackgroundCarousel>
        <section className="flex flex-col items-center gap-2 z-10">
          <img
            src={`/assets/logo/imaigine_logo.svg`}
            alt={'Imaigine Logo'}
            className="w-[31.8em] h-[9.5em] mb-5"
            draggable={false}
          />
          <p className="font-inkFree text-white text-3xl tracking-wider text-center mb-8">Imagination Engine</p>
          <Button
            size="2xl"
            variant="accent"
            className="rounded-full px-14 mt-8 uppercase text-[#4FB800] font-jost text-xl w-[23.5em]"
            onClick={() => setActiveScreen(SCREENS.CREATE_AVATAR)}
          >
            Create New Character
          </Button>
          { isLoadExisting && <input value={input} onChange={(e) => setInput(e.target.value)}/>}
          <Button
            size="2xl"
            variant="outline"
            className="rounded-full px-14 mt-4 uppercase font-jost text-xl w-[17em]"
            onClick={() => {
              if (isLoadExisting) handleLoadExisting(input)
              else setIsLoadExisting(true)
            }}
          >
            Load Existing
          </Button>
        </section>
      </BackgroundCarousel>
    </div>
  )
}
