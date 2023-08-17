import React, { useState } from 'react'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { IForgetPassVerify } from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import { Spinner } from 'flowbite-react'
import { postForgetPasswordVerify } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import LoginCard from '@components/login/LoginCard'
import { RootState } from '@redux/store'
import { increment, setMobileToken } from '@redux/slices/password.slice'
import axios from 'axios'

// Joi validation schema for corresponding state
const schema: Joi.Schema = Joi.object({
  otp: Joi.string().max(6).min(6).required(),
})

export default function ResetPasswordVerify(): JSX.Element {
  const pass = useSelector((state: RootState) => state.password)
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState<IForgetPassVerify>({
    otp: '',
  })

  const dispatch = useDispatch()
  const { ok, errors } = useFormValidationAsync(schema, otp, {
    abortEarly: true,
  })

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string | boolean = e.target.value
    setOtp({
      ...otp,
      [e.target.name]: value,
    })
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const config = {
          headers: {
            'x-auth-passcode': '$Er@InfoTech#LtdCMMI3',
            'x-conval-token': pass.convalToken,
          },
        }
        setIsLoading(true)
        const res = await axios.post(postForgetPasswordVerify, otp, config)
        setIsLoading(true)
        if (res?.data?.status == true) {
          toast.success('OTP Matched!')
          const name = 'mobileToken'
          const value = res.headers['x-mobile-token']
          const inputObj = {
            name,
            value,
          }
          dispatch(setMobileToken(inputObj))
          dispatch(increment())
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
        <h1 className="text-lg text-gray-500 my-6">Reset Password</h1>
        <form className="w-full flex flex-col gap-8 mb-5">
          <TextInput
            id="otp"
            placeholder="Verification Code"
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
