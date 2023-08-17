import Auth from '@components/auth/Auth'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import VerificationPath from '@components/nid/VerificationPath'
import { resetNidVerificationState } from '@redux/slices/nid-verification.slice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function Verification() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetNidVerificationState())
  }, [])
  return (
    <Auth code="9.1">
      <>
        <SEO />
        <DashboardLayout>
          <VerificationPath />
        </DashboardLayout>
      </>
    </Auth>
  )
}
