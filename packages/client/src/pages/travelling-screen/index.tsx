import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import { Footer, HourglassLoader } from '@/components/base/Footer'
import React from 'react'
import { Button } from '@/components/base/Button'
import { useMap } from '@/hooks/v1/useMap'
import Map from '@/components/shared/Map'

export default function TravellingScreen() {

  const { myPlayer, isMyPlayerComplete, functions: { travel }, travelData } = useMap()

  if (travelData) {
    console.log('TRAVEL', travelData.status)
    if (travelData.status >= 2){
      setInterval(() => {
        console.log('Player is travelling...')
        travel.mutate();
      }, 15000); // 15 seconds interval
    }
  }

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
