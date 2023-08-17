import React, { useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postUserLogout, putPasswordUpdate } from '@config/urls.config'
import { toast } from 'react-toastify'
import { IUserLogoutRes } from '@interfaces/user.interface'
import { IPasswordChange, IProfileUpdateRes } from '@interfaces/profile.interface'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  oldPassword: Joi.string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Please check the password policy')
    .required(),
  newPassword: Joi.string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Please check the password policy')
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).label('Must be Same as New Password').required(),
})

export default function UpdateProfile(): JSX.Element {
  const [updatePass, setUpdatePass] = useState<IPasswordChange>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const { ok: userCheckOk, errors: passwordError } = useFormValidationAsync(schema, updatePass, {
    abortEarly: true,
  })

  const { execute: executeLogout } = useAPIWithToken<IUserLogoutRes>()
  const { isLoading, execute: profileUpdate } = useAPIWithToken<IProfileUpdateRes>()

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value
    setUpdatePass({
      ...updatePass,
      [e.target.name]: value,
    })
  }

  const onSignOutClick = () => {
    executeLogout({
      method: 'POST',
      url: postUserLogout,
    })
      .then((res: IUserLogoutRes | null) => {
        if (res) {
          toast.success('Logout successful')
          localStorage.clear()
          router.replace('/')
        }
      })
      .catch((e) => {
        console.error(e)
        toast.error('Unknown error')
      })
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (userCheckOk) {
      try {
        const res = await profileUpdate({
          method: 'POST',
          url: putPasswordUpdate,
          data: {
            oldPassword: updatePass.oldPassword,
            newPassword: updatePass.newPassword,
          },
        })
        if (res?.statusCode === 200) {
          toast.success('Updated successfully')
          onSignOutClick()
        } else {
          toast.error('Wrong Password')
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  return (
    <>
      <div className="container my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Change Password</h1>

        <div>
          <TextInput
            id="oldPassword"
            placeholder="Old Password"
            name="oldPassword"
            type="password"
            value={updatePass.oldPassword}
            onChange={onChangeEvent}
            label="Old Password"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={passwordError['oldPassword']}
          />
        </div>
        <div>
          <TextInput
            id="newPassword"
            placeholder="New Password"
            name="newPassword"
            type="password"
            value={updatePass.newPassword}
            onChange={onChangeEvent}
            label="New password"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={passwordError['newPassword']}
          />
        </div>
        <div>
          <TextInput
            id="confirmPassword"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={onChangeEvent}
            value={updatePass.confirmPassword}
            label="Confirm Password"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={passwordError['confirmPassword']}
          />
        </div>

        <div className="container m-auto mt-8 overflow-x-auto"></div>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="purple" aria-label="Loading" size="xl" />
          </div>
        ) : (
          ''
        )}
        <div className="sm:w-2/4 pt-3 m-auto">
          <ButtonCom id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
        </div>
      </div>
    </>
  )
}
