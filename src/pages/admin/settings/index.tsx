import Auth from '@components/auth/Auth'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import AppSetting from '@components/setting/AppSetting'
import React from 'react'

export default function Index() {
  return (
    <Auth code="4.1">
      <>
        <SEO />
        <DashboardLayout>
          <AppSetting />
        </DashboardLayout>
      </>
    </Auth>
  )
}
