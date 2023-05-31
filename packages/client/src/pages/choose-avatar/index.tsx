import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'
import { Button } from '../../components/base'


export function ChooseAvatar({avatars} : {avatars: string[]}) {

  return (
    <div className={"flex flex-col mt-20"}>
      <div>
        <div className={"pt-5 flex flex-col"}>
          <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[226px] mx-auto " />
          <p className="font-rancho text-2xl tracking-wider text-center self-center w-[330px]">Imagination Engine</p>
        </div>
      </div>
      <p className='font-bold text-4xl text-center text-white mt-10 '>Choose your avatar</p>
      <div className={"flex gap-12 self-center bg-[#2C3B47] p-7 mt-4 rounded-2xl shadow-2xl w-[1245px] h-fit"}>
        {
          avatars.map((avatar, key) => {
            return (
              <div key={key} className={"aspect-square rounded-2xl overflow-hidden "}>
                <img src="src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg" />
              </div>
            )
          })
        }
      </div>
      <Button variant="accent" size="lg" className="mi{}n-w-[200px] w-[360px] rounded-full uppercase self-center mt-10" >Let's go!</Button>
    </div>
  )
}
