import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import List from '@components/account/List'

export default function AccountList(): JSX.Element {
  return (
    <Auth code="8.1">
      <>
        <SEO />
        <DashboardLayout>
          <List />
        </DashboardLayout>
      </>
    </Auth>
  )
}
