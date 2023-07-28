import React from 'react'
import { clsx } from 'clsx'

type PropType = {
  text: string
  typingSpeed: number
  className?: string
}

export default function TypingParagraph({ text, typingSpeed, className }: PropType) {
  const [displayedText, setDisplayedText] = React.useState('')
  const textLength = text.length
  const timeDelay = typingSpeed || 100 // Adjust the typing speed (in milliseconds) as needed

  React.useEffect(() => {
    console.info(1)
    let currentLength = 0
    const typingInterval = setInterval(() => {
      if (currentLength <= textLength) {
        setDisplayedText(text.substring(0, currentLength))
        currentLength++
      } else {
        clearInterval(typingInterval)
      }
    }, timeDelay)

    return () => clearInterval(typingInterval)
  }, [text, textLength, timeDelay])

  return <p className={clsx(['break-words w-full', className])}>{displayedText}</p>
}
