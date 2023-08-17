import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { FaEdit, FaArchive, FaBinoculars, FaEyeSlash } from 'react-icons/fa'
import { useAPIWithToken } from '@hooks/useAPI'
import { deleteProductList, postProductList } from '@config/urls.config'
import TableTooltip from '@components/common/TableTooltip'
import { FcApproval } from 'react-icons/fc'
import { AiOutlineRollback } from 'react-icons/ai'
import { CiCircleAlert } from 'react-icons/ci'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { isAuthorized } from '@utils/auth.utils'
import SelectBox from '@components/common/SelectBox'
import InlineButton from '@components/common/InlineButton'
import { IProductData, IProductListRes, IProductreDetails } from '@interfaces/product.interface'
import ProductView from '@components/product/ProductView'

export default function ProductList() {
  const router = useRouter()
  const [product, setProduct] = useState<IProductData[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<{ status: boolean; current: number }>({
    status: false,
    current: -1,
  })
  const [productView, setTpModal] = useState<IProductreDetails[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const features = useSelector((state: RootState) => state.user.features)
  const { isLoading: isDeleteLoading, execute: executeDelete } = useAPIWithToken()
  const { isLoading: isProductList, execute: executeProductList } = useAPIWithToken<IProductListRes>()
  const { isLoading, execute: executeProductWithId } = useAPIWithToken<IProductListRes>()

  useEffect(() => {
    fetchProductList()
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
      const res = await executeProductWithId({
        method: 'POST',
        url: postProductList,
        data: { id: id },
      })
      setTpModal(res ? res.data : [])
      setShowDetailsModal(true)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleDelete = async (id: number) => {
    const newProduct = product?.filter((r) => r.id !== id)
    try {
      const res = await executeDelete({
        method: 'DELETE',
        url: deleteProductList,
        data: { id: id },
      })
      if (res) toast.success('Successfully Deleted')
      setProduct(newProduct)
      setShowDeleteModal({ status: false, current: -1 })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleUpdateModal = (id: number) => {
    router.push({
      pathname: `/admin/product/update`,
      query: {
        id: id,
      },
    })
  }

  const handleOptionChange = (event: { target: { value: string; name: string } }) => {
    searchCategoryCode(event.target.value)
  }

  const fetchProductList = async () => {
    try {
      const res = await executeProductList({
        method: 'POST',
        url: postProductList,
      })
      setProduct(res ? res.data : [])
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const searchCategoryCode = async (option: string) => {
    try {
      const res = await executeProductList({
        method: 'POST',
        url: postProductList,
        data: { categoryCode: option },
      })
      setProduct(res ? res.data : [])
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleChannelChange = (event: { target: { value: string; name: string } }) => {
    searchChannelName(event.target.value)
  }

  const searchChannelName = async (options: string) => {
    try {
      const res = await executeProductList({
        method: 'POST',
        url: postProductList,
        data: { channelCode: options },
      })
      setProduct(res ? res.data : [])
    } catch (error) {
      toast.error('Unknown error')
    }
  }
  return (
    <>
      <div className="container m-auto mt-8 overflow-x-auto">
        <div className="flex justify-end">
          <div className="flex  flex-wrap  justify-end items-center w-full">
            <div className="sm:text-xs px-3 w-64">
              <SelectBox
                id="dropdown"
                name="dropdown"
                selectText="Channel Name"
                onSelect={handleChannelChange}
                options={[
                  { key: 'ABS', value: 'Agent Banking' },
                  { key: 'CBS', value: 'Conventional Core Banking' },
                  { key: 'ICBS', value: 'Islamic Core Banking' },
                ]}
              />
            </div>

            <div className="sm:text-xs px-3 w-64">
              <SelectBox
                id="dropdown"
                onSelect={handleOptionChange}
                name="dropdown"
                selectText="Category Name"
                options={[
                  { key: 'S0', value: 'Savings Account' },
                  { key: 'C0', value: 'Current Account' },
                  { key: 'TD', value: 'Term Deposit' },
                  { key: 'RD', value: 'Recurring Deposit' },
                ]}
              />
            </div>
          </div>
        </div>

        {product.length > 0 ? (
          <div className="py-4">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>Product Name</Table.HeadCell>
                <Table.HeadCell>Product Status</Table.HeadCell>
                <Table.HeadCell>Product Code</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell className="text-center">Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {product.map((productShow) => (
                  <Table.Row className="bg-white border" key={productShow.id}>
                    <Table.Cell>{productShow.name}</Table.Cell>
                    <Table.Cell>{getFullStatusIcon(productShow.status)}</Table.Cell>
                    <Table.Cell>{productShow.code}</Table.Cell>
                    <Table.Cell>{productShow.description}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1 justify-center items-center">
                        {isAuthorized(features, '7.3') && (
                          <InlineButton
                            icon={<FaEdit />}
                            value="Update"
                            onClick={() => handleUpdateModal(productShow.id)}
                            color="bg-yellow-400 hover:bg-yellow-500"
                          />
                        )}

                        <InlineButton
                          disabled={isLoading}
                          icon={<FaBinoculars />}
                          value="Details"
                          onClick={() => handleShowDetailsModal(productShow.id)}
                          color="bg-green-400 hover:bg-green-500"
                        />
                        {isAuthorized(features, '7.4') && (
                          <InlineButton
                            icon={<FaArchive />}
                            value="Delete"
                            onClick={() => handleShowDeleteModal(productShow.id)}
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
              {isProductList ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                'No Data Found'
              )}
            </h3>
            {isProductList ? (
              ''
            ) : (
              <InlineButton
                icon={<AiOutlineRollback />}
                onClick={fetchProductList}
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
              <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this Product?</h3>
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
            <p className="ml-3 my-2">Product Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">
            {productView.length && <ProductView productList={productView[0]} />}
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

export function getFullStatusIcon(status: string) {
  if (status === 'A') return <TableTooltip content="Approved" icon={<FcApproval />} />
  else if (status === 'I') return <TableTooltip content="Inactive" icon={<FaEyeSlash className="text-red-400" />} />
  else return
}
