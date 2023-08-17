import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaEdit, FaArchive, FaBinoculars, FaEyeSlash, FaSearch } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { postAccountDiscard, postAccountGet, postAccountReopen } from '@config/urls.config'
import TableTooltip from '@components/common/TableTooltip'
import { FcApproval } from 'react-icons/fc'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdPending } from 'react-icons/md'
import { CiCircleAlert } from 'react-icons/ci'
import { BiBlock } from 'react-icons/bi'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import TextInput from '@components/common/TextInput'
import SelectBox from '@components/common/SelectBox'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import InlineButton from '@components/common/InlineButton'
import CustomPagination from '@components/common/CustomPagination'
import { IAccount, IAccountData, IAccountDiscard, IAccountReopenRes, IAccountRes } from '@interfaces/account.interface'
import AccountView from '@components/account/AccountView'

const schema: Joi.Schema = Joi.object({
  id: Joi.string().guid(),
})

export default function List(): JSX.Element {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const [accountDetails, setAccountDetails] = useState<IAccount[]>([])
  const [accountId, setAccountId] = useState({
    id: '',
  })
  const [payloadData, setPayloadData] = useState<IAccountData>({
    channelCode: '',
    productCategoryCode: '',
    status: '',
    type: '',
  })

  const [pagination, setPagination] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const [showReopenModal, setShowReopenModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })

  const features = useSelector((state: RootState) => state.user.features)

  const { isLoading: isDeleteLoading, execute: executeDiscardAccount } = useAPIWithToken<IAccountDiscard>()
  const { isLoading: isAccountLoading, execute: executeAccountSearch } = useAPIWithToken<IAccountRes>()
  const { isLoading: isReopenLoading, execute: executeAccountReopen } = useAPIWithToken<IAccountReopenRes>()

  const { ok: accountIdOk } = useFormValidationAsync(schema, accountId, {
    abortEarly: true,
  })

  useEffect(() => {
    searchByDropDown()
  }, [currentPage])

  const handleDeleteModalCancel = () => {
    setShowDeleteModal({
      status: false,
      current: -1,
    })
  }

  const handleReopenModalCancel = () => {
    setShowReopenModal({
      status: false,
      current: -1,
    })
  }

  const handleShowDeleteModal = (id: number) => {
    setShowDeleteModal({ status: true, current: id })
  }

  const handleShowReopenModal = (id: number) => {
    setShowReopenModal({ status: true, current: id })
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPayloadData({ type: '', productCategoryCode: '', status: '', channelCode: '' })
    setAccountId({ id: e.target.value })
  }

  const onSelectChange = (event: { target: { value: string; name: string } }) => {
    setAccountId({ id: '' })
    if (event.target.name === 'type') {
      setPayloadData({ ...payloadData, type: event.target.value })
    } else if (event.target.name === 'channelCode') {
      setPayloadData({ ...payloadData, channelCode: event.target.value })
    } else if (event.target.name === 'status') {
      setPayloadData({ ...payloadData, status: event.target.value })
    } else {
      setPayloadData({ ...payloadData, productCategoryCode: event.target.value })
    }
    searchByDropDown(event.target.name, event.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleShowDetailsModal = async (id: number) => {
    try {
      const accountDetailsRes = await executeAccountSearch({
        method: 'POST',
        url: `${postAccountGet}/1`,
        data: { id: id },
      })
      if (accountDetailsRes?.statusCode === 200) {
        setShowDetailsModal(true)
        setAccountDetails(accountDetailsRes?.data.accounts ? accountDetailsRes.data.accounts : [])
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await executeDiscardAccount({
        method: 'POST',
        url: postAccountDiscard,
        data: { id: id },
      })
      if (res?.statusCode == 200) {
        toast.success('Successfully Deleted')
        setShowDeleteModal({ status: false, current: -1 })
        accountId.id ? search() : searchByDropDown()
      } else {
        toast.error('Failed to Delete')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const reOpen = async (id: number) => {
    try {
      setPagination(false)
      const res = await executeAccountReopen({
        method: 'POST',
        url: postAccountReopen,
        data: { id: id },
      })
      setShowReopenModal({ status: false, current: -1 })
      if (res?.data.channelResponse == 'true') {
        toast.success('Account Re-open Successful')
        accountId.id ? search() : searchByDropDown()
      } else {
        toast.error('Account Re-open Failed!')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const search = async () => {
    try {
      setPagination(false)
      if (accountIdOk) {
        const res = await executeAccountSearch({
          method: 'POST',
          url: `${postAccountGet}/${currentPage}`,
          data: { id: accountId.id },
        })
        setAccounts(res?.data.accounts ? res.data.accounts : [])
      } else {
        toast.error('Please provide valid ID')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  const searchByDropDown = async (name?: string, value?: string) => {
    try {
      setPagination(true)
      const payload = {} as { type: string; channelCode: string; productCategory: string; status: string }
      if (payloadData.type !== 'none' && payloadData.type !== '') {
        payload['type'] = payloadData.type
      }
      if (payloadData.channelCode !== 'none' && payloadData.channelCode !== '') {
        payload['channelCode'] = payloadData.channelCode
      }
      if (payloadData.productCategoryCode !== 'none' && payloadData.productCategoryCode !== '') {
        payload['productCategoryCode'] = payloadData.productCategoryCode
      }
      if (payloadData.status !== 'none' && payloadData.status !== '') {
        payload['status'] = payloadData.status
      }

      if (name && value !== 'none') payload[name] = value

      if (name && value === 'none') delete payload[name]

      const res = await executeAccountSearch({
        method: 'POST',
        url: `${postAccountGet}/${currentPage}`,
        data: payload,
      })
      setAccounts(res?.data.accounts ? res.data.accounts : [])
      setTotalPage(res ? res.data.totalPages : 1)
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Account Search</h1>
        <div className="flex flex-wrap justify-center items-center w-full mt-5">
          <div className="sm:text-xs pl-3 pr-4 w-3/4">
            <TextInput
              id="id"
              placeholder="Account ID"
              name="id"
              type="text"
              onChange={handleChange}
              value={accountId.id}
              iconUrl="/icon/icon_search.svg"
            />
          </div>
          <div className=" sm:text-md w-64 justify-start pl-1">
            <button
              type="submit"
              className="flex justify-center gap-1 py-3 mb-5 mt-5 pl-1 pr-4 w-60 bg-indigo-400 rounded-lg hover:bg-indigo-500 text-white font-semibold"
              onClick={() => search()}
              disabled={isAccountLoading}
              value="Find"
            >
              <span className="mt-1">
                <FaSearch />
              </span>
              <span>Find</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center items-center w-full">
          <div className="sm:text-xs lg:pl-3 w-60">
            <SelectBox
              id="type"
              onSelect={onSelectChange}
              value={payloadData.type}
              name="type"
              selectText="Account Type"
              options={[
                { key: 'S', value: 'Single Account' },
                { key: 'J', value: 'Joint Account' },
                { key: 'none', value: 'None' },
              ]}
            />
          </div>

          <div className="sm:text-xs w-60">
            <SelectBox
              id="channelCode"
              onSelect={onSelectChange}
              value={payloadData.channelCode}
              name="channelCode"
              selectText="Channel Code"
              options={[
                { key: 'ABS', value: 'Agent Banking' },
                { key: 'CBS', value: 'Conventional Core Banking' },
                { key: 'ICBS', value: 'Islamic Core Banking' },
                { key: 'none', value: 'None' },
              ]}
            />
          </div>

          <div className="sm:text-xs w-60">
            <SelectBox
              id="status"
              onSelect={onSelectChange}
              value={payloadData.status}
              name="status"
              selectText="Account Status"
              options={[
                { key: 'P', value: 'Pending' },
                { key: 'A', value: 'Approved' },
                { key: 'R', value: 'Rejected' },
                { key: 'D', value: 'Deleted' },
                { key: 'none', value: 'None' },
              ]}
            />
          </div>

          <div className="sm:text-xs lg:pr-2 w-60">
            <SelectBox
              id="productCategoryCode"
              onSelect={onSelectChange}
              value={payloadData.productCategoryCode}
              name="productCategoryCode"
              selectText="Product Category"
              options={[
                { key: 'S0', value: 'Savings Account' },
                { key: 'C0', value: 'Current Account' },
                { key: 'RD', value: 'Recurring Deposit' },
                { key: 'TD', value: 'Term Deposit' },
                { key: 'none', value: 'None' },
              ]}
            />
          </div>
        </div>

        {accounts.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>Account Title</Table.HeadCell>
                <Table.HeadCell>Channel Code</Table.HeadCell>
                <Table.HeadCell>Product Code</Table.HeadCell>
                <Table.HeadCell>Branch Or Agent Point Code</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {accounts &&
                  accounts.map((account) => (
                    <Table.Row className="bg-white border" key={account.id}>
                      <Table.Cell>{account.title}</Table.Cell>
                      <Table.Cell>{account.channelCode}</Table.Cell>
                      <Table.Cell>{account.productCode}</Table.Cell>
                      <Table.Cell>{account.branchOrAgentPointCode}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{getViewTooltip(account.status)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1 justify-center items-center">
                          {isAuthorized(features, '8.2') && (
                            <InlineButton
                              icon={<FaEdit />}
                              value="Reopen"
                              onClick={() => handleShowReopenModal(account.id)}
                              color="bg-yellow-400 hover:bg-yellow-500"
                            />
                          )}

                          <InlineButton
                            disabled={isAccountLoading}
                            icon={<FaBinoculars />}
                            value="Details"
                            onClick={() => handleShowDetailsModal(account.id)}
                            color="bg-green-400 hover:bg-green-500"
                          />
                          {isAuthorized(features, '8.3') && (
                            <InlineButton
                              icon={<FaArchive />}
                              value="Discard"
                              onClick={() => handleShowDeleteModal(account.id)}
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
        {pagination &&
          (totalPage > 1 ? (
            <div className=" p-3 sm:w-2/4 m-auto mb-10">
              <CustomPagination page={currentPage} totalPage={totalPage} onPagination={handlePageChange} />
            </div>
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
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this account?</h3>
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
        {/* <!--- Reopen Modal Show ---> */}
        <Modal
          show={showReopenModal.status}
          size="md"
          onClose={handleReopenModalCancel}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <CiCircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to re-open this Account?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  disabled={isReopenLoading}
                  gradientDuoTone="pinkToOrange"
                  outline
                  onClick={() => reOpen(showReopenModal.current)}
                >
                  {`Yes, I'm sure`}
                </Button>
                <Button color="gray" onClick={handleReopenModalCancel}>
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
            <p className="ml-3 my-2">Account Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">
            {accountDetails.length && <AccountView account={accountDetails[0]} />}
          </Modal.Body>
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
