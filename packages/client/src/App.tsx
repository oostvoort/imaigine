import { SCREENS } from '@/states/global'
import TitleScreen from '@/pages/title-screen'
import Template from '@/components/layouts/MainLayout'
import CreateAvatarScreen from '@/pages/create-avatar-screen'
import CurrentLocationScreen from '@/pages/current-location-screen'
import WorldMapScreen from '@/pages/world-map-screen'
import useGameState from '@/hooks/useGameState'
// import TravellingScreen from '@/pages/travelling-screen'
import MinigameScreen from '@/pages/minigame-screen'
import LoadingScreen from '@/components/shared/LoadingScreen'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import React from 'react'

export const App = () => {
  const activeScreen = useGameState()
  return (
    <Template>
      {activeScreen === SCREENS.TITLE &&
        <Template.FullScreenLayout>
          <TitleScreen />
        </Template.FullScreenLayout>
      }

      {activeScreen === SCREENS.CREATE_AVATAR &&
        <Template.FullScreenLayout>
          <CreateAvatarScreen />
        </Template.FullScreenLayout>
      }

      {activeScreen === SCREENS.CURRENT_LOCATION &&
        <Template.ContentLayout className={'px-10 pt-28'}>
          <CurrentLocationScreen />
        </Template.ContentLayout>
      }

      {activeScreen === SCREENS.WORLD_MAP &&
        <Template.ContentLayout>
          <WorldMapScreen />
        </Template.ContentLayout>
      }

      {/*{activeScreen === SCREENS.TRAVELLING &&*/}
      {/*  <Template.ContentLayout className={'px-10 pt-28'}>*/}
      {/*    <TravellingScreen />*/}
      {/*  </Template.ContentLayout>*/}
      {/*}*/}

      {activeScreen === SCREENS.MINIGAME &&
        <Template.MinigameLayout>
          <MinigameScreen />
        </Template.MinigameLayout>
      }

      {activeScreen === SCREENS.LOADING &&
        <Template.FullScreenLayout>
          <BackgroundCarousel>
            <LoadingScreen message={'Imagining'} />
          </BackgroundCarousel>
        </Template.FullScreenLayout>
      }
    </Template>
  )
}
