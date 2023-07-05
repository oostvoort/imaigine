import React from 'react'
import { clsx } from 'clsx'
import { SkeletonParagraph } from '@/components/base/Skeleton'
import LocationContent from '@/components/shared/LocationContent'

const SubLayout = ({ children }: { children: React.ReactNode }) => {
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

const MapViewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx(['w-full h-full'])}>
      {children}
    </div>
  )
}

const VisualSummaryLayout = ({ children, summary, setIsOpen }: { children: React.ReactNode, summary: any, setIsOpen: () => void}) => {
  return (
    <div
      className={clsx([
        'flex',
        'w-full h-full',
      ])}
    >
      <div className={clsx([
        'aspect-video w-1/2',
        'border-r-[1px] border-[#AB8200]',
        'flex',
      ])}>
        <React.Fragment>
          {children}
        </React.Fragment>
      </div>
      <div className={clsx([
        'w-1/2 p-[30px]',
        'bg-content-bg-gray bg-no-repeat bg-cover',
        'rounded-r-2xl',
      ])}>
        <LocationContent
          content={summary.text}
          target={summary.target}
          onTarget={setIsOpen}
        />
        {/*{summary === undefined && <SkeletonParagraph />}*/}
        {/*<p className={clsx([ 'font-amiri', 'text-[30px] text-[# BAC5F1]' ])}>{summary}</p>*/}
      </div>
    </div>
  )
}

export default SubLayout
SubLayout.Sublayout = SubLayout
SubLayout.MapViewLayout = MapViewLayout
SubLayout.VisualSummaryLayout = VisualSummaryLayout
