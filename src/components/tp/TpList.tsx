import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaEdit, FaArchive, FaBinoculars, FaEyeSlash } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { deleteTpList, postTpList } from '@config/urls.config'
import TableTooltip from '@components/common/TableTooltip'
import { FcApproval } from 'react-icons/fc'
import { AiOutlineRollback } from 'react-icons/ai'
import { CiCircleAlert } from 'react-icons/ci'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import InlineButton from '@components/common/InlineButton'
import { ITransactionProfile, ITransactionProfileDeleteRes, ITransactionProfileRes } from '@interfaces/tp.interface'
import TpView from './TpView'
import { getFullCategoryName, getFullChanneltName } from '@utils/status.utils'

export default function TransactionList(): JSX.Element {
  const router = useRouter()
  const [tpModal, setTpModal] = useState<ITransactionProfile[]>([])
  const [tpShow, setTpShow] = useState<ITransactionProfile[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const features = useSelector((state: RootState) => state.user.features)
  const { isLoading: isTpShow, execute: executeTpList } = useAPIWithToken<ITransactionProfileRes>()
  const { isLoading: isDeleteLoading, execute: executeDeleteTp } = useAPIWithToken<ITransactionProfileDeleteRes>()

  useEffect(() => {
    fetchTpList()
  }, [])

  const handleDeleteModalCancel = () => {
    setShowDeleteModal({
      status: false,
      current: -1,
    })
  }

  const handleShowDeleteModal = (id: number) => {
    setShowDeleteModal({ status: true, current: id })
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  const handleShowDetailsModal = async (id: number) => {
    try {
      const res = await executeTpList({
        method: 'POST',
        url: postTpList,
        data: { id: id },
      })
      setTpModal(res ? res.data : [])
      setShowDetailsModal(true)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDelete = async (id: number) => {
    const newRoles = tpShow?.filter((r) => r.id !== id)
    try {
      const res = await executeDeleteTp({
        method: 'DELETE',
        url: deleteTpList,
        data: { id: id },
      })
      if (res) toast.success('Successfully Deleted')
      setTpShow(newRoles)
      setShowDeleteModal({ status: false, current: -1 })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleUpdateModal = (id: number) => {
    router.push({
      pathname: `/admin/settings/tp/update`,
      query: {
        id: id,
      },
    })
  }

  const fetchTpList = async () => {
    try {
      const res = await executeTpList({
        method: 'POST',
        url: postTpList,
      })
      setTpShow(res ? res.data : [])
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        {tpShow.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>Ekyc Type</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Category Code</Table.HeadCell>
                <Table.HeadCell>Channel Code</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {tpShow &&
                  tpShow.map((tp) => (
                    <Table.Row className="bg-white border" key={tp.id}>
                      <Table.Cell>{getFullEkycType(tp.ekycType)}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{getViewToolStatus(tp.status)}</Table.Cell>
                      <Table.Cell>{getFullCategoryName(tp.productCategoryCode)}</Table.Cell>
                      <Table.Cell>{getFullChanneltName(tp.channelCode)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          {isAuthorized(features, '4.2.3') && (
                            <InlineButton
                              icon={<FaEdit />}
                              value="Update"
                              onClick={() => handleUpdateModal(tp.id)}
                              color="bg-yellow-400 hover:bg-yellow-500"
                            />
                          )}

                          <InlineButton
                            disabled={isTpShow}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetailsModal(tp.id)}
                            color="bg-green-400 hover:bg-green-500"
                          />
                          {isAuthorized(features, '4.2.4') && (
                            <InlineButton
                              icon={<FaArchive />}
                              value="Delete"
                              onClick={() => handleShowDeleteModal(tp.id)}
                              color="bg-red-400 hover:bg-red-500"
                            />
                          )}
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
              {isTpShow ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
            {isTpShow ? (
              ''
            ) : (
              <InlineButton
                icon={<AiOutlineRollback />}
                onClick={fetchTpList}
                value="Go Back"
                color="bg-indigo-500 hover:bg-indigo-600"
              />
            )}
          </div>
        )}
        {/* <!--- Delete Modal Show ---> */}
        <Modal
          show={showDeleteModal.status}
          size="md"
          onClose={handleDeleteModalCancel}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <CiCircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this TP?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  disabled={isDeleteLoading}
                  gradientDuoTone="pinkToOrange"
                  outline
                  onClick={() => handleDelete(showDeleteModal.current)}
                >
                  {`Yes, I'm sure`}
                </Button>
                <Button color="gray" onClick={handleDeleteModalCancel}>
                  {`No, cancel`}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

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
            <p className="ml-3 my-2">TP Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">{tpModal.length && <TpView tp={tpModal[0]} />}</Modal.Body>
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

export function getViewToolStatus(status: string) {
  if (status === 'A') return <TableTooltip content="Approved" icon={<FcApproval />} />
  else if (status === 'I') return <TableTooltip content="Inactive" icon={<FaEyeSlash className="text-red-400" />} />
  else return undefined
}

export function getFullEkycType(type: string) {
  if (type === 'S') return 'Simplified'
  else if (type === 'R') return 'Regular'
  else return ''
}
