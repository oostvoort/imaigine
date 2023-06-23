import { clsx } from 'clsx'
import React from 'react'
import { Input } from '@/components/base/Input'
import { Button } from '@/components/base/Button'

export default function WishPrompt() {
  const isGood = false

  return (
    <div
      className={clsx([ 'h-screen w-screen', 'flex items-center justify-center', 'bg-cover bg-no-repeat bg-center', {'bg-mainGood': isGood}, {'bg-mainEvil': !isGood} ])}>
      <div
        className={clsx([ 'flex gap-6', 'h-[75%] w-[calc(100%-25rem)]', 'border border-option-10 rounded-2xl shadow-lg', 'bg-modal', 'p-md' ])}>
        <div className={clsx([ 'w-[468px] h-full'])}>
          <img src={isGood ? '/src/assets/avatar/img_good_npc.jpg' : '/src/assets/avatar/img_evil_npc.jpg'} alt={'NPC Image'} className={'object-cover w-full h-full rounded-lg'}/>
        </div>

        <div className={clsx([ 'flex flex-col justify-between flex-1' ])}>
          <p className="text-3xl text-option-11 font-amiri leading-[48px] pt-sm">
            In a blinding flash, Alice found herself before a radiant goddess who recognized her pure heart. Pleased by
            her virtuous deeds, the goddess granted her a single wish, capable of shaping the world. Overwhelmed by the
            possibilities, Alice pondered the responsibility. The fate of countless lives rested in her hands. Will she
            choose wisely, bringing hope and harmony, or succumb to the allure of personal gain? The universe held its
            breath, awaiting her answer.
          </p>

          <div className={clsx([ 'w-full ', 'flex flex-col' ])}>
            <Input placeholder={'Enter your wish...'} className={'my-md'} variant={isGood ? 'default' : 'evil'}/>

            <div className={'flex justify-center'}>
              <Button variant={isGood ? 'good' : 'evil'} size={'btnWithBgImg'} className={clsx([ 'mb-2' ])}>Grant my wish</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
