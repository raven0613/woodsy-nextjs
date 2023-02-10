import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import ArticleProvider from '../components/ArticleProvider'

import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ArticleProvider>
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </ArticleProvider>
    </SessionProvider>
  )
}
