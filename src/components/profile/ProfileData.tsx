import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { getUserProfile } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import InlineButton from '@components/common/InlineButton'
import { IProfileData, IProfileDataRes } from '@interfaces/profile.interface'
import TextRow from '@components/common/TextRow'
import Row from '@components/common/Row'
import DateRow from '@components/common/DateRow'
import router from 'next/router'

export default function ProfileData(): JSX.Element {
  const flag = 'data:image/jpeg;base64,'
  const [profileShow, setProfileShow] = useState<IProfileData>()
  const features = useSelector((state: RootState) => state.user.features)
  const { execute: executeProfileShow } = useAPIWithToken<IProfileDataRes>()

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const res = await executeProfileShow({
        method: 'GET',
        url: getUserProfile,
      })
      setProfileShow(res?.data)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleUpdate = () => {
    router.push({
      pathname: `/admin/profile/update`,
    })
  }

  return (
    <div className="md:px-12 animate__animated animate__fadeIn">
      <h1 className="flex justify-center text-2xl text-gray-900 font-bold pb-5">Profile Information</h1>
      <div className="bg-white w-full justify-center items-center">
        <div className=" py-8">
          <img
            className="w-40 h-40 rounded-md m-auto"
            src={
              profileShow?.userImage?.data
                ? flag + profileShow?.userImage.data
                : '/img/placeholder_nominee_photo@2x.png'
            }
            alt="profile Image"
          />
        </div>
        <Row>
          <>
            <TextRow label="Name" value={profileShow?.name} />
            <TextRow label="Mobile No." value={profileShow?.mobile} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Email" value={profileShow?.email} />
            <DateRow label="Create Date" value={profileShow?.userImage?.createDate} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="2FA" value={profileShow?.pinAuthStatus ? 'Yes' : 'No'} />
          </>
        </Row>
      </div>
      <div className="flex gap-1 justify-center items-center pt-4">
        {isAuthorized(features, '3.2') && (
          <InlineButton
            icon={<FaEdit />}
            value="Update"
            onClick={handleUpdate}
            color="bg-yellow-400 hover:bg-yellow-500"
          />
        )}
      </div>
    </div>
  )
}
