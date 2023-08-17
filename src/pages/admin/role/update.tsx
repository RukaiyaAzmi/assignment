import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import UpdateRole from '@components/role/UpdateRole'
import Auth from '@components/auth/Auth'

interface UpdateRoleProps {
  id: string
}

export default function Update({ id }: UpdateRoleProps): JSX.Element {
  const roleId = parseInt(id)
  return (
    <Auth code="1.3">
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <UpdateRole Id={roleId} />
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
