
import MainLayout from './components/templates/MainLayout'
import Welcome from './pages/welcome'
import { useAtomValue } from 'jotai'
import { activePage_atom } from './atoms/globalAtoms'
import CreatePlayerNew from './pages/create-player-new'
import Game from './pages/game'
import DEV from './pages/DEV'
import { useMUD } from './MUDContext'

export const App = () => {
  const activePage = useAtomValue(activePage_atom)

    return (
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
            {
              activePage == 'dev' && <DEV />
            }
          </MainLayout>
    );
};
