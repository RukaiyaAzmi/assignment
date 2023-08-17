import { RootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import UpgradePersonal from './UpgradePersonal'
import UpgradeFile from './UpgradeFile'
import UpgradeRisk from './UpgradeRisk'
import UpgradeList from './UpgradeList'
import UpgradeConfirm from './UpgradeConfirm'

export default function UpgradePath() {
  const step = useSelector((state: RootState) => state.upgrade.step)
  switch (step) {
    case 1:
      return <UpgradeList />
    case 2:
      return <UpgradePersonal />
    case 3:
      return <UpgradeFile />
    case 4:
      return <UpgradeRisk />
    case 5:
      return <UpgradeConfirm />
    default:
      return <div></div>
  }
}
