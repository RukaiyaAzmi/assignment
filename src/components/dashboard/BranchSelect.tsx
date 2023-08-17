import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import { getBranchList } from '@config/urls.config'
import { IBranchListRes } from '@interfaces/integration.interface'
import { updateCurrentBranchOrAgentPoint } from '@redux/slices/user.slice'
import { RootState } from '@redux/store'
import { fetchWithToken } from '@utils/fetch.utils'
import React, { useEffect, useState } from 'react'
import { CiBank } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'

export default function BranchSelect() {
  const [shouldFetch, setShouldFetch] = useState<string | null>(null)
  const [options, setOptions] = useState<IOptionsData[]>([])
  const branchCode = useSelector((state: RootState) => state.user.branchOrAgentPointCode)
  const branchName = useSelector((state: RootState) => state.user.branchOrAgentPointName)
  const currentBranchCode = useSelector((state: RootState) => state.user.currentBranchOrAgentPointCode)
  const dispatch = useDispatch()

  const { data: branchListRes } = useSWR<IBranchListRes>(
    [shouldFetch, localStorage.getItem('accessToken')],
    ([url, token]) => fetchWithToken(url, token as string),
  )

  useEffect(() => {
    const func = async () => {
      const optionArr: IOptionsData[] = []
      branchCode.forEach((code, index) => optionArr.push({ key: code, value: branchName[index] }))
      // select the 1st point as default
      if (optionArr.length > 0 && currentBranchCode === '') dispatch(updateCurrentBranchOrAgentPoint(optionArr[0].key))
      setOptions(optionArr)
    }
    if (branchCode.length === 0) setShouldFetch(getBranchList)
    else func()
  }, [])

  useEffect(() => {
    if (branchListRes && branchCode.length === 0) {
      const optionArr: IOptionsData[] = []
      branchListRes?.data.forEach((branch) =>
        optionArr.push({ key: branch.branchCode.toString(), value: branch.branchName }),
      )
      if (optionArr.length > 0 && currentBranchCode === '') dispatch(updateCurrentBranchOrAgentPoint(optionArr[0].key))
      setOptions(optionArr)
    }
  }, [branchListRes])

  const onBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateCurrentBranchOrAgentPoint(e.target.value))
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-4 mt-4 rounded-md border-b">
      <div className="flex gap-3">
        <span>
          <CiBank className="text-indigo-400 text-4xl" />
        </span>
        <div className=" text-sm capitalize">
          <p className=" font-semibold">Select Branch</p>
          <p className="text-xs">Account will be opened in selected branch</p>
        </div>
      </div>
      <div className="flex-1">
        <SelectBox
          id="branchCode"
          name="branchCode"
          options={options}
          selectText="Please select the Branch point"
          onSelect={onBranchSelect}
          value={currentBranchCode}
        />
      </div>
    </div>
  )
}
