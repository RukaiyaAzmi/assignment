import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import RoleList from '@components/role/RoleList'
import Auth from '@components/auth/Auth'

export default function Report() {
  return (
    <Auth code="1.5">
      <>
        <SEO />
        <DashboardLayout>
          <RoleList />
        </DashboardLayout>
      </>
    </Auth>
  )
}
