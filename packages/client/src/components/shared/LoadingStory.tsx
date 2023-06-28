import React from 'react'
import imaigineIcon from '@/assets/logo/imaigine_logo.svg'
import { clsx } from 'clsx'

type PropType = {
  message?: string
  isLoading?: boolean
}

const LoadingStory = ({ message, isLoading }: PropType) => {
  return (
    <div className={clsx([
      'w-full h-screen px-20 py-16',
      'flex flex-col justify-between',
    ])}>
      <img
        src={imaigineIcon}
        alt={String(imaigineIcon)}
        className={clsx('aspect-auto w-[15em]')}
      />
      <div className={clsx('flex justify-between')}>
        <p className={clsx([
          'max-w-[1100px]',
          'text-white text-3xl',
          'font-amiri leading-10',
        ])}>
          {message}
        </p>
        <p className={clsx('self-end')}>{ isLoading ? 'Loading ...' : 'Continue' }</p>
      </div>
    </div>
  )
}

export default LoadingStory
