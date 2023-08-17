import { postUserGet, putUserApprove } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { IUserData, IUserStatusRes } from '@interfaces/user.interface'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { FaBinoculars } from 'react-icons/fa'
import { toast } from 'react-toastify'
import UserView from './UserView'
import { CiCircleAlert } from 'react-icons/ci'

export default function UserApprove(): JSX.Element {
  const [approvalData, setApprovalData] = useState<IUserData[]>([])
  const [showApproveModal, setShowApproveModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const [showRejectModal, setShowRejectModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })

  const [roleData, setRoleData] = useState<IUserData[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)

  const { execute: executeApproval } = useAPIWithToken<IUserStatusRes>()
  const { execute: executeRoleDetails } = useAPIWithToken<IUserStatusRes>()
  const { isLoading, execute: executeRoleList } = useAPIWithToken<IUserStatusRes>()

  useEffect(() => {
    approvalList()
  }, [])

  const handleApproveModalCancel = () => {
    setShowApproveModal({
      status: false,
      current: -1,
    })
  }

  const handleRejectModalCancel = () => {
    setShowRejectModal({
      status: false,
      current: -1,
    })
  }

  const handleShowApproveModal = (id: number) => {
    setShowApproveModal({ status: true, current: id })
  }

  const handleShowRejectModal = (id: number) => {
    setShowRejectModal({ status: true, current: id })
  }

  const approvalList = async () => {
    try {
      const res = await executeRoleList({
        method: 'POST',
        url: postUserGet,
        data: { status: 'P' },
      })
      setApprovalData(res ? res.data : [])
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  const approveRole = async (id: number) => {
    try {
      const res = await executeApproval({
        method: 'PUT',
        url: putUserApprove,
        data: {
          id: id,
          status: 'A',
        },
      })
      if (res) toast.success('Successfully Approved')
      approvalList()
      setShowApproveModal({ status: false, current: -1 })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const rejectRole = async (id: number) => {
    try {
      const res = await executeApproval({
        method: 'PUT',
        url: putUserApprove,
        data: {
          id: id,
          status: 'R',
        },
      })
      if (res) toast.success('Successfully Rejected')
      approvalList()
      setShowRejectModal({ status: false, current: -1 })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const details = async (id: number) => {
    try {
      setShowDetailsModal(true)
      const res = await executeRoleDetails({
        method: 'POST',
        url: postUserGet,
        data: { id: id },
      })
      setRoleData(res ? res.data : [])
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="py-4 px-10 overflow-x-auto">
        <Table striped={true}>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Channel Name</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Mobile</Table.HeadCell>
            <Table.HeadCell className=" text-center">Action</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {approvalData &&
              approvalData.map((approval) => {
                const { id, userId, channelCode, name, mobile } = approval
                return (
                  <Table.Row className="bg-white border" key={id}>
                    <Table.Cell>{id}</Table.Cell>
                    <Table.Cell>{userId}</Table.Cell>
                    {/* <Table.Cell>{status}</Table.Cell> */}
                    <Table.Cell>{channelCode}</Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{mobile}</Table.Cell>
                    {/* <Table.Cell>{grantedIPList}</Table.Cell> */}
                    <Table.Cell>
                      <div className="flex gap-1 justify-center items-center">
                        <button
                          onClick={() => handleShowApproveModal(id)}
                          disabled={isLoading}
                          className="flex justify-center text-xs items-center mr-3 px-2 py-1 space-x-1 bg-green-400 hover:bg-green-500 hover: duration-200 rounded-md text-gray-100 w-20 font-semibold"
                        >
                          <AiOutlineCheckCircle />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleShowRejectModal(id)}
                          disabled={isLoading}
                          className="flex justify-center text-xs items-center mr-3 px-2 py-1 space-x-1 bg-red-400 hover:bg-red-500 hover: duration-200 rounded-md text-gray-100 w-20 font-semibold"
                        >
                          <AiOutlineCloseCircle />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => details(id)}
                          disabled={isLoading}
                          className="flex justify-center text-xs items-center mr-3 px-2 py-1 space-x-1 bg-yellow-400 hover:bg-yellow-500 hover: duration-200 rounded-md text-gray-100 w-20 font-semibold"
                        >
                          <i>
                            <FaBinoculars />
                          </i>
                          <span>Details</span>
                        </button>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center">
                          <Spinner color="purple" aria-label="Loading" size="xl" />
                        </div>
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>

        <Modal
          show={showDetailsModal}
          size="6xl"
          onClose={handleDetailsClose}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header className="bg-slate-100">
            <p className="ml-3 my-2">User Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">
            {roleData.length && <UserView user={roleData[0]} image={''} />}
          </Modal.Body>
          <Modal.Footer className="flex justify-end bg-slate-100">
            <Button color="gray" onClick={handleDetailsClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* <!--- Approve Modal Show ---> */}
        <Modal
          show={showApproveModal.status}
          size="md"
          onClose={handleApproveModalCancel}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <CiCircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to Approve this User?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  disabled={isLoading}
                  gradientDuoTone="pinkToOrange"
                  outline
                  onClick={() => approveRole(showApproveModal.current)}
                >
                  {`Yes, I'm sure`}
                </Button>
                <Button color="gray" onClick={handleApproveModalCancel}>
                  {`No, cancel`}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* <!--- Reject Modal Show ---> */}
        <Modal
          show={showRejectModal.status}
          size="md"
          onClose={handleRejectModalCancel}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <CiCircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to Reject this User?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  disabled={isLoading}
                  gradientDuoTone="pinkToOrange"
                  outline
                  onClick={() => rejectRole(showRejectModal.current)}
                >
                  {`Yes, I'm sure`}
                </Button>
                <Button color="gray" onClick={handleRejectModalCancel}>
                  {`No, cancel`}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}
