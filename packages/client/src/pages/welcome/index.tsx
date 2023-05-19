import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import React from 'react'
import { Button } from '../../components/base/button'
import { Link } from 'react-router-dom'

export default function Welcome() {

  return (
    <div className='flex flex-col justify-center items-center bg-gray-400 border gap-10'>
      <section className="flex flex-col gap-2">
        <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[200px]" />
        <p className="font-rancho tracking-wider text-center">Imagination Engine</p>
      </section>
      <Link to='/create'>
        <Button className='rounded-full px-14'>Continue</Button>
      </Link>
    </div>
  )
}
