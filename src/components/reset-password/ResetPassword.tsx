import React, { useState } from 'react'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { IForgetPass, IForgetPassRes } from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import useAPI from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postForgetPassword } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import LoginCard from '@components/login/LoginCard'
import { increment, setConvalToken } from '@redux/slices/password.slice'

// Joi validation schema for corresponding state
const schema: Joi.Schema = Joi.object({
  userId: Joi.string().min(3).message('Please provide a valid User ID').required(),
})

export default function ResetPassword(): JSX.Element {
  const [user, setUser] = useState<IForgetPass>({
    userId: '',
  })

  const dispatch = useDispatch()

  const { ok, errors } = useFormValidationAsync(schema, user, {
    abortEarly: true,
  })

  const { isLoading, execute: executeForgetPass } = useAPI<IForgetPassRes>()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string | boolean = e.target.value
    setUser({
      ...user,
      [e.target.name]: value,
    })
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await executeForgetPass({
          method: 'POST',
          url: postForgetPassword,
          data: user,
          headers: {
            'x-auth-passcode': '$Er@InfoTech#LtdCMMI3',
          },
        })
        if (res?.message !== 'No User Found') {
          const name = 'convalToken'
          const value = res?.data.convalToken
          const inputObj = {
            name,
            value,
          }
          dispatch(setConvalToken(inputObj))
          dispatch(increment())
        } else {
          toast.error('No User Found')
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid user Id')
    }
  }

  return (
    <LoginCard>
      <>
        <h1 className="text-lg text-gray-500 my-6">Reset Password</h1>
        <form className="w-full flex flex-col gap-8 mb-5">
          <TextInput
            id="userId"
            placeholder="User ID"
            name="userId"
            type="text"
            onChange={onInputChange}
            iconUrl="/icon/icon_userid.svg"
            error={errors['userId']}
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
