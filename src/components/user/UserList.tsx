import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaEdit, FaArchive, FaBinoculars, FaEyeSlash } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { getUserImage, postUserGet, postUserReport, putUserApprove } from '@config/urls.config'
import { getViewDateFormat } from '@utils/date.utils'
import TableTooltip from '@components/common/TableTooltip'
import { FcApproval } from 'react-icons/fc'
import { AiOutlineRollback, AiTwotoneDelete } from 'react-icons/ai'
import { MdPending } from 'react-icons/md'
import { CiCircleAlert } from 'react-icons/ci'
import { BiBlock } from 'react-icons/bi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import TextInput from '@components/common/TextInput'
import SelectBox from '@components/common/SelectBox'
import {
  IUser,
  IUserData,
  IUserDetailsRes,
  IUserListRes,
  IUserProfileDetailsRes,
  IUserStatusRes,
} from '@interfaces/user.interface'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import InlineButton from '@components/common/InlineButton'
import UserView from './UserView'
import CustomPagination from '@components/common/CustomPagination'

const schema: Joi.Schema = Joi.object({
  val: Joi.string().min(1).required(),
})

const schemaMob: Joi.Schema = Joi.object({
  val: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
})

export default function UserList(): JSX.Element {
  const router = useRouter()
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [user, setUser] = useState<IUser[]>([])
  const [image, setImage] = useState<string>('')
  const [users, setUsers] = useState<IUserData[]>([])
  const [value, setValue] = useState({
    val: '',
  })
  const [selectedOption, setSelectedOption] = useState('')
  const [option, setOption] = useState('')
  const [pagination, setPagination] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const features = useSelector((state: RootState) => state.user.features)

  const { isLoading: isUserLoading, execute: executeUserList } = useAPIWithToken<IUserListRes>()
  const { isLoading: isDeleteLoading, execute: executeDeleteRole } = useAPIWithToken()
  const { execute: executeUserSearch } = useAPIWithToken<IUserStatusRes>()
  const { isLoading: isUserList, execute: executeUserListWithId } = useAPIWithToken<IUserDetailsRes>()
  const { execute: executeUserProfile } = useAPIWithToken<IUserProfileDetailsRes>()

  const { ok: userListOk } = useFormValidationAsync(schema, value, {
    abortEarly: true,
  })
  const { ok: userListMobOk } = useFormValidationAsync(schemaMob, value, {
    abortEarly: true,
  })

  useEffect(() => {
    fetchUserList()
  }, [currentPage])

  const fetchUserList = async () => {
    setValue({ val: '' })
    setOption('')
    try {
      setPagination(true)
      const res = await executeUserList({
        method: 'POST',
        url: `${postUserReport}/${currentPage}`,
      })
      setUsers(res ? res.data.users : [])
      setTotalPage(res ? res.data.totalPages : 1)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDeleteModalCancel = () => {
    setShowDeleteModal({
      status: false,
      current: -1,
    })
  }

  const handleShowDeleteModal = (id: number) => {
    setShowDeleteModal({ status: true, current: id })
  }

  const handleDelete = async (id: number) => {
    const newRoles = users?.filter((r) => r.id !== id)
    try {
      const res = await executeDeleteRole({
        method: 'PUT',
        url: putUserApprove,
        data: { id: id, status: 'D' },
      })
      if (res) toast.success('Successfully Deleted')
      setUsers(newRoles)
      setShowDeleteModal({ status: false, current: -1 })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  const handleUpdateModal = (id: number) => {
    router.push({
      pathname: `/admin/user/update`,
      query: {
        id: id,
      },
    })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue({ val: e.target.value })
    setOption('')
  }

  const handleOptionChange = (event: { target: { value: string; name: string } }) => {
    setSelectedOption(event.target.value)
    searchStatus(event.target.value)
  }

  const onSelectChange = (event: { target: { value: string; name: string } }) => {
    setOption(event.target.value)
    if (event.target.value === 'i' && value.val != '') {
      search(event.target.value)
    } else if (event.target.value === 'r' && value.val != '') {
      search(event.target.value)
    } else {
      toast.error('Please enter User ID or Mobile No')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleShowDetailsModal = async (id: number) => {
    try {
      const userDetailsRes = await executeUserListWithId({
        method: 'POST',
        url: postUserGet,
        data: { id: id },
      })
      if (userDetailsRes?.statusCode === 200) {
        setShowDetailsModal(true)
        setUser(userDetailsRes ? userDetailsRes.data : [])
        const userProfileRes = await executeUserProfile({
          method: 'GET',
          url: getUserImage,
          params: { id: id },
        })
        setImage(userProfileRes?.data.userImage ? userProfileRes.data.userImage.data : '')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const search = async (select: string) => {
    try {
      setSelectedOption('')
      setPagination(false)
      if (select == 'i') {
        if (userListOk) {
          const res = await executeUserSearch({
            method: 'POST',
            url: `${postUserReport}/${currentPage}`,
            data: { userId: value.val },
          })
          setUsers(res ? res.data : [])
        } else {
          toast.error('Please provide valid User ID')
        }
      } else if (select == 'r') {
        if (userListMobOk) {
          const res = await executeUserSearch({
            method: 'POST',
            url: `${postUserReport}/${currentPage}`,
            data: { mobile: value.val },
          })
          setUsers(res ? res.data : [])
        } else {
          toast.error('Please provide valid Mobile No')
        }
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const searchStatus = async (option: string) => {
    try {
      setValue({ val: '' })
      setOption('')
      setPagination(false)
      const res = await executeUserSearch({
        method: 'POST',
        url: `${postUserReport}/${currentPage}`,
        data: { status: option },
      })
      setUsers(res?.data ? res?.data : [])
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <div className="flex justify-end">
          <div className="flex   flex-wrap  justify-end items-center w-full">
            <div className="sm:text-xs px-3 w-64">
              <TextInput
                id="roleId"
                placeholder="User ID or Mobile"
                name="roleId"
                type="text"
                onChange={handleChange}
                value={value.val}
                iconUrl="/icon/icon_search.svg"
              />
            </div>
            <div className="sm:text-xs px-3 w-64">
              <SelectBox
                id="dropdown"
                onSelect={onSelectChange}
                value={option}
                name="dropdown"
                selectText="User ID or Mobile"
                options={[
                  { key: 'i', value: 'User ID' },
                  { key: 'r', value: 'Mobile No' },
                ]}
              />
            </div>

            <div className="sm:text-xs px-3 w-64">
              <SelectBox
                id="dropdown"
                onSelect={handleOptionChange}
                value={selectedOption}
                name="dropdown"
                selectText="Select Status"
                options={[
                  { key: 'A', value: 'Approved' },
                  { key: 'R', value: 'Rejected' },
                  { key: 'P', value: 'Pending' },
                  { key: 'D', value: 'Deleted' },
                ]}
              />
            </div>
          </div>
        </div>

        {users.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>User ID</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Channel Name</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Mobile</Table.HeadCell>
                <Table.HeadCell>Create Date</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {users &&
                  users.map((user) => (
                    <Table.Row className="bg-white border" key={user.id}>
                      <Table.Cell>{user.userId}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{getViewTooltip(user.status)}</Table.Cell>
                      <Table.Cell>{user.channelCode}</Table.Cell>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>{user.mobile}</Table.Cell>
                      <Table.Cell>{getViewDateFormat(user.createDate)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          {isAuthorized(features, '1.3') && (
                            <InlineButton
                              icon={<FaEdit />}
                              value="Update"
                              onClick={() => handleUpdateModal(user.id)}
                              color="bg-yellow-400 hover:bg-yellow-500"
                            />
                          )}

                          <InlineButton
                            disabled={isUserList}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetailsModal(user.id)}
                            color="bg-green-400 hover:bg-green-500"
                          />
                          {isAuthorized(features, '1.6') && (
                            <InlineButton
                              icon={<FaArchive />}
                              value="Delete"
                              onClick={() => handleShowDeleteModal(user.id)}
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
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this User?</h3>
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
            <p className="ml-3 my-2">User Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">{user.length && <UserView user={user[0]} image={image} />}</Modal.Body>
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

export function getViewTooltip(status: string) {
  if (status === 'A') return <TableTooltip content="Approved" icon={<FcApproval />} />
  else if (status === 'P') return <TableTooltip content="Pending" icon={<MdPending className="text-yellow-400" />} />
  else if (status === 'R') return <TableTooltip content="Rejected" icon={<BiBlock className="text-red-500" />} />
  else if (status === 'D') return <TableTooltip content="Deleted" icon={<AiTwotoneDelete />} />
  else if (status === 'I') return <TableTooltip content="Inactive" icon={<FaEyeSlash className="text-red-400" />} />
  else return undefined
}

export function getFullStatusName(status: string) {
  if (status === 'A') return 'Approved'
  else if (status === 'P') return 'Pending'
  else if (status === 'R') return 'Rejected'
  else if (status === 'D') return 'Deleted'
  else return ''
}
