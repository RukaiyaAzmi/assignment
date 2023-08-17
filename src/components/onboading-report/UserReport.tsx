import React, { useEffect, useState } from 'react'
import Joi from 'joi'
import { Button, Modal, Spinner } from 'flowbite-react'
import { useAPIWithToken } from '@hooks/useAPI'
import { postAdminReportDetails } from '@config/urls.config'
import { AiOutlineRollback } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { IAdminReport, IEkyc, ISearchRes } from '@interfaces/admin-report.interface'
import InlineButton from '@components/common/InlineButton'
import CustomPagination from '@components/common/CustomPagination'
import { FaBinoculars, FaUserCircle } from 'react-icons/fa'
import TextRow from '@components/common/TextRow'
import Row from '@components/common/Row'
import DateRow from '@components/common/DateRow'
import SelectBox from '@components/common/SelectBox'
import TextInput from '@components/common/TextInput'
import { useFormValidationAsync } from '@hooks/useFormValidation'

import TextRowFull from '@components/common/TextRowFull'
import UserReportView from './UserReportView'

const schema: Joi.Schema = Joi.object({
  val: Joi.string().min(1).required(),
})
export default function AdminReport() {
  const router = useRouter()
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [pagination, setPagination] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showReport, setShowReport] = useState<IEkyc[]>([])
  const [userReport, setShowReportDetails] = useState<IEkyc>()
  const [value, setValue] = useState({
    val: '',
  })
  const [option, setOption] = useState('')
  const { execute: executProfileSearch } = useAPIWithToken<ISearchRes>()
  const { isLoading: isUserLoading, execute: executeAdminReport } = useAPIWithToken<IAdminReport>()
  const { execute: executeAdminReportDetails } = useAPIWithToken<IAdminReport>()
  const { ok } = useFormValidationAsync(schema, value, {
    abortEarly: true,
  })
  useEffect(() => {
    fetchUserList()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const fetchUserList = async () => {
    try {
      setPagination(true)
      const res = await executeAdminReport({
        method: 'POST',
        url: `${postAdminReportDetails}/${currentPage}`,
      })
      console.log(res)

      if (res?.statusCode === 200) {
        setShowReport(res?.data.ekyc)
        setTotalPage(res ? res.data.totalPages : 1)
      }
      console.log(totalPage)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }
  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }
  const handleShowDetailsModal = async (id: string) => {
    try {
      const resModalDetails = await executeAdminReportDetails({
        method: 'POST',
        url: `${postAdminReportDetails}/${currentPage}`,
        data: { id: id },
      })
      setShowReportDetails(resModalDetails ? resModalDetails.data[0] : {})
      setShowDetailsModal(true)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue({ val: e.target.value })
    setOption('')
  }
  const onSelectChange = (event: { target: { value: string; name: string } }) => {
    if (ok) {
      setOption(event.target.value)
      if (event.target.value === 'ekycId') {
        search(event.target.value)
      } else if (event.target.value === 'nid') {
        search(event.target.value)
      } else if (event.target.value === 'mobile') {
        search(event.target.value)
      } else if (event.target.value === 'no') {
        fetchUserList()
        setValue({ val: '' })
      }
    } else {
      toast.error('Please enter eKYC ID,NID or Mobile No')
    }
  }

  /************************  Search  ******************************** */
  const search = (select: string) => {
    setPagination(false)
    switch (select) {
      case 'ekycId':
        searchKYC('id', 'eKYC ID')
        break
      case 'nid':
        searchKYC('nid', 'NID')
        break
      case 'mobile':
        searchKYC('mobile', 'Mobile No')
        break
      default:
    }
  }
  const searchKYC = async (payload: string, massage: string) => {
    const res = await executProfileSearch({
      method: 'POST',
      url: `${postAdminReportDetails}/${currentPage}`,
      data: {
        [payload]: value.val,
      },
    })
    if (res?.statusCode === 200) {
      setShowReport(res?.data)
    } else {
      toast.error(`Please provide valid ${massage}`)
    }
  }

  const profileShow = (id: string) => {
    router.push({
      pathname: `/admin/full-profile/`,
      query: {
        id: id,
      },
    })
  }
  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto w-full">
        <div className="flex justify-end">
          <div className="flex flex-wrap justify-end items-center w-full">
            <div className="sm:text-xs px-3 w-80">
              <TextInput
                id="admin"
                placeholder="Search eKYC ID, NID or Mobile No"
                name="admin"
                type="text"
                onChange={handleChange}
                value={value.val}
                iconUrl="/icon/icon_search.svg"
              />
            </div>
            <div className="sm:text-xs px-3 w-80">
              <SelectBox
                id="dropdown"
                onSelect={onSelectChange}
                value={option}
                name="dropdown"
                selectText="eKYC ID,NID or Mobile No"
                options={[
                  { key: 'ekycId', value: 'eKYC ID' },
                  { key: 'nid', value: 'NID' },
                  { key: 'mobile', value: 'Mobile Number' },
                  { key: 'no', value: 'None' },
                ]}
              />
            </div>
          </div>
        </div>
        {showReport.length > 0 ? (
          <div className="flex flex-col w-full rounded-lg py-8 gap-y-3 ">
            {showReport &&
              showReport.map((adminReport) => (
                <div
                  key={adminReport.id}
                  className="overflow-hidden bg-white rounded-lg shadow-lg border-t-4 border-indigo-500 h-full p-4 text-gray-900 max-w-full sm:p-8 "
                >
                  <div>
                    <div className="items-center text-xl mt-1 ml-2 font-semibold">{adminReport.name}</div>
                    <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
                    <Row>
                      <>
                        <TextRowFull label="ID " value={adminReport.id} />
                      </>
                    </Row>
                    <Row>
                      <>
                        <TextRow label="NID No" value={adminReport.nid} />
                        <TextRow label="Account No" value={adminReport.account.channelAccountId} />
                      </>
                    </Row>
                    <Row>
                      <>
                        <TextRow label="Mobile No" value={adminReport.mobile} />
                        <TextRow label="Verification Type" value={adminReport.verificationType} />
                      </>
                    </Row>
                    <Row>
                      <>
                        <TextRow label="Onboading Type" value={adminReport.onboardingType} />
                        <DateRow label="Create Date" value={adminReport.createDate} />
                      </>
                    </Row>

                    <div className="flex gap-2 mt-3 justify-center items-center">
                      <InlineButton
                        icon={<FaUserCircle />}
                        value="Profile"
                        onClick={() => profileShow(adminReport.id)}
                        color="bg-blue-400 hover:bg-blue-500"
                      />

                      <InlineButton
                        icon={<FaBinoculars />}
                        value="Details"
                        onClick={() => handleShowDetailsModal(adminReport.id)}
                        color="bg-green-400 hover:bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="my-4 py-16 flex flex-col justify-center items-center border-2 border-gray-300 rounded-md space-y-4">
            <h3 className="text-3xl text-center capitalize text-gray-400">
              {isUserLoading ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
            {isUserLoading ? (
              ''
            ) : (
              <>
                <InlineButton
                  icon={<AiOutlineRollback />}
                  onClick={fetchUserList}
                  value="Go Back"
                  color="bg-indigo-500 hover:bg-indigo-600"
                />
              </>
            )}
          </div>
        )}
        {pagination &&
          (totalPage > 1 ? (
            <CustomPagination page={currentPage} totalPage={totalPage} onPagination={handlePageChange} />
          ) : (
            ''
          ))}

        {/* <!--- Details Modal Show ---> */}
        <Modal
          show={showDetailsModal}
          size="7xl"
          onClose={handleDetailsClose}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header className="bg-slate-100"></Modal.Header>
          <Modal.Body className=" bg-slate-100">{userReport && <UserReportView userReport={userReport} />}</Modal.Body>
          <Modal.Footer className="flex justify-end bg-slate-100">
            <Button color="gray" onClick={handleDetailsClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}
