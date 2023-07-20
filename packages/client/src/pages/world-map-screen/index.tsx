import React from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'
import { useMap } from '@/hooks/v1/useMap'
import useTravel from '@/hooks/v1/useTravel'
import LocationDialog from '@/components/shared/LocationDialog'
import useLocation from '@/hooks/v1/useLocation'
import { useAtom, useSetAtom } from 'jotai'
import { activeScreen_atom, SCREENS, travelStory_atom } from '@/states/global'
import useLocationLists from '@/hooks/v1/useLocationLists'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { Footer, HourglassLoader } from '@/components/base/Footer'

export type LocationType = {
  name: string,
  summary: string,
  imgHash: string,
}

export default function WorldMapScreen(){

  const { players, myPlayer, isMyPlayerComplete, functions: { prepareTravel, travel }, travelData } = useMap()
  const [ isLocationOpen, setIsLocationOpen ] = React.useState<boolean>(false)
  const [locationData, setLocationData] = React.useState<LocationType>({} as LocationType)
  const [destination, setDestination] = React.useState<number>(0)

  const [activeScreen, setActiveScreen] = useAtom(activeScreen_atom)
  const [travelStory, setTravelStory] = useAtom(travelStory_atom)

  const { generateTravel } =  useTravel()
  const { generateLocation } = useLocation(destination)

  const { locationToGenerate } = useLocationLists(myPlayer?.revealedCell ?? [])

  function travelPlayer(cellId: number) {
    setIsLocationOpen(true)
    setDestination(cellId)
  }

  React.useEffect(() => {
    if (locationToGenerate && locationToGenerate?.length > 0) {
      setDestination(locationToGenerate[0]?.cell)
    }
  }, [locationToGenerate])

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

  React.useEffect(() => {
    let intervalId: any;
    if (travelData && travelData.status >= 2){
      setActiveScreen(SCREENS.TRAVELLING)
      intervalId = setInterval(() => {
        travel.mutate();
      }, 5000); // 5 seconds interval
    }

    return () => {
      clearInterval(intervalId);
    };
  },[travelData])

  const handleTravel = () => {
    prepareTravel.mutateAsync({ toLocation: destination })
      .then(() => {
        generateTravel.mutateAsync()
          .then((result) => {
            if (result) {
              setTravelStory({
                name: locationData.name,
                travelStory:  result.travelStory,
              })
            }
        })
      })
  }

  const handleEnterLocation = () => {
    setTravelStory({ name: '', travelStory: ''})
    setActiveScreen(SCREENS.CURRENT_LOCATION)
  }

  return(
    <React.Fragment>
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
          setOpen={setIsLocationOpen}
          location={locationData}
          travelFunc={handleTravel}
        />
      </SubLayout.MapViewLayout>
      {
        activeScreen === SCREENS.TRAVELLING && (
          <div className={clsx(
            'w-[800px] max-h-[800px] h-[800px] z-10',
            'absolute top-28 right-20',
            'bg-content-bg-gray bg-no-repeat bg-cover',
            'rounded-3xl p-[30px]'
          )}>
            <div className={clsx('overflow-y-auto h-[650px]')}>
              <p className={clsx([
                'text-[30px] text-[#BAC5F1]',
                'font-amiri',
              ])}>
                Please wait..
              </p>
            </div>
            <Footer>
              {/*<Button variant={'neutral'} size={'btnWithBgImg'}>Enter Location</Button>*/}
              {/*<div className={'flex justify-center my-auto w-[989px] h-[63px]'}>*/}
              {/*  <HourglassLoader>Travelling to Location ...</HourglassLoader>*/}
              {/*</div>*/}
            </Footer>
          </div>
        )
      }
    </React.Fragment>
  )
}
