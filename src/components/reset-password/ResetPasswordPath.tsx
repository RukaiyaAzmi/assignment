import { RootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import ResetPassword from './ResetPassword'
import ResetPasswordVerify from './ResetPasswordVerify'
import ResetPasswordConfirm from './ResetPasswordConfirm'

export default function ResetPasswordPath() {
  const step = useSelector((state: RootState) => state.password.step)
  switch (step) {
    case 1:
      return <ResetPassword />
    case 2:
      return <ResetPasswordVerify />
    case 3:
      return <ResetPasswordConfirm />
    default:
      return <div></div>
  }
}
