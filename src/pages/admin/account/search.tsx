import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import ChannelSearch from '@components/account/ChannelSearch'
/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function AccessLog(): JSX.Element {
  return (
    <Auth code="8.4">
      <>
        <SEO />
        <DashboardLayout>
          <ChannelSearch />
        </DashboardLayout>
      </>
    </Auth>
  )
}
