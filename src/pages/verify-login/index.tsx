// import type { NextPage } from 'next'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LandingLayout from '@components/layout/LandingLayout'
import SEO from '@components/common/SEO'
import VerifyLogin from '@components/login/VerifyLogin'

/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Index(): JSX.Element {
  return (
    <>
      <SEO />
      <LandingLayout>
        <VerifyLogin />
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
