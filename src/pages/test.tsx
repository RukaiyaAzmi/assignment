import React, { useEffect, useState } from 'react'
import { Table } from 'flowbite-react'

import { useAPIWithToken } from '@hooks/useAPI'
import { postEkycCount } from '@config/urls.config'
import { IEkycCountRes } from '@interfaces/statistics.interface'
import DoughnutChart from '@components/chart/DoughnutChart'
import { toast } from 'react-toastify'
import InlineButton from '@components/common/InlineButton'
import { FaArchive, FaBinoculars, FaEdit } from 'react-icons/fa'
import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import TextInput from '@components/common/TextInput'
import { IpOptions } from 'joi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { setProducts } from '@redux/slices/product.slice'

export default function test() {
  // const [product, setProduct] = useState<any[]>([])
  const [category, setCategory] = useState<IOptionsData[]>([])
  const [option, setOption] = useState('')
  const [verificationType, setVerificationType] = useState<number[]>([])
  const products = useSelector((state: RootState) => state.product.products)
  const dispatch = useDispatch()
  const { execute } = useAPIWithToken<any>()

  useEffect(() => {
    getProducts()
    getCategory()
  }, [])

  const getProducts = async () => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products',
      })
      console.log('pro', pro.products)
      dispatch(setProducts(pro.products))
      // const name: string = pro.products
      // const value: string = pro.products
      // const inputObj: any = {
      //   name,
      //   value,
      // }
      // dispatch(setProduct(inputObj))
      //setProduct(pro.products)
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    getProductByTitle(e.target.value)
  }

  const onSelectChange = async (event: { target: { value: string; name: string } }) => {
    setOption(event.target.value)
    try {
      const pro = await execute({
        method: 'GET',
        url: `https://dummyjson.com/products/category/${event.target.value}`,
      })
      // setProduct(pro.products)
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getProductByTitle = async (title: string) => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products/search',
        params: { q: title },
      })
      // setProduct(pro.products)
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getCategory = async () => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products/categories',
      })
      const itemArr: any = []
      for (let i = 0; i < pro.length; i++) {
        itemArr.push({ key: pro[i], value: pro[i] })
      }
      setCategory(itemArr)
    } catch (error) {
      toast.error('Unknown Error')
    }
  }
  // console.log(product)
  const addToCart = async (id: number) => {
    try {
      const res = await execute({
        method: 'PUT',
        url: `https://dummyjson.com/carts/${id}`,
        data: JSON.stringify({
          merge: true,
          products: [
            {
              id: id,
              quantity: 1,
            },
          ],
        }),
      })
    } catch (error) {
      console.log('error', error)
      toast.error('Unknown error')
    }
  }

  return (
    <div>
      <h1 className="flex justify-center text-2xl text-gray-900 font-bold py-5">List of Products</h1>
      <div className="flex flex-wrap justify-end items-center w-full">
        <div className="sm:text-xs px-3 w-64">
          <TextInput
            id="roleId"
            placeholder="Search by ID or Role"
            name="roleId"
            type="text"
            onChange={handleChange}
            //value={value.val}
            iconUrl="/icon/icon_search.svg"
          />
        </div>
        <div className="sm:text-xs px-3 w-64">
          <SelectBox id="dropdown" name="dropdown" value={option} onSelect={onSelectChange} options={category} />
        </div>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Brand</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Thumbnail</Table.HeadCell>
          <Table.HeadCell>Available Stock</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {products &&
            products.map((product) => (
              <Table.Row className="bg-white border" key={product.id}>
                <Table.Cell>{product.title}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>{product.price}</Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>{<img src={product.thumbnail} width={60} alt="Thumbnail" />}</Table.Cell>
                <Table.Cell>{product.stock}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1 justify-center items-center">
                    <InlineButton
                      icon={<FaEdit />}
                      value="Add"
                      onClick={() => addToCart(product.id)}
                      color="bg-yellow-400 hover:bg-yellow-500"
                    />
                    <InlineButton
                      // disabled={isLoading}
                      icon={<FaBinoculars />}
                      value="Remove"
                      ///onClick={() => handleShowDetailsModal(role.id)}
                      color="bg-green-400 hover:bg-green-500"
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
