// import type { NextPage } from 'next'
import React from 'react'
import LandingLayout from '@components/layout/LandingLayout'
import SEO from '@components/common/SEO'
import ResetPasswordPath from '@components/reset-password/ResetPasswordPath'

/**
 * Home: The Landing page of the web app
 * @return {JSX.Element} The JSX Code for the Home Page
 */

export default function Index(): JSX.Element {
  return (
    <>
      <SEO />
      <LandingLayout>
        <ResetPasswordPath />
      </LandingLayout>
    </>
  )
}
