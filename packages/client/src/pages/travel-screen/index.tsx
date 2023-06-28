import React from 'react'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import Map from '@/components/shared/Map'

export default function TravelScreen(){
  return(
    <SubLayout>
      <SubLayout.MapViewLayout>
        <Map className={'w-full h-full rounded-2xl'} />
      </SubLayout.MapViewLayout>
    </SubLayout>
  )
}
