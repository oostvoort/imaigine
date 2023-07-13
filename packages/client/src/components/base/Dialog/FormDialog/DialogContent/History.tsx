import React from 'react'
import { clsx } from 'clsx'
import { useMUD } from '@/MUDContext'
import { useGetPlayerHistory } from '@/hooks/v1/useGetPlayerHistory'
import AILoader from '@/components/shared/AILoader'

export default function History() {
  const {
    network: {
      playerEntity
    },
  } = useMUD()

  const history = useGetPlayerHistory(playerEntity)

  return (
    <div className={clsx([ 'md:w-[872px] md:h-[684px] h-full w-full', 'p-sm' ])}>
      <h3 className={clsx(['text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-md'])}>History</h3>
      {
        history.isLoading ? (
          <div className={clsx([
            'w-full h-full mx-auto p-10',
            'flex flex-col justify-center items-center gap-10',
          ])}>
            <AILoader message={'Fetching history...'} />
          </div>
        ) : (
          <div className={clsx([ 'h-[590px] w-full', 'overflow-y-auto' ])}>
            {
              history.isSuccess && (
                <p className={clsx(['text-option-11 text-left text-xl', 'tracking-[0.4px] leading-8', 'font-segoe'])}>
                  {history.data}
                </p>
              )
            }
          </div>
        )
      }
    </div>
  )
}
