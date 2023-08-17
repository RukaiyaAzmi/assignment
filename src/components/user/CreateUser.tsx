import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import { IRoleData, IRoleListRes } from '@interfaces/role.interface'
import CheckBox from '@components/common/CheckBox'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { postRoleGet, postRoleReport, postUserCreate, postUserValidationCheck } from '@config/urls.config'
import { toast } from 'react-toastify'
import { FaBinoculars } from 'react-icons/fa'
import { IUserCreate, IUserCreateRes, IUserCheckRes } from '@interfaces/user.interface'
import RoleView from '@components/role/RoleView'
import SelectBox from '@components/common/SelectBox'
import _ from 'lodash'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  userId: Joi.string().min(1).message('Please provide a valid UserID').required(),
  channelCode: Joi.string().valid('ABS', 'CBS', 'ICBS', 'EKYC').required(),
  name: Joi.string().min(1).message('Please provide a valid Name').required(),
  password: Joi.string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Please check the password policy')
    .required(),
  conirmPassword: Joi.string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Please check the password policy')
    .required(),
  email: Joi.string().required(),
  mobile: Joi.string()
    .max(14)
    .regex(new RegExp(/^(?:\+88|88)?(01[3-9]\d{8})$/))
    .message('Please provide a valid Mobile Number')
    .required(),

  pinAuthStatus: Joi.boolean().required(),
  roles: Joi.array().min(1).required(),
})

export default function CreateUser(): JSX.Element {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [roleData, setRoleData] = useState<IRoleData[]>([])
  const [roles, setRoles] = useState<IRoleData[]>([])
  const [createUser, setCreateUser] = useState<IUserCreate>({
    userId: '',
    channelCode: '',
    name: '',
    password: '',
    conirmPassword: '',
    email: '',
    mobile: '',
    pinAuthStatus: false,
    roles: [],
  })

  const { execute: userCreate } = useAPIWithToken<IUserCreateRes>()
  const { execute: executeRoleList } = useAPIWithToken<IRoleListRes>()
  const { isLoading, execute: executeRoleDetails } = useAPIWithToken<IRoleListRes>()
  const { execute: userCheckId } = useAPIWithToken<IUserCheckRes>()
  const { execute: userCheckMobile } = useAPIWithToken<IUserCheckRes>()
  const { execute: userCheckEmail } = useAPIWithToken<IUserCheckRes>()

  const { ok: userCheckOk, errors: userCreateError } = useFormValidationAsync(schema, createUser, {
    abortEarly: true,
  })

  useEffect(() => {
    fetchRoleData()
  }, [])

  //************** Show Table *************** *//
  const fetchRoleData = async () => {
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

  //************** Multiple Checkbox *************** *//
  const onCheckBoxChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { roles } = createUser
    if (e.target.checked) {
      roles.push(id)
      setCreateUser({ ...createUser, roles: roles })
    } else {
      const newRole = roles.filter((rId) => rId !== id)
      setCreateUser({ ...createUser, roles: [...newRole] })
    }
  }

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value

    if (value === 'true') {
      setCreateUser({
        ...createUser,
        [e.target.name]: true,
      })
    } else if (value === 'false') {
      setCreateUser({
        ...createUser,
        [e.target.name]: false,
      })
    } else {
      setCreateUser({
        ...createUser,
        [e.target.name]: value,
      })
    }
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (createUser.password !== createUser.conirmPassword) {
      toast.warning('Please check the password')
      return
    }
    if (userCheckOk) {
      try {
        const checkingUserId = userCheckId({
          method: 'POST',
          url: postUserValidationCheck,
          data: _.omit(createUser, [
            'conirmPassword',
            'name',
            'roles',
            'channelCode',
            'pinAuthStatus',
            'password',
            'mobile',
            'email',
          ]),
        })
        const checkingEmail = userCheckEmail({
          method: 'POST',
          url: postUserValidationCheck,
          data: _.omit(createUser, [
            'conirmPassword',
            'name',
            'roles',
            'channelCode',
            'pinAuthStatus',
            'password',
            'mobile',
            'userId',
          ]),
        })
        const checkingUserMobile = userCheckMobile({
          method: 'POST',
          url: postUserValidationCheck,
          data: _.omit(createUser, [
            'conirmPassword',
            'name',
            'roles',
            'channelCode',
            'pinAuthStatus',
            'password',
            'userId',
            'email',
          ]),
        })

        Promise.all([checkingUserId, checkingUserMobile, checkingEmail]).then((values) => {
          if (values[0]?.data === true) return toast.warning('User Id already exists')
          if (values[1]?.data === true) return toast.warning('Mobile number already exists')
          if (values[2]?.data === true) return toast.warning('Email already exists')
          else {
            userCreate({
              method: 'POST',
              url: postUserCreate,
              data: _.omit(createUser, ['conirmPassword']),
            })
            toast.success('Created successfully', {
              onOpen: () => router.push('/admin/user/report'),
            })
            return
          }
        })
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
      <div className="container  my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Create User</h1>
        <div>
          <TextInput
            id="userId"
            placeholder="User ID"
            name="userId"
            type="text"
            onChange={onChangeEvent}
            label="User ID"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['userID']}
          />
        </div>
        <SelectBox
          id="channelCode"
          name="channelCode"
          label="Channel Code"
          onSelect={onChangeEvent}
          value={createUser.channelCode}
          options={[
            { key: 'ABS', value: 'Agent Banking' },
            { key: 'CBS', value: 'Conventional Core Banking' },
            { key: 'ICBS', value: 'Islamic Core Banking' },
            { key: 'EKYC', value: 'eKYC' },
          ]}
          error={userCreateError['channelCode']}
        />

        <div>
          <TextInput
            id="name"
            placeholder="Name"
            name="name"
            type="text"
            onChange={onChangeEvent}
            label={'Name'}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['name']}
          />
        </div>

        <div>
          <TextInput
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            onChange={onChangeEvent}
            label="Password"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['password']}
          />
        </div>

        <div>
          <TextInput
            id="conirmPassword"
            placeholder="Confirm Password"
            name="conirmPassword"
            type="password"
            onChange={onChangeEvent}
            label="Confirm Password"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['conirmPassword']}
          />
        </div>

        <div>
          <TextInput
            id="email"
            placeholder="Email"
            name="email"
            type="text"
            onChange={onChangeEvent}
            label="Email"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['email']}
          />
        </div>

        <div>
          <TextInput
            id="mobile"
            placeholder="Mobile"
            name="mobile"
            type="text"
            onChange={onChangeEvent}
            label="Mobile"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['mobile']}
          />
        </div>

        <div>
          <SelectBox
            id="pinAuthStatus"
            label="Two Step Verification"
            name="pinAuthStatus"
            onSelect={onChangeEvent}
            options={[
              { key: 'false', value: 'No' },
              { key: 'true', value: 'Yes' },
            ]}
            error={userCreateError['pinAuthStatus']}
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
              {roles.length &&
                roles.map((userRole, index) => {
                  const { id, roleName, description } = userRole
                  return (
                    <Table.Row className="bg-white border" key={index}>
                      <Table.Cell>{roleName}</Table.Cell>
                      <Table.Cell>{description}</Table.Cell>
                      <Table.Cell className="flex justify-center">
                        <CheckBox id="prev" onChange={(e) => onCheckBoxChange(id, e)} />
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

        {/* </div> */}
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="purple" aria-label="Loading" size="xl" />
          </div>
        ) : (
          ''
        )}
        <div className="sm:w-2/4 pt-3 m-auto ">
          <ButtonCom id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
        </div>
        {/* </div> */}
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
