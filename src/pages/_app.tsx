import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NavigationBar from '@/components/NavigationBar'
import '@/app/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isDemo = router.pathname === '/demo'

  if (isDemo) {
    return <Component {...pageProps} />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <NavigationBar />
    </div>
  )
}