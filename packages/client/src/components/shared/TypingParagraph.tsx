import React from 'react'

type PropType = {
  text: string
  typingSpeed: number
}

export default function TypingParagraph({ text, typingSpeed }: PropType) {
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

  return <p className={'break-words w-full'}>{displayedText}</p>
}
