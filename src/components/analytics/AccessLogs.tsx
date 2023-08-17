import React, { useEffect, useState } from 'react'
import { Spinner, Table } from 'flowbite-react'
import { useAPIWithToken } from '@hooks/useAPI'
import { getAccessLog } from '@config/urls.config'
import { getViewDateAndTime } from '@utils/date.utils'
import { AiOutlineRollback } from 'react-icons/ai'
import { toast } from 'react-toastify'
import InlineButton from '@components/common/InlineButton'
import { IAccessLog, IAccessLogRes } from '@interfaces/access-log.interface'
import CustomPagination from '@components/common/CustomPagination'

export default function AccessLogs(): JSX.Element {
  const [access, setAccess] = useState<IAccessLog[]>([])
  const [pagination, setPagination] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { isLoading: isUserLoading, execute: executeAccessLog } = useAPIWithToken<IAccessLogRes>()

  useEffect(() => {
    fetchAccessLog()
  }, [currentPage])

  const fetchAccessLog = async () => {
    try {
      setPagination(true)
      const res = await executeAccessLog({
        method: 'GET',
        url: `${getAccessLog}/${currentPage}`,
      })
      setAccess(res ? res.data.data : [])
      setTotalPage(res ? res.data.totalPages : 1)
    } catch (error) {
      toast.error('Unknown error')
    }
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        {access.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>User Id </Table.HeadCell>
                <Table.HeadCell>Login Date & Time</Table.HeadCell>
                <Table.HeadCell>Logout Date & Time</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {access &&
                  access.map((accessLog) => (
                    <Table.Row className="bg-white border" key={accessLog.id}>
                      <Table.Cell>{accessLog.id}</Table.Cell>
                      <Table.Cell>{accessLog.userIdRef}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {getViewDateAndTime(accessLog.loginDateTime)}
                      </Table.Cell>
                      <Table.Cell>{getViewDateAndTime(accessLog.logoutDateTime)}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
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
                  onClick={fetchAccessLog}
                  value="Go Back"
                  color="bg-indigo-500 hover:bg-indigo-600"
                />
              </>
            )}
          </div>
        )}
        {pagination &&
          (totalPage > 1 ? (
            <div className=" p-3 sm:w-2/4 m-auto ">
              <CustomPagination page={currentPage} totalPage={totalPage} onPagination={handlePageChange} />
            </div>
          ) : (
            ''
          ))}
      </div>
    </>
  )
}
