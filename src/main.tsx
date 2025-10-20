import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5, // Retry failed queries up to 5 times
      retryDelay: 1000, // Wait 1 second before retrying
      refetchOnMount: false, // When a screen shows again, don’t re-check if you already have data.
      staleTime: 1000 * 60 * 5, //Treat data as “fresh” for 5 minutes. After that it’s “stale” (old data).
      refetchOnReconnect: true, //When the user reconnects to the internet, re-fetch the data.
      refetchOnWindowFocus: true, //When the user focuses on the window, re-fetch the data.
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <ReactQueryDevtools initialIsOpen={false} /> {/* Optional: Add React Query Devtools for debugging ==> initialIsOpen={false} means the devtools will be closed by default */}
      <App />
    </StrictMode>
  </QueryClientProvider>
)
