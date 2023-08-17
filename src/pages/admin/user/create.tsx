// import type { NextPage } from 'next'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import CreateUser from '@components/user/CreateUser'
import Auth from '@components/auth/Auth'
/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Create(): JSX.Element {
  return (
    <Auth code="2.1">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <CreateUser />
          </Card>
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
