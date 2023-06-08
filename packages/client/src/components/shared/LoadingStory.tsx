import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'

type PropType = {
  message?: string
  isLoading: boolean
}

export const LoadingStory = ({ message, isLoading }: PropType) => {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-between px-20 py-16">
      <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[15em]" />
      <div className="flex justify-between">
        <p className="max-w-[1100px] text-white text-3xl font-amiri leading-10 animate-revealAnimation">
          {message}
        </p>
        <p className="self-end">{ isLoading ? 'Loading ...' : 'Continue' }</p>
      </div>
    </div>
  )
}
