import OnboardingPath from '@components/onboarding/OnboardingPath'
import React, { useEffect } from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import { useDispatch } from 'react-redux'
import { resetOnboardingState, setEkycType } from '@redux/slices/ekyc.slice'

export default function Index() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetOnboardingState())
    dispatch(setEkycType(''))
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
