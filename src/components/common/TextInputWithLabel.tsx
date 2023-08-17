import { Label } from 'flowbite-react'
import React from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'

interface TextInputWithLabelProps {
  id: string
  placeholder: string
  label: string
  type?: string
  name: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  value?: string | number
  iconUrl?: string
  maxLength?: number
  minLength?: number
  readonly?: boolean
  mandatory?: boolean
  min?: number
  max?: number
}

export default function TextInputWithLabel({
  id,
  placeholder,
  type,
  name,
  onChange,
  error,
  value,
  iconUrl,
  label,
  maxLength,
  minLength,
  readonly,
  mandatory,
}: TextInputWithLabelProps) {
  return (
    <div className="flex flex-col relative ">
      <div className="py-2 relative ">
        <Label
          className="w-full rounded-md py-7 mb-2 mt-0 text-base font-medium text-grey-300 leading-tight "
          value={label}
        />
        {mandatory ? <span className="text-red-500">*</span> : ''}

        <input
          readOnly={readonly ?? false}
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          minLength={minLength}
          className="bg-white border-none text-gray-900 text-sm rounded-md block max-w-full w-full p-3 placeholder-gray-400 px-20 shadow-md pl-12 focus:ring-indigo-600 [&::-webkit-inner-spin-button]:appearance-none"
        />

        <img src={iconUrl} className="absolute top-[55%] left-5 w-4" alt="Search Icon" />
      </div>
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
  )
}
