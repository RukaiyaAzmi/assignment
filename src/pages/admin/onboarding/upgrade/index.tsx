import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import UpgradePath from '@components/onboarding/upgrade/UpgradePath'

export default function Index() {
  return (
    <Auth code="5.1.3">
      <>
        <SEO />
        <DashboardLayout>
          <UpgradePath />
        </DashboardLayout>
      </>
    </Auth>
  )
}
