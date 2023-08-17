import React from 'react'

interface ButtonProps {
  id: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  label: string
  disable?: boolean
  width?: string
  hide?: boolean
}

export default function Button({ id, label, onClick, disable = false, width, hide }: ButtonProps) {
  return (
    <div className="py-2 flex flex-col relative">
      <button
        id={id}
        disabled={disable}
        onClick={onClick}
        hidden={hide}
        className={`focus:outline-none text-white ${width} bg-indigo-500 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-300 text-lg font-bold rounded-md px-5 py-2.5 p-3.5`}
      >
        {label}
      </button>
    </div>
  )
}
