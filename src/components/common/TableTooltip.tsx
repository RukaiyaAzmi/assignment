import React from 'react'
import { Tooltip } from 'flowbite-react'

export interface TooltipProps {
  content: string
  icon: JSX.Element
  className?: string
}

export default function TableTooltip({ content, icon, className }: TooltipProps) {
  return (
    <>
      <Tooltip content={content}>
        <span className={className ?? 'text-2xl cursor-pointer'}>{icon}</span>
      </Tooltip>
    </>
  )
}
