import { postInitSetting, postSetting, putSetting } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { ISetting, ISettingData, ISettingRes, IUpdateSettingRes } from '@interfaces/setting.interface'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Setting from './Setting'
import { AiOutlineDatabase, AiOutlineMobile } from 'react-icons/ai'
import { TbReportSearch } from 'react-icons/tb'
import { Label, RangeSlider } from 'flowbite-react'
import { BiTimeFive } from 'react-icons/bi'
import Button from '@components/common/Button'

export default function AppSetting() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [settings, setSettings] = useState<ISetting>({
    EKYC_SANCTION_SCREENING: false,
    EKYC_DEPOSITORY_USE: true,
    EKYC_MOBILE_VERIFICATION: true,
    USER_IDLE_TIMEOUT: '',
  })

  const { execute: executeSetting } = useAPIWithToken<ISettingRes>()
  const { execute: executeUpdateSetting } = useAPIWithToken<IUpdateSettingRes>()
  const { isLoading: isResetSettingLoading, execute: executeResetSetting } = useAPIWithToken<ISettingRes>()

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const fetchSettings = async () => {
    try {
      const res = await executeSetting({
        method: 'POST',
        url: postSetting,
      })

      const settingsData: ISetting = settingsCheck(res?.data ?? [])
      setSettings({ ...settings, ...settingsData })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleChange = async (name: string, check: boolean) => {
    setSettings({ ...settings, [name]: check })

    const dataObj = {
      key: name,
      value: check ? 'YES' : 'NO',
    }

    try {
      await executeUpdateSetting({
        method: 'PUT',
        url: putSetting,
        data: dataObj,
      })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.name
    const value: string = e.target.value
    setSettings({ ...settings, [name]: value })

    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const newTimeoutId = setTimeout(async () => {
      try {
        await executeUpdateSetting({
          method: 'PUT',
          url: putSetting,
          data: { key: name, value: value },
        })
      } catch (error) {
        console.log('error', error)
        toast.error('Unknown error')
      }
    }, 300)
    setTimeoutId(newTimeoutId)
  }

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      const res = await executeResetSetting({
        method: 'POST',
        url: postInitSetting,
      })

      const settingsData: ISetting = settingsCheck(res?.data ?? [])
      setSettings({ ...settings, ...settingsData })
      toast.success('Successfully Reset')
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <div className=" container mx-auto mt-10 overflow-x-auto animate__animated animate__fadeIn">
      <div className="flex flex-col items-center justify-center mb-4">
        <h2 className="flex justify-center text-2xl text-gray-900 font-bold ">Application Settings</h2>
      </div>
      <div className=" bg-white overflow-x-auto">
        <Setting
          icon={<TbReportSearch className=" text-indigo-400 text-4xl" />}
          value={settings.EKYC_SANCTION_SCREENING}
          name="EKYC_SANCTION_SCREENING"
          label="sanction screening"
          subLabel="aml verification through API"
          onChange={handleChange}
          disabled
        />
        <Setting
          icon={<AiOutlineMobile className=" text-indigo-400 text-4xl" />}
          value={settings.EKYC_MOBILE_VERIFICATION}
          name="EKYC_MOBILE_VERIFICATION"
          label="mobile verification"
          subLabel="OTP based mobile verification for 2FA"
          onChange={handleChange}
          disabled
        />
        <Setting
          icon={<AiOutlineDatabase className=" text-indigo-400 text-4xl" />}
          value={settings.EKYC_DEPOSITORY_USE}
          name="EKYC_DEPOSITORY_USE"
          label="depository"
          subLabel="reuse election commission verification cached data"
          onChange={handleChange}
          disabled
        />
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-md border-b">
          <div className="flex gap-3">
            <span>
              <BiTimeFive className="text-indigo-400 text-4xl" />
            </span>
            <div className=" text-sm capitalize">
              <p className=" font-semibold">idle timeout</p>
              <p className="text-xs">amount of time the system remain active during inactivity</p>
            </div>
          </div>
          <div className="mt-2 flex gap-3">
            <div className="mb-1 block">
              <Label htmlFor="default-range" value={settings.USER_IDLE_TIMEOUT} />
            </div>
            <RangeSlider
              id="timer_range"
              name="USER_IDLE_TIMEOUT"
              value={settings.USER_IDLE_TIMEOUT}
              min="0"
              max="60"
              onChange={handleRangeChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        <Button id="button" label="Reset as Default" onClick={handleReset} disable={isResetSettingLoading} />
      </div>
    </div>
  )
}

function settingsCheck(data: ISettingData[]) {
  const tempData = {} as ISetting
  data.length &&
    data.map((d) => {
      if (d.key === 'EKYC_SANCTION_SCREENING') {
        tempData[d.key] = d.value === 'YES' ? true : false
      } else if (d.key === 'EKYC_DEPOSITORY_USE') {
        tempData[d.key] = d.value === 'YES' ? true : false
      } else if (d.key === 'EKYC_MOBILE_VERIFICATION') {
        tempData[d.key] = d.value === 'YES' ? true : false
      } else if (d.key === 'USER_IDLE_TIMEOUT') {
        tempData[d.key] = d.value
      }
    })
  return tempData
}
