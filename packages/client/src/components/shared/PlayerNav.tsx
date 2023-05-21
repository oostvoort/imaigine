import React from 'react'
import avatarImage from '../../assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'

type IconItemProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  label?: string,
  icon?: string
}

function IconItem({ icon, label, ...others }: IconItemProps) {

  return (
    <div className='flex flex-col gap-3 justify-center cursor-pointer' {...others}>
      {
        icon ? <img className='w-[104px] rounded-full origin-top-right scale-150' src={icon} alt={JSON.stringify(icon)} />
          : <div className='w-auto w-[60px] h-[60px] aspect-square rounded-full border border-gray-400 bg-night mx-auto'></div>
      }
      <p className='text-white text-sm text-center'>{ label }</p>
    </div>
  )
}

export default function PlayerNav() {

  return (
    <nav className='w-[107px] bg-player-nav flex flex-col p-3 gap-5 overflow-visible z-10'>
      <IconItem icon={avatarImage} className='mb-12' />
      <IconItem label='Stats' />
      <IconItem label='Inventory' />
      <IconItem label='History' />
      <IconItem label='Friends' />
      <IconItem label='Settings' />
    </nav>
  )
}
