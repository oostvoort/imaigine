import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import { Footer, HourglassLoader } from '@/components/base/Footer'
import React from 'react'
import { Button } from '@/components/base/Button'
import { useMap } from '@/hooks/v1/useMap'
import Map from '@/components/shared/Map'
import { useAtom } from 'jotai'
import { activeScreen_atom, SCREENS } from '@/states/global'

export default function TravellingScreen() {

  const { myPlayer, isMyPlayerComplete, functions: { travel }, travelData } = useMap()

  const [, setActiveScreen] = useAtom(activeScreen_atom)

  React.useEffect(() => {
    let intervalId: any;
    if (travelData && travelData.status >= 2){
      setActiveScreen(SCREENS.TRAVELLING)
      intervalId = setInterval(() => {
        travel.mutate();
      }, 15000); // 15 seconds interval
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
          <p>Details ...</p>
        </SubLayout.VisualSummaryLayout>
      </SubLayout>
      <Footer>
        <div className={'flex justify-center my-auto w-[989px] h-[63px]'}>
          <HourglassLoader>Travelling to Location ...</HourglassLoader>
        </div>
        {/*<Button variant={'neutral'} size={'btnWithBgImg'}>Enter Location</Button>*/}
      </Footer>
    </React.Fragment>
  )
}
