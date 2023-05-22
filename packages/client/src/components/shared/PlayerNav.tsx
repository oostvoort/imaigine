import React from 'react'
import avatarImage from '../../assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'
import backpackIcon from '../../assets/backpack.png'
import historyIcon from '../../assets/history.png'
import settingsIcon from '../../assets/settings.png'
import { clsx } from 'clsx'
import AvatarStatsDialog from '../AvatarStatsDialog'
import sampleAvatarIcon from '../../assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'

type IconItemProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  label?: string,
  icon?: string
  isAvatar?: boolean
}

const mockupAvatarInfo = {
  stats: [
    {
      name: 'Strength',
      value: 5,
    },
    {
      name: 'Dexterity',
      value: 5,
    },
    {
      name: 'Agility',
      value: 5,
    },
    {
      name: 'Charisma',
      value: 5,
    },
    {
      name: 'Other',
      value: 5,
    },
  ],
  skills: [ 'fireball', 'swordStrike', 'thunderbolt', 'poisonCreation' ],
}

function IconItem({ icon, label, isAvatar, ...others }: IconItemProps) {

  return (
    <div className="flex flex-col justify-center cursor-pointer" {...others}>
      {
        icon ?
          <div className={clsx([
            'rounded-full origin-top-right',
            'bg-cover bg-no-repeat',
            {
              'bg-avatar-frame scale-[1.3]': isAvatar
            },
          ])}>
            <img className="w-[105px] rounded-full scale-[0.8]" src={icon} alt={JSON.stringify(icon)} />
          </div>
          : <div
            className="w-auto w-[60px] h-[60px] aspect-square rounded-full border border-gray-400 bg-night mx-auto"></div>
      }
      <p className="text-white text-sm text-center">{label}</p>
    </div>
  )
}

export default function PlayerNav() {
  // transform this into atom once other components need to change this state
  const [ openAvatarDialog, setOpenAvatarDialog ] = React.useState<boolean>(false)

  return (
    <>
      <nav className="w-[107px] bg-player-nav flex flex-col p-3 gap-8 overflow-visible z-10">
        <IconItem isAvatar icon={avatarImage} className="mb-8 cursor-pointer" onClick={() => setOpenAvatarDialog(true)} />
        <IconItem icon={historyIcon} label="History" />
        <IconItem icon={backpackIcon} label="Inventory" />
        <IconItem icon={settingsIcon} label="Settings" />
      </nav>
      <AvatarStatsDialog
        isOpen={openAvatarDialog}
        setOpen={val => setOpenAvatarDialog(val)}
        avatarIcon={sampleAvatarIcon}
        playerName={'Alice'}
        lvl='4'
        description={'Alice is a young woman with a spirited nature and an adventurous spark in her eyes. Her wavy chestnut hair cascades down her shoulders, complementing her warm hazel eyes that shine with determination. Freckles dance across her fair skin, adding to her youthful appearance. She stands at an average height, with a lean and agile frame shaped by her outdoor lifestyle and physical training. Alice\'s attire reflects her connection to nature, adorned with earthy tones and practical garments suitable for her travels. She carries a staff adorned with intricate nature-themed carvings, a symbol of her magical prowess and connection to the natural world.'}
        stats={mockupAvatarInfo.stats} skills={mockupAvatarInfo.skills}
      />
    </>
  )
}
