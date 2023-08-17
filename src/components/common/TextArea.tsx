import { Label } from 'flowbite-react'
import React from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'

interface TextAreaProps {
  id: string
  label: string
  name: string
  placeholder: string
  required: boolean
  rows: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  value?: string
  iconUrl?: string
}

export default function TextArea({
  id,
  placeholder,
  label,
  name,
  onChange,
  error,
  value,
  rows,
  required,
  iconUrl,
}: TextAreaProps): JSX.Element {
  return (
    <div className="flex flex-col ">
      <div className="relative ">
        <Label className="mb-2 mt-0 text-base font-medium text-grey-300 leading-tight p-2" value={label} />
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
          onChange={onChange}
          value={value}
          className="bg-white border-none text-gray-900 text-sm rounded-md block w-full p-3.5 placeholder-gray-400 shadow-md pl-12 focus:ring-indigo-600"
        />
        <img src={iconUrl} className="absolute top-[33%] left-5 w-4" alt="Search Icon" />
      </div>
      {error !== undefined ? (
        <p className="flex gap-1 items-center py-1 text-sm text-red-500">
          <span>
            <AiOutlineCheckSquare />
          </span>
          {error}
        </p>
      ) : (
        ''
      )}
    </div>
  )
}
