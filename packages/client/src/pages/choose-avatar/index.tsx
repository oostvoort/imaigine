import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'
import { Button } from '../../components/base'


export function ChooseAvatar({avatars} : {avatars: string[]}) {

  const [selectedDiv, setSelectedDiv] = React.useState(null);

  const handleDivClick = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSelectedDiv(index);
  };

  return (
    <div className={"flex flex-col pt-10 bg-[#2C3B47]"}>
      <div>
        <div className={"flex flex-col"}>
          <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[226px] mx-auto " />
          <p className="font-rancho text-2xl tracking-wider text-center self-center w-[330px]">Imagination Engine</p>
        </div>
      </div>
      <p className='font-bold text-4xl text-center text-white mt-10 '>Choose your avatar</p>
      <div className={"flex gap-2.5 self-center bg-[#2C3B47] p-7 mt-6 rounded-3xl drop-shadow-2xl w-[1245px]"}>
        {
          avatars.map((avatar, key) => {
            return (
              <div key={key} className={`aspect-square rounded-2xl overflow-hidden transition duration-500 ease-in-out  ${selectedDiv !== key ? 'opacity-25' : ''} ${
                selectedDiv === key ? 'ring-4 ring-yellow-300' : ''
              }`} onClick={() => handleDivClick(key)}>
                <img src={`${avatar}`} className={"w-full h-full"} />
              </div>
            )
          })
        }
      </div>
      <Button variant="accent" size="lg" className="mi{}n-w-[200px] w-[360px] rounded-full uppercase self-center mt-10" >Let's go!</Button>
    </div>
  )
}
