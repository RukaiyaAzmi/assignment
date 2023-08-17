import React from 'react'
export interface TextRowProps {
  label?: string
  value?: string | number
}

export default function TextRow({ label, value }: TextRowProps) {
  return (
    <>
      <div className=" w-full md:w-1/2 flex  gap-4">
        <span className="text-sm text-gray-400 font-semibold max-w-[70px] sm:max-w-[150px] w-full inline-block">
          {label}
        </span>
        <span className="text-sm text-gray-800 flex  font-semibold">: {value ? value : 'None'}</span>
      </div>
    </>
  )
}
