import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import UpdateUser from '@components/user/UpdateUser'
import Auth from '@components/auth/Auth'

interface UpdateUserProps {
  id: string
}

export default function Update({ id }: UpdateUserProps): JSX.Element {
  const roleId = parseInt(id)
  return (
    <Auth code="2.3">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <UpdateUser Id={roleId} />
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
