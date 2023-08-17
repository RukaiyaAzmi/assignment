import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import RoleApprove from '@components/role/RoleApprove'
import Auth from '@components/auth/Auth'

export default function Approve() {
  return (
    <Auth code="1.2">
      <>
        <SEO />
        <DashboardLayout>
          <RoleApprove />
        </DashboardLayout>
      </>
    </Auth>
  )
}
