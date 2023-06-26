import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import React from 'react'

export default function Footer(){

  return (
    <>
      {/*todo: make it compound component*/}
      <div className={clsx([
        'flex gap-x-3 my-8',
      ])}>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Explore Surroundings
        </Button>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Follow the nearest trail
        </Button>
        <Button variant={'neutral'} size={'btnWithBgImg'}>
          Succumb to panic
        </Button>
      </div>
    </>
  )
}
