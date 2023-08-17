import { useDispatch, useSelector } from 'react-redux'
import CustomerPhoto from './CustomerPhoto'
import React, { useEffect, useRef, useState } from 'react'
import { RootState } from '@redux/store'
import { decrement, increment } from '@redux/slices/ekyc.slice'
import { Spinner } from 'flowbite-react'

export default function PhotoRouter() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const ekyc = useSelector((state: RootState) => state.ekyc)
  const isFirst = useRef(1)
  useEffect(() => {
    setIsLoading(false)
    if (isFirst.current === 1) {
      if (ekyc.applicant.verificationType === 'FACE' && ekyc.stepType === 'I') {
        dispatch(increment())
      } else if (ekyc.applicant.verificationType === 'FACE' && ekyc.stepType === 'D') {
        dispatch(decrement())
      }
    }
    isFirst.current++
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="purple" aria-label="Loading" size="xl" />
        </div>
      ) : (
        <CustomerPhoto />
      )}
    </>
  )
}
