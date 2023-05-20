import React from 'react'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import { Button } from '../../components/base/button'
import { useSetAtom } from 'jotai'
import { activePage_atom } from '../../atoms/globalAtoms'
import { clsx } from 'clsx'

export default function Welcome() {
  const setActivePage = useSetAtom(activePage_atom)

  return (
    <div
      className={clsx([
        "flex flex-col justify-center items-center bg-gray-400 border gap-10",
        "bg-cover bg-center bg-opacity-10 bg-no-repeat relative1"
      ])}>
      {/*<div className='w-screen h-screen blur-lg bg-black/70 absolute'>*/}

      {/*</div>*/}
      <section className="flex flex-col gap-2 z-10">
        <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[200px]" />
        <p className="font-rancho tracking-wider text-center">Imagination Engine</p>
        <Button onClick={() => setActivePage('create')} className="rounded-full px-14 mt-5">Continue</Button>
      </section>
      {/*<Link to='/create'>*/}
      {/*</Link>*/}
    </div>
  )
}
