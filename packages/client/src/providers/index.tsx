import React from 'react'
import { MUDProvider } from '@/MUDContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai/index'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ProviderProps = {
  children: React.ReactNode
  mudValue: any
}

const queryClient = new QueryClient()

const Providers: React.FC<ProviderProps> = ({ children, mudValue }) => {
  return (
    <>
      <JotaiProvider>
        <MUDProvider value={mudValue}>
          <QueryClientProvider client={queryClient}>
            {children}

            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </MUDProvider>
      </JotaiProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </>

  )
}

export default Providers
