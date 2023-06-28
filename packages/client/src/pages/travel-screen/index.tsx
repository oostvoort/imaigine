import React from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'

export default function TravelScreen(){
  return(
    <SubLayout.MapViewLayout>
      <Map className={'w-full h-full'} />
    </SubLayout.MapViewLayout>
  )
}
