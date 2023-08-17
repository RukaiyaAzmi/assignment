import Button from '@components/common/Button'
import { resetOnboardingState } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import getJsonObjectToArray from '@utils/ekyc-sanitize.utils'
import { toSnakeCase } from 'keys-transform'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

export default function AccountReport() {
  const router = useRouter()
  const dispatch = useDispatch()
  const channel = useSelector((state: RootState) => state.ekycUtil)
  //eslint-disable-next-line
  const channelResult: Record<string, any>[] = useMemo(() => getJsonObjectToArray(channel), [channel])
  useEffect(() => {
    dispatch(resetOnboardingState())
  }, [])
  const handleClick = () => {
    router.replace('/admin/dashboard')
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="bg-gray-200 flex flex-col justify-center items-center w-2/3 gap-4 p-4 rounded-tl-md rounded-tr-md">
        <p className="mt-4">
          <BsFillCheckCircleFill className="text-5xl text-indigo-500" />
        </p>
        <h4 className="text-2xl font-semibold">Process Completed</h4>
        <p className="text-center text-sm text-gray-500 font-semibold">
          Thank you for your submission.You will get an email for further instrutions.
        </p>
      </div>
      <div className="bg-white w-2/3 p-6">
        {channelResult.map((c, index) => {
          return (
            <div key={index} className="flex flex-col justify-center items-center mb-2 lg:flex-row">
              <div className="lg:w-1/2 flex justify-end gap-4 text-sm text-gray-500 font-semibold">
                {toSnakeCase(c[0]).toUpperCase()}
                <span> : </span>
              </div>
              <div className="lg:w-1/2 text-sm font-semibold ml-1">{c[1]}</div>
            </div>
          )
        })}
      </div>
      <div className="bg-white w-2/3 flex justify-center items-center shadow-sm mb-4">
        <div className="w-1/2 mb-2">
          <Button label="Back to Dashboard" id="button" onClick={handleClick} />
        </div>
      </div>
    </div>
  )
}
