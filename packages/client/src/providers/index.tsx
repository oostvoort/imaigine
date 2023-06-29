import React from 'react'
import { MUDProvider } from '@/MUDContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai/index'

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
        </QueryClientProvider>
      </MUDProvider>
    </JotaiProvider>
  )
}

export default Providers
