import React, { useEffect, useState } from 'react'
import LoginCard from './LoginCard'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import CheckBox from '@components/common/CheckBox'
import { IUserLogin, IUserLoginRes } from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Link from '@components/common/Link'
import useAPI from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postUserLogin } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserDetails } from '@redux/slices/user.slice'
import { useRouter } from 'next/router'
import { resetPasswordState } from '@redux/slices/password.slice'

// Joi validation schema for corresponding state
const schema: Joi.Schema = Joi.object({
  userId: Joi.string().min(3).message('Please provide a valid User ID').required(),
  password: Joi.string().min(3).message('Please check the password policy').required(),
  channelLogin: Joi.boolean().required(),
})

export default function Login(): JSX.Element {
  const [loginForm, setLoginForm] = useState<IUserLogin>({
    userId: '',
    password: '',
    channelLogin: false,
  })

  const dispatch = useDispatch()
  const router = useRouter()
  const { ok, errors } = useFormValidationAsync(schema, loginForm, {
    abortEarly: true,
  })

  const { isLoading, execute: executeLogin } = useAPI<IUserLoginRes>()

  useEffect(() => {
    dispatch(resetPasswordState())
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | boolean = e.target.value
    if (e.target.name === 'channelLogin') value = e.target.checked
    setLoginForm({
      ...loginForm,
      [e.target.name]: value,
    })
  }

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      executeLogin({
        method: 'POST',
        url: postUserLogin,
        data: loginForm,
      })
        .then((res) => {
          if (res) {
            if (res.data.authToken) {
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
              localStorage.setItem('loginToken', res.data.loginToken)
              router.replace('/verify-login')
            }
          }
        })
        .catch((e) => {
          console.error(e)
          toast.error('Unknown error')
        })
    }
  }

  return (
    <LoginCard>
      <>
        <h1 className="text-lg text-gray-500">Sign In</h1>
        <form className="w-full flex flex-col gap-4">
          <TextInput
            id="userId"
            placeholder="User ID"
            name="userId"
            type="text"
            onChange={onInputChange}
            iconUrl="/icon/icon_userid.svg"
            error={errors['userId']}
          />
          <TextInput
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            onChange={onInputChange}
            iconUrl="/icon/icon_password.svg"
            error={errors['password']}
          />
          <div className=" flex justify-between items-center">
            <CheckBox id="channelLogin" name="channelLogin" onChange={onInputChange} label="Channel Login" />
            <Link href="/reset-password" size="sm">
              Forgot Password?
            </Link>
          </div>
          {/** Spinner for api call */}
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="submit" label="Login" onClick={onSubmit} disable={isLoading} />
        </form>
      </>
    </LoginCard>
  )
}
