import StartingScreen from '@/pages/starting-screen'
import MainLayout from '@/pages/MainLayout'
import CreateAvatarScreen from '@/pages/create-avatar-screen'

export const App = () => {
  return (
    <MainLayout>
      {/*<StartingScreen />*/}
      <CreateAvatarScreen />
    </MainLayout>
  )
}
