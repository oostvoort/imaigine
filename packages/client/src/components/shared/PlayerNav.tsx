import React from 'react'
import avatarImage from '../../assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'
import backpackIcon from '../../assets/backpack.png'
import historyIcon from '../../assets/history.png'
import settingsIcon from '../../assets/settings.png'
import { clsx } from 'clsx'
import AvatarStatsDialog from '../AvatarStatsDialog'
import sampleAvatarIcon from '../../assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg'
import SettingsDialog from '../SettingsDialog'
import useGame from '../../hooks/useGame'
import useGetIPFSImage from '../../hooks/useGetIPFSImage'
import LoadingScreen from './LoadingScreen'
import envs from '../../env'

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
            'bg-cover bg-no-repeat overflow-hidden',
            {
              'bg-avatar-frame aspect-square w-[105px] [&>img]:h-[105px] translate-x-[-20px] scale-[1.2]': isAvatar,
            },
          ])}>
            <img className="w-[105px] rounded-full scale-[0.8] object-cover object-top" src={icon} alt={JSON.stringify(icon)} />
          </div>
          : <div
            className="w-auto w-[60px] h-[60px] aspect-square rounded-full border border-gray-400 bg-night mx-auto"></div>
      }
      <p className="text-white text-sm text-center">{label}</p>
    </div>
  )
}

export default function PlayerNav() {
  const { player } = useGame()
  // transform this into atom once other components need to change this state
  const [ openAvatarDialog, setOpenAvatarDialog ] = React.useState<boolean>(false)
  const [ openSettingsDialog, setOpenSettingsDialog ] = React.useState<boolean>(false)


  if (!player) return <LoadingScreen message='Loading player data...' />

  const imageUrl = `${envs.API_IPFS_URL_PREFIX}/${player.image.value}`

  return (
    <>
      <nav className="w-[107px] bg-player-nav flex flex-col p-3 gap-8 overflow-visible z-10">
        <IconItem isAvatar icon={imageUrl} className="mb-8 cursor-pointer"
                  onClick={() => setOpenAvatarDialog(true)} />
        <IconItem icon={historyIcon} label="History" />
        <IconItem icon={backpackIcon} label="Inventory" />
        <IconItem icon={settingsIcon} label="Settings" onClick={() => setOpenSettingsDialog(true)} />
      </nav>
      <AvatarStatsDialog
        isOpen={openAvatarDialog}
        setOpen={val => setOpenAvatarDialog(val)}
        avatarIcon={imageUrl}
        playerName={player.name.value}
        lvl="4"
        description={player.summary.value}
        stats={mockupAvatarInfo.stats} skills={mockupAvatarInfo.skills}
      />
      <SettingsDialog
        name={'Alice'}
        privateKey={'MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8QuKUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEmo3qGy0t6z09AIJtH5OeRV1b00DY+pxLQnwfotadxd+Uy/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs'}
        isOpen={openSettingsDialog}
        setOpen={value => setOpenSettingsDialog(value)} />
    </>
  )
}
