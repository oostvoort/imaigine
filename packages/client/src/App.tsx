import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CreatePlayer} from "./pages/CreatePlayer";
import GridStoryLayout from './components/templates/grid_story_layout'
import MainLayout from './components/templates/main_layout'
import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/welcome'

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
                element={<GridStoryLayout />}
                //  TODO: Loading component to be created here
                loader={() => <div>loading component here</div>}
              />
              <Route
                path='/create'
                element={<CreatePlayer />}
                //  TODO: Loading component to be created here
                loader={() => <div>loading component here</div>}
              />
            </Routes>
          </MainLayout>
        </QueryClientProvider>
    );
};
