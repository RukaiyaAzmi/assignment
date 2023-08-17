import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import ProductUpate from '@components/product/ProductUpdate'
import Auth from '@components/auth/Auth'

interface UpdateProductProps {
  id: string
}

export default function Update({ id }: UpdateProductProps): JSX.Element {
  const prodcutId = parseInt(id)
  return (
    <Auth code="7.3">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <ProductUpate pId={prodcutId} />
          </Card>
        </DashboardLayout>
      </>
    </Auth>
  )
}

export async function getServerSideProps(context) {
  const id = context.query.id
  return {
    props: {
      id: id,
    },
  }
}
