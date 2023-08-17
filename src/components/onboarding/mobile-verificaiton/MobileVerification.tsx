import Button from '@components/common/Button'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { postSendOtp, postVerifydOtp, getTemp, putEkycTemp } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import {
  ICreateTemp,
  IGetTempDataRes,
  ISendOtpRes,
  ITempDataRes,
  IVerifyOtp,
  IverifyOtpRes,
} from '@interfaces/onboarding.interface'
import { increment, setApplicant, setChannel, setTempData, setTempId } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { Spinner } from 'flowbite-react'
import Joi from 'joi'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const schema: Joi.Schema = Joi.object({
  mobile: Joi.string()
    .max(14)
    .regex(new RegExp(/^(?:\+88|88)?(01[3-9]\d{8})$/))
    .message('Please provide a valid Mobile Number')
    .required(),
})
const schemaForOtp: Joi.Schema = Joi.object({
  otp: Joi.string().max(6).min(6).required(),
})

export default function MobileVerification() {
  const dispatch = useDispatch()
  const applicant = useSelector((state: RootState) => state.ekyc)
  const user = useSelector((state: RootState) => state.user)
  const [otp, setOtp] = useState(false)
  const [conval, setConval] = useState('')
  const [verifyOtp, setVerifyOtp] = useState<IVerifyOtp>({
    otp: '',
  })

  const { ok, errors: mobileError } = useFormValidationAsync(
    schema,
    applicant.applicant,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { ok: otpOk, errors: otpError } = useFormValidationAsync(
    schemaForOtp,
    verifyOtp,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { isLoading, execute: executeSendOtp } = useAPIWithToken<ISendOtpRes>()
  const { isLoading: isVerifyOtpLoading, execute: executeVerifyOtp } = useAPIWithToken<IverifyOtpRes>()
  const { execute: executeGetTempData } = useAPIWithToken<IGetTempDataRes>()
  const { execute: executeCreateTemp } = useAPIWithToken<ICreateTemp>()
  const { execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    const inputObj = {
      name,
      value,
    }
    dispatch(setApplicant(inputObj))
  }

  const onOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value
    setVerifyOtp({
      ...verifyOtp,
      [e.target.name]: value,
    })
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await executeSendOtp({
          method: 'POST',
          url: postSendOtp,
          data: { mobile: applicant.applicant.mobile },
        })
        if (res?.statusCode === 200) {
          setConval(res.data.convalToken)
          setOtp(true)
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  const verify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (otpOk) {
      try {
        const res = await executeVerifyOtp({
          method: 'POST',
          url: postVerifydOtp,
          data: verifyOtp,
          headers: {
            'x-conval-token': conval,
          },
        })
        if (res?.status === true) {
          toast.success('OTP Matched!')
          dispatch(setChannel(user.channelCode))
          getTempData()
        } else {
          toast.error('Invalid OTP')
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  const getTempData = async () => {
    try {
      const res = await executeGetTempData({
        method: 'GET',
        url: getTemp,
        params: { mobile: applicant.applicant.mobile },
      })
      if (res?.data == null) {
        const res1 = await executeCreateTemp({
          method: 'POST',
          url: getTemp,
          data: {
            mobile: applicant.applicant.mobile,
            data: {},
          },
        })
        if (res1?.statusCode === 201) {
          const tempRes = await executeTempData({
            method: 'PUT',
            url: putEkycTemp,
            params: {
              id: res1?.data.id,
            },
            data: {
              data: {
                step: applicant.step + 1,
                tempStorageId: res1?.data.id,
              },
            },
          })

          if (tempRes) {
            dispatch(setTempId(res1?.data.id))
            dispatch(increment())
          }
        }
      } else {
        dispatch(setTempData(res.data.data))
      }
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <OnboardingInputLayout title="Mobile Verification">
        <>
          <TextInputWithLabel
            id="mobile"
            placeholder="Mobile No"
            name="mobile"
            type="text"
            value={applicant.applicant.mobile}
            onChange={onInputChange}
            label="Mobile No"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={mobileError['mobile']}
          />
          {otp && (
            <TextInputWithLabel
              id="otp"
              placeholder="OTP"
              name="otp"
              type="text"
              onChange={onOtpInputChange}
              label="OTP"
              iconUrl="/icon/icon_forAllTextFild.svg"
              maxLength={6}
              minLength={6}
              error={otpError['otp']}
            />
          )}
          {/** Spinner for api call */}
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          {!otp && <Button id="otp" label="Send OTP" disable={isLoading} onClick={onSubmit} />}
          {otp && <Button id="verify" label="Verify" disable={isVerifyOtpLoading} onClick={verify} />}
        </>
      </OnboardingInputLayout>
    </>
  )
}
