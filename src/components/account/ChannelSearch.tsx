import React, { useState } from 'react'
import { Spinner, Table } from 'flowbite-react'
import { FaBinoculars, FaSearch } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { postChannelGet } from '@config/urls.config'
import { toast } from 'react-toastify'
import TextInput from '@components/common/TextInput'
import SelectBox from '@components/common/SelectBox'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import InlineButton from '@components/common/InlineButton'
import { IApplicants, IChannelData, IChannelRes } from '@interfaces/account.interface'
import router from 'next/router'

const schemaDropdown: Joi.Schema = Joi.object({
  channelCode: Joi.string().required(),
  channelAccountId: Joi.string().required(),
})

export default function ChannelSearch(): JSX.Element {
  const [accounts, setAccounts] = useState<IApplicants[]>([])
  const [data, setData] = useState<IChannelData>({
    channelCode: '',
    channelAccountId: '',
  })

  const { isLoading: isChannelLoading, execute: executeChannelSearch } = useAPIWithToken<IChannelRes>()

  const { ok } = useFormValidationAsync(schemaDropdown, data, {
    abortEarly: true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, channelAccountId: e.target.value })
  }

  const onSelectChange = (e: { target: { value: string; name: string } }) => {
    setData({ ...data, channelCode: e.target.value })
  }

  const handleShowDetails = async (id: string) => {
    router.push({
      pathname: `/admin/full-profile/`,
      query: {
        id: id,
      },
    })
  }

  const search = async () => {
    try {
      if (ok) {
        const res = await executeChannelSearch({
          method: 'POST',
          url: postChannelGet,
          data: { channelAccountId: data.channelAccountId, channelCode: data.channelCode },
        })
        setAccounts(res?.data ? res.data.applicants : [])
      } else {
        toast.error('Please provide all information')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Channel Search</h1>
        <div className="flex flex-wrap justify-end items-center my-5">
          <div className="sm:text-xs px-1 w-64">
            <SelectBox
              id="channelCode"
              onSelect={onSelectChange}
              value={data.channelCode}
              name="channelCode"
              selectText="Channel Code"
              options={[
                { key: 'ABS', value: 'Agent Banking' },
                { key: 'CBS', value: 'Conventional Core Banking' },
                { key: 'ICBS', value: 'Islamic Core Banking' },
              ]}
            />
          </div>
          <div className="sm:text-xs px-1 w-64">
            <TextInput
              id="channelAccountId"
              placeholder="Channel Account Number"
              name="channelAccountId"
              type="text"
              onChange={handleChange}
              value={data.channelAccountId}
              iconUrl="/icon/icon_search.svg"
            />
          </div>
          <div className="sm:text-md px-1 w-28">
            <button
              type="submit"
              className="flex justify-center gap-1 py-3 mb-5 mt-5 w-full bg-indigo-400 rounded-lg hover:bg-indigo-500 text-white font-semibold"
              onClick={() => search()}
              value="Find"
            >
              <span className="mt-1">
                <FaSearch />
              </span>
              <span>Find</span>
            </button>
          </div>
        </div>

        {accounts.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>NID</Table.HeadCell>
                <Table.HeadCell>Mobile No</Table.HeadCell>
                <Table.HeadCell>Verification Type</Table.HeadCell>
                <Table.HeadCell>Onboarding Type</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {accounts &&
                  accounts.map((account) => (
                    <Table.Row className="bg-white border" key={account.id}>
                      <Table.Cell>{account.nid}</Table.Cell>
                      <Table.Cell>{account.mobile}</Table.Cell>
                      <Table.Cell>{account.verificationType}</Table.Cell>
                      <Table.Cell>{account.onboardingType}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2 justify-center items-center">
                          <InlineButton
                            disabled={isChannelLoading}
                            icon={<FaBinoculars />}
                            value="Full Profile"
                            onClick={() => handleShowDetails(account.id)}
                            color="bg-green-400 hover:bg-green-500"
                            width="w-32"
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
              {isChannelLoading ? (
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
