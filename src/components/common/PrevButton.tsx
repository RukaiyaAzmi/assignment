import React from 'react'

interface IPrevButton {
  onPrevStep: () => void
}

export default function PrevButton({ onPrevStep }: IPrevButton) {
  return (
    <div className="flex flex-col justify-center items-center">
      <button onClick={onPrevStep} className=" text-sm font-semibold text-gray-400 capitalize">
        back to previous
      </button>
      <div className="border-b-2 w-36"></div>
    </div>
  )
}
