import React, { useEffect, useState } from 'react'
import DateInput from '@components/common/DateInput'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { useAPIWithToken } from '@hooks/useAPI'
import { ecURL, postNidFingerprintVerification } from '@config/urls.config'
import { toast } from 'react-toastify'
import { IFingerPrintRes } from '@interfaces/onboarding.interface'
import { Spinner } from 'flowbite-react'
import { increment, setECFingerApiData, setFingerprint } from '@redux/slices/nid-verification.slice'
import Verification from '@components/onboarding/nid-verification/Verification'
import { setApplicant } from '@redux/slices/nid-verification.slice'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import { getOnboardingDateFormat } from '@utils/date.utils'
import { INidFingerprintVerificationRes } from '@interfaces/nid-verification.interface'

const schema: Joi.Schema = Joi.object({
  nid: Joi.alternatives().try(
    Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    Joi.string()
      .length(17)
      .pattern(/^[0-9]+$/)
      .required(),
  ),
  dob: Joi.string().required(),
})

export default function FingerprintVerification() {
  const [isShow, setIsShow] = useState<boolean>(false)
  const finger = useSelector((state: RootState) => state.verification.fingerprint)
  const nidVerification = useSelector((state: RootState) => state.verification)
  const dispatch = useDispatch()

  const { ok, errors: Error } = useFormValidationAsync(
    schema,
    nidVerification.applicant,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { isLoading: isFingerprintLoading, execute: executeFingerprint } = useAPIWithToken<IFingerPrintRes>()
  const { isLoading: isFingerprintVerificationLoading, execute: executeFingerprintVerification } =
    useAPIWithToken<INidFingerprintVerificationRes>()

  useEffect(() => {
    if (finger?.lIndex && finger?.lThumb && finger?.rIndex && finger?.rThumb) {
      setIsShow(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }

    dispatch(setApplicant(obj))
  }

  const handleDateChange = (selectedDate: Date) => {
    const date = getOnboardingDateFormat(selectedDate)
    const objDob = {
      name: 'dob',
      value: date,
    }
    const objDobDate = {
      name: 'dobDate',
      value: selectedDate.toISOString(),
    }
    dispatch(setApplicant(objDob))
    dispatch(setApplicant(objDobDate))
  }

  const handleSubmit = async () => {
    if (!ok) {
      toast.error('Please provide valid information')
      return
    }
    if (finger?.lIndex && finger?.lThumb && finger?.rIndex && finger?.rThumb) {
      try {
        const response = await executeFingerprintVerification({
          method: 'POST',
          url: postNidFingerprintVerification,
          data: {
            nid: nidVerification.applicant.nid,
            dob: nidVerification.applicant.dob,
            ...finger,
          },
        })
        if (response?.data.fingerVerificationResult.status === false) {
          toast.error('Fingerprint not Matched')
        } else {
          const resDetails = response?.data.fingerVerificationResult.details.details
          dispatch(setECFingerApiData(resDetails))
          dispatch(increment())
        }
      } catch (error) {
        toast.error('Unknown Error')
      }
    } else {
      toast.error('Please Provide Fingerprint')
    }
  }

  const handleFingerprintVerification = async () => {
    const fingerobj = {
      MinQ: 30,
      Retry: 3,
      TokenId: 'g86v5s4g5se84g5sfd4g5werx25sdf4f',
    }

    try {
      const response = await executeFingerprint({
        method: 'POST',
        url: ecURL,
        data: fingerobj,
      })
      if (response) {
        const rightThumb = response[0].fingerData
        const rightIndex = response[1].fingerData
        const leftThumb = response[2].fingerData
        const leftIndex = response[3].fingerData

        const obj = {
          rightThumb,
          rightIndex,
          leftThumb,
          leftIndex,
        }
        dispatch(setFingerprint(obj))
        setIsShow(true)
      }
    } catch (error) {
      setIsShow(false)
      toast.error('Device Not Found')
    }
  }

  return (
    <>
      <OnboardingInputLayout title="fingerprint verification">
        <>
          <TextInputWithLabel
            id="nid"
            placeholder="Enter Your NID No"
            type="text"
            name="nid"
            onChange={handleChange}
            value={nidVerification.applicant.nid}
            iconUrl="/icon/icon_forAllTextFild.svg"
            label="NID No"
            error={Error['nid']}
          />
          <DateInput
            isShow={true}
            error={Error['dob']}
            label="Date of Birth"
            onDateChange={handleDateChange}
            dob={nidVerification.applicant.dob}
          />
          <Verification
            onClick={handleFingerprintVerification}
            iconUrl="/icon_finger.png"
            text="Click to Provide Fingerprint"
            isShow={isShow}
            disable={isFingerprintLoading}
          />
          {isFingerprintLoading || isFingerprintVerificationLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="button" label="Next" disable={isFingerprintVerificationLoading} onClick={handleSubmit} />
          {/* <PrevButton onPrevStep={handlePrevStep} /> */}
        </>
      </OnboardingInputLayout>
    </>
  )
}
