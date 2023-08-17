import React, { useEffect } from 'react'
import DashboardLayout from '@components/layout/DashboardLayout'
import { useDispatch } from 'react-redux'
import { resetUpgradeState } from '@redux/slices/upgrade.slice'

export default function UpgradeSuccess(): JSX.Element {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetUpgradeState())
  }, [])

  return (
    <>
      <DashboardLayout>
        <div className="bg-gray-100 h-1/2 w-auto">
          <div className="bg-white py-20 w-2/3 md:mx-auto mt-16">
            <svg viewBox="0 0 24 24" className="text-green-500 w-16 h-16 mx-auto mb-6">
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-4xl text-base text-gray-900 font-semibold text-center">Successful!</h3>
              <p className="text-gray-600 my-2 md:text-2xl">Your Simplified Account Converted to Regular Account.</p>
              <p>You will get an email with further instructions</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
