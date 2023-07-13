import React, { useEffect, useRef } from 'react'
import { MapPlayer } from '@/global/types'
import { useAtom, useAtomValue } from 'jotai'
import { activeScreen_atom, markerId_atom, SCREENS } from '@/states/global'

type PropType = {
  className?: string
  myPlayer?: MapPlayer
  isMyPlayerComplete: boolean
  players?: MapPlayer[]
  travelPlayer?: (cellId: number) => void
}
const Map: React.FC<PropType> = ({
  className,
  myPlayer,
  isMyPlayerComplete,
  players,
  travelPlayer,
}: PropType) => {
  const mapSeed = 962218354
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMapRendered, setIsMapRendered] = React.useState(false)
  const activeScreen = useAtomValue(activeScreen_atom)
  const [markerId, setMarkerId] =  useAtom(markerId_atom)
  const sendMessageToIframe = (msg: { cmd: string; params: any }) => {
    if (iframeRef.current) {
      const iframeWindow = iframeRef.current.contentWindow
      if (iframeWindow) {
        // Call the JavaScript function within the iframe
        iframeWindow.postMessage(msg, '*')
      }
    }
  }
  // const showPlayers = () => {sendMessageToIframe({cmd: "showPlayers", params: {players}})}
  const showMyPlayer = () => {sendMessageToIframe({cmd: "showMyPlayer", params: {player: myPlayer, marker: markerId}})}

  // Display myPlayer marker on the map
  React.useEffect(() => {
    if(isMyPlayerComplete && myPlayer && isMapRendered) {
      showMyPlayer()
    }
  },[myPlayer, isMyPlayerComplete, isMapRendered])

  useEffect(() => {
    const handleMessage = (event: any) => {
      // ignore events that are not from the same baseUri
      if (document.baseURI.indexOf(event.origin) < 0) return
      // Access the message data
      const {cmd, params} = event.data

      if(cmd === "FinishedLoadingMap"){
        // Map rendered
        setIsMapRendered(true)
      } else if(cmd === "BurgClicked"){
        // Travel
        if (myPlayer?.cell === params.locationId) return
        if (activeScreen === 3 && travelPlayer) {
          travelPlayer(params.locationId)
        }
      } else if(cmd === "PlayerMarkerId"){
        // Save player's marker id
        setMarkerId(params.id)
      } else{
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

  // const setUnFog = (id: string) => {sendMessageToIframe({cmd: "unFog", params: {id: id}})}
  // const reloadIframe = () => {
  //   if (iframeRef.current) {
  //     iframeRef.current.src = iframeRef.current.src
  //   }
  // }

  return (
    <div className={'w-full h-full'}>
      {/*<button onClick={() => {setUnFog('myFogId')}}>unFog</button>*/}
      {/*| <button onClick={reloadIframe}>Reload Iframe</button>*/}
      <iframe
        ref={iframeRef}
        width={'w-[inherit]'}
        className={className}
        src={`${document.baseURI}map/index.html?maplink=http://localhost:3000/mapdata?seed=${mapSeed}`}
        title="Map"
      />
    </div>
  )
}

export default Map
