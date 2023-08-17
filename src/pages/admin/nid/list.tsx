import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import List from '@components/nid/List'

export default function NidList(): JSX.Element {
  return (
    <Auth code="9.2">
      <>
        <SEO />
        <DashboardLayout>
          <List />
        </DashboardLayout>
      </>
    </Auth>
  )
}
