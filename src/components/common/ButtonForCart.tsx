import React from 'react'

interface ButtonProps {
  id: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  label: string
  disable?: boolean
  width?: string
  hide?: boolean
}

export default function ButtonForCart({ id, label, onClick, disable = false, width, hide }: ButtonProps) {
  return (
    <div className="py-2 flex flex-col relative">
      <button
        id={id}
        disabled={disable}
        onClick={onClick}
        hidden={hide}
        className={`focus:outline-none text-blue-700 hover:text-blue-900 ${width} focus:ring-2 focus:ring-indigo-300 text-lg underline rounded-md px-5 py-2.5 p-3.5`}
      >
        {label}
      </button>
    </div>
  )
}
