import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { getUserProfile, postUserValidationCheck, putProfilePictureUpdate, putProfileUpdate } from '@config/urls.config'
import { toast } from 'react-toastify'
import { IUserCheckRes } from '@interfaces/user.interface'
import SelectBox from '@components/common/SelectBox'
import { IProfileCheck, IProfileDataRes, IProfileUpdate, IProfileUpdateRes } from '@interfaces/profile.interface'
import ImageUpdate from '@components/common/ImageUpdate'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  name: Joi.string().min(1).message('Please provide a valid Name').required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  mobile: Joi.string()
    .max(14)
    .regex(new RegExp(/^(?:\+88|88)?(01[3-9]\d{8})$/))
    .message('Please provide a valid Mobile Number')
    .required(),
  pinAuthStatus: Joi.boolean().required(),
})

export default function UpdateProfile(): JSX.Element {
  const flag = 'data:image/jpeg;base64,'

  const [userCheck, setUserCheck] = useState<IProfileCheck>({
    name: '',
    email: '',
    mobile: '',
  })
  const [updateUser, setUpdateUser] = useState<IProfileUpdate>({
    name: '',
    email: '',
    mobile: '',
    pinAuthStatus: false,
  })

  const { ok: userCheckOk, errors: userUpdateError } = useFormValidationAsync(schema, updateUser, {
    abortEarly: true,
  })

  const { execute: executeProfileShow } = useAPIWithToken<IProfileDataRes>()
  const { isLoading, execute: profileUpdate } = useAPIWithToken<IProfileUpdateRes>()
  const { execute: userCheckMobile } = useAPIWithToken<IUserCheckRes>()
  const { execute: userCheckEmail } = useAPIWithToken<IUserCheckRes>()
  const [img, setImg] = useState(false)
  const [url, setUrl] = useState('/img/placeholder_nominee_photo@2x.png')
  const [type, setType] = useState('')

  useEffect(() => {
    fetchProfileData()
    getPicture()
  }, [])

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value
    if (e.target.name === 'pinAuthStatus') {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: value === 'true' ? true : false,
      })
    } else {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: value,
      })
    }
  }

  //   //************** Show from data *************** *//
  const fetchProfileData = async () => {
    try {
      const res = await executeProfileShow({
        method: 'GET',
        url: getUserProfile,
      })
      const userData: IProfileUpdate = {
        name: res?.data.name ?? '',
        email: res?.data.email ?? '',
        mobile: res?.data.mobile ?? '',
        pinAuthStatus: res?.data.pinAuthStatus ?? false,
      }
      setUpdateUser({ ...userData })
      setUserCheck({
        name: res?.data.name ?? '',
        email: res?.data.email ?? '',
        mobile: res?.data.mobile ?? '',
      })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (userCheckOk) {
      try {
        if (updateUser.email !== userCheck.email) {
          const checkingEmail = await userCheckEmail({
            method: 'POST',
            url: postUserValidationCheck,
            data: { email: updateUser.email },
          })
          if (checkingEmail?.data) {
            toast.warning('Email already exists')
          }
        }
        if (updateUser.mobile !== userCheck.mobile) {
          const checkingUserMobile = await userCheckMobile({
            method: 'POST',
            url: postUserValidationCheck,
            data: { mobile: updateUser.mobile },
          })

          if (checkingUserMobile?.data) {
            toast.warning('Mobile number already exists')
          }
        }
        const res = await profileUpdate({
          method: 'PUT',
          url: putProfileUpdate,
          data: {
            ...updateUser,
          },
        })
        if (res?.statusCode === 200) {
          if (img) {
            updatePicture()
          }
          toast.success('Updated successfully', {
            onOpen: () => router.push('/admin/profile'),
          })
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  //**************** Picture Update ************** */
  const updatePicture = async () => {
    try {
      await profileUpdate({
        method: 'PUT',
        url: putProfilePictureUpdate,
        data: {
          data: url.split(',').pop(),
          mimeType: type,
        },
      })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const onUpdate = (data: string, mime: string) => {
    setUrl(data)
    setType(mime)
    setImg(true)
  }

  const getPicture = async () => {
    setImg(false)
    try {
      const res = await executeProfileShow({
        method: 'GET',
        url: getUserProfile,
      })
      setUrl(res?.data.userImage?.data ? flag + res?.data.userImage?.data : '/img/placeholder_nominee_photo@2x.png')
      if (res?.data.userImage) {
        setImg(true)
        setType(res?.data.userImage.mimeType)
      } else {
        setImg(false)
      }
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container my-33 mx-auto px-4 md:px-12">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold pb-10">Update Profile Information</h1>
        <div className="flex justify-center">
          <ImageUpdate url={url} onUpdate={onUpdate} />
        </div>
        <div>
          <TextInput
            id="name"
            placeholder="Name"
            name="name"
            type="text"
            value={updateUser.name}
            onChange={onChangeEvent}
            label="Name"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['name']}
          />
        </div>
        <div>
          <TextInput
            id="email"
            placeholder="Email"
            name="email"
            type="text"
            value={updateUser.email}
            onChange={onChangeEvent}
            label="Email"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['email']}
          />
        </div>
        <div>
          <TextInput
            id="mobile"
            placeholder="Mobile"
            name="mobile"
            type="text"
            onChange={onChangeEvent}
            value={updateUser.mobile}
            label="Mobile"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['mobile']}
          />
        </div>
        <div>
          <SelectBox
            id="pinAuthStatus"
            label="Two Step Verification"
            name="pinAuthStatus"
            value={updateUser.pinAuthStatus.toString()}
            onSelect={onChangeEvent}
            options={[
              { key: 'true', value: 'Yes' },
              { key: 'false', value: 'No' },
            ]}
            error={userUpdateError['pinAuthStatus']}
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
