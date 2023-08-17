import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Card from '@components/common/Card'
import FullProfile from '@components/full-profile/FullProfile'
import Auth from '@components/auth/Auth'

interface FullProfileProps {
  id: string
}

export default function Index({ id }: FullProfileProps): JSX.Element {
  const profileId = id
  return (
    <Auth code={['5.3', '5.4']}>
      <>
        <SEO />
        <DashboardLayout>
          <Card>
            <FullProfile applicantId={profileId} />
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
