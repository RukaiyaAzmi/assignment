import React, { useEffect, useState } from 'react'
import { Spinner, Table } from 'flowbite-react'
import { FaEdit, FaBinoculars } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { postAllEkycGet } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import TextInput from '@components/common/TextInput'
import SelectBox from '@components/common/SelectBox'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import InlineButton from '@components/common/InlineButton'
import { ISimplifiedData, ISimplifiedEkycRes, ISimplifiedFullProfileRes } from '@interfaces/onboarding.interface'
import { setApplicantId, increment, resetUpgradeState } from '@redux/slices/upgrade.slice'

const schema: Joi.Schema = Joi.object({
  val: Joi.alternatives().try(
    Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    Joi.string()
      .length(17)
      .pattern(/^[0-9]+$/)
      .required(),
  ),
})

const schemaMob: Joi.Schema = Joi.object({
  val: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
})

export default function Upgrade(): JSX.Element {
  const dispatch = useDispatch()
  const router = useRouter()
  const [account, setAccount] = useState<ISimplifiedData[]>([])
  const [value, setValue] = useState({
    val: '',
  })
  const [option, setOption] = useState('')
  const features = useSelector((state: RootState) => state.user.features)

  const { isLoading: isAccountLoading, execute: executeAccountSearch } = useAPIWithToken<ISimplifiedEkycRes>()
  const { isLoading: isAccountList } = useAPIWithToken<ISimplifiedFullProfileRes>()

  const { ok: accountListOk } = useFormValidationAsync(schema, value, {
    abortEarly: true,
  })
  const { ok: accountListMobOk } = useFormValidationAsync(schemaMob, value, {
    abortEarly: true,
  })

  useEffect(() => {
    fetchAccountList()
    dispatch(resetUpgradeState())
  }, [])

  const fetchAccountList = async () => {
    setValue({ val: '' })
    setOption('')
    setAccount([])
  }

  const handleUpdate = (id: string) => {
    const name = 'applicantId'
    const value = id
    const inputObj = {
      name,
      value,
    }
    dispatch(setApplicantId(inputObj))
    dispatch(increment())
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue({ val: e.target.value })
    setOption('')
  }

  const onSelectChange = (event: { target: { value: string; name: string } }) => {
    setOption(event.target.value)
    if (event.target.value === 'n' && value.val != '') {
      search(event.target.value)
    } else if (event.target.value === 'm' && value.val != '') {
      search(event.target.value)
    } else {
      toast.error('Please enter NID or Mobile No')
    }
  }

  const handleShowDetails = async (id: string) => {
    router.push({
      pathname: `/admin/full-profile/`,
      query: {
        id: id,
      },
    })
  }

  const search = async (select: string) => {
    try {
      if (select == 'n') {
        if (accountListOk) {
          const res = await executeAccountSearch({
            method: 'POST',
            url: postAllEkycGet,
            data: { nid: value.val },
          })
          setAccount(res ? res.data : [])
        } else {
          toast.error('Please provide valid NID')
        }
      } else if (select == 'm') {
        if (accountListMobOk) {
          const res = await executeAccountSearch({
            method: 'POST',
            url: postAllEkycGet,
            data: { mobile: value.val },
          })
          setAccount(res ? res.data : [])
        } else {
          toast.error('Please provide valid Mobile No')
        }
      }
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
                placeholder="NID or Mobile"
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
                selectText="NID or Mobile"
                options={[
                  { key: 'n', value: 'NID' },
                  { key: 'm', value: 'Mobile No' },
                ]}
              />
            </div>
          </div>
        </div>

        {account.length !== 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>NID</Table.HeadCell>
                <Table.HeadCell>Account Title</Table.HeadCell>
                <Table.HeadCell>Account No.</Table.HeadCell>
                <Table.HeadCell>Mobile No.</Table.HeadCell>
                <Table.HeadCell>Verification Type</Table.HeadCell>
                <Table.HeadCell>Onboarding Type</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {account &&
                  account.map((account) => (
                    <Table.Row className="bg-white border" key={account.id}>
                      <Table.Cell>{account.nid}</Table.Cell>
                      <Table.Cell>{account.account.title}</Table.Cell>
                      <Table.Cell>{account.account.channelAccountId}</Table.Cell>
                      <Table.Cell>{account.mobile}</Table.Cell>
                      <Table.Cell>{account.verificationType}</Table.Cell>
                      <Table.Cell>{account.onboardingType}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          {isAuthorized(features, '5.1.3') && (
                            <InlineButton
                              icon={<FaEdit />}
                              value="Upgrade"
                              onClick={() => handleUpdate(account.id)}
                              color="bg-yellow-400 hover:bg-yellow-500"
                            />
                          )}

                          <InlineButton
                            disabled={isAccountList}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetails(account.id)}
                            color="bg-green-400 hover:bg-green-500"
                          />
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
              {isAccountLoading ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
          </div>
        )}
      </div>
    </>
  )
}
