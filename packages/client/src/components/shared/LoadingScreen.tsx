import { Card, CardContent } from '@/components/base/Card'
import React from 'react'
import { clsx } from 'clsx'
import AILoader from '@/components/shared/AILoader'

type Props = {
  message: string
}

export default function LoadingScreen({ message }: Props) {

  return (
    <div className={clsx([
      'w-full mt-10 z-50',
      'absolute flex justify-center items-center',
    ])}>
      <section className="flex-1 flex flex-col gap-10">
        <div className='flex flex-col gap-5'>
          <img src={"/assets/logo/imaigine_logo.svg"} alt={"imaigine icon"} className="w-[225px] mx-auto" />
          <p className={clsx([
            'text-white text-sm text-center',
            'font-inkFree  tracking-wider',
          ])}>
            Imagination Engine
          </p>
        </div>
        <p className={clsx([
          'text-white text-4xl text-center',
          'font-segoeBold -mb-6',
        ])}>
          Please wait...
        </p>
        <Card className='mx-auto'>
          <CardContent className={clsx([
            'w-[32em] h-[30em] mx-auto p-10',
            'flex flex-col justify-center items-center gap-10',
            'shadow-2xl',
          ])}>
            <AILoader message={message} />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
