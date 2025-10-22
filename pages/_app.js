import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import '../styles/globals.css'


export default function app({
  Component, pageProps: { session, ...pageProps }
}) {
  return (

    <>
      <Head>
        <title>Indigenous Cultures RAG Chatbot</title>

        {/* Basic favicon (recommended to include a favicon.ico in /public) */}
        <link rel="icon" href="/favicon.svg" />

        {/* PNG favicons for better support & sizes */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple touch icon for iOS home-screen */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Optional cache-busting parameter if you need to force browsers to update */}
        {/* <link rel="icon" href="/favicon.ico?v=2" /> */}
      </Head>
      <Component {...pageProps} />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}