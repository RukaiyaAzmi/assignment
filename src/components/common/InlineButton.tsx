import React from 'react'

interface InlineButtonProps {
  icon: JSX.Element
  disabled?: boolean
  color: string
  value: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  width?: string
}

export default function InlineButton({ icon, onClick, color, value, disabled, width }: InlineButtonProps) {
  return (
    <>
      <button
        disabled={disabled ?? false}
        onClick={onClick}
        className={`flex justify-center text-xs items-center mr-3 px-2 py-1 space-x-1 ${width} ${color} hover: duration-200 rounded-md text-gray-100 w-20 font-semibold`}
      >
        <i>{icon}</i>
        <span>{value}</span>
      </button>
    </>
  )
}
