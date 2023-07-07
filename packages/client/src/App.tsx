import { SCREENS } from '@/states/global'
import TitleScreen from '@/pages/title-screen'
import Template from '@/components/layouts/MainLayout'
import CreateAvatarScreen from '@/pages/create-avatar-screen'
import CurrentLocationScreen from '@/pages/current-location-screen'
import WorldMapScreen from '@/pages/world-map-screen'
import TestScreen from '@/pages/test-screen'
import useGameState from '@/hooks/useGameState'
import { useMap } from '@/hooks/v1/useMap'

export const App = () => {
  const activeScreen = useGameState()
  const { players } = useMap()
  console.log({players})
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

      {activeScreen === SCREENS.TEST &&
        <Template.FullScreenLayout>
          <TestScreen />
        </Template.FullScreenLayout>
      }
    </Template>
  )
}
