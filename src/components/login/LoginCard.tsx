import React from 'react'

interface LoginCardProps {
  children: JSX.Element
}

export default function LoginCard({ children }: LoginCardProps) {
  return (
    <div className=" flex flex-col sm:flex-row justify-center items-center sm:w-6/12 bg-white rounded-lg my-20">
      <div className="flex justify-center items-center p-8">
        <img src="/img/icon_kyc@2x.png" alt="logo image" width={250} height={250} loading="lazy" />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center flex-1 h-full w-full bg-gray-50 rounded-lg p-8">
        {children}
      </div>
    </div>
  )
}
