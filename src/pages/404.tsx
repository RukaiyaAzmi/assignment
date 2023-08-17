import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */
export default function NotFound(): JSX.Element {
  return (
    <>
      <div
        className="flex flex-col h-full min-h-screen bg-cover"
        style={{ backgroundImage: `url(/img/404.jpg)` }}
      ></div>
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [])),
    },
  }
}
