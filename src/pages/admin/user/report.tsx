import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import UserList from '@components/user/UserList'

export default function Report() {
  return (
    <Auth code="2.5">
      <>
        <SEO />
        <DashboardLayout>
          <UserList />
        </DashboardLayout>
      </>
    </Auth>
  )
}
