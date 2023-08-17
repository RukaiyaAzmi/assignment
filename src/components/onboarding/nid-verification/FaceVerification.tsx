import React, { useEffect, useState } from 'react'
import DateInput from '@components/common/DateInput'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import PrevButton from '@components/common/PrevButton'
import Verification from './Verification'
import { decrement, increment, setApplicatFile, setECFaceApiData, setVerificationToken } from '@redux/slices/ekyc.slice'
import { useAPIWithToken } from '@hooks/useAPI'
import { postFaceVerification, postNidRpa, putEkycTemp } from '@config/urls.config'
import { toast } from 'react-toastify'
import { IFaceVerificationRes, INidRpaRes, ITempDataRes } from '@interfaces/onboarding.interface'
import { Spinner } from 'flowbite-react'
import ImageUploadCapture from '@components/common/ImageUploadCapture'
import Button from '@components/common/Button'
import { imageConverter } from '@utils/converter.utils'

export default function FaceVerification() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isShow, setIsShow] = useState<boolean>(false)
  const dispatch = useDispatch()
  const ekyc = useSelector((state: RootState) => state.ekyc)

  const { isLoading: isNidRpaLoading, execute: executeNidRpa } = useAPIWithToken<INidRpaRes>()

  const { isLoading: isFaceVerificationLoading, execute: executeFaceVerification } =
    useAPIWithToken<IFaceVerificationRes>()

  const { execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  useEffect(() => {
    if (ekyc.applicantFile.nidFrontImage !== '') {
      setIsShow(true)
    }
  }, [])

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
        url: postFaceVerification,
        data: {
          photo: base64Image,
          nidFront: ekyc.applicantFile.nidFrontImage,
        },
      })

      if (res?.statusCode === 200 && res.data.faceVerificationResult.status) {
        dispatch(setVerificationToken(res.data.verificationToken))

        const tempRes = await executeTempData({
          method: 'PUT',
          url: putEkycTemp,
          params: {
            id: ekyc.tempStorageId,
          },
          data: {
            data: {
              step: ekyc.step + 1,
              verificationToken: res.data.verificationToken,
              account: ekyc.account,
              applicant: ekyc.applicant,
              applicantFile: ekyc.applicantFile,
              applicantPermanentAddress: ekyc.applicantPermanentAddress,
              applicantPresentAddress: ekyc.applicantPresentAddress,
            },
          },
        })

        if (tempRes) {
          dispatch(increment())
        }
      } else {
        toast.error('Photo is Not Matching With NID Image')
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const handleFaceVerification = async () => {
    try {
      if (ekyc.applicant.nid && ekyc.applicant.dob) {
        const response = await executeNidRpa({
          method: 'POST',
          url: postNidRpa,
          data: {
            nid: ekyc.applicant.nid,
            dob: ekyc.applicant.dob,
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

  const handlePrevStep = () => {
    dispatch(decrement())
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
            value={ekyc.applicant.nid}
            readonly={true}
            iconUrl="/icon/icon_forAllTextFild.svg"
            label="NID No"
          />
          <DateInput isShow={false} label="Date of Birth" dob={ekyc.applicant.dob} />
          <Verification
            onClick={handleFaceVerification}
            iconUrl={
              ekyc.applicantFile.nidFrontImage ? imageConverter(ekyc.applicantFile.nidFrontImage) : '/icon_facial.png'
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
          {ekyc.applicantFile.nidFrontImage && (
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

          {/* <Button id="button" label="Next" onClick={handleSubmit} /> */}
          <PrevButton onPrevStep={handlePrevStep} />
        </>
      </OnboardingInputLayout>
    </>
  )
}
