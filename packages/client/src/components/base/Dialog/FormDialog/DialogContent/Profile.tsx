import { clsx } from 'clsx'
import React from 'react'

export function Profile() {
  return (
    <div className={clsx([ 'md:w-[1186px] h-full w-full', 'p-sm' ])}>
      <div className={clsx([ 'flex gap-6' ])}>
        <div className="w-[480px] h-[620px]">
          <img
            className="w-full h-full rounded rounded-lg object-cover"
            src={'/src/assets/avatar/avatar1.jpg'}
            alt={'Avatar 1'}
          />
        </div>

        <div className={clsx([ 'flex-1' ])}>
          <div className={clsx([ 'flex flex-col gap-y-md' ])}>
            <div className={clsx([ 'bg-option-13', 'p-sm', 'rounded-lg', 'border-b-[1px] border-option-12' ])}>
              <div className={clsx([ 'flex items-center space-x-2' ])}>
                <p className={clsx([ 'text-option-11 text-xl', 'font-segoe', 'leading-8 tracking-[0.4px]' ])}>Name :</p>
                <p
                  className={clsx([ 'text-white text-xl', 'font-segoe font-semibold', 'leading-8 tracking-[0.4px]' ])}>Alice</p>
              </div>

              <div className={clsx([ 'flex items-center space-x-2', 'mt-sm' ])}>
                <p
                  className={clsx([ 'text-option-11 text-xl uppercase', 'font-segoe', 'leading-8 tracking-[0.4px]' ])}>LVL
                  :</p>
                <p
                  className={clsx([ 'text-option-11 text-xl uppercase', 'font-segoe', 'leading-8 tracking-[0.4px]' ])}>1</p>
              </div>
            </div>

            <div>
              <h3
                className={clsx([ 'text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-sm' ])}>Description</h3>
              <div className={clsx([ 'bg-option-13', 'p-sm', 'rounded-lg', 'border-b-[1px] border-option-12' ])}>
                <p
                  className={clsx([ 'text-option-11 text-left text-xl', 'tracking-[0.4px] leading-8', 'font-segoe' ])}>Alice
                  is a young woman with a spirited nature and an adventurous spark in her eyes. Her wavy chestnut
                  hair cascades down her shoulders, complementing her warm hazel eyes that shine with determination.
                  Freckles dance across her fair skin, adding to her youthful appearance. Alice's attire reflects her
                  connection to nature, adorned with earthy tones and practical garments suitable for her travels. She
                  carries a staff adorned with intricate nature-themed carvings, a symbol of her magical prowess and
                  connection to the natural world.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
