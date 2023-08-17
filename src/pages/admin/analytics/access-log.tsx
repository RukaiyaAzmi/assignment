// import type { NextPage } from 'next'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import AccessLogs from '@components/analytics/AccessLogs'
import Auth from '@components/auth/Auth'
/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function AccessLog(): JSX.Element {
  return (
    <Auth code="6.2">
      <>
        <SEO />
        <DashboardLayout>
          <AccessLogs />
        </DashboardLayout>
      </>
    </Auth>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [])),
    },
  }
}
