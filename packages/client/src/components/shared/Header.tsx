import { clsx } from 'clsx'
import React from 'react'

type PropType = {
  openModal: (modalType: string) => void
}

const Header = ({ openModal }: PropType) => {
  return (
    <div className="w-full bg-gold-to-dark pb-[2px]">
      <div className="flex w-full h-[5.375rem] bg-[#0B1115]">
        <div
          className={clsx([
            'absolute left-8 flex items-center justify-center w-36 h-36',
            `bg-[url('/src/assets/bg_avatarFrame.png')] bg-cover bg-no-repeat`,
            'cursor-pointer'
          ])}
          onClick={() => openModal('profile')}
        >
          <img
            src="src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg"
            alt="Profile"
            className="h-28 w-28 rounded-full"
          />
        </div>
        <div className="flex gap-8 mx-52 self-center">
          <div className="flex gap-2 cursor-pointer" onClick={() => openModal('history')}>
            <img src="src/assets/history.png" alt="History" className="w-[71px] h-[59px]" />
            <span className="self-center text-lg text-[#FFF195] font-amiri">History</span>
          </div>
          <div className="flex gap-2 cursor-pointer" onClick={() => openModal('settings')}>
            <img src="src/assets/settings.png" alt="Settings" className="w-[59px] h-[59px]" />
            <span className="self-center text-lg text-[#FFF195] font-amiri">Settings</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
