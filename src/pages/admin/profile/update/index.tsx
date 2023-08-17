import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import Auth from '@components/auth/Auth'
import UpdateProfile from '@components/profile/UpdateProfile'

export default function Update(): JSX.Element {
  return (
    <Auth code="3.2">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <UpdateProfile />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
