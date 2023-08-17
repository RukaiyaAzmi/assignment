import React from 'react'
import FingerprintVerification from './FingerprintVerification'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import FaceVerification from './FaceVerification'

export default function Router() {
  const { verificationType } = useSelector((state: RootState) => state.ekyc.applicant)

  if (verificationType === 'FACE') {
    return (
      <>
        <FaceVerification />
      </>
    )
  } else {
    return (
      <>
        <FingerprintVerification />
      </>
    )
  }
}
