import React, { useEffect, useRef, useState } from 'react'
import AdditionalFile from './AdditionalFile'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { decrement, increment } from '@redux/slices/ekyc.slice'
import { Spinner } from 'flowbite-react'

export default function Router() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  const ekycType = useSelector((state: RootState) => state.ekyc.ekycType)
  const stepType = useSelector((state: RootState) => state.ekyc.stepType)
  const isFirst = useRef(1)

  useEffect(() => {
    setIsLoading(false)
    if (isFirst.current === 1) {
      if (ekycType === 'S' && stepType === 'I') {
        dispatch(increment())
      } else if (ekycType === 'S' && stepType === 'D') {
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
        <AdditionalFile />
      )}
    </>
  )
}
