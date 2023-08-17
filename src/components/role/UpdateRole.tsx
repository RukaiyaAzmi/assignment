import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import TextArea from '@components/common/TextArea'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import { IRoleUpdate, IRoleUpdateRes } from '@interfaces/role.interface'
import CheckBox from '@components/common/CheckBox'
import Button from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postRoleReport, putRoleUpdate } from '@config/urls.config'
import { toast } from 'react-toastify'
import { routes } from '@config/routes.config'
import { useRouter } from 'next/router'

const schema: Joi.Schema = Joi.object({
  roleName: Joi.string().min(5).message('Please provide a valid Role Name').required(),
  description: Joi.string().min(5).message('Please provide a valid Description').required(),
  status: Joi.string(),
})

interface UpdateRoleProps {
  Id: number
}

export default function UpdateRole({ Id }: UpdateRoleProps): JSX.Element {
  const router = useRouter()
  const [showRole, setShowRole] = useState<IRoleUpdate>({
    roleName: '',
    description: '',
    status: '',
  })
  const [prev, setPrev] = useState<string[][]>([])

  const { ok, errors: roleCreateError } = useFormValidationAsync(schema, showRole, {
    abortEarly: true,
  })

  const { isLoading, execute: roleUpdate } = useAPIWithToken<IRoleUpdateRes>()
  const { execute: executeRole } = useAPIWithToken<IRoleUpdateRes>()

  useEffect(() => {
    fetchRoleData()
  }, [])

  const fetchRoleData = async () => {
    try {
      const res = await executeRole({
        method: 'POST',
        url: postRoleReport,
        data: { id: Id },
      })
      const roleData: IRoleUpdate = {
        roleName: res?.data[0].roleName ?? '',
        status: res?.data[0].status ?? '',
        description: res?.data[0].description ?? '',
      }
      setShowRole({ ...roleData })
      setPrev(res?.data[0].rolePrivileges)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  //************** Input fild on change  *************** *//
  const onChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value: string | boolean = e.target.value
    setShowRole({
      ...showRole,
      [e.target.name]: value,
    })
  }
  //************** Multiple Checkbox *************** *//
  const onCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const elem = prev.find((p) => p[0] === e.target.value)
      if (!elem) {
        const p: string[] = [e.target.value, e.target.getAttribute('name') as string]
        setPrev([...prev, p])
      }
    } else {
      const elemIndex = prev.findIndex((p) => p[0] === e.target.value)
      prev.splice(elemIndex, 1)
      setPrev([...prev])
    }
  }
  //**************** Checked Box ************** */
  const isChecked = (code: string): boolean => {
    if (prev && prev.length > 0) {
      const rolePrev = prev
      const elem = rolePrev.find((r) => r[0] === code)
      if (elem) return true
    }
    return false
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok && prev.length > 0) {
      try {
        const res = await roleUpdate({
          method: 'PUT',
          url: putRoleUpdate,
          data: {
            id: Id,
            ...showRole,
            rolePrivileges: prev,
            grantedIPList: [],
          },
        })
        if (res?.statusCode === 200) {
          toast.success('Role Successfully Updated', {
            onOpen: () => router.push('/admin/role/report'),
          })
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  return (
    <>
      <form className="container my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Update Role</h1>
        <div>
          <TextInput
            id="roleName"
            placeholder="Role Name"
            name="roleName"
            type="text"
            value={showRole.roleName}
            onChange={onChangeEvent}
            label={'Role Name'}
            iconUrl="/icon/icon_userid.svg"
            error={roleCreateError['roleName']}
          />
        </div>
        <div>
          <TextArea
            id="description"
            placeholder="Description"
            name="description"
            value={showRole.description}
            rows={4}
            onChange={onChangeEvent}
            iconUrl="/icon/icon_userid.svg"
            required={true}
            label={'Description'}
            error={roleCreateError['description']}
          />
        </div>
        <div className="py-4">
          <h3 className="text-md text-gray-700 font-semibold mt-3">Assign permissions </h3>
          <div className="flex flex-wrap -mx-1 lg:-mx-4">
            {routes.map((routes, index) => (
              <div key={index} className="my-1 px-2 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
                <article className="overflow-hidden rounded-lg shadow-lg border-t-4 border-indigo-500 h-full p-4">
                  <h1 className="text-lg flex justify-centern ">
                    <div className="flex justify-between items-center mt-1 ml-2 font-semibold">
                      {/* <CheckBox
                    id="channelLogin"
                    name="select_all"
                    value="Select All"
                    onChange={onCheckBoxChange}
                    /> */}
                      {routes.title}
                    </div>
                  </h1>
                  <div className=" border-b-2 m-auto border-indigo-300 mt-1 w-full"></div>
                  <header className="flex items-center justify-between leading-tight p-3 md:p-2">
                    <ul className="flex flex-wrap w-full text-grey-darker text-sm ">
                      {routes.children.map((children, index) => (
                        <li key={index} className="flex py-1 w-2/4">
                          <CheckBox
                            id="prev"
                            name={children.title}
                            value={children.code}
                            checked={isChecked(children.code)}
                            onChange={onCheckBoxChange}
                          />
                          {children.title}
                        </li>
                      ))}
                    </ul>
                  </header>
                </article>
              </div>
            ))}
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <div className="sm:w-2/4 pt-3 m-auto ">
            <Button id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
          </div>
        </div>
      </form>
    </>
  )
}
