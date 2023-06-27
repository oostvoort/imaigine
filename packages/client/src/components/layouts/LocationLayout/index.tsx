import { clsx } from 'clsx'
import React from 'react'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'

type PropType = {
  children: React.ReactNode
}

export default function LocationLayout({ children }: PropType) {
  return (
    <div className={clsx([
      'flex flex-col items-center',
      'h-screen w-screen',
      'px-10 pt-28',
      'bg-main-bg-neutral bg-no-repeat bg-cover',
    ])}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
