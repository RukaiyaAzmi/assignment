import Auth from '@components/auth/Auth'
import Card from '@components/common/Card'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import UserReport from '@components/onboading-report/UserReport'
import React from 'react'

export default function Index() {
  return (
    <Auth code="5.4">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <UserReport />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
