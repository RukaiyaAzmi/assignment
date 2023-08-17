import React, { useEffect, useState } from 'react'
import DateInput from '@components/common/DateInput'
import { useAPIWithToken } from '@hooks/useAPI'
import {
  IBarChart,
  IBarChartRes,
  IChart,
  IChartRes,
  ICount,
  ICountReport,
  IEkycCountRes,
  IEkycRes,
  ILineData,
  IReportCountRes,
} from '@interfaces/statistics.interface'
import { postChartValue, postEkycCount, getReportCount, postVerificationValue } from '@config/urls.config'
import { toast } from 'react-toastify'
import { getOnboardingDateFormat } from '@utils/date.utils'
import { FaSearch } from 'react-icons/fa'
import { Bar, Line } from 'react-chartjs-2'
import SelectBox from '@components/common/SelectBox'
import { Chart, registerables } from 'chart.js'
import DoughnutChart from '@components/chart/DoughnutChart'
import CountUp from 'react-countup'

Chart.register(...registerables)

interface StatisticsProps {
  label?: boolean
}

export default function Statistics({ label = true }: StatisticsProps): JSX.Element {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const startDateSuffix = 'T00:00:00.000Z'
  const endDateSuffix = 'T23:59:59.000Z'

  const [onboardingType, setOnboardingType] = useState<number[]>([])
  const [verificationType, setVerificationType] = useState<number[]>([])
  const [fromDate, setFromDate] = useState(Date)
  const [toDate, setToDate] = useState(Date)
  const [ekyc, setEkyc] = useState<ICount>()
  const [countData, setCountData] = useState<ICountReport>()
  const [lineData, setLineData] = useState<ILineData>()
  const [lineDataByYear, setLineDataByYear] = useState<ILineData>()
  const [barDataByYear, setBarDataByYear] = useState<ILineData>()
  const [year, setYear] = useState(String(currentYear))
  const [month, setMonth] = useState<number>(currentMonth + 1)
  const [yearForVer, setYearForVer] = useState<number>(currentYear)

  const { execute: executeEkycCount } = useAPIWithToken<IEkycRes>()
  const { execute: executeCount } = useAPIWithToken<IReportCountRes>()
  const { execute: executeChart } = useAPIWithToken<IChartRes>()
  const { execute: executeBarChart } = useAPIWithToken<IBarChartRes>()
  const { execute } = useAPIWithToken<IEkycCountRes>()

  const startDate = new Date(fromDate)
  const endDate = new Date(toDate)

  useEffect(() => {
    count()
    ekycYearChart(year)
    barChart(Number(currentYear), month)
  }, [])

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

  const handleFromDateChange = (selectedDate: Date) => {
    setFromDate(getOnboardingDateFormat(selectedDate) + startDateSuffix)
  }

  const handleToDateChange = (selectedDate: Date) => {
    setToDate(getOnboardingDateFormat(selectedDate) + endDateSuffix)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setYear(value)
    ekycYearChart(value)
  }

  const onInputChangeBarMonth = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setMonth(Number(value))
    barChart(yearForVer, Number(value))
  }

  const onInputChangeBarYear = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setYearForVer(Number(value))
    barChart(Number(value), month)
  }

  const ekycCount = async () => {
    try {
      const res = await executeEkycCount({
        method: 'POST',
        url: postEkycCount,
        data: {
          startDate: getOnboardingDateFormat(startDate) + startDateSuffix,
          endDate: getOnboardingDateFormat(endDate) + endDateSuffix,
        },
      })
      setEkyc(res?.data)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const count = async () => {
    try {
      const res = await executeCount({
        method: 'GET',
        url: getReportCount,
      })
      setCountData(res?.data)

      const chart = await executeChart({
        method: 'POST',
        url: postChartValue,
        data: {
          year: year,
        },
      })

      const newArray: IChart[] = []
      if (chart?.data.length) {
        for (let i = 0; i < chart?.data.length; i++) {
          newArray.push(chart?.data[i])
        }
      }

      const emptyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for (let i = 0; i < newArray.length; i++) {
        emptyData[newArray ? newArray[i].month - 1 : ''] = parseInt(newArray ? newArray[i].count : '')
      }

      const modData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Total E-KYC',
            data: emptyData,
            backgroundColor: 'hsl(252, 82.9%, 67.8%)',
            borderColor: 'hsl(252, 82.9%, 67.8%)',
            pointBackgroundColor: 'purple',
            pointBorderColor: 'purple',
          },
        ],
      }
      setLineData(modData)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const ekycYearChart = async (year: string) => {
    try {
      const chart = await executeChart({
        method: 'POST',
        url: postChartValue,
        data: { year: year },
      })

      const newArray: IChart[] = []
      if (chart?.data.length) {
        for (let i = 0; i < chart?.data.length; i++) {
          newArray.push(chart?.data[i])
        }
      }

      const emptyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for (let i = 0; i < newArray.length; i++) {
        emptyData[newArray ? newArray[i].month - 1 : ''] = parseInt(newArray ? newArray[i].count : '')
      }

      const modData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Total E-KYC',
            data: emptyData,
            backgroundColor: 'hsl(252, 82.9%, 67.8%)',
            borderColor: 'hsl(252, 82.9%, 67.8%)',
            pointBackgroundColor: 'purple',
            pointBorderColor: 'purple',
          },
        ],
      }
      setLineDataByYear(modData)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const barChart = async (year: number, month: number) => {
    try {
      const chart = await executeBarChart({
        method: 'POST',
        url: postVerificationValue,
        data: { month: month, year: year },
      })

      const newArray: IBarChart[] = []
      if (chart?.data.length) {
        for (let i = 0; i < chart?.data.length; i++) {
          newArray.push(chart?.data[i])
        }
      }

      const emptyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for (let i = 0; i < newArray.length; i++) {
        emptyData[newArray ? newArray[i].day : ''] = parseInt(newArray ? newArray[i].count : '')
      }

      const modData = {
        labels: [
          'Day-1',
          'Day-2',
          'Day-3',
          'Day-4',
          'Day-5',
          'Day-6',
          'Day-7',
          'Day-8',
          'Day-9',
          'Day-10',
          'Day-11',
          'Day-12',
          'Day-13',
          'Day-14',
          'Day-15',
          'Day-16',
          'Day-17',
          'Day-18',
          'Day-19',
          'Day-20',
          'Day-21',
          'Day-22',
          'Day-23',
          'Day-24',
          'Day-25',
          'Day-26',
          'Day-27',
          'Day-28',
          'Day-29',
          'Day-30',
          'Day-31',
        ],
        datasets: [
          {
            label: 'Total Verification',
            data: emptyData,
            backgroundColor: 'hsl(252, 82.9%, 67.8%)',
            borderColor: 'hsl(252, 82.9%, 67.8%)',
            pointBackgroundColor: 'purple',
            pointBorderColor: 'purple',
          },
        ],
      }
      setBarDataByYear(modData)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className={`container m-auto overflow-x-auto ${label ? 'mt-8' : ''}`}>
        {label && <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Statistics for E-KYC</h1>}
        <div className="flex flex-col w-full rounded-lg py-8 gap-y-3 ">
          <div
            className={`overflow-hidden bg-white rounded-lg shadow-lg h-full p-4 text-gray-900 max-w-full sm:p-8 ${
              label ? 'border-t-4 border-indigo-500' : ''
            } `}
          >
            <h6 className="text-lg dark:text-white bg-indigo-100 py-2 my-5 text-center">Search E-KYC</h6>

            <div>
              <div className="flex flex-col gap-4 lg:flex-row lg:w-full ">
                <DateInput isShow={true} label="From Date" onDateChange={handleFromDateChange} dob={fromDate} />
                <DateInput isShow={true} label="To Date" onDateChange={handleToDateChange} dob={toDate} />

                <button
                  type="submit"
                  className="flex justify-center item-center gap-1 lg:w-1/12 py-3 mb-5 mt-8  px-4 bg-indigo-400 rounded-lg hover:bg-indigo-500 text-white font-semibold"
                  onClick={() => ekycCount()}
                  value="Find"
                >
                  <span className="mt-1">
                    <FaSearch />
                  </span>
                  <span>Find</span>
                </button>

                <div className="flex flex-col lg:w-2/3 mb-5 py-5 rounded-lg bg-indigo-200 items-center justify-center">
                  <div className=" lg:text-2xl font-semibold">
                    E-KYC: <CountUp start={0} end={ekyc ? ekyc.count : 0} />
                  </div>
                </div>
              </div>

              <div className="mt-0 border-b-2 border-indigo-700 pt-3"></div>

              <div className="flex flex-col justify-center items-center gap-4 lg:w-full lg:flex-row pt-7">
                <div className="flex flex-col w-2/3 h-40 rounded-lg gap-y-3 pt-5 bg-indigo-200 items-center justify-center">
                  <div className="flex flex-col w-2/3 h-20 rounded-lg gap-y-3 bg-white items-center justify-center">
                    <div className=" lg:text-2xl">
                      <CountUp start={0} end={countData?.accountCount ?? 0} />
                    </div>
                  </div>
                  <div className=" lg:text-xl pb-5 font-semibold">Total Account</div>
                </div>

                <div className="flex flex-col w-2/3 h-40 rounded-lg gap-y-3 pt-5 bg-indigo-200 items-center justify-center">
                  <div className="flex flex-col w-2/3 h-20 rounded-lg gap-y-3 bg-white items-center justify-center">
                    <div className=" lg:text-2xl">
                      <CountUp start={0} end={countData?.userCount ?? 0} />
                    </div>
                  </div>
                  <div className=" lg:text-xl pb-5 font-semibold">Total User</div>
                </div>

                <div className="flex flex-col w-2/3 h-40 rounded-lg gap-y-3 pt-5 bg-indigo-200 items-center justify-center">
                  <div className="flex flex-col w-2/3 h-20 rounded-lg gap-y-3 bg-white items-center justify-center">
                    <div className=" lg:text-2xl">
                      <CountUp start={0} end={countData?.roleCount ?? 0} />
                    </div>
                  </div>
                  <div className=" lg:text-xl pb-5 font-semibold">Total Role</div>
                </div>

                <div className="flex flex-col w-2/3 h-40 rounded-lg gap-y-3 pt-5 bg-indigo-200 items-center justify-center">
                  <div className="flex flex-col w-2/3 h-20 rounded-lg gap-y-3 bg-white items-center justify-center">
                    <div className=" lg:text-2xl">
                      <CountUp start={0} end={countData?.ekycCount ?? 0} />
                    </div>
                  </div>
                  <div className=" lg:text-xl pb-5 font-semibold">Total E-KYC</div>
                </div>

                <div className="flex flex-col w-2/3 h-40 rounded-lg gap-y-3 pt-5 bg-indigo-200 items-center justify-center">
                  <div className="flex flex-col w-2/3 h-20 rounded-lg gap-y-3 bg-white items-center justify-center">
                    <div className=" lg:text-2xl">
                      <CountUp start={0} end={countData?.verificationCount ?? 0} />
                    </div>
                  </div>
                  <div className=" lg:text-xl pb-5 font-semibold">Total Verification</div>
                </div>
              </div>
              <div className="mt-2 border-b-2 lg:m-auto border-indigo-700 pt-7"></div>
              <div className="flex flex-col gap-4 lg:flex-row w-full pt-5">
                <div className="lg:w-1/2">
                  <h6 className="text-lg dark:text-white bg-indigo-100 my-2 py-3 text-center">E-KYC in {year}</h6>
                  <hr />
                  {lineData && <Line data={lineData} />}
                  <hr />
                </div>

                <div className="lg:w-1/2 ">
                  <SelectBox
                    id="year"
                    name="year"
                    onSelect={onInputChange}
                    value={year}
                    options={[
                      { key: '2019', value: '2019' },
                      { key: '2020', value: '2020' },
                      { key: '2021', value: '2021' },
                      { key: '2022', value: '2022' },
                      { key: '2023', value: '2023' },
                      { key: '2024', value: '2024' },
                      { key: '2025', value: '2025' },
                    ]}
                  />
                  <hr />
                  {lineDataByYear && <Line data={lineDataByYear} />}
                  <hr />
                </div>
              </div>
            </div>
            <div className="mt-2 border-b-2 m-auto border-indigo-700 pt-5"></div>
            <div className="w-full">
              <h6 className="text-lg dark:text-white bg-indigo-100 py-2 mt-7 text-center">Total Verification</h6>
              <SelectBox
                id="month"
                name="month"
                onSelect={onInputChangeBarMonth}
                value={String(month)}
                options={[
                  { key: '1', value: 'January' },
                  { key: '2', value: 'February' },
                  { key: '3', value: 'March' },
                  { key: '4', value: 'April' },
                  { key: '5', value: 'May' },
                  { key: '6', value: 'June' },
                  { key: '7', value: 'July' },
                  { key: '8', value: 'August' },
                  { key: '9', value: 'September' },
                  { key: '10', value: 'October' },
                  { key: '11', value: 'November' },
                  { key: '12', value: 'December' },
                ]}
              />
              <SelectBox
                id="barYear"
                name="year"
                onSelect={onInputChangeBarYear}
                value={String(yearForVer)}
                options={[
                  { key: '2019', value: '2019' },
                  { key: '2020', value: '2020' },
                  { key: '2021', value: '2021' },
                  { key: '2022', value: '2022' },
                  { key: '2023', value: '2023' },
                  { key: '2024', value: '2024' },
                  { key: '2025', value: '2025' },
                ]}
              />
              <hr />
              {barDataByYear && <Bar data={barDataByYear} />}
              <hr />
            </div>

            <div className="flex flex-col justify-center items-center mt-10 gap-4 mx-8 mb-8 lg:flex-row">
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center shadow-md rounded-md text-center p-4">
                <div className="w-full">
                  <h6 className="text-lg dark:text-white bg-indigo-100 py-2 mt-4 text-center">Onboarding Ratio</h6>
                </div>
                <div className=" w-56 h-56 my-8">
                  <DoughnutChart
                    data={onboardingType}
                    labels={['Self', 'Assisted']}
                    backgroundColor={['#c084fc', '#f9a8d4']}
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center shadow-md rounded-md text-center p-4">
                <div className="w-full">
                  <h6 className="text-lg dark:text-white bg-indigo-100 py-2 mt-4 text-center">Verification Ratio</h6>
                </div>
                <div className=" w-56 h-56 my-8">
                  <DoughnutChart
                    data={verificationType}
                    labels={['Face', 'Fingerprint']}
                    backgroundColor={['#c084fc', '#f9a8d4']}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
