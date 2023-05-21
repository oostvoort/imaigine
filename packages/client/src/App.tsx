import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './components/templates/main_layout'
import Welcome from './pages/welcome'
import { useAtomValue } from 'jotai'
import { activePage_atom } from './atoms/globalAtoms'
import CreatePlayerNew from './pages/create-player-new'
import Game from './pages/game'
import useGame from './hooks/useGame'

const queryClient = new QueryClient()

export const App = () => {
  const activePage = useAtomValue(activePage_atom)
  const {locations, characters, players} = useGame()

    return (
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            {
              activePage == 'welcome' && <Welcome />
            }
            {
              // TODO: loading component
              activePage == 'loading' && <>loading component to be create</>
            }
            {
              activePage == 'create' && <CreatePlayerNew />
            }
            {
              activePage == 'game' && <Game />
            }
          </MainLayout>
        </QueryClientProvider>
    );
};
