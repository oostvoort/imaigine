import { Card as CardCore } from '../base'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'

const { Card, CardContent } = CardCore

type Props = {
  message: string
}

export default function LoadingScreen({ message }: Props) {

  return (
    <div className="absolute z-50 w-full h-full flex justify-center items-center bg-primary">
      <section className="flex-1 flex flex-col gap-10">
        <div className='flex flex-col gap-5'>
          <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[300px] mx-auto" />
          <p className="font-rancho text-2xl tracking-wider text-center">Imagination Engine</p>
        </div>
        <p className='font-bold text-4xl text-center'>Please wait...</p>
        <Card className='mx-auto'>
          <CardContent className='min-h-[100px] min-w-xl mx-auto flex flex-col justify-center items-center p-10 gap-10'>
            <p className='font-bold tracking-wide text-xl'>{ message }</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
