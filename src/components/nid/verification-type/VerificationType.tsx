import React, { useState } from 'react'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import Verification from '@components/onboarding/nid-verification/Verification'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { increment, setApplicant } from '@redux/slices/nid-verification.slice'
import { RootState } from '@redux/store'
import { toast } from 'react-toastify'

export default function VerificationType() {
  const dispatch = useDispatch()
  const [isFinger, setIsFinger] = useState<boolean>(false)
  const [isFace, setIsFace] = useState<boolean>(false)
  const type = useSelector((state: RootState) => state.verification.applicant.verificationType)

  const handleFingerprintVerification = () => {
    setIsFinger(true)
    setIsFace(false)
    const data = {
      name: 'verificationType',
      value: 'FINGER',
    }
    dispatch(setApplicant(data))
  }

  const handleFaceVerification = () => {
    setIsFinger(false)
    setIsFace(true)
    const data = {
      name: 'verificationType',
      value: 'FACE',
    }
    dispatch(setApplicant(data))
  }

  const onSubmit = () => {
    if (type !== '') {
      dispatch(increment())
    } else {
      toast.error('Please Select Verification Type First')
    }
  }

  return (
    <>
      <OnboardingInputLayout title="verification type">
        <>
          <div className="flex gap-4 justify-center items-center">
            <Verification
              text="Fingerprint"
              isShow={isFinger}
              onClick={handleFingerprintVerification}
              iconUrl="/icon_finger.png"
            />
            <Verification text="Face" isShow={isFace} onClick={handleFaceVerification} iconUrl="/icon_facial.png" />
          </div>
          <div className="mb-5">
            <Button id="next" label="Next" onClick={onSubmit} />
          </div>
        </>
      </OnboardingInputLayout>
    </>
  )
}
