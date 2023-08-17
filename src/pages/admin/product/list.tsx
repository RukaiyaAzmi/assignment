import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import ProductList from '@components/product/ProductList'

export default function List() {
  return (
    <Auth code="7.2">
      <>
        <SEO />
        <DashboardLayout>
          <ProductList />
        </DashboardLayout>
      </>
    </Auth>
  )
}
