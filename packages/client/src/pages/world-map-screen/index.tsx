import React from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'
import { useMap } from '@/hooks/v1/useMap'
import useTravel from '@/hooks/v1/useTravel'
import LocationDialog from '@/components/shared/LocationDialog'

export default function WorldMapScreen(){
  const { players, myPlayer, isMyPlayerComplete, functions: { prepareTravel, travel }, travelData } = useMap()
  const { generateTravel } =  useTravel()
  const [ isLocationOpen, setIsLocationOpen ] = React.useState<boolean>(false)
  const [locationData, setLocationData] = React.useState<any>({} as any)

  function travelPlayer(cellId: number) {
    // console.log('location', cellId)
    // setIsLocationOpen(true)
    prepareTravel.mutateAsync({ toLocation: cellId }).then(() => generateTravel.mutate())
  }

  if (travelData) {
    console.log('TRAVEL', travelData.status)
    if (travelData.status >= 2){
        setInterval(() => {
          console.log('Player is travelling...')
          travel.mutate();
        }, 15000); // 15 seconds interval
    }
  }

  return(
    <SubLayout.MapViewLayout>
      <Map
        className={'w-full h-full'}
        myPlayer={myPlayer}
        isMyPlayerComplete={isMyPlayerComplete}
        players={players}
        travelPlayer={(value) => travelPlayer(value)}
      />
      <LocationDialog
        isOpen={isLocationOpen}
        setOpen={value => setLocationData(value)}
        location={locationData}
      />
    </SubLayout.MapViewLayout>
  )
}
