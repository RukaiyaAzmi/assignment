import { ToggleSwitch } from 'flowbite-react'
import React from 'react'

const theme = {
  toggle: {
    checked: {
      color: {
        blue: 'bg-indigo-700',
      },
    },
  },
}

interface SettingProps {
  icon: JSX.Element
  value: boolean
  name: string
  onChange: (name: string, check: boolean) => void
  label: string
  subLabel: string
  disabled?: boolean
}

export default function Setting({ icon, value, name, onChange, label, subLabel, disabled }: SettingProps) {
  return (
    <div className="flex justify-between p-4 rounded-md border-b">
      <div className="flex gap-3">
        <span>{icon}</span>
        <div className=" text-sm capitalize">
          <p className=" font-semibold">{label}</p>
          <p className="text-xs">{subLabel}</p>
        </div>
      </div>
      <div className=" mt-2">
        <ToggleSwitch
          checked={value}
          label=""
          theme={theme}
          onChange={(check) => (disabled ? '' : onChange(name, check))}
        />
      </div>
    </div>
  )
}
