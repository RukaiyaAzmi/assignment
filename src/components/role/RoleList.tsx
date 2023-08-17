import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaEdit, FaArchive, FaBinoculars } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { IRoleData, IRoleListRes } from '@interfaces/role.interface'
import { postRoleReport, putRoleDelete } from '@config/urls.config'
import { getViewDateFormat } from '@utils/date.utils'
import TableTooltip from '@components/common/TableTooltip'
import { FcApproval } from 'react-icons/fc'
import { AiOutlineRollback, AiTwotoneDelete } from 'react-icons/ai'
import { MdPending } from 'react-icons/md'
import { CiCircleAlert } from 'react-icons/ci'
import { BiBlock } from 'react-icons/bi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import RoleView from './RoleView'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import TextInput from '@components/common/TextInput'
import SelectBox from '@components/common/SelectBox'
import InlineButton from '@components/common/InlineButton'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'

const schema: Joi.Schema = Joi.object({
  val: Joi.number().min(1).required(),
})

export const schemaRole: Joi.Schema = Joi.object({
  val: Joi.string().min(5).required(),
})

export default function RoleList() {
  const router = useRouter()
  const [roles, setRoles] = useState<IRoleData[]>([])
  const [role, setRole] = useState<IRoleData[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [value, setValue] = useState({
    val: '',
  })
  const [selectedOption, setSelectedOption] = useState('')
  const [option, setOption] = useState('')
  const features = useSelector((state: RootState) => state.user.features)

  const { ok: roleListOk } = useFormValidationAsync(schema, value, {
    abortEarly: true,
  })
  const { ok: roleListNameOk } = useFormValidationAsync(schemaRole, value, {
    abortEarly: true,
  })

  const { isLoading: isRoleList, execute: executeRoleList } = useAPIWithToken<IRoleListRes>()
  const { isLoading, execute: executeRoleListWithId } = useAPIWithToken<IRoleListRes>()
  const { isLoading: isDeleteLoading, execute: executeDeleteRole } = useAPIWithToken()
  const { execute: executeRoleSearch } = useAPIWithToken<IRoleListRes>()

  useEffect(() => {
    fetchRoleList()
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
      const res = await executeRoleListWithId({
        method: 'POST',
        url: postRoleReport,
        data: { id: id },
      })
      setRole(res ? res.data : [])
      setShowDetailsModal(true)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDelete = async (id: number) => {
    const newRoles = roles?.filter((r) => r.id !== id)
    try {
      const res = await executeDeleteRole({
        method: 'PUT',
        url: putRoleDelete,
        data: { id: id, status: 'D' },
      })
      if (res) toast.success('Successfully Deleted')
      setRoles(newRoles)
      setShowDeleteModal({ status: false, current: -1 })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleUpdateModal = (id: number) => {
    router.push({
      pathname: `/admin/role/update`,
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
      toast.error('Please enter User ID or Role Name')
    }
  }

  const fetchRoleList = async () => {
    setValue({ val: '' })
    setOption('')
    try {
      const res = await executeRoleList({
        method: 'POST',
        url: postRoleReport,
      })
      setRoles(res ? res.data : [])
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const search = async (select: string) => {
    try {
      setSelectedOption('')
      if (select === 'i') {
        if (roleListOk) {
          const res = await executeRoleSearch({
            method: 'POST',
            url: postRoleReport,
            data: { id: Number(value.val) },
          })
          setRoles(res ? res.data : [])
        } else {
          toast.error('Please provide valid ID')
        }
      } else if (select === 'r') {
        if (roleListNameOk) {
          const res = await executeRoleSearch({
            method: 'POST',
            url: postRoleReport,
            data: { roleName: value.val },
          })
          setRoles(res ? res.data : [])
        } else {
          toast.error('Please provide valid Role Name')
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
      const res = await executeRoleSearch({
        method: 'POST',
        url: postRoleReport,
        data: { status: option },
      })
      setRoles(res ? res.data : [])
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <div className="flex justify-end">
          <div className="flex flex-wrap justify-end items-center w-full">
            <div className="sm:text-xs px-3 w-64">
              <TextInput
                id="roleId"
                placeholder="Search by ID or Role"
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
                selectText="ID or Role Name"
                options={[
                  { key: 'i', value: 'ID' },
                  { key: 'r', value: 'Role Name' },
                ]}
              />
            </div>

            <div className="sm:text-xs px-3 w-64">
              <SelectBox
                id="dropdown"
                onSelect={handleOptionChange}
                value={selectedOption}
                name="dropdown"
                selectText="Role Status"
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
        {roles.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>Role Name</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Create Date</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {roles &&
                  roles.map((role) => (
                    <Table.Row className="bg-white border" key={role.id}>
                      <Table.Cell>{role.roleName}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{getViewTooltip(role.status)}</Table.Cell>
                      <Table.Cell>{role.description}</Table.Cell>
                      <Table.Cell>{getViewDateFormat(role.createDate)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          {isAuthorized(features, '1.3') && (
                            <InlineButton
                              icon={<FaEdit />}
                              value="Update"
                              onClick={() => handleUpdateModal(role.id)}
                              color="bg-yellow-400 hover:bg-yellow-500"
                            />
                          )}

                          <InlineButton
                            disabled={isLoading}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetailsModal(role.id)}
                            color="bg-green-400 hover:bg-green-500"
                          />
                          {isAuthorized(features, '1.6') && (
                            <InlineButton
                              icon={<FaArchive />}
                              value="Delete"
                              onClick={() => handleShowDeleteModal(role.id)}
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
              {isRoleList ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
            {isRoleList ? (
              ''
            ) : (
              <InlineButton
                icon={<AiOutlineRollback />}
                onClick={fetchRoleList}
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
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this Role?</h3>
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
            <p className="ml-3 my-2">Role Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">{role.length && <RoleView role={role[0]} />}</Modal.Body>
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
  else return undefined
}

export function getFullStatusName(status: string) {
  if (status === 'A') return 'Approved'
  else if (status === 'P') return 'Pending'
  else if (status === 'R') return 'Rejected'
  else if (status === 'D') return 'Deleted'
  else return ''
}
