import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import TpUpdate from '@components/tp/TpUpdate'
import Auth from '@components/auth/Auth'

interface UpdateTpProps {
  id: string
}

export default function Update({ id }: UpdateTpProps): JSX.Element {
  const tpIdRes = parseInt(id)
  return (
    <Auth code="4.2.3">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <TpUpdate tpId={tpIdRes} />
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
