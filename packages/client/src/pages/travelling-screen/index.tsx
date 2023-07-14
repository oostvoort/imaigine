import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import { Footer, HourglassLoader } from '@/components/base/Footer'
import React from 'react'
import { Button } from '@/components/base/Button'
import { useMap } from '@/hooks/v1/useMap'
import Map from '@/components/shared/Map'
import { useAtom, useSetAtom } from 'jotai'
import { activeScreen_atom, SCREENS, travelStory_atom } from '@/states/global'
import { clsx } from 'clsx'

export default function TravellingScreen() {

  const { myPlayer, isMyPlayerComplete, functions: { travel }, travelData } = useMap()

  const setActiveScreen = useSetAtom(activeScreen_atom)
  const [travelStory, setTravelStory] = useAtom(travelStory_atom)

  const handleEnterLocation = () => {
    setTravelStory({ name: '', travelStory: ''})
    setActiveScreen(SCREENS.CURRENT_LOCATION)
  }

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

  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout>
          <Map
            className={'w-full h-full'}
            myPlayer={myPlayer}
            isMyPlayerComplete={isMyPlayerComplete}
          />
          <div className={clsx('overflow-y-auto h-[650px]')}>
            <p className={clsx([
              'text-[30px] text-[#BAC5F1]',
              'font-amiri',
            ])}>
              {travelStory.travelStory === '' ? 'Please wait...' : travelStory.travelStory}
            </p>
          </div>
        </SubLayout.VisualSummaryLayout>
      </SubLayout>
      <Footer>
        {
          travelData?.status === 0 ? (
            <Button variant={'neutral'} size={'btnWithBgImg'} onClick={handleEnterLocation}>Enter {travelStory.name}</Button>
          ) : (
            <div className={'flex justify-center my-auto w-[989px] h-[63px]'}>
              <HourglassLoader>Travelling to Location ...</HourglassLoader>
            </div>
          )
        }
      </Footer>
    </React.Fragment>
  )
}
