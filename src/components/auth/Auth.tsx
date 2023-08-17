import Loader from '@components/common/Loader'
import { RootState } from '@redux/store'
import { isAuthorized, isTokenValid } from '@utils/auth.utils'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface AuthProps {
  children: JSX.Element
  code: string | string[]
}

enum VerificationStatus {
  'P',
  'A',
  'R',
}

export default function Auth({ children, code }: AuthProps): JSX.Element {
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.P)
  const features = useSelector((state: RootState) => state.user.features)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const isValid = isTokenValid(token)
      if (!isValid) return setVerificationStatus(VerificationStatus.R)
      const isAuth = isAuthorized(features, code)
      if (isAuth) setVerificationStatus(VerificationStatus.A)
      else setVerificationStatus(VerificationStatus.R)
    } else setVerificationStatus(VerificationStatus.R)
  }, [])

  if (verificationStatus === VerificationStatus.P) return <Loader />
  if (verificationStatus === VerificationStatus.R)
    return (
      <>
        {(() => {
          localStorage.clear()
          router.push('/')
        })()}
      </>
    )
  return <>{children}</>
}
