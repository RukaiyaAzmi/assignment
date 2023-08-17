import React, { useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import TextArea from '@components/common/TextArea'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import { ICreateRole, IRoleCreateRes, IRoleListRes } from '@interfaces/role.interface'
import CheckBox from '@components/common/CheckBox'
import Button from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postCreateRole, postRoleGet } from '@config/urls.config'
import { toast } from 'react-toastify'
import { routes } from '@config/routes.config'
import { useRouter } from 'next/router'

const schema: Joi.Schema = Joi.object({
  roleName: Joi.string().min(5).message('Please provide a valid Role Name').required(),
  description: Joi.string().min(5).message('Please provide a valid Description').required(),
})

export default function CreateRole(): JSX.Element {
  const router = useRouter()
  const [createRole, setCreateRole] = useState<ICreateRole>({
    roleName: '',
    description: '',
  })
  const [prev, setPrev] = useState<string[][]>([])

  const { ok: roleCreateOk, errors: roleCreateError } = useFormValidationAsync(schema, createRole, {
    abortEarly: true,
  })
  const { isLoading, execute: roleCreate } = useAPIWithToken<IRoleCreateRes>()
  const { execute: roleGetExecute } = useAPIWithToken<IRoleListRes>()

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

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value: string | boolean = e.target.value
    setCreateRole({
      ...createRole,
      [e.target.name]: value,
    })
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (roleCreateOk && prev.length > 0) {
      try {
        const role = await roleGetExecute({
          method: 'POST',
          url: postRoleGet,
          data: {
            roleName: createRole.roleName,
          },
        })

        if (role?.data.length) {
          toast.error(`"${createRole.roleName}" Role Name is Already Exist`)
          return
        }

        const res = await roleCreate({
          method: 'POST',
          url: postCreateRole,
          data: {
            ...createRole,
            rolePrivileges: prev,
          },
        })

        if (res?.statusCode === 201) {
          toast.success('Role created successfully', {
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
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Create Role</h1>
        <div>
          <TextInput
            id="roleName"
            placeholder="Role Name"
            name="roleName"
            type="text"
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
                    <div className="flex justify-between items-center mt-1 ml-2 font-semibold">{routes.title}</div>
                  </h1>
                  <div className=" border-b-2 m-auto border-indigo-300 mt-1 w-full"></div>
                  <header className="flex items-center justify-between leading-tight p-3 md:p-2">
                    <ul className="flex flex-wrap w-full text-grey-darker text-sm ">
                      {routes.children.map((c, index) => (
                        <li key={index} className="flex py-1 w-2/4">
                          <CheckBox
                            id="prev"
                            disable={false}
                            name={c.title}
                            value={c.code}
                            onChange={onCheckBoxChange}
                          />
                          {c.title}
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
          <div className="sm:w-2/4 pt-3 m-auto">
            <Button id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
          </div>
        </div>
      </form>
    </>
  )
}
