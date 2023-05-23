import ReactDOM from 'react-dom/client'
import { mount as mountDevTools } from '@latticexyz/dev-tools'
import { App } from './App'
import { setup } from './mud/setup'
import { MUDProvider } from './MUDContext'
import { BrowserRouter } from 'react-router-dom'
import { Provider as JotaiProvider } from 'jotai'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const rootElement = document.getElementById('react-root')
if (!rootElement) throw new Error('React root not found')
const root = ReactDOM.createRoot(rootElement)

setup().then((result) => {
  root.render(
    <JotaiProvider>
      <MUDProvider value={result}>
        {/* Handle client routing if needed */}
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {/* Manage application states */}
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </MUDProvider>
    </JotaiProvider>,
  )
  mountDevTools()
})
