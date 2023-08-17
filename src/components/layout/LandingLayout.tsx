import React from 'react'

interface LandingLayoutProps {
  children: JSX.Element
  bgImage?: string
}

export default function LandingLayout({ children, bgImage = '/img/bg_login.png' }: LandingLayoutProps): JSX.Element {
  return (
    <div className="flex flex-col h-full min-h-screen bg-cover" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="flex items-center justify-between my-8 mx-10 sm:mx-32 ">
        <div>
          <img src="/img/logo_login@2x.png" alt="Logo Image" width={130} height={35} loading="lazy" />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <p className="hidden sm:block text-gray-100 font-light">Don&apos;t have an account?</p>
          <button className="btn btn-grey">Self Onboard</button>
        </div>
      </nav>
      <section className="flex justify-center items-center">{children}</section>
    </div>
  )
}
