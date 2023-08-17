import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import ProfileData from '@components/profile/ProfileData'
import Card from '@components/common/Card'

export default function Profile() {
  return (
    <Auth code="3.1">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <ProfileData />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}
