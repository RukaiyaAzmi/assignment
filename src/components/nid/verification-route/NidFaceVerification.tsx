import React, { useEffect, useState } from 'react'
import DateInput from '@components/common/DateInput'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { useAPIWithToken } from '@hooks/useAPI'
import { postNidFaceVerification, postNidRpa } from '@config/urls.config'
import { toast } from 'react-toastify'
import { INidRpaRes } from '@interfaces/onboarding.interface'
import { Spinner } from 'flowbite-react'
import ImageUploadCapture from '@components/common/ImageUploadCapture'
import Button from '@components/common/Button'
import { imageConverter } from '@utils/converter.utils'
import Verification from '@components/onboarding/nid-verification/Verification'
import { getOnboardingDateFormat } from '@utils/date.utils'
import { increment, setApplicant, setApplicatFile, setECFaceApiData } from '@redux/slices/nid-verification.slice'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import { INidFaceVerificationRes } from '@interfaces/nid-verification.interface'

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

export default function NidFaceVerification() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isShow, setIsShow] = useState<boolean>(false)
  const dispatch = useDispatch()
  const nidVerification = useSelector((state: RootState) => state.verification)

  const { ok, errors: Error } = useFormValidationAsync(
    schema,
    nidVerification.applicant,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { isLoading: isNidRpaLoading, execute: executeNidRpa } = useAPIWithToken<INidRpaRes>()

  const { isLoading: isFaceVerificationLoading, execute: executeFaceVerification } =
    useAPIWithToken<INidFaceVerificationRes>()

  useEffect(() => {
    if (nidVerification.applicantFile.nidFrontImage !== '') {
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

  const handleConfirm = async (image: string) => {
    const base64Image = image.split(',')[1]
    const obj = {
      name: 'photo',
      value: base64Image,
    }
    dispatch(setApplicatFile(obj))

    try {
      const res = await executeFaceVerification({
        method: 'POST',
        url: postNidFaceVerification,
        data: {
          nid: nidVerification.applicant.nid,
          photo: base64Image,
          nidFrontImage: nidVerification.applicantFile.nidFrontImage,
        },
      })

      if (res?.statusCode === 200 && res.data.faceVerificationResult.status) {
        dispatch(increment())
      } else {
        toast.error('Photo is Not Matching With NID Image')
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const handleFaceVerification = async () => {
    try {
      if (ok) {
        const response = await executeNidRpa({
          method: 'POST',
          url: postNidRpa,
          data: {
            nid: nidVerification.applicant.nid,
            dob: nidVerification.applicant.dob,
          },
        })
        if (response?.statusCode === 200) {
          setIsShow(true)
          dispatch(setECFaceApiData(response.data))
        }
      } else {
        toast.error('Plese Provide NID and Date of Birth')
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <OnboardingInputLayout title="Face verification">
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
            onClick={handleFaceVerification}
            iconUrl={
              nidVerification.applicantFile.nidFrontImage
                ? imageConverter(nidVerification.applicantFile.nidFrontImage)
                : '/icon_facial.png'
            }
            isShow={isShow}
            text="NID Verification"
            disable={isNidRpaLoading}
          />
          {isNidRpaLoading || isFaceVerificationLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          {nidVerification.applicantFile.nidFrontImage && (
            <div className="flex justify-center items-center">
              <div className="w-full">
                <Button
                  id="button"
                  disable={isFaceVerificationLoading}
                  label="Capture Photo"
                  onClick={handleShowModal}
                />
              </div>

              <ImageUploadCapture
                onConfirm={handleConfirm}
                label="Next"
                showModal={showModal}
                onCloseModal={handleCloseModal}
              />
            </div>
          )}
        </>
      </OnboardingInputLayout>
    </>
  )
}
