import Auth from '@components/auth/Auth'
import Card from '@components/common/Card'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import AdminReport from '@components/onboading-report/AdminReport'
import React from 'react'

export default function Index() {
  return (
    <Auth code="5.3">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <AdminReport />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
