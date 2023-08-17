import React from 'react'

interface CardProps {
  children: JSX.Element
}

export default function Card({ children }: CardProps) {
  return (
    <div className=" flex flex-col justify-center  items-center mt-0">
      <div className=" bg-clip-text   rounded-lg  p-2 w-full">
        <div className=" rounded px-38 pt-6 pb-8 mb-4 ">{children}</div>
      </div>
    </div>
  )
}
