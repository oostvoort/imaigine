import MainLayout from '@/components/layouts/MainLayout'
import StartingScreen from '@/pages/starting-screen'
import CreateAvatarScreen from '@/pages/create-avatar-screen'
import CurrentLocationScreen from '@/pages/current-location-screen'
import { useAtomValue } from 'jotai'
import { activeScreen_atom } from '@/global/states'

export const App = () => {
  const activeScreen = useAtomValue(activeScreen_atom)
  return (
    <MainLayout>
      { activeScreen == 'startingScreen' && <StartingScreen /> }
      { activeScreen == 'createAvatarScreen' && <CreateAvatarScreen /> }
      { activeScreen == 'currentLocationScreen' && <CurrentLocationScreen /> }
    </MainLayout>
  )
}
