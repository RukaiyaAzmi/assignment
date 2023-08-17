import React from 'react'
import DateRow from '@components/common/DateRow'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { getFullStatusName } from '@components/role/RoleList'
import { IUser } from '@interfaces/user.interface'
import { routes } from '@config/routes.config'
import CheckBox from '@components/common/CheckBox'

interface UserViewProps {
  user: IUser
  image: string
}

export default function UserView({ user, image }: UserViewProps) {
  const {
    id,
    userId,
    name,
    mobile,
    email,
    channelCode,
    status,
    approvedBy,
    approveDate,
    createdBy,
    createDate,
    updatedBy,
    updateDate,
    roles,
  } = user

  const flag = 'data:image/jpeg;base64, '

  const isChecked = (code: string): boolean => {
    for (let i = 0; i < roles.length; i++) {
      const rolePrev = roles[i].rolePrivileges
      const elem = rolePrev.find((r) => r[0] === code)
      if (elem) return true
    }

    return false
  }

  return (
    <div className="bg-white animate__animated animate__fadeIn">
      <div className=" py-5">
        <img
          className="w-40 h-40 rounded-md m-auto"
          src={image ? flag + image : '/img/placeholder_nominee_photo.png'}
          alt="profile Image"
        />
      </div>
      <Row>
        <>
          <TextRow label="ID" value={id} />
          <TextRow label="User ID" value={userId} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Name" value={name} />
          <TextRow label="Mobile" value={mobile} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Email" value={email} />
          <TextRow label="Channel Code" value={channelCode} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Status" value={getFullStatusName(status)} />
          <TextRow label="Role Name" value={roles[0].roleName} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Approved By" value={approvedBy} />
          <DateRow label="Approved Date" value={approveDate} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Created By" value={createdBy} />
          <DateRow label="Create Date" value={createDate} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Updated By" value={updatedBy} />
          <DateRow label="Update Date" value={updateDate} />
        </>
      </Row>
      <div className="flex flex-wrap -mx-1 lg:-mx-4 py-2">
        {routes.map((route, index) => (
          <div key={index} className="my-1 px-2 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
            <article className="overflow-hidden rounded-lg shadow-lg border-t-4 border-indigo-500 h-full p-4">
              <div className="text-lg flex justify-centern ">
                <div className="flex justify-between items-center mt-1 ml-2 font-semibold">{route.title}</div>
              </div>
              <div className=" border-b-2 m-auto border-indigo-300 mt-1 w-full"></div>
              <header className="flex items-center justify-between leading-tight p-3 md:p-2">
                <ul className="flex flex-wrap w-full text-grey-darker text-sm ">
                  {route.children.map((c, index) => (
                    <li key={index} className="flex py-1 w-2/4">
                      <CheckBox id="showUserRole" name={c.title} disable checked={isChecked(c.code)} />
                      {c.title}
                    </li>
                  ))}
                </ul>
              </header>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}
