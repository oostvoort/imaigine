import { useAtomValue } from 'jotai'
import StartingScreen from '@/pages/starting-screen'
import Template from '@/components/layouts/MainLayout'
import CreateAvatarScreen from '@/pages/create-avatar-screen'
import CurrentLocationScreen from '@/pages/current-location-screen'
import { activeScreen_atom } from '@/global/states'

export const App = () => {
  const activeScreen = useAtomValue(activeScreen_atom)
  return (
    <Template>
      {activeScreen == 'startingScreen' &&
        <Template.FullScreenLayout>
          <StartingScreen />
        </Template.FullScreenLayout>
      }

      {activeScreen == 'createAvatarScreen' &&
        <Template.FullScreenLayout>
          <CreateAvatarScreen />
        </Template.FullScreenLayout>
      }

      {
        activeScreen == 'currentLocationScreen' &&
        <Template.ContentLayout>
          <CurrentLocationScreen />
        </Template.ContentLayout>
      }
    </Template>
  )
}
