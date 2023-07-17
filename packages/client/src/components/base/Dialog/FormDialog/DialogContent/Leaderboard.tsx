import { clsx } from 'clsx'
import React from 'react'

export default function Leaderboard() {
  return (
    <div className={clsx([ 'flex flex-col' ])}>
      <p
        className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Leaderboard</p>

      <ul
        className={clsx([ '[&>*:nth-child(1)]:bg-[#E6B415]', '[&>*:nth-child(2)]:bg-[#A5A5A5]', '[&>*:nth-child(3)]:bg-[#AF5200]' ])}>
        {
          [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map((count, index) =>
            <li
              key={index}
              className={clsx([ 'w-[38px] h-[38px]', 'flex justify-center items-center', 'text-[16px] text-white', 'font-bold font-segoe tracking-[0.2px]', 'rounded-full', 'bg-[#2C3B47]', 'mt-sm' ])}>
              {count}
            </li>,
          )
        }
      </ul>
    </div>
  )
}
