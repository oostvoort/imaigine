import React from 'react'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'

export default function StartingScreen() {
  return (
    <div className={clsx([
      'flex flex-col justify-center items-center bg-gray-900 gap-10 h-screen',
      'bg-cover bg-center bg-no-repeat relative',
    ])}>
      <BackgroundCarousel>
        <section className="flex flex-col items-center gap-2 z-10">
          <img
            src={`/src/assets/logo/imaigine_logo.svg`}
            alt={'Imaigine Logo'}
            className="w-[31.8em] h-[9.5em] mb-5"
          />
          <p className="font-inkFree text-white text-3xl tracking-wider text-center mb-8">Imagination Engine</p>
          <Button
            size="2xl"
            variant="accent"
            className="rounded-full px-14 mt-8 uppercase text-[#4FB800] font-jost text-xl w-[23.5em]"
          >
            Create New Character
          </Button>
          <Button
            size="2xl"
            variant="outline"
            className="rounded-full px-14 mt-4 uppercase font-jost text-xl w-[17em]"
          >
            Load Existing
          </Button>
        </section>
      </BackgroundCarousel>
    </div>
  )
}
