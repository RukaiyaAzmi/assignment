import React from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'

export interface IOptionsData {
  key: string
  value: string
}

interface SelectBoxProps {
  id: string
  label?: string
  options: IOptionsData[]
  onSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value?: string
  name?: string
  error?: string
  selectText?: string
  disabled?: boolean
  mandatory?: boolean
}

export default function SelectBox({
  id,
  label,
  options,
  onSelect,
  value,
  name,
  error,
  selectText,
  disabled,
  mandatory,
}: SelectBoxProps) {
  return (
    <>
      <div className="flex flex-col relative">
        <div className="py-2 relative">
          {label && (
            <label
              htmlFor={id}
              className="w-full rounded-md py-7 mb-2 mt-0 text-base font-medium text-grey-300 leading-tight "
            >
              {label}
              {mandatory ? <span className="text-red-500">*</span> : ''}
            </label>
          )}
          <select
            id={id}
            onChange={onSelect}
            value={value}
            name={name}
            disabled={disabled}
            className="bg-white border-none shadow-md text-gray-500 text-sm rounded-md focus:ring-indigo-500 block w-full p-2.5 h-12"
          >
            <option value="" disabled>
              {selectText ?? 'Please Select'}
            </option>
            {options.map((op, index) => (
              //eslint-disable-next-line
              <option key={index} value={op.key} custom-value={op.value}>
                {op.value}
              </option>
            ))}
          </select>
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
    </>
  )
}
