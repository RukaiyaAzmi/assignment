import { RootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import VerificationType from './verification-type/VerificationType'
import VerificationRoute from './verification-route/VerificationRoute'
import NidVerificationPreview from './verification-preview/NidVerificationPreview'

export default function VerificationPath() {
  const step = useSelector((state: RootState) => state.verification.step)

  switch (step) {
    case 1:
      return <VerificationType />
    case 2:
      return <VerificationRoute />
    case 3:
      return <NidVerificationPreview />
    default:
      return <></>
  }
}
