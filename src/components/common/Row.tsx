import React from 'react'

interface RowProps {
  children: JSX.Element
}

export default function Row({ children }: RowProps) {
  return <div className="flex flex-col md:flex-row px-8 py-2 border-b-2 border-gray-300">{children}</div>
}
