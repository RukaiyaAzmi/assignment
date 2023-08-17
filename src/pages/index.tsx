// import type { NextPage } from 'next'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LandingLayout from '@components/layout/LandingLayout'
import Login from '@components/login/Login'
import SEO from '@components/common/SEO'

/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Home(): JSX.Element {
  return (
    <>
      <SEO />
      <LandingLayout>
        <Login />
      </LandingLayout>
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
