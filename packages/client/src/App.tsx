import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CreatePlayer} from "./pages/CreatePlayer";


const queryClient = new QueryClient()

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CreatePlayer/>
        </QueryClientProvider>
    );
};
