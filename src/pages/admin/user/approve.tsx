import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import UserApprove from '@components/user/UserApprove'

export default function Approve() {
  return (
    <Auth code="2.2">
      <>
        <SEO />
        <DashboardLayout>
          <UserApprove />
        </DashboardLayout>
      </>
    </Auth>
  )
}
