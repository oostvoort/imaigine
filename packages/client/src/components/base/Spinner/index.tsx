import { clsx } from 'clsx'
import React from 'react'

interface SpinnerType {
  className?: string
  text?: string

}

export default function Spinner({ className, text }: SpinnerType) {
  return (
    <div className={clsx([ 'flex items-center justify-center uppercase text-[#2C3B47] gap-4', className ])}>
      <img src={'/assets/svg/spinner.svg'} alt={'Spinner Icon'}
           className={clsx([ 'animate-spin', 'fill-[#4FB800]' ])} draggable={false}/>
      <span>{text}</span>
    </div>
  )
}
