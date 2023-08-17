import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import Auth from '@components/auth/Auth'
import CreateTP from '@components/tp/CreateTP'
/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Create(): JSX.Element {
  return (
    <Auth code="4.2.1">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <CreateTP />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
