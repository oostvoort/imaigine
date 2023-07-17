import { clsx } from 'clsx'
import React from 'react'

export default function Leaderboard() {
  return (
    <div className={clsx([ 'flex flex-col min-w-[478px] w-full' ])}>
      <p
        className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Leaderboard</p>
      <ul>
        {
          [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map((count, index) =>
            <li
              key={index}
              className={clsx([ 'flex items-center', 'text-[16px] text-white', 'font-bold font-segoe tracking-[0.2px]', 'mt-sm' ])}>

              <div
                className={clsx([ 'basis-10', 'w-[38px] h-[38px]', 'rounded-full', 'flex justify-center items-center', 'bg-[#2C3B47]' ])}>{count}
              </div>

              <p
                className={clsx([ 'flex-1', 'ml-sm', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe tracking-[0.4px]' ])}>Helena</p>
              <p className={clsx([ 'basis-4/12', 'text-[16px] leading-[32px] text-right text-option-11', 'font-segoe tracking-[0.32px]' ])}>3,455,123
                BP</p>
            </li>
          )
        }
      </ul>

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
  )
}
