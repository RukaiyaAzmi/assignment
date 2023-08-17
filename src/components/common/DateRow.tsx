import { getViewDateFormat } from '@utils/date.utils'
import React from 'react'

export interface DateRowProps {
  label?: string
  value?: Date
}

export default function DateRow({ label, value }: DateRowProps) {
  return (
    <>
      <div className=" w-full md:w-1/2 flex  gap-4">
        <span className="text-sm text-gray-400 font-semibold max-w-[70px] sm:max-w-[150px] w-full inline-block">
          {label}
        </span>
        <span className="text-sm text-gray-800 font-semibold">: {value ? getViewDateFormat(value) : 'None'}</span>
      </div>
    </>
  )
}
