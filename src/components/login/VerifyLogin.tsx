import React, { useState } from 'react'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { IForgetPassVerify, IUserLoginRes } from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import useAPI from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postVerifyLogin } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import router from 'next/router'
import LoginCard from '@components/login/LoginCard'
import { updateUserDetails } from '@redux/slices/user.slice'

// Joi validation schema for corresponding state
const schema: Joi.Schema = Joi.object({
  otp: Joi.string().max(6).min(6).required(),
})

export default function VerifyLogin(): JSX.Element {
  const [otp, setOtp] = useState<IForgetPassVerify>({
    otp: '',
  })

  const dispatch = useDispatch()
  const { ok, errors } = useFormValidationAsync(schema, otp, {
    abortEarly: true,
  })

  const { isLoading, execute: executeVerifyLogin } = useAPI<IUserLoginRes>()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value
    setOtp({
      ...otp,
      [e.target.name]: value,
    })
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await executeVerifyLogin({
          method: 'POST',
          url: postVerifyLogin,
          data: {
            otp: otp.otp,
          },
          headers: {
            'x-login-token': localStorage.getItem('loginToken'),
          },
        })

        if (res?.statusCode === 200) {
          localStorage.clear()
          dispatch(
            updateUserDetails({
              channelCode: res.data.channelCode,
              branchOrAgentPointCode: res.data.branchOrAgentPointCode,
              branchOrAgentPointName: res.data.branchOrAgentPointName,
              features: res.data.features,
            }),
          )
          localStorage.setItem('accessToken', res.data.authToken)
          toast.success('Login successful')
          router.replace('/admin/dashboard')
        } else {
          toast.error('Invalid OTP')
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid OTP')
    }
  }

  return (
    <LoginCard>
      <>
        <h1 className="text-lg text-gray-500 my-6">Two Step Verification</h1>
        <form className="w-full flex flex-col gap-8 mb-5">
          <TextInput
            id="otp"
            placeholder="OTP"
            name="otp"
            type="text"
            onChange={onInputChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={errors['otp']}
          />
          {/** Spinner for api call */}
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
        </form>
      </>
    </LoginCard>
  )
}
