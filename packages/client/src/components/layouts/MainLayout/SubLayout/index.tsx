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

const VisualSummaryLayout = ({ children, summary, setIsOpen }: { children: React.ReactNode, summary?: any, setIsOpen?: () => void}) => {
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
        {/*<LocationContent*/}
        {/*  content={summary.text}*/}
        {/*  target={summary.target}*/}
        {/*  onTarget={setIsOpen}*/}
        {/*/>*/}
        {
          summary.scenario === undefined ? (
            <SkeletonParagraph />
          ) : (
            <div className={clsx([
              'text-[30px] text-[#BAC5F1]',
              'font-amiri',
            ])}>
              <p>{summary.scenario}</p>
              <p className={clsx('mt-8')}>
                Nearby NPC: <span className={clsx('cursor-pointer text-[#24E1FF]')} onClick={setIsOpen}>{summary.npc.name}</span>
              </p>
            </div>
          )
        }
        {/*<p className={'text-option-11 text-[30px] font-amiri'}>*/}
        {/*  Alice, guided by whispers of the Mystic Forest, embarked on a treacherous trek to the towering Everpeak Mountains.*/}
        {/*  She navigated dense foliage, encountered mystical creatures, and sought shelter in a hidden cave. The air*/}
        {/*  grew colder as she ascended, but her spirit burned with determination. Finally, she emerged at the*/}
        {/*  mountain&apos;s summit, greeted by breathtaking vistas and a newfound sense of accomplishment. The journey had*/}
        {/*  tested her resilience, but it had also awakened her inner strength. With a renewed spirit, Alice stood ready*/}
        {/*  to face the challenges awaiting her in the rugged wilderness of Everpeak.*/}
        {/*</p>*/}
      </div>
    </div>
  )
}

export default SubLayout
SubLayout.Sublayout = SubLayout
SubLayout.MapViewLayout = MapViewLayout
SubLayout.VisualSummaryLayout = VisualSummaryLayout
