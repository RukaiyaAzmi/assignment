import React from 'react'

interface VerificationProps {
  iconUrl: string
  text?: string
  isShow?: boolean
  onClick: () => void
  disable?: boolean
}

export default function Verification({ iconUrl, text, onClick, isShow, disable }: VerificationProps) {
  return (
    <>
      <div
        className={`w-full bg-white flex flex-col justify-center items-center mt-2 gap-2 shadow-md py-5 rounded-md ${
          isShow ? 'border-2 border-green-500 border-dashed' : ''
        }`}
      >
        <button onClick={onClick} disabled={disable}>
          <img className=" w-28 h-28 rounded-md" src={iconUrl} alt="" />
        </button>

        <p className=" text-sm font-semibold text-gray-400">{text}</p>
      </div>
    </>
  )
}
