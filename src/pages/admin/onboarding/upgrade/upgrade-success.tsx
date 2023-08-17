import React from 'react'
import SEO from '@components/common/SEO'
import Auth from '@components/auth/Auth'
import UpgradeSuccess from '@components/onboarding/upgrade/UpgradeSuccess'

export default function Index() {
  return (
    <Auth code="5.1.3">
      <>
        <SEO />
        <UpgradeSuccess />
      </>
    </Auth>
  )
}
