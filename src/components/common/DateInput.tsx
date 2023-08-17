import { Label } from 'flowbite-react'
import React, { useState } from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import Datepicker from 'tailwind-datepicker-react'

const options = {
  autoHide: true,
  todayBtn: false,
  clearBtn: false,
  theme: {
    background: 'bg-white',
    todayBtn: '',
    clearBtn: '',
    icons: '',
    text: '',
    disabledText: 'bg-white',
    input:
      'bg-white border-none text-gray-900 text-sm rounded-md w-full p-3.5 placeholder-gray-400 shadow-md pl-12 focus:ring-indigo-600',
    inputIcon: 'text-gray-300',
    selected: 'bg-indigo-400 hover:bg-indigo-500',
  },
  datepickerClassNames: '',
  defaultDate: new Date(),
  language: 'en',
}

interface DateInputProps {
  dob?: string
  onDateChange?: (data: Date) => void
  label: string
  isShow: boolean
  mandatory?: boolean
  error?: string
}

export default function DateInput({ onDateChange, dob, label, isShow, mandatory = false, error }: DateInputProps) {
  const [show, setShow] = useState<boolean>(false)
  const handleClose = (state: boolean) => {
    setShow(state)
  }

  return (
    <>
      <div className="flex flex-col py-2">
        <div>
          <Label className="w-full text-base font-medium text-grey-300 leading-tight " value={label} />
          {mandatory ? <span className="text-red-500">*</span> : ''}
        </div>

        <Datepicker
          options={{ ...options, defaultDate: dob ? new Date(dob) : new Date() }}
          onChange={onDateChange}
          show={show ? isShow : false}
          setShow={handleClose}
        />
        {error !== undefined ? (
          <p className="flex gap-1 items-center py-1 text-sm text-red-400">
            <span>
              <AiOutlineCheckSquare />
            </span>
            {error}
          </p>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
