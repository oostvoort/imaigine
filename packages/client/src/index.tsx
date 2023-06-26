import ReactDOM from "react-dom/client";
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { Provider as JotaiProvider } from 'jotai'
import {QueryClientProvider} from "react-query";
import {queryClient} from "./provider/queryClient";
import './index.css'

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  root.render(
    <JotaiProvider>
      <MUDProvider value={result}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MUDProvider>
    </JotaiProvider>
  );
  mountDevTools();
});
