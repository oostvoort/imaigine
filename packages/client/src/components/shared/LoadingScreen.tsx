import { Card as CardCore } from '../base'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'

const { Card, CardContent } = CardCore

type Props = {
  message: string
}

export default function LoadingScreen({ message }: Props) {

  return (
    <div className="absolute z-50 w-full mt-10 flex justify-center items-center">
      <section className="flex-1 flex flex-col gap-10">
        <div className='flex flex-col gap-5'>
          <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[226px] mx-auto" />
          <p className="font-rancho text-md tracking-wider text-center">Imagination Engine</p>
        </div>
        <p className='font-bold text-4xl text-center -mb-6'>Please wait...</p>
        <Card className='mx-auto'>
          <CardContent className='w-[30em] h-[30em] mx-auto flex flex-col justify-center items-center p-10 gap-10'>
            <div className="loader-wrapper">
              <div className="loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <svg className="aiLogo" xmlns="http://www.w3.org/2000/svg" width="92.61" height="86.204"
                   viewBox="0 0 92.61 86.204">
                <path id="Path_4" data-name="Path 4"
                      d="M37.045-41.673a21.966,21.966,0,0,1,16.106,6.711A21.865,21.865,0,0,1,59.8-18.917a21.865,21.865,0,0,1-6.65,16.045,22.067,22.067,0,0,1-16.106,6.65A21.865,21.865,0,0,1,21-2.872a21.865,21.865,0,0,1-6.65-16.045A21.865,21.865,0,0,1,21-34.962,21.766,21.766,0,0,1,37.045-41.673Zm0,54.785A30.892,30.892,0,0,0,59.8,3.656v8.6h9.334V-50.214H59.8v8.663a30.892,30.892,0,0,0-22.756-9.456,30.851,30.851,0,0,0-22.634,9.4,30.922,30.922,0,0,0-9.4,22.7,30.851,30.851,0,0,0,9.4,22.634A30.851,30.851,0,0,0,37.045,13.112ZM86.705-50.336H96.04V12.258H86.705Zm4.637-10.249a5.991,5.991,0,0,1-4.393-1.83,5.991,5.991,0,0,1-1.83-4.393,6.062,6.062,0,0,1,1.83-4.454,5.991,5.991,0,0,1,4.393-1.83,6.062,6.062,0,0,1,4.454,1.83,6.062,6.062,0,0,1,1.83,4.454,5.991,5.991,0,0,1-1.83,4.393A6.062,6.062,0,0,1,91.342-60.586Z"
                      transform="translate(-5.016 73.092)" fill="#fff" />
              </svg>
            </div>
            <p className='font-bold font-jost tracking-wide text-xl'>{ message }</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
