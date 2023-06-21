// import StartingScreen from '@/pages/starting-screen'

import CreateAvatarScreen from '@/pages/create-avatar-screen'
import MainLayout from '@/components/layouts/MainLayout'

export const App = () => {
  return (
    <MainLayout>
      {/*<StartingScreen />*/}
      <CreateAvatarScreen />
    </MainLayout>
  )
}
