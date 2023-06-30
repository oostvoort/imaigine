import React, { useEffect, useRef } from 'react'

type PropType = {
  className?: string
}

const Map: React.FC<PropType> = ({ className }) => {
  const mapSeed = 123
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {

    const handleMessage = (event: any) => {
      // Check the origin if necessary
      if (event.origin !== document.baseURI) return

      // Access the message data
      const message = event.data

      // Handle the message received from the iframe
      console.log('Message received from iframe:', message)
    }

    // Add event listener for the 'message' event
    window.addEventListener('message', handleMessage)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendMessageToIframe = (msg: { cmd: string; params: any }) => {
    if (iframeRef.current) {
      const iframeWindow = iframeRef.current.contentWindow
      if (iframeWindow) {
        // Call the JavaScript function within the iframe
        iframeWindow.postMessage(msg, '*')
      }
    }
  }

  const setFog = (cells: number[]) => {sendMessageToIframe({cmd: "fog", params: {cells: cells}})}

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }
  return (
    <div className={'w-full h-full'}>
      <br /><br /><br /><br /><br /><br />
      <button onClick={() => {setFog([ 558, 559, 560])}}>Fog</button>
      |
      <button onClick={reloadIframe}>Reload Iframe</button>
      <iframe
        ref={iframeRef}
        width={'w-[inherit]'}
        className={className}
        src={`${document.baseURI}map/index.html?burg=75&scale=12&maplink=http://localhost:3000/mapdata?seed=${mapSeed}`}
        title="Map"
      />
    </div>
  )
}

export default Map
