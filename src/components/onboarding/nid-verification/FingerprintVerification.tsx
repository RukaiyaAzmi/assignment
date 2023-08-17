import React, { useEffect, useState } from 'react'
import DateInput from '@components/common/DateInput'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import PrevButton from '@components/common/PrevButton'
import Verification from './Verification'
import { useAPIWithToken } from '@hooks/useAPI'
import { ecURL, postFingerprintVerification, putEkycTemp } from '@config/urls.config'
import { toast } from 'react-toastify'
import { IFingerPrintRes, IFingerprintVerificationRes, ITempDataRes } from '@interfaces/onboarding.interface'
import { Spinner } from 'flowbite-react'
import {
  decrement,
  increment,
  setECFingerApiData,
  setFingerprint,
  setVerificationToken,
} from '@redux/slices/ekyc.slice'

export default function FingerprintVerification() {
  const [isShow, setIsShow] = useState<boolean>(false)
  const finger = useSelector((state: RootState) => state.ekyc.fingerprint)
  const ekyc = useSelector((state: RootState) => state.ekyc)
  const dispatch = useDispatch()

  const { isLoading: isFingerprintLoading, execute: executeFingerprint } = useAPIWithToken<IFingerPrintRes>()
  const { isLoading: isFingerprintVerificationLoading, execute: executeFingerprintVerification } =
    useAPIWithToken<IFingerprintVerificationRes>()
  const { isLoading: isTempDataLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  useEffect(() => {
    if (finger?.lIndex && finger?.lThumb && finger?.rIndex && finger?.rThumb) {
      setIsShow(true)
    }
  }, [])

  const handleSubmit = async () => {
    if (finger?.lIndex && finger?.lThumb && finger?.rIndex && finger?.rThumb) {
      try {
        const response = await executeFingerprintVerification({
          method: 'POST',
          url: postFingerprintVerification,
          data: {
            nid: ekyc.applicant.nid,
            dob: ekyc.applicant.dob,
            ...finger,
          },
        })
        if (response?.data.fingerVerificationResult.status === false) {
          toast.error('Fingerprint not Matched')
        } else {
          const resDetails = response?.data.fingerVerificationResult.details.details
          dispatch(setECFingerApiData(resDetails))
          dispatch(setVerificationToken(response?.data.verificationToken ?? ''))
          const tempRes = await executeTempData({
            method: 'PUT',
            url: putEkycTemp,
            params: {
              id: ekyc.tempStorageId,
            },
            data: {
              data: {
                step: ekyc.step + 1,
                verificationToken: response?.data.verificationToken,
                account: {
                  ...ekyc.account,
                  title: resDetails?.nameEn,
                },
                applicant: {
                  ...ekyc.applicant,
                  nameBangla: resDetails?.name,
                  name: resDetails?.nameEn,
                  motherNameBangla: resDetails?.mother,
                  fatherNameBangla: resDetails?.father,
                  spouseName: resDetails?.spouse,
                  pin: resDetails?.pin,
                },
                applicantFile: {
                  ...ekyc.applicantFile,
                  nidFrontImage: resDetails?.photo,
                },
                applicantPermanentAddress: {
                  ...ekyc.applicantPermanentAddress,
                  ...resDetails?.permanentAddress,
                },
                applicantPresentAddress: {
                  ...ekyc.applicantPresentAddress,
                  ...resDetails?.presentAddress,
                },
                fingerprint: finger,
              },
            },
          })

          if (tempRes) {
            dispatch(increment())
          }
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

  const handlePrevStep = () => {
    dispatch(decrement())
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
            value={ekyc.applicant.nid}
            readonly={true}
            iconUrl="/icon/icon_forAllTextFild.svg"
            label="NID No"
          />
          <DateInput isShow={false} label="Date of Birth" dob={ekyc.applicant.dob} />
          <Verification
            onClick={handleFingerprintVerification}
            iconUrl="/icon_finger.png"
            text="Click to Provide Fingerprint"
            isShow={isShow}
            disable={isFingerprintLoading}
          />
          {isFingerprintLoading || isTempDataLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="button" label="Next" disable={isFingerprintVerificationLoading} onClick={handleSubmit} />
          <PrevButton onPrevStep={handlePrevStep} />
        </>
      </OnboardingInputLayout>
    </>
  )
}
