import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import Auth from '@components/auth/Auth'
import ChangePassword from '@components/profile/ChangePassword'

export default function Update(): JSX.Element {
  return (
    <Auth code="3.4">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <ChangePassword />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
