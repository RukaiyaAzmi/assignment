import React, { useState } from 'react'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { IForgetPassConfirm, IForgetPassConfirmRes } from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import useAPI from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postForgetPasswordConfirm } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import router from 'next/router'
import LoginCard from '@components/login/LoginCard'
import { RootState } from '@redux/store'

// Joi validation schema for corresponding state
const schema: Joi.Schema = Joi.object({
  newPassword: Joi.string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Please check the password policy')
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).label('Must be Same as New Password').required(),
})

export default function ResetPasswordConfirm(): JSX.Element {
  const pass = useSelector((state: RootState) => state.password)
  const [password, setPassword] = useState<IForgetPassConfirm>({
    newPassword: '',
    confirmPassword: '',
  })

  const { ok, errors } = useFormValidationAsync(schema, password, {
    abortEarly: true,
  })

  const { isLoading: isForgetPassLoading, execute: executeForgetPassConfirm } = useAPI<IForgetPassConfirmRes>()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string | boolean = e.target.value
    setPassword({
      ...password,
      [e.target.name]: value,
    })
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await executeForgetPassConfirm({
          method: 'POST',
          url: postForgetPasswordConfirm,
          data: {
            newPassword: password.newPassword,
          },
          headers: {
            'x-auth-passcode': '$Er@InfoTech#LtdCMMI3',
            'x-mobile-token': pass.mobileToken,
          },
        })
        if (res?.statusCode === 200) {
          toast.success('Password Changed')
          router.push('/')
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid password')
    }
  }

  return (
    <LoginCard>
      <>
        <h1 className="text-lg text-gray-500">Reset Password</h1>
        <form className="w-full flex flex-col gap-6">
          <TextInput
            id="newPassword"
            placeholder="New Password"
            name="newPassword"
            type="password"
            onChange={onInputChange}
            iconUrl="/icon/icon_password.svg"
            error={errors['newPassword']}
          />
          <TextInput
            id="confirmPassword"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={onInputChange}
            iconUrl="/icon/icon_password.svg"
            error={errors['confirmPassword']}
          />
          {/** Spinner for api call */}
          {isForgetPassLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="submit" label="Confirm" onClick={onSubmit} disable={isForgetPassLoading} />
        </form>
      </>
    </LoginCard>
  )
}
