import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import { getAgentPointList } from '@config/urls.config'
import { IAgentPointListRes } from '@interfaces/integration.interface'
import { updateCurrentBranchOrAgentPoint } from '@redux/slices/user.slice'
import { RootState } from '@redux/store'
import { fetchWithToken } from '@utils/fetch.utils'
import React, { useEffect, useState } from 'react'
import { CiBank } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'

export default function AgentPointSelect() {
  const [shouldFetch, setShouldFetch] = useState<string | null>(null)
  const [options, setOptions] = useState<IOptionsData[]>([])
  const agentPointCode = useSelector((state: RootState) => state.user.branchOrAgentPointCode)
  const agentPointName = useSelector((state: RootState) => state.user.branchOrAgentPointName)
  const currentAgentPointCode = useSelector((state: RootState) => state.user.currentBranchOrAgentPointCode)
  const dispatch = useDispatch()

  const { data: agentPointListRes } = useSWR<IAgentPointListRes>(
    [shouldFetch, localStorage.getItem('accessToken')],
    ([url, token]) => fetchWithToken(url, token as string),
  )

  useEffect(() => {
    const func = async () => {
      const optionArr: IOptionsData[] = []
      agentPointCode.forEach((code, index) => optionArr.push({ key: code, value: agentPointName[index] }))
      // select the 1st point as default
      if (optionArr.length > 0 && currentAgentPointCode === '')
        dispatch(updateCurrentBranchOrAgentPoint(optionArr[0].key))
      setOptions(optionArr)
    }
    if (agentPointCode.length === 0) setShouldFetch(getAgentPointList)
    else func()
  }, [])

  useEffect(() => {
    if (agentPointListRes && agentPointCode.length === 0) {
      const optionArr: IOptionsData[] = []
      agentPointListRes?.data.points.forEach((point) =>
        optionArr.push({ key: point.pointId.toString(), value: point.pointName }),
      )
      if (optionArr.length > 0 && currentAgentPointCode === '')
        dispatch(updateCurrentBranchOrAgentPoint(optionArr[0].key))
      setOptions(optionArr)
    }
  }, [agentPointListRes])

  const onAgentPointSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateCurrentBranchOrAgentPoint(e.target.value))
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-4 mt-4 rounded-md border-b">
      <div className="flex gap-3">
        <span>
          <CiBank className="text-indigo-400 text-4xl" />
        </span>
        <div className=" text-sm capitalize">
          <p className=" font-semibold">Select Agent Point</p>
          <p className="text-xs">Account will be opened in selected agent point</p>
        </div>
      </div>
      <div className="flex-1">
        <SelectBox
          id="agentPointCode"
          name="agentPointCode"
          options={options}
          selectText="Please select the agent point"
          onSelect={onAgentPointSelect}
          value={currentAgentPointCode}
        />
      </div>
    </div>
  )
}
