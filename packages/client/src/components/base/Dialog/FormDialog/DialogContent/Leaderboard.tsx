import { clsx } from 'clsx'
import React from 'react'
import useHistory from '@/hooks/minigame/useHistory'
import usePlayer from '@/hooks/usePlayer'
import { Entity } from '@latticexyz/recs'

export default function Leaderboard() {
  const { player } = usePlayer()
  const { getAllPlayersBattlePoints } = useHistory(player.id as Entity)

  const sortedPlayers = getAllPlayersBattlePoints.map(({data}) => data).sort((a, b) => Number(b?.playerBP.value) - Number(a?.playerBP.value)).slice(0, 4)

  return (
    <div className={clsx([ 'flex flex-col min-w-[478px] w-full' ])}>
      <p
        className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Leaderboard</p>
      <ul>
        {
          sortedPlayers.length > 0 ? sortedPlayers.map((data, index) => {

              return (
                <li
                  key={index}
                  className={clsx([ 'flex items-center', 'text-[16px] text-white', 'font-bold font-segoe tracking-[0.2px]', 'mt-sm' ])}>

                  <div
                    className={clsx([{'bg-[#E6B415]': index === 0}, {'bg-[#A5A5A5]': index === 1}, {'bg-[#AF5200]': index === 2}, 'basis-10', 'w-[38px] h-[38px]', 'rounded-full', 'flex justify-center items-center', 'bg-[#2C3B47]' ])}>{index + 1}
                  </div>

                  <p
                    className={clsx([ 'flex-1', 'ml-sm', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe tracking-[0.4px]' ])}>{data?.playerInfo.name}</p>
                  <p
                    className={clsx([ 'basis-4/12', 'text-[16px] leading-[32px] text-right text-option-11', 'font-segoe tracking-[0.32px]' ])}>{`${Number(data?.playerBP.value)} BP` }
                  </p>
                </li>
              )
            },
          ) : <>
            <div className={"w-full h-[5em] flex justify-center items-center"}>
              <p className={clsx([ 'flex-1', 'ml-sm', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe tracking-[0.4px]' ])}>NO PLAYERS</p>
            </div>
          </>
        }
      </ul>

      <div className={'hidden'}>
        <div className={clsx(['border-b-[1px] border-card', 'mt-sm'])}/>
        <div
          className={clsx([ 'flex items-center', 'text-[16px] text-white', 'font-bold font-segoe tracking-[0.2px]', 'mt-sm' ])}>

          <div
            className={clsx([ 'basis-10', 'w-[38px] h-[38px]', 'rounded-full', 'flex justify-center items-center', 'bg-[#2C3B47]' ])}>?
          </div>

          <p
            className={clsx([ 'flex-1', 'ml-sm', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe tracking-[0.4px]' ])}>You [Player Name]</p>
          <p className={clsx([ 'basis-4/12', 'text-[16px] leading-[32px] text-right text-option-11', 'font-segoe tracking-[0.32px]' ])}>0
            BP</p>
        </div>
      </div>

    </div>
  )
}
