import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import AccountReport from '@components/onboarding/account-report/AccountReport'

export default function Index() {
  return (
    <Auth code="*">
      <>
        <SEO />
        <DashboardLayout>
          <AccountReport />
        </DashboardLayout>
      </>
    </Auth>
  )
}
