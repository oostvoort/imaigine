import ReactDOM from 'react-dom/client'
import {mount as mountDevTools} from '@latticexyz/dev-tools'
import {App} from './App'
import {setup} from './mud/setup'
import {MUDProvider} from './MUDContext'
import { BrowserRouter } from 'react-router-dom'
import { Provider as JotaiProvider } from 'jotai'
import './index.css'

const rootElement = document.getElementById('react-root')
if (!rootElement) throw new Error('React root not found')
const root = ReactDOM.createRoot(rootElement)

setup().then((result) => {
    root.render(
        <MUDProvider value={result}>
            {/* Handle client routing if needed */}
            <BrowserRouter>
                {/* Manage application states */}
                <JotaiProvider>
                  <App/>
                </JotaiProvider>
            </BrowserRouter>
        </MUDProvider>
    )
    mountDevTools()
})
