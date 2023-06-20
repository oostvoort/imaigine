import React, { ReactNode } from 'react'
import { BACKGROUND_IMAGES } from '@/global/constants'
import { clsx } from 'clsx'

type PropType = {
  children: ReactNode
}

const BackgroundCarousel = ({ children }: PropType) => {
  const [ currentBackground, setCurrentBackground ] = React.useState<number>(0)
  const [ opacity, setOpacity ] = React.useState<number>(100)

  const changeBackground = () => {
    setOpacity(0)
    setTimeout(() => {
      setCurrentBackground((prevBackground) => (prevBackground + 1) % BACKGROUND_IMAGES.length)
      setOpacity(100)
    }, 500)
  }

  React.useEffect(() => {
    const timer = setTimeout(changeBackground, 4000)
    return () => clearTimeout(timer)
  }, [ currentBackground ])

  return (
    <React.Fragment>
      <img
        src={`/src/assets/background/${BACKGROUND_IMAGES[currentBackground]}`}
        alt={BACKGROUND_IMAGES ? BACKGROUND_IMAGES[currentBackground] : 'Background Images'}
        className={clsx([
          'absolute w-full h-full',
          'transition-opacity duration-1000',
          { 'opacity-0': opacity === 0, 'opacity-30': opacity === 100 },
        ])}
      />
      {children}
    </React.Fragment>
  )
}

export default BackgroundCarousel
