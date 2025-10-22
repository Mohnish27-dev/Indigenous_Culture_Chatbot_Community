import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import '../styles/globals.css'


export default function app({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Indigenous Cultures RAG Chatbot</title>
        <meta name="description" content="AI-powered chatbot for learning about indigenous cultures" />
        
        {/* SVG Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Fallback for browsers that don't support SVG favicons */}
        <link rel="alternate icon" href="/favicon.ico" />
        
        {/* For better browser compatibility */}
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}