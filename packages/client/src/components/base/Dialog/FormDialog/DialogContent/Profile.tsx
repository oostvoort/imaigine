import { clsx } from 'clsx'
import React from 'react'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { Skeleton, SkeletonParagraph } from '@/components/base/Skeleton'
import usePlayer from '@/hooks/v1/usePlayer'
import TypingParagraph from '@/components/shared/TypingParagraph'

export function Profile() {
  const { player, ipfsData } = usePlayer()

  const playerInformation = {
    image: `${IPFS_URL_PREFIX}/${player.image?.value}`,
    name: ipfsData.data?.name,
    description: ipfsData.data?.description,
  }

  return (
    <div className={clsx([ 'md:w-[1186px] h-full w-full', 'p-sm' ])}>
      <div className={clsx([ 'flex gap-6' ])}>
        <div className="w-[480px] h-[620px]">
          {
            player && player.image
              ? <img
                className="w-full h-full rounded rounded-lg object-cover"
                src={playerInformation.image}
                alt={'Profile Avatar'}
                draggable={false} />
              : <Skeleton className={'w-full h-full bg-[#485476] rounded-[4px]'} />
          }
        </div>

        <div className={clsx([ 'flex-1' ])}>
          <div className={clsx([ 'flex flex-col gap-y-md' ])}>
            <div className={clsx([ 'bg-option-13', 'p-sm', 'rounded-lg', 'border-b-[1px] border-option-12' ])}>
              <div className={clsx([ 'flex items-center space-x-2' ])}>
                <p className={clsx([ 'text-option-11 text-xl', 'font-segoe', 'leading-8 tracking-[0.4px]' ])}>Name :</p>
                {
                  playerInformation.name
                    ? <TypingParagraph
                      className={clsx([ 'text-white text-xl', 'font-segoe font-semibold', 'leading-8 tracking-[0.4px]' ])}
                      text={playerInformation.name}
                      typingSpeed={5} />
                    : <Skeleton className={'bg-[#485476] rounded-[4px] w-2/4 h-[30px]'} />
                }

              </div>
            </div>

            <div>
              <h3
                className={clsx([ 'text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-sm' ])}>Description</h3>
              <div className={clsx([ 'bg-option-13', 'p-sm', 'rounded-lg', 'border-b-[1px] border-option-12' ])}>
                {
                  playerInformation.description
                    ? <TypingParagraph
                      className={clsx([ 'text-option-11 text-left text-xl', 'tracking-[0.4px] leading-8', 'font-segoe' ])}
                      text={playerInformation.description}
                      typingSpeed={5} />
                    : <SkeletonParagraph />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
