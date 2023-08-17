import React from 'react'

interface CheckboxInputProps {
  id: string
  name?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  disable?: boolean
  checked?: boolean
  value?: string
}

export default function CheckBox({ id, name, onChange, label, disable, checked, value }: CheckboxInputProps) {
  return (
    <>
      <div className="flex space-x-2">
        <input
          className="w-5 h-5 text-indigo-700 rounded-sm border-gray-300 focus:ring-0 hover:cursor-pointer"
          type="checkbox"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disable ?? false}
          checked={checked ?? undefined}
        />
        <span className=" text-sm text-gray-700 font-semibold">{label}</span>
      </div>
    </>
  )
}
