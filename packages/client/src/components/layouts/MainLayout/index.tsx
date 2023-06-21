import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className='flex flex-row-reverse flex-1 [&>div]:flex-1'>
      {children}
    </main>
  )
}
