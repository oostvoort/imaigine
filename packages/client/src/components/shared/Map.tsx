import React, { useEffect, useRef } from 'react'
import { useMap } from '@/hooks/v1/useMap'

type PropType = {
  className?: string
}
const Map: React.FC<PropType> = ({ className }) => {
  const mapSeed = 962218354
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { players, myPlayer, isMyPlayerComplete, prepareTravel} = useMap()

  // console.log('isMyPlayerComplete', isMyPlayerComplete)
  // console.log('myPlayer', myPlayer)
  // console.log('players', players)

  useEffect(() => {

    const handleMessage = (event: any) => {

      // ignore events that are not from the same baseUri
      if (document.baseURI.indexOf(event.origin) < 0) return

      // Access the message data
      const {cmd, params} = event.data

      if(cmd === "FinishedLoadingMap"){
          showPlayers()
          showMyPlayer()
      } else if(cmd === "BurgClicked"){
        console.log("BurgClicked", params)
        prepareTravel.mutate(params.locationId)

        // player.cell = params.locationId
        // if (!exploredCells.includes(params.locationId)) {
        //   exploredCells.push(params.locationId)
        // }
        // showExploredCells()
      }else{
        console.log('Other message received from iframe:', event.data)

      }
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

  const setUnFog = (id: string) => {sendMessageToIframe({cmd: "unFog", params: {id: id}})}
  const showPlayers = () => {sendMessageToIframe({cmd: "showPlayers", params: {players}})}
  const showMyPlayer = () => {sendMessageToIframe({cmd: "showMyPlayer", params: {player: myPlayer}})}

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return(
    <div className={'w-full h-full'}>
      <br /><br /><br /><br /><br /><br />
      <button onClick={() => {setUnFog('myFogId')}}>unFog</button>
      | <button onClick={reloadIframe}>Reload Iframe</button>
      {
        ( isMyPlayerComplete) ? (
          <iframe
            ref={iframeRef}
            width={'w-[inherit]'}
            className={className}
            src={`${document.baseURI}map/index.html?cell=${myPlayer?.cell}&scale=12&maplink=http://localhost:3000/mapdata?seed=${mapSeed}`}
            title="Map"
          />
        ): (
          <>Loading</>
        )
      }
    </div>
  )
}

export default Map
