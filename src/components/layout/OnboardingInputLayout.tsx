import React from 'react'

interface IOnboardingInputLayoutProps {
  children: JSX.Element
  title: string
  widthfull?: boolean
}

export default function OnboardingInputLayout({ children, title, widthfull }: IOnboardingInputLayoutProps) {
  return (
    <div className="flex flex-col justify-center items-center mt-10 overflow-x-auto overflow-y-hidden animate__animated animate__fadeIn">
      <h4 className="text-2xl font-semibold capitalize mb-4">{title}</h4>
      {widthfull ? (
        <div className="w-full px-4 flex flex-col gap-4">{children}</div>
      ) : (
        <div className="w-full px-4 md:w-2/3 lg:w-5/12 flex flex-col gap-4">{children}</div>
      )}
    </div>
  )
}
