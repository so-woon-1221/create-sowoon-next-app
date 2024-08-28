import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ProvidersProps {
  children: React.ReactNode
}

const client = new QueryClient()

const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </>
  )
}

export default Providers
