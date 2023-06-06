import React, { ReactNode } from 'react'
import { clsx } from 'clsx'

type PropType = {
  children: ReactNode
}

export const LoadingBackground = ({ children }: PropType) => {
  const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg']
  const [currentBackground, setCurrentBackground] = React.useState(0)
  const [opacity, setOpacity] = React.useState(100)

  const changeBackground = () => {
    setOpacity(0)
    setTimeout(() => {
      setCurrentBackground((prevBackground) => (prevBackground + 1) % backgrounds.length)
      setOpacity(100)
    }, 500)
  }

  React.useEffect(() => {
    const timer = setTimeout(changeBackground, 5000)
    return () => clearTimeout(timer)
  }, [currentBackground])

  return (
    <>
      <img
        src={`/src/assets/background/${backgrounds[currentBackground]}`}
        alt={'loading bg'}
        className={clsx([
          'absolute w-full h-full',
          'transition-opacity duration-1000',
          { 'opacity-0': opacity === 0, 'opacity-100': opacity === 100 }
        ])}
      />
      {children}
    </>
  )
}
