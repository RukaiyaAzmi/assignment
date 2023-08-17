import React, { useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Joi from 'joi'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postProductCreate } from '@config/urls.config'
import { toast } from 'react-toastify'
import SelectBox from '@components/common/SelectBox'
import { ICreateProduct, ICreateProductRes } from '@interfaces/product.interface'
import TextArea from '@components/common/TextArea'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  channelCode: Joi.string().min(2).valid('ABS', 'CBS', 'ICBS', 'EKYC').required(),
  subChannelCode: Joi.string().min(2).valid('CONVENTIONAL', 'ISLAMIC').required(),
  categoryCode: Joi.string().valid('S0', 'C0', 'TD', 'RD').required(),
  status: Joi.string().valid('A', 'I'),
  name: Joi.string().min(3).message('Please provide a valid Product Name').required(),
  code: Joi.string().min(2).required(),
  description: Joi.string().min(1).required(),
})

export default function CreateProduct(): JSX.Element {
  const [createProduct, setCreateProduct] = useState<ICreateProduct>({
    name: '',
    channelCode: '',
    subChannelCode: '',
    code: '',
    categoryCode: '',
    status: '',
    description: '',
  })

  const { isLoading, execute: productCreate } = useAPIWithToken<ICreateProductRes>()

  const { ok, errors: userCreateError } = useFormValidationAsync(schema, createProduct, {
    abortEarly: true,
  })
  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value: string | boolean = e.target.value

    if (value === 'true') {
      setCreateProduct({
        ...createProduct,
        [e.target.name]: true,
      })
    } else if (value === 'false') {
      setCreateProduct({
        ...createProduct,
        [e.target.name]: false,
      })
    } else {
      setCreateProduct({
        ...createProduct,
        [e.target.name]: value,
      })
    }
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await productCreate({
          method: 'POST',
          url: postProductCreate,
          data: {
            ...createProduct,
          },
        })
        if (res?.statusCode === 201) {
          toast.success('Product created successfully', {
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
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Create Product</h1>
        <div>
          <SelectBox
            id="channelCode"
            name="channelCode"
            label="Channel Name"
            value={createProduct.channelCode}
            onSelect={onChangeEvent}
            options={[
              { key: 'ABS', value: 'Agent Banking' },
              { key: 'CBS', value: 'Conventional Core Banking' },
              { key: 'ICBS', value: 'Islamic Core Banking' },
            ]}
            error={userCreateError['channelCode']}
          />
        </div>
        <div>
          <SelectBox
            id="subChannelCode"
            name="subChannelCode"
            label="Sub-Channel Name"
            value={createProduct.subChannelCode}
            onSelect={onChangeEvent}
            options={[
              { key: 'CONVENTIONAL', value: 'CONVENTIONAL' },
              { key: 'ISLAMIC', value: 'ISLAMIC' },
            ]}
            error={userCreateError['subChannelCode']}
          />
        </div>

        <div>
          <SelectBox
            id="categoryCode"
            name="categoryCode"
            label="Product Category"
            value={createProduct.categoryCode}
            onSelect={onChangeEvent}
            options={[
              { key: 'S0', value: 'Saving Account' },
              { key: 'C0', value: 'Current Account' },
              { key: 'TD', value: 'Term Deposit' },
              { key: 'RD', value: 'Recurring Deposit' },
            ]}
            error={userCreateError['categoryCode']}
          />
        </div>

        <div>
          <SelectBox
            id="status"
            name="status"
            label="Product Status"
            value={createProduct.status}
            onSelect={onChangeEvent}
            options={[
              { key: 'A', value: 'Active' },
              { key: 'I', value: 'Inactive' },
            ]}
            error={userCreateError['status']}
          />
        </div>
        <div>
          <TextInput
            id="name"
            placeholder="Product Name"
            name="name"
            type="text"
            onChange={onChangeEvent}
            label="Product Name"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['name']}
          />
        </div>
        <div>
          <TextInput
            id="code"
            placeholder="Product Code"
            name="code"
            type="text"
            onChange={onChangeEvent}
            label="Product Code"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={userCreateError['code']}
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
            label="Description"
            error={userCreateError['description']}
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
          <ButtonCom id="submit" label="Submit" onClick={onSubmit} disable={isLoading} />
        </div>
      </div>
    </>
  )
}
