import React from 'react'
import CheckBox from '@components/common/CheckBox'
import DateRow from '@components/common/DateRow'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { routes } from '@config/routes.config'
import { getFullStatusName } from '@components/role/RoleList'
import { IRoleData } from '@interfaces/role.interface'

interface RoleDataProps {
  role: IRoleData
}

export default function RoleView({ role }: RoleDataProps) {
  const {
    id,
    roleName,
    description,
    status,
    rolePrivileges,
    approvedBy,
    approveDate,
    createdBy,
    createDate,
    updatedBy,
    updateDate,
  } = role

  const isChecked = (code: string): boolean => {
    const rolePrev = rolePrivileges
    const elem = rolePrev.find((r) => r[0] === code)
    if (elem) return true
    else return false
  }

  return (
    <>
      <div className="bg-white animate__animated animate__fadeIn">
        <Row>
          <>
            <TextRow label="Id" value={id} />
            <TextRow label="Role Name" value={roleName} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Status" value={getFullStatusName(status)} />
            <TextRow label="Description" value={description} />
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
          {routes.map((routes, index) => (
            <div key={index} className="my-1 px-2 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
              <article className="overflow-hidden rounded-lg shadow-lg border-t-4 border-indigo-500 h-full p-4">
                <div className="text-lg flex justify-centern ">
                  <div className="flex justify-between items-center mt-1 ml-2 font-semibold">{routes.title}</div>
                </div>
                <div className=" border-b-2 m-auto border-indigo-300 mt-1 w-full"></div>
                <header className="flex items-center justify-between leading-tight p-3 md:p-2">
                  <ul className="flex flex-wrap w-full text-grey-darker text-sm ">
                    {routes.children.map((children, index) => (
                      <li key={index} className="flex py-1 w-2/4">
                        <CheckBox id="roleView" name={children.title} disable checked={isChecked(children.code)} />
                        {children.title}
                      </li>
                    ))}
                  </ul>
                </header>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
