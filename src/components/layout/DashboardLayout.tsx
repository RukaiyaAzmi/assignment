import Sidebar from '@components/sidebar/Sidebar'
import { routes } from '@config/routes.config'
import { getUserProfile, postSetting, postUserLogout } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { IProfileDataRes } from '@interfaces/profile.interface'
import { ISettingRes } from '@interfaces/setting.interface'
import { IUserLogoutRes } from '@interfaces/user.interface'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiHomeAlt } from 'react-icons/bi'
import { MdCastForEducation, MdForwardToInbox } from 'react-icons/md'
import { useIdleTimer } from 'react-idle-timer'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

interface DashboardLayoutProps {
  children: JSX.Element
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const [profile, setProfile] = useState<{ name: string | undefined; email: string | undefined }>({
    name: undefined,
    email: undefined,
  })
  const [url, setUrl] = useState('')
  const [idleTime, setIdleTime] = useState<number>(10)
  const router = useRouter()
  const dispatch = useDispatch()
  const { execute: executeLogout } = useAPIWithToken<IUserLogoutRes>()
  const { execute: executeProfileShow } = useAPIWithToken<IProfileDataRes>()
  const { execute: executeSetting } = useAPIWithToken<ISettingRes>()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await executeSetting({
        method: 'POST',
        url: postSetting,
        data: {
          key: 'USER_IDLE_TIMEOUT',
        },
      })
      setIdleTime(parseInt(res?.data[0].value ?? '10'))
    } catch (error) {
      toast.error('Unknown error')
    }
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
          dispatch({ type: 'app/clear' })
          window.location.href = '/'
        }
      })
      .catch((e) => {
        console.error(e)
        toast.error('Unknown error')
      })
  }

  const getPicture = async () => {
    const flag = 'data:image/jpeg;base64,'
    try {
      const res = await executeProfileShow({
        method: 'GET',
        url: getUserProfile,
      })
      setProfile({ name: res?.data.name, email: res?.data.email })
      setUrl(res?.data.userImage?.data ? flag + res?.data.userImage.data : '/img/placeholder_nominee_photo@2x.png')
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  useEffect(() => {
    getPicture()
  }, [])

  useIdleTimer({
    onIdle: onSignOutClick,
    timeout: 1000 * 60 * idleTime,
  })

  return (
    <div>
      <Sidebar menus={routes} brandName="eKYC">
        <>
          <Navbar fluid={true} rounded={true} className="shadow-md">
            <Navbar.Brand></Navbar.Brand>
            <div className="flex md:order-2">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<Avatar alt="User Image" img={url ?? '/img/placeholder_nominee_photo.png'} rounded={true} />}
              >
                <Dropdown.Header>
                  <span className="block text-sm">{profile.name ?? 'Your Name'}</span>
                  <span className="block truncate text-xs font-medium text-custom-purple">
                    {profile.email ?? 'name@email.com'}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item onClick={() => router.push('/admin/dashboard')}>Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={() => router.push('/admin/profile')}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onSignOutClick}>Sign out</Dropdown.Item>
              </Dropdown>
              <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
              <Navbar.Link href="/admin/dashboard">
                <span className=" flex justify-center items-center gap-1">
                  <BiHomeAlt /> Home
                </span>
              </Navbar.Link>
              <Navbar.Link href="#">
                <span className=" flex justify-center items-center gap-1">
                  <MdForwardToInbox /> Inbox
                </span>
              </Navbar.Link>
              <Navbar.Link href="#">
                <span className=" flex justify-center items-center gap-1">
                  <MdCastForEducation /> Training
                </span>
              </Navbar.Link>
            </Navbar.Collapse>
          </Navbar>
          {/**
           * Main content area
           */}
          <div className="min-h-screen">{children}</div>
          {/* Footer text */}
          <p className="hidden sm:block fixed bottom-0 right-2 font-semibold text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900">
            Copyrights © 2023 ERA InfoTech LTD. All rights reserved.
          </p>
        </>
      </Sidebar>
    </div>
  )
}
