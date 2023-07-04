import React, { useEffect, useRef } from 'react'

type PropType = {
  className?: string
}



const players = [
  {
    name: "Edward",
    cell: 5033,
    legend: 'A brave and honorable knight known for his swordsmanship.'
  },
  {
    name: "Oliver",
    cell: 4928,
    legend: 'A skilled rogue and master of stealth and thievery.'
  },
  {
    name: "Merlin",
    cell: 5283,
    legend: 'A talented wizard specializing in elemental magic.'
  },
  {
    name: "George",
    cell: 5148,
    legend: 'A nimble archer with exceptional accuracy and keen eyesight.'
  }
]

const exploredCells = [4928, 5033, 5148, 5283]


const Map: React.FC<PropType> = ({ className }) => {
  const mapSeed = 123
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {

    const handleMessage = (event: any) => {

      // ignore events that are not from the same baseUri
      if (document.baseURI.indexOf(event.origin) < 0) return

      // Access the message data
      const {cmd, params} = event.data

      if(cmd === "FinishedLoadingMap"){
        showPlayers()
        showExploredCells()
      }else if(cmd === "MapClicked"){
        console.log("Mapclicked", params)
      }else if(cmd === "ExploreMap"){
        exploredCells.push(params.locationId)
        showExploredCells()
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

  const sendMessageToIframe = (msg: { cmd: string; params: any }) => {
    if (iframeRef.current) {
      const iframeWindow = iframeRef.current.contentWindow
      if (iframeWindow) {
        // Call the JavaScript function within the iframe
        iframeWindow.postMessage(msg, '*')
      }
    }
  }

  const setRevealedCells = (cells: number[]) => {sendMessageToIframe({cmd: "revealCells", params: {cells: cells}})}
  const setUnFog = (id: string) => {sendMessageToIframe({cmd: "unFog", params: {id: id}})}
  const showPlayers = () => {sendMessageToIframe({cmd: "showPlayers", params: {players}})}
  const showExploredCells = () => {sendMessageToIframe({cmd: "showExploredCells", params: {cells: exploredCells}})}

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }
  return (
    <div className={'w-full h-full'}>
      <br /><br /><br /><br /><br /><br />
      <button onClick={() => {setRevealedCells([ 4928, 5033, 5148, 5283])}}>revealCells</button>
      | <button onClick={() => {setUnFog('myFogId')}}>unFog</button>
      | <button onClick={() => {showPlayers()}}>showPlayers</button>
      | <button onClick={reloadIframe}>Reload Iframe</button>
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
