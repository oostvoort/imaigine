import React, { useEffect, useRef } from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'
import { useMap } from '@/hooks/v1/useMap'
import useTravel from '@/hooks/v1/useTravel'
import LocationDialog from '@/components/shared/LocationDialog'
import useLocation from '@/hooks/v1/useLocation'

export type LocationType = {
  name: string,
  summary: string,
  imgHash: string,
}

export default function WorldMapScreen(){

  const { players, myPlayer, isMyPlayerComplete, functions: { prepareTravel, travel }, travelData } = useMap()
  const { generateTravel } =  useTravel()


  const [ isLocationOpen, setIsLocationOpen ] = React.useState<boolean>(false)
  const [locationData, setLocationData] = React.useState<LocationType>({} as LocationType)


  const [cellNumber, setCellNumber] = React.useState<number>(0)
  const {generateLocation } = useLocation(cellNumber)

  const handleSelectCell = (newCellNumber: number) => setCellNumber(newCellNumber)

  React.useEffect(() => {
    if (!isLocationOpen) {
      setLocationData({} as LocationType)
    }
  }, [isLocationOpen])


  React.useEffect(() => {
    generateLocation.mutate({ id: cellNumber })
  }, [cellNumber])

  React.useEffect(() => {
    if (generateLocation.isSuccess) {
      console.log('generateLocation.data', generateLocation.data)
      if (generateLocation.data) {
        setLocationData({
          name: generateLocation.data.name,
          summary: generateLocation.data.summary,
          imgHash: generateLocation.data.imageHash,
        })
      }
    }
  }, [generateLocation.isSuccess])

  console.log({travelData})

  // prepareTravel.mutateAsync({ toLocation: params.locationId }).then(() => generateTravel.mutate())
  //
  //
  // useEffect(() => {
  //   if(!travelData) return
  //   if (travelData.status >= 2){
  //     setInterval(() => {
  //       console.log('Player is travelling...')
  //       travel.mutate();
  //       showMyPlayer()
  //     }, 15000); // 15 seconds interval
  //   }
  // }, [travelData])

  const handleTravel = () => {
    console.info('Travelling...')
    prepareTravel.mutateAsync({ toLocation: cellNumber }).then(() => generateTravel.mutate())
  }

  return(
    <SubLayout.MapViewLayout>
      <Map
        className={'w-full h-full'}
        myPlayer={myPlayer}
        isMyPlayerComplete={isMyPlayerComplete}
        players={players}
        setIsLocationOpen={setIsLocationOpen}
        setCellNumber={handleSelectCell}
      />
      <LocationDialog
        isOpen={isLocationOpen}
        setOpen={setIsLocationOpen}
        location={locationData}
        travelFunc={handleTravel}
      />
    </SubLayout.MapViewLayout>
  )
}
