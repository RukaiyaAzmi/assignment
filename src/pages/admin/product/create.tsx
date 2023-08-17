// import type { NextPage } from 'next'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import CreateProduct from '@components/product/CreateProduct'
import Auth from '@components/auth/Auth'
/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Create(): JSX.Element {
  return (
    <Auth code="7.1">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <CreateProduct />
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
