import { RootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import NidFaceVerification from './NidFaceVerification'
import NidFingerVerification from './NidFingerVerification'

export default function VerificationRoute() {
  const type = useSelector((state: RootState) => state.verification.applicant.verificationType)

  switch (type) {
    case 'FACE':
      return <NidFaceVerification />
    case 'FINGER':
      return <NidFingerVerification />
    default:
      return <></>
  }
}
