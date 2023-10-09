import { SCREENS } from '@/states/global'
import TitleScreen from '@/pages/title-screen'
import Template from '@/components/layouts/MainLayout'
import CreateAvatarScreen from '@/pages/create-avatar-screen'
import CurrentLocationScreen from '@/pages/current-location-screen'
import WorldMapScreen from '@/pages/world-map-screen'
import useGameState from '@/hooks/useGameState'
import MinigameScreen from '@/pages/minigame-screen'
import LoadingScreen from '@/components/shared/LoadingScreen'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import React from 'react'
import { useIsMutating } from '@tanstack/react-query'

export const App = () => {
  const activeScreen = useGameState()
  const isMutatingPlayFn = useIsMutating({ mutationKey: [ 'play' ] })
  const isMutatingLeaveFn = useIsMutating({ mutationKey: [ 'leave' ] })

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
        <React.Fragment>
          {
            isMutatingPlayFn ?
              <BackgroundCarousel>
                <LoadingScreen message={'Preparing Battle Field'} />
              </BackgroundCarousel>
              :
              <Template.ContentLayout className={'px-10 pt-28'}>
                <CurrentLocationScreen />
              </Template.ContentLayout>
          }
        </React.Fragment>

      }

      {activeScreen === SCREENS.WORLD_MAP &&
        <Template.ContentLayout>
          <WorldMapScreen />
        </Template.ContentLayout>
      }

      {activeScreen === SCREENS.MINIGAME &&
        <React.Fragment>
          {
            isMutatingLeaveFn ?
              <BackgroundCarousel>
                <LoadingScreen message={'Leaving Battle Field'} />
              </BackgroundCarousel>
              :
              <Template.MinigameLayout>
                <MinigameScreen />
              </Template.MinigameLayout>
          }
        </React.Fragment>
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
