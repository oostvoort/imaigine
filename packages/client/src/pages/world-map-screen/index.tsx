import React from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'
import { useMap } from '@/hooks/v1/useMap'
import useTravel from '@/hooks/v1/useTravel'
import LocationDialog from '@/components/shared/LocationDialog'
import useLocation from '@/hooks/v1/useLocation'
import { useAtom, useSetAtom } from 'jotai'
import { activeScreen_atom, isTravelling_atom, SCREENS } from '@/states/global'
import useLocationLists from '@/hooks/v1/useLocationLists'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { HourglassLoader } from '@/components/base/Footer'
import AILoader from '@/components/shared/AILoader'
import TypingParagraph from '@/components/shared/TypingParagraph'

export type LocationType = {
  name: string,
  summary: string,
  imgHash: string,
}

type TravelStory = {
  locationName: string,
  travelStory: string,
}

export default function WorldMapScreen(){

  const { players, myPlayer, isMyPlayerComplete, functions: { prepareTravel, travel }, travelData } = useMap()
  const [ isLocationOpen, setIsLocationOpen ] = React.useState<boolean>(false)
  const [locationData, setLocationData] = React.useState<LocationType>({} as LocationType)
  const [destination, setDestination] = React.useState<number>(0)

  const setActiveScreen = useSetAtom(activeScreen_atom)

  const [isTravelling, setIsTravelling] = useAtom(isTravelling_atom)
  const [travelStory, setTravelStory] = React.useState<TravelStory>({ locationName: '', travelStory: '' })

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
      intervalId = setInterval(() => {
        travel.mutate();
      }, 5000); // 5 seconds interval
    }

    return () => {
      clearInterval(intervalId);
    };
  },[travelData])

  const handleTravel = () => {
    setIsTravelling(true)
    setTravelStory(prevState => ({
      ...prevState,
      locationName: locationData.name,
    }))
    setIsLocationOpen(false)
    prepareTravel.mutateAsync({ toLocation: destination })
      .then(() => {
        generateTravel.mutateAsync()
          .then((result) => {
            if (result) {
              setTravelStory(prevState => ({
                ...prevState,
                travelStory: result.travelStory,
              }))
            }
        })
      })
  }

  const handleEnterLocation = () => {
    setTravelStory({ locationName: '', travelStory: ''})
    setIsTravelling(false)
    setActiveScreen(SCREENS.CURRENT_LOCATION)
  }

  return(
    <React.Fragment>
      <SubLayout.MapViewLayout>
        <Map
          className={'w-full h-full mt-20'}
          myPlayer={myPlayer}
          isMyPlayerComplete={isMyPlayerComplete}
          players={isTravelling ? undefined : players}
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
        isTravelling && (
          <div className={clsx(
            'w-[800px] max-h-[800px] h-[800px] z-10',
            'absolute top-28 right-12',
            'flex flex-col justify-between',
            'bg-content-bg-gray bg-no-repeat bg-cover',
            'rounded-3xl p-8 animate-fade',
          )}>
            <div className={clsx('overflow-y-auto h-[85%]')}>
              <div className={clsx([
                'h-full flex justify-center',
                'text-[30px] text-[#BAC5F1]',
                'font-amiri',
              ])}>
                {
                  travelStory.travelStory === '' ? (
                    <div className={clsx([
                      'my-auto gap-10',
                      'flex flex-col justify-center items-center',
                    ])}>
                      <AILoader message={'Please wait...'} />
                    </div>
                  ) : (
                    <TypingParagraph text={travelStory.travelStory} typingSpeed={5} />
                  )
                }
              </div>
            </div>
            <div className={'flex justify-center'}>
              {
                travelData?.status === 0 ? (
                  <Button
                    variant={'neutral'}
                    size={'btnWithBgImg'}
                    onClick={handleEnterLocation}
                  >
                    Enter {travelStory.locationName}
                  </Button>
                ) : (
                  <div
                    className={clsx([
                      'bg-lining bg-no-repeat bg-cover h-[48px] w-[800px]',
                      'flex justify-center gap-3',
                    ])}
                  >
                    <HourglassLoader>Travelling to {travelStory.locationName}</HourglassLoader>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </React.Fragment>
  )
}
