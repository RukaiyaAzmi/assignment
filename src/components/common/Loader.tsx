import React from 'react'

export default function Loader(): JSX.Element {
  return (
    <div className=" h-screen w-full flex flex-col gap-6 justify-center items-center text-center bg-slate-100">
      <div className="animate-pulse">
        <img src="/logo@2x.png" alt="Logo" className={`cursor-pointer duration-500`} width="150" height="75" />
      </div>
      <div className="flex gap-4">
        <div className="animate-spin h-8 w-8 rounded-lg bg-purple-300"></div>
        <div className="animate-spin h-8 w-8 rounded-lg bg-purple-300"></div>
        <div className="animate-spin h-8 w-8 rounded-lg bg-purple-300"></div>
      </div>
    </div>
  )
}
