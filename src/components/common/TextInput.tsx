import React from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'

interface TextInputProps {
  id: string
  placeholder: string
  type?: string
  name: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  value?: string
  iconUrl?: string
  label?: string
}

export default function TextInput({
  id,
  placeholder,
  type,
  name,
  onChange,
  error,
  value,
  iconUrl,
  label,
}: TextInputProps) {
  return (
    <div className="flex flex-col ">
      {label && (
        <label className="text-sm font-semibold" id={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          className="bg-white border-none text-gray-900 text-sm rounded-md block w-full p-3.5 placeholder-gray-400 shadow-md pl-12 focus:ring-indigo-600"
        />
        <img src={iconUrl} className="absolute top-[33%] left-5 w-4" alt="Search Icon" />
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
