import { clsx } from 'clsx'
import React from 'react'

export function BattleGuide(){
  return(
    <div className={clsx([ 'max-w-[560px] w-full h-full' ])}>
      <p
        className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Battle
        Guide</p>
      <p
        className={clsx(['py-2', 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
        Each battle has a 1-minute time limit. Players simultaneously choose between Sword, Scroll, or
        Potion. After each round, the winner earns a point. The game continues until the time limit is
        reached, and the player with the most points wins.
      </p>

      <div className={clsx([ 'flex flex-col items-center', 'my-md' ])}>
        <img src={'/assets/minigame/img_guide.png'} alt={'Battle Guide Image'}
             className={clsx([ 'w-[330px] h-[305px]' ])} />
      </div>


      <p
        className={clsx(['py-2', 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
        <span className={'text-accent font-bold'}>Sword : </span>
        The Sword represents strength and combat prowess. The Sword defeats the Scroll but is
        ineffective against the Potion.
      </p>

      <p
        className={clsx(['py-2', 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
        <span className={'text-accent font-bold'}>Scroll : </span>
        The Scroll symbolizes knowledge and magic. The Scroll defeats the Potion but is vulnerable to the Sword.
      </p>


      <p
        className={clsx([ 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
        <span className={'text-accent font-bold'}>Potion : </span>
        The Potion embodies healing and magical elixirs. The Potion defeats the Sword but is ineffective against the Scroll.
      </p>
    </div>
  )
}
