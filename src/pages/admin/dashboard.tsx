import Statistics from '@components/analytics/Statistics'
import Auth from '@components/auth/Auth'
import SEO from '@components/common/SEO'
import BranchSelectContainer from '@components/dashboard/BranchSelectContainer'
import DashboardLayout from '@components/layout/DashboardLayout'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const channelCode = useSelector((state: RootState) => state.user.channelCode)
  const features = useSelector((state: RootState) => state.user.features)
  return (
    <Auth code="*">
      <>
        <SEO />
        <DashboardLayout>
          <>
            <BranchSelectContainer channelCode={channelCode} />
            {isAuthorized(features, '6.1') ? <Statistics label={false} /> : ''}
          </>
        </DashboardLayout>
      </>
    </Auth>
  )
}
