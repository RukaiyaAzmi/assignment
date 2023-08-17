import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import TextArea from '@components/common/TextArea'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import Button from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postProductList, putProduct } from '@config/urls.config'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import SelectBox from '@components/common/SelectBox'
import { ICreateProductRes, IProductUpdate, IUpdateProduct } from '@interfaces/product.interface'

const schema: Joi.Schema = Joi.object({
  channelCode: Joi.string().min(2).valid('ABS', 'CBS', 'ICBS', 'EKYC').required(),
  subChannelCode: Joi.string().min(2).valid('CONVENTIONAL', 'ISLAMIC').required(),
  categoryCode: Joi.string().valid('S0', 'C0', 'TD', 'RD').required(),
  status: Joi.string().valid('A', 'I'),
  name: Joi.string().min(3).message('Please provide a valid Product Name').required(),
  code: Joi.string().min(2).required(),
  description: Joi.string().min(1).required(),
})

interface UpdateProductProps {
  pId: number
}

export default function ProductUpdate({ pId }: UpdateProductProps): JSX.Element {
  const router = useRouter()
  const [productShow, setProductShow] = useState<IUpdateProduct>({
    name: '',
    code: '',
    categoryCode: '',
    subChannelCode: '',
    channelCode: '',
    status: '',
    description: '',
  })
  const { ok, errors: productUpdate } = useFormValidationAsync(schema, productShow, {
    abortEarly: true,
  })
  const { isLoading, execute: productUpdateReq } = useAPIWithToken<IProductUpdate>()
  const { execute: executeProduct } = useAPIWithToken<ICreateProductRes>()

  useEffect(() => {
    fetchProductData()
  }, [])

  const fetchProductData = async () => {
    try {
      const res = await executeProduct({
        method: 'POST',
        url: postProductList,
        data: { id: pId },
      })
      const productDataShow: IUpdateProduct = {
        name: res?.data[0].name ?? '',
        status: res?.data[0].status ?? '',
        description: res?.data[0].description ?? '',
        code: res?.data[0].code ?? '',
        categoryCode: res?.data[0].categoryCode ?? '',
        channelCode: res?.data[0].channelCode ?? '',
        subChannelCode: res?.data[0].subChannelCode ?? '',
      }
      setProductShow({ ...productDataShow })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  //************** Input fild on change  *************** *//
  const onChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value
    setProductShow({
      ...productShow,
      [e.target.name]: value,
    })
  }
  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await productUpdateReq({
          method: 'PUT',
          url: putProduct,
          data: {
            id: pId,
            ...productShow,
          },
        })
        if (res?.statusCode === 200) {
          toast.success('Product Successfully Updated', {
            onOpen: () => router.push('/admin/product/list'),
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
      <div className="container  my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Update Product</h1>
        <SelectBox
          id="channelCode"
          name="channelCode"
          label="Channel Name"
          value={productShow.channelCode}
          onSelect={onChangeEvent}
          options={[
            { key: 'ABS', value: 'Agent Banking' },
            { key: 'CBS', value: 'Conventional Core Banking' },
            { key: 'ICBS', value: 'Islamic Core Banking' },
            { key: 'EKYC', value: 'EKYC' },
          ]}
          error={productUpdate['channelCode']}
        />
        <div>
          <SelectBox
            id="subChannelCode"
            name="subChannelCode"
            label="Sub-Channel Name"
            value={productShow.subChannelCode}
            onSelect={onChangeEvent}
            options={[
              { key: 'CONVENTIONAL', value: 'CONVENTIONAL' },
              { key: 'ISLAMIC', value: 'ISLAMIC' },
            ]}
            error={productUpdate['subChannelCode']}
          />
        </div>
        <div>
          <SelectBox
            id="categoryCode"
            name="categoryCode"
            label="Product Category"
            value={productShow.categoryCode}
            onSelect={onChangeEvent}
            options={[
              { key: 'S0', value: 'Saving Account' },
              { key: 'C0', value: 'Current Account' },
              { key: 'TD', value: 'Term Deposit' },
              { key: 'RD', value: 'Recurring Deposit' },
            ]}
            error={productUpdate['categoryCode']}
          />
        </div>

        <div>
          <SelectBox
            id="status"
            name="status"
            label="Product Status"
            value={productShow.status}
            onSelect={onChangeEvent}
            options={[
              { key: 'A', value: 'Active' },
              { key: 'I', value: 'Inactive' },
            ]}
            error={productUpdate['status']}
          />
        </div>
        <div>
          <TextInput
            id="name"
            placeholder="Product Name"
            value={productShow.name}
            name="name"
            type="text"
            onChange={onChangeEvent}
            label="Product Name"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={productUpdate['name']}
          />
        </div>
        <div>
          <TextInput
            id="code"
            placeholder="Product Code"
            value={productShow.code}
            name="code"
            type="text"
            onChange={onChangeEvent}
            label="Product Code"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={productUpdate['code']}
          />
        </div>
        <div>
          <TextArea
            id="description"
            placeholder="Description"
            name="description"
            rows={4}
            onChange={onChangeEvent}
            value={productShow.description}
            iconUrl="/icon/icon_userid.svg"
            required={true}
            label="Description"
            error={productUpdate['description']}
          />
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
    </>
  )
}
