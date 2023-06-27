import React from 'react'
import { clsx } from 'clsx'

type PropType = {
  children: React.ReactNode
}

const SubLayout = ({ children }: PropType) => {
  return (
    <div
      className={clsx([
        'flex',
        'w-full h-[820px]',
        'border border-[#AB8200]',
        'rounded-2xl',
        'bg-content-bg-gray bg-no-repeat bg-cover',
      ])}
    >
      {children}
    </div>
  )
}

const MapViewLayout = ({ children }: PropType) => {
  return (
    <div className={clsx(['w-full h-full'])}>
      {children}
    </div>
  )
}

const VisualSummaryLayout = ({ children }: PropType) => {
  return (
    <div
      className={clsx([
        'flex',
        'w-full h-full',
      ])}
    >
      {children}
    </div>
  )
}

export default SubLayout
SubLayout.Sublayout = SubLayout
SubLayout.MapViewLayout = MapViewLayout
SubLayout.VisualSummaryLayout = VisualSummaryLayout
