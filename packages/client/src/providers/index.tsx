import React from 'react'
import { MUDProvider } from '@/MUDContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai/index'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type ProviderProps = {
  children: React.ReactNode
  mudValue: any
}

const queryClient = new QueryClient()

const Providers: React.FC<ProviderProps> = ({ children, mudValue }) => {
  return (
    <JotaiProvider>
      <MUDProvider value={mudValue}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
      </MUDProvider>
    </JotaiProvider>
  )
}

export default Providers
