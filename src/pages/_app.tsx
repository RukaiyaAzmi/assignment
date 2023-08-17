import '@styles/globals.css'
import 'animate.css'
import React from 'react'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { persistor, store } from '@redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Alert from '@components/common/Alert'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'

/**
 * App: App component
 * @return {JSX.Element} The JSX Code for the Home Page
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            <Alert />
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </>
        </PersistGate>
      </Provider>
    </>
  )
}

export default appWithTranslation(MyApp)
