import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import React from 'react'

export default function Footer(){
  const isWorldMap = true

  return (
    <>
      <div className={clsx([
        'flex gap-x-3 my-8',
      ])}>
        {
          isWorldMap ?
            <div className={'h-[88px] flex items-center'}>
              <div className={'flex items-center 2 '}>
                <img src={'/src/assets/svg/hourglass.svg'} alt={'Hourglass Icon'} className={'w-[40px] '}/>
                <h3 className={'text-white font-amiri text-[30px] ml-2'}>Travelling to Silverstream</h3>
              </div>
            </div>
            :
            <>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Explore Surroundings
              </Button>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Follow the nearest trail
              </Button>
              <Button variant={'neutral'} size={'btnWithBgImg'}>
                Succumb to panic
              </Button>
            </>
        }
      </div>
    </>
  )
}
