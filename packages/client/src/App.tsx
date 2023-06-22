// import StartingScreen from '@/pages/starting-screen'

// import CreateAvatarScreen from '@/pages/create-avatar-screen'
import MainLayout from '@/components/layouts/MainLayout'
import CurrentLocationScreen from '@/pages/current-location-screen'

export const App = () => {
  return (
    <MainLayout>
      {/*<StartingScreen />*/}
      {/*<CreateAvatarScreen />*/}
      <CurrentLocationScreen />
    </MainLayout>
  )
}
