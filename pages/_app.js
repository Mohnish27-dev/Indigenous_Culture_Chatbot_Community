import { SessionProvider } from "next-auth/react";
import Head from 'next/head'
import '../styles/globals.css'


export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Indigenous Cultures RAG Chatbot</title>
        <meta name="description" content="AI-powered chatbot for learning about indigenous cultures" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
