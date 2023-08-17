import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import AbsAccountCheck from './AbsAccountCheck'
import CbsAccountCheck from './CbsAccountCheck'
export default function DedupeRouter() {
  const channelCode = useSelector((state: RootState) => state.ekyc.account.channelCode)

  switch (channelCode) {
    case 'ABS':
      return <AbsAccountCheck />
    case 'CBS':
      return <CbsAccountCheck />
    default:
      return <></>
  }
}
