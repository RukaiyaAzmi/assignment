import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import { IRoleData, IRoleListRes } from '@interfaces/role.interface'
import CheckBox from '@components/common/CheckBox'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import {
  postRoleGet,
  postRoleReport,
  postUserGetAll,
  postUserValidationCheck,
  putUserUpdate,
} from '@config/urls.config'
import { toast } from 'react-toastify'
import { FaBinoculars } from 'react-icons/fa'
import { IUserCheck, IUserCheckRes, IUserUpdate, IUserUpdateRes } from '@interfaces/user.interface'
import RoleView from '@components/role/RoleView'
import SelectBox from '@components/common/SelectBox'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  userId: Joi.string().min(1).message('Please provide a valid UserID').required(),
  channelCode: Joi.string().valid('ABS', 'CBS', 'ICBS', 'EKYC').required(),
  name: Joi.string().min(1).message('Please provide a valid Name').required(),
  email: Joi.string().required(),
  mobile: Joi.string()
    .max(14)
    .regex(new RegExp(/^(?:\+88|88)?(01[3-9]\d{8})$/))
    .message('Please provide a valid Mobile Number')
    .required(),
  pinAuthStatus: Joi.boolean().required(),
  status: Joi.string().valid('A', 'I').required(),
  roles: Joi.array().min(1).required(),
})

interface UpdateProps {
  Id: number
}

export default function UpdateUser({ Id }: UpdateProps): JSX.Element {
  const [roleData, setRoleData] = useState<IRoleData[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [roles, setRoles] = useState<IRoleData[]>([])
  const [userCheck, setUserCheck] = useState<IUserCheck>({
    userId: '',
    email: '',
    mobile: '',
  })
  const [updateUser, setUpdateUser] = useState<IUserUpdate>({
    userId: '',
    channelCode: '',
    name: '',
    email: '',
    mobile: '',
    pinAuthStatus: false,
    status: '',
    roles: [],
  })

  const { execute: executeUser } = useAPIWithToken<IUserUpdateRes>()
  const { execute: executeRoleList } = useAPIWithToken<IRoleListRes>()
  const { execute: userUpdate } = useAPIWithToken<IUserUpdateRes>()

  const { ok: userCheckOk, errors: userUpdateError } = useFormValidationAsync(schema, updateUser, {
    abortEarly: true,
  })
  const { isLoading, execute: executeRoleDetails } = useAPIWithToken<IRoleListRes>()
  const { execute: userCheckId } = useAPIWithToken<IUserCheckRes>()
  const { execute: userCheckMobile } = useAPIWithToken<IUserCheckRes>()
  const { execute: userCheckEmail } = useAPIWithToken<IUserCheckRes>()

  useEffect(() => {
    fetchRoleData()
    fetchRoleTable()
  }, [])

  //   //************** Show from data *************** *//
  const fetchRoleData = async () => {
    try {
      const res = await executeUser({
        method: 'POST',
        url: postUserGetAll,
        data: { id: Id },
      })
      const userData: IUserUpdate = {
        userId: res?.data[0].userId ?? '',
        channelCode: res?.data[0].channelCode ?? '',
        name: res?.data[0].name ?? '',
        email: res?.data[0].email ?? '',
        mobile: res?.data[0].mobile ?? '',
        pinAuthStatus: res?.data[0].pinAuthStatus ?? false,
        roles: res?.data[0].roles.map((r) => r.id) ?? [],
        status: res?.data[0].status ?? '',
      }
      setUpdateUser({ ...userData })
      setUserCheck({
        userId: res?.data[0].userId ?? '',
        email: res?.data[0].email ?? '',
        mobile: res?.data[0].mobile ?? '',
      })
    } catch (error) {
      toast.error('Unknown error')
    }
  }
  //   //************** Show Table *************** *//
  const fetchRoleTable = async () => {
    try {
      const res = await executeRoleList({
        method: 'POST',
        url: postRoleReport,
      })
      setRoles(res ? res.data : [])
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  //************** Multiple Checkbox *************** *//
  const onCheckBoxChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { roles } = updateUser
    if (e.target.checked) {
      roles.push(id)
      setUpdateUser({ ...updateUser, roles: roles })
    } else {
      const newRole = roles.filter((rId) => rId !== id)
      setUpdateUser({ ...updateUser, roles: [...newRole] })
    }
  }
  //**************** Checked Box ************** */
  const isChecked = (id: number): boolean => {
    const { roles } = updateUser
    if (roles && roles.length > 0) {
      const rolePrev = roles
      const updateRole = rolePrev.find((rId) => rId === id)
      if (updateRole) return true
    }
    return false
  }
  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value

    if (value === 'true') {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: true,
      })
    } else if (value === 'false') {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: false,
      })
    } else {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: value,
      })
    }
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (userCheckOk) {
      try {
        if (updateUser.userId !== userCheck.userId) {
          const checkingUserId = await userCheckId({
            method: 'POST',
            url: postUserValidationCheck,
            data: { userId: updateUser.userId },
          })
          if (checkingUserId?.data) {
            toast.warning('User Id already exists')
          }
          return
        }
        if (updateUser.email !== userCheck.email) {
          const checkingEmail = await userCheckEmail({
            method: 'POST',
            url: postUserValidationCheck,
            data: { email: updateUser.email },
          })
          if (checkingEmail?.data) {
            toast.warning('Email already exists')
          }
          return
        }
        if (updateUser.mobile !== userCheck.mobile) {
          const checkingUserMobile = await userCheckMobile({
            method: 'POST',
            url: postUserValidationCheck,
            data: { mobile: updateUser.mobile },
          })

          if (checkingUserMobile?.data) {
            toast.warning('Mobile number already exists')
          }
          return
        }

        console.log('updateUser', updateUser)
        const res = await userUpdate({
          method: 'PUT',
          url: putUserUpdate,
          data: {
            id: Id,
            ...updateUser,
          },
        })

        if (res?.statusCode === 200) {
          toast.success('Update successfully', {
            onOpen: () => router.push('/admin/user/report'),
          })
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  //**************** Modal details************** */
  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }
  const details = async (id: number) => {
    try {
      const res = await executeRoleDetails({
        method: 'POST',
        url: postRoleGet,
        data: { id: id },
      })
      setRoleData(res ? res.data : [])
      setShowDetailsModal(true)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Update User</h1>
        <div>
          <TextInput
            id="userId"
            placeholder="User ID"
            name="userId"
            type="text"
            value={updateUser.userId}
            onChange={onChangeEvent}
            label="User ID"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['userID']}
          />
        </div>
        <div>
          <SelectBox
            id="channelCode"
            name="channelCode"
            label="Channel Code"
            onSelect={onChangeEvent}
            value={updateUser.channelCode}
            options={[
              { key: 'ABS', value: 'Agent Banking' },
              { key: 'CBS', value: 'Conventional Core Banking' },
              { key: 'ICBS', value: 'Islamic Core Banking' },
              { key: 'EKYC', value: 'EKYC' },
            ]}
            error={userUpdateError['channelCode']}
          />
        </div>
        <div>
          <TextInput
            id="name"
            placeholder="Name"
            name="name"
            type="text"
            value={updateUser.name}
            onChange={onChangeEvent}
            label="Name"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['name']}
          />
        </div>
        <div>
          <TextInput
            id="email"
            placeholder="Email"
            name="email"
            type="text"
            value={updateUser.email}
            onChange={onChangeEvent}
            label="Email"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['email']}
          />
        </div>
        <div>
          <TextInput
            id="mobile"
            placeholder="Mobile"
            name="mobile"
            type="text"
            onChange={onChangeEvent}
            value={updateUser.mobile}
            label="Mobile"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userUpdateError['mobile']}
          />
        </div>
        <div>
          <SelectBox
            id="pinAuthStatus"
            label="Two Step Verification"
            name="pinAuthStatus"
            value={updateUser.pinAuthStatus.toString()}
            onSelect={onChangeEvent}
            options={[
              { key: 'true', value: 'Yes' },
              { key: 'false', value: 'No' },
            ]}
            error={userUpdateError['pinAuthStatus']}
          />
        </div>
        <div>
          <SelectBox
            id="status"
            label="Status"
            name="status"
            value={updateUser.status}
            onSelect={onChangeEvent}
            options={[
              { key: 'A', value: 'Active' },
              { key: 'I', value: 'Inactive' },
            ]}
            error={userUpdateError['status']}
          />
        </div>

        <div className="container m-auto mt-8 overflow-x-auto">
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>Role Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell className="flex justify-center">Checkbox</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {roles.length > 0 &&
                roles.map((userRole, index) => {
                  const { id, roleName, description } = userRole
                  return (
                    <Table.Row className="bg-white border" key={index}>
                      <Table.Cell>{roleName}</Table.Cell>
                      <Table.Cell>{description}</Table.Cell>
                      <Table.Cell className="flex justify-center">
                        <CheckBox checked={isChecked(id)} id="roles" onChange={(e) => onCheckBoxChange(id, e)} />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <button
                          onClick={() => details(id)}
                          disabled={isLoading}
                          className="flex justify-center items-center text-xs mr-3 space-x-1 bg-green-400 hover:bg-green-500 hover: duration-200 rounded-md px-2 py-1 text-gray-100"
                        >
                          <i>
                            <FaBinoculars />
                          </i>
                          <span>Details</span>
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
            </Table.Body>
          </Table>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="purple" aria-label="Loading" size="xl" />
          </div>
        ) : (
          ''
        )}
        <div className="sm:w-2/4 pt-3 m-auto">
          <ButtonCom id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
        </div>
      </div>
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
        <Modal.Body className=" bg-slate-100">{roleData.length && <RoleView role={roleData[0]} />}</Modal.Body>
        <Modal.Footer className="flex justify-end bg-slate-100">
          <Button color="gray" onClick={handleDetailsClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
