import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaBinoculars } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { postNidVerificationList, postVerificationDepository } from '@config/urls.config'
import { toast } from 'react-toastify'
import InlineButton from '@components/common/InlineButton'
import CustomPagination from '@components/common/CustomPagination'
import { IAddress, IDepository, INidRes, INidVerificaion, IVerificationDepositoryRes } from '@interfaces/nid.interface'
import DepositoryView from './DepositoryView'
import { getViewDateAndTime } from '@utils/date.utils'

export default function List(): JSX.Element {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [depository, setDepository] = useState<IDepository>()
  const [permanentAddress, setPermanentAddress] = useState<IAddress>()
  const [presentAddress, setPresentAddress] = useState<IAddress>()
  const [nid, setNid] = useState<INidVerificaion[]>([])

  const [pagination, setPagination] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { isLoading: isNidListLoading, execute: executeNidList } = useAPIWithToken<INidRes>()
  const { isLoading: isDepositoryLoading, execute: executeDepository } = useAPIWithToken<IVerificationDepositoryRes>()

  useEffect(() => {
    fetchNidVerifyList()
  }, [currentPage])

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleShowDetailsModal = async (nid: string) => {
    try {
      const res = await executeDepository({
        method: 'POST',
        url: postVerificationDepository,
        data: { nid: nid },
      })
      if (res?.data) {
        setShowDetailsModal(true)
        setDepository(res.data)
        setPermanentAddress(res.data.permanentAddress)
        setPresentAddress(res.data.presentAddress)
      } else {
        toast.error('No Data Found')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const fetchNidVerifyList = async () => {
    try {
      setPagination(true)
      const res = await executeNidList({
        method: 'POST',
        url: `${postNidVerificationList}/${currentPage}`,
      })
      setNid(res?.data.nidVerificaion ? res.data.nidVerificaion : [])
      setTotalPage(res ? res.data.totalPages : 1)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">NID Verification List</h1>

        {nid.length > 0 ? (
          <div className="py-4 mt-5">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>NID No</Table.HeadCell>
                <Table.HeadCell>CREATED BY</Table.HeadCell>
                <Table.HeadCell>Create Date</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {nid &&
                  nid.map((nid) => (
                    <Table.Row className="bg-white border" key={nid.id}>
                      <Table.Cell>{nid.id}</Table.Cell>
                      <Table.Cell>{nid.nid}</Table.Cell>
                      <Table.Cell>{nid.createdBy}</Table.Cell>
                      <Table.Cell>{getViewDateAndTime(nid.createDate)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          <InlineButton
                            disabled={isDepositoryLoading}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetailsModal(nid.nid)}
                            color="bg-green-400 hover:bg-green-500"
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="my-4 py-16 flex flex-col justify-center items-center border-2 border-gray-300 rounded-md space-y-4">
            <h3 className="text-3xl text-center capitalize text-gray-400">
              {isNidListLoading ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
          </div>
        )}
        {pagination &&
          (totalPage > 1 ? (
            <div className=" p-3 sm:w-2/4 m-auto mb-10">
              <CustomPagination page={currentPage} totalPage={totalPage} onPagination={handlePageChange} />
            </div>
          ) : (
            ''
          ))}

        {/* <!--- Details Modal Show ---> */}
        <Modal
          show={showDetailsModal}
          size="6xl"
          onClose={handleDetailsClose}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header className="bg-slate-100">
            <p className="ml-3 my-2">Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">
            {depository && permanentAddress && presentAddress ? (
              <DepositoryView
                depository={depository}
                permanentAddress={permanentAddress}
                presentAddress={presentAddress}
              />
            ) : (
              'No Data Found'
            )}
          </Modal.Body>
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
