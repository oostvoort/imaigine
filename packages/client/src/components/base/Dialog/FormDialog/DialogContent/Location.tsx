import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import React from 'react'

export default function Location() {
  return (
    <div className={clsx([ 'md:w-[1192px]  h-full w-full', 'p-sm' ])}>
      <div className="flex gap-6">
        <div className="w-[430px]">
          <img
            className="w-full h-full rounded rounded-xl object-cover"
            src={'/assets/background/bg1.jpg'}
            alt={'RPG 40 Image'}
          />
        </div>
        <div className=" flex-1 flex-col justify-between">
          <div>
            <h1 className={clsx([ 'text-4xl text-option-9 font-amiri font-bold leading-[48px]', 'mb-3' ])}>Everpeak
              Mountain</h1>
            <p className="text-3xl text-option-11 font-amiri leading-10">
              A majestic range reaching towards the sky, their rugged peaks kissed by snow. Towering cliffs and deep
              valleys carve the landscape, while ancient pines cling to the slopes. A realm of awe and mystery, where
              echoes of legends and the whispers of nature intertwine in harmony.
            </p>
          </div>

          <div className={'flex justify-center mt-lg'}>
            <Button variant={'neutral'} size={'btnWithBgImg'}>Travel to Everpeak Mountains</Button>

          </div>
        </div>
      </div>
    </div>
  )
}
