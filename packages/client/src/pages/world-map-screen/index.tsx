import React, { useEffect } from 'react'
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

  return(
    <SubLayout.MapViewLayout>
      <Map
        className={'w-full h-full'}
        myPlayer={myPlayer}
        isMyPlayerComplete={isMyPlayerComplete}
        players={players}
        setIsLocationOpen={(value) => setIsLocationOpen(value)}
      />
      <LocationDialog
        isOpen={isLocationOpen}
        setOpen={value => setLocationData(value)}
        location={locationData}
      />
    </SubLayout.MapViewLayout>
  )
}
