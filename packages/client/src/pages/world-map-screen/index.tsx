import React, { useEffect, useRef } from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'
import { useMap } from '@/hooks/v1/useMap'
import useTravel from '@/hooks/v1/useTravel'
import LocationDialog from '@/components/shared/LocationDialog'
import useLocation from '@/hooks/v1/useLocation'
import { useSetAtom } from 'jotai'
import { travelStory_atom } from '@/states/global'

export type LocationType = {
  name: string,
  summary: string,
  imgHash: string,
}

export default function WorldMapScreen(){

  const { players, myPlayer, isMyPlayerComplete, functions: { prepareTravel } } = useMap()
  const [ isLocationOpen, setIsLocationOpen ] = React.useState<boolean>(false)
  const [locationData, setLocationData] = React.useState<LocationType>({} as LocationType)
  const [destination, setDestination] = React.useState<number>(0)

  const setTravelStory = useSetAtom(travelStory_atom)

  const { generateTravel } =  useTravel()
  const {generateLocation } = useLocation(destination)
  function travelPlayer(cellId: number) {
    setIsLocationOpen(true)
    setDestination(cellId)
  }

  React.useEffect(() => {
    if (!destination) return
    generateLocation.mutate({ id: destination })
  }, [destination])

  React.useEffect(() => {
    if (generateLocation.isSuccess) {
      if (generateLocation.data) {
        setLocationData({
          name: generateLocation.data.name,
          summary: generateLocation.data.summary,
          imgHash: generateLocation.data.imageHash,
        })
      }
    }
  }, [generateLocation.isSuccess])

  React.useEffect(() => {
    if (!isLocationOpen) {
      setLocationData({} as LocationType)
      setDestination(0)
    }
  }, [isLocationOpen])

  const handleTravel = () => {
    prepareTravel.mutateAsync({ toLocation: destination })
      .then(() => {
        generateTravel.mutateAsync()
          .then((result) => {
            if (result) {
              console.log({result})
              setTravelStory({
                name: locationData.name,
                travelStory:  result.travelStory,
              })
            }
        })
      })
  }

  return(
    <SubLayout.MapViewLayout>
      <Map
        className={'w-full h-full mt-40'}
        myPlayer={myPlayer}
        isMyPlayerComplete={isMyPlayerComplete}
        players={players}
        travelPlayer={(value) => travelPlayer(value)}
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
