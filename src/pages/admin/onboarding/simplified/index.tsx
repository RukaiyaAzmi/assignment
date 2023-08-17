import Auth from '@components/auth/Auth'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import OnboardingPath from '@components/onboarding/OnboardingPath'
import { resetOnboardingState, setEkycType } from '@redux/slices/ekyc.slice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function Index() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetOnboardingState())
    dispatch(setEkycType('S'))
  }, [])

  return (
    <Auth code="*">
      <>
        <SEO />
        <DashboardLayout>
          <OnboardingPath />
        </DashboardLayout>
      </>
    </Auth>
  )
}
