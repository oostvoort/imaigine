import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CreatePlayer} from "./pages/CreatePlayer";
import CreatePlayerNew from './pages/create-player-new'
import MainLayout from './components/templates/main_layout'
import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/welcome'
import Game from './pages/game'

const queryClient = new QueryClient()

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <Routes>
              <Route
                path='/'
                element={<Welcome />}
                //  TODO: Loading component to be created here
                loader={() => <div>loading component here</div>}
              />
              <Route
                path='/game'
                element={<Game />}
                //  TODO: Loading component to be created here
                loader={() => <div>loading component here</div>}
              />
              <Route
                path='/create'
                element={<CreatePlayerNew />}
                //  TODO: Loading component to be created here
                loader={() => <div>loading component here</div>}
              />
            </Routes>
          </MainLayout>
        </QueryClientProvider>
    );
};
