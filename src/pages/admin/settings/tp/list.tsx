import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import TransactionList from '@components/tp/TpList'

export default function List() {
  return (
    <Auth code="4.2.2">
      <>
        <SEO />
        <DashboardLayout>
          <TransactionList />
        </DashboardLayout>
      </>
    </Auth>
  )
}
