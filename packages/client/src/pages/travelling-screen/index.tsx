import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import { Footer, HourglassLoader } from '@/components/base/Footer'
import React from 'react'
import { Button } from '@/components/base/Button'

export default function TravellingScreen() {
  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout>
          <p className={'m-auto text-[30px] font-amiri'}>Map Here...</p>
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
