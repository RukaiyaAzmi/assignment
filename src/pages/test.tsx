import React, { useEffect, useState } from 'react'

import { useAPIWithToken } from '@hooks/useAPI'
import { postEkycCount } from '@config/urls.config'
import { IEkycCountRes } from '@interfaces/statistics.interface'
import DoughnutChart from '@components/chart/DoughnutChart'
import { toast } from 'react-toastify'

export default function test() {
  const [onboardingType, setOnboardingType] = useState<number[]>([])
  const [verificationType, setVerificationType] = useState<number[]>([])

  const { execute } = useAPIWithToken<IEkycCountRes>()

  useEffect(() => {
    getEkycCount()
  }, [])

  const getEkycCount = async () => {
    try {
      const resSelf = await execute({
        method: 'POST',
        url: postEkycCount,
        data: {
          startDate: '2000-11-25T12:53:08.795Z',
          endDate: new Date().toISOString(),
          onboardingType: 'SELF',
        },
      })

      const resAssisted = await execute({
        method: 'POST',
        url: postEkycCount,
        data: {
          startDate: '2000-11-25T12:53:08.795Z',
          endDate: new Date().toISOString(),
          onboardingType: 'ASSISTED',
        },
      })

      setOnboardingType([...onboardingType, resSelf?.data.count ?? 0, resAssisted?.data.count ?? 0])

      const resFace = await execute({
        method: 'POST',
        url: postEkycCount,
        data: {
          startDate: '2000-11-25T12:53:08.795Z',
          endDate: new Date().toISOString(),
          verificationType: 'FACE',
        },
      })

      const resFinger = await execute({
        method: 'POST',
        url: postEkycCount,
        data: {
          startDate: '2000-11-25T12:53:08.795Z',
          endDate: new Date().toISOString(),
          verificationType: 'FINGER',
        },
      })

      setVerificationType([...verificationType, resFace?.data.count ?? 0, resFinger?.data.count ?? 0])
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  return (
    <div className="flex justify-center items-center mt-10 gap-4 mx-8">
      <div className="w-1/2 flex flex-col justify-center items-center shadow-md rounded-md text-center">
        <div className="p-2 shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">
          <h4 className="text-white font-semibold text-center">
            eKYC Verification compare betweeen running Face and Finger
          </h4>
        </div>
        <div className=" w-44 h-44 my-8">
          <DoughnutChart data={onboardingType} labels={['Self', 'Assisted']} backgroundColor={['#c084fc', '#f9a8d4']} />
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center shadow-md rounded-md text-center">
        <div className="p-2 shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">
          <h4 className="text-white font-semibold text-center">
            eKYC Verification compare betweeen running Face and Finger
          </h4>
        </div>
        <div className=" w-44 h-44 my-8">
          <DoughnutChart data={verificationType} labels={['Face', 'Finger']} backgroundColor={['#c084fc', '#f9a8d4']} />
        </div>
      </div>
    </div>
  )
}
