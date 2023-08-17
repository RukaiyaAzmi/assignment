import React from 'react'
export interface TextRowProps {
  label?: string
  value?: string | number
}

export default function TextRowFull({ label, value }: TextRowProps) {
  return (
    <>
      <div className="flex  w-full">
        <span className=" text-sm text-gray-400 font-semibold max-w-[80px] sm:max-w-[165px] w-full inline-block">
          {label}
        </span>
        <span className="text-sm text-gray-800 flex  font-semibold">: {value ? value : 'None'}</span>
      </div>
    </>
  )
}
