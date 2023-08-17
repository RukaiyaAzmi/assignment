import { IAlert } from '@redux/slices/global.slice'
import { RootState } from '@redux/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function Alert(): JSX.Element {
  const alert = useSelector<RootState, IAlert>((state) => state.global.alert)

  useEffect(() => {
    if (alert.hidden === false) {
      window.scrollTo(0, 0)
    }
  }, [alert.hidden])

  if (!alert) return <></>
  if (alert.hidden === true) return <></>

  return (
    <div className="flex p-4 text-sm text-red-800 bg-red-50 justify-center items-center" role="alert">
      <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">{alert.title}</span> {alert.message}
      </div>
    </div>
  )
}
