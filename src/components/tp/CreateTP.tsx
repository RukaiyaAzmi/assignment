import React, { useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import Joi from 'joi'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postTPCreate } from '@config/urls.config'
import { toast } from 'react-toastify'
import SelectBox from '@components/common/SelectBox'
import { ITpCreate, ITpCreateRes } from '@interfaces/tp.interface'
import router from 'next/router'
import { useFormValidationAsync } from '@hooks/useFormValidation'

const schema: Joi.Schema = Joi.object({
  ekycType: Joi.string().required(),
  productCategoryCode: Joi.string().required(),
  minLimit: Joi.number().integer().min(0).required(),
  maxLimit: Joi.number().integer().greater(Joi.ref('minLimit')).required(),
  channelCode: Joi.string().required(),
  status: Joi.string().required(),
})

export default function CreateTP(): JSX.Element {
  const [createTP, setCreateTP] = useState<ITpCreate>({
    ekycType: '',
    productCategoryCode: '',
    channelCode: '',
    minLimit: '',
    maxLimit: '',
    status: '',
  })

  const { isLoading, execute: userCreate } = useAPIWithToken<ITpCreateRes>()

  const { ok: userCheckOk, errors: tpCreateError } = useFormValidationAsync(schema, createTP, {
    abortEarly: true,
  })

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string | boolean = e.target.value
    setCreateTP({
      ...createTP,
      [e.target.name]: value,
    })
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (userCheckOk) {
      try {
        userCreate({
          method: 'POST',
          url: postTPCreate,
          data: {
            ekycType: createTP.ekycType,
            channelCode: createTP.channelCode,
            productCategoryCode: createTP.productCategoryCode,
            minLimit: parseInt(createTP.minLimit),
            maxLimit: parseInt(createTP.maxLimit),
            status: createTP.status,
          },
        }).then(() => {
          toast.success('Created successfully', {
            onOpen: () => router.push('/admin/settings/tp/list'),
          })
        })
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
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Create Transaction Profile</h1>
        <SelectBox
          id="ekycType"
          name="ekycType"
          label="eKYC Type"
          onSelect={onChangeEvent}
          value={createTP.ekycType}
          options={[
            { key: 'S', value: 'Simplified' },
            { key: 'R', value: 'Regular' },
          ]}
          error={tpCreateError['ekycType']}
        />
        <SelectBox
          id="productCategoryCode"
          name="productCategoryCode"
          label="Product Category"
          onSelect={onChangeEvent}
          value={createTP.productCategoryCode}
          options={[
            { key: 'S0', value: 'Savings Account' },
            { key: 'C0', value: 'Current Account' },
            { key: 'TD', value: 'Term Deposit' },
            { key: 'RD', value: 'Recurring Deposit' },
          ]}
          error={tpCreateError['productCategoryCode']}
        />
        <div>
          <TextInput
            id="minLimit"
            placeholder="Low Limit"
            name="minLimit"
            type="text"
            onChange={onChangeEvent}
            label="Low Limit"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={tpCreateError['minLimit']}
          />
        </div>
        <div>
          <TextInput
            id="maxLimit"
            placeholder="High Limit"
            name="maxLimit"
            type="text"
            onChange={onChangeEvent}
            label="High Limit"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={tpCreateError['maxLimit']}
          />
        </div>
        <SelectBox
          id="channelCode"
          name="channelCode"
          label="Channel Name"
          onSelect={onChangeEvent}
          value={createTP.channelCode}
          options={[
            { key: 'ABS', value: 'Agent Banking' },
            { key: 'CBS', value: 'Conventional Core Banking' },
            { key: 'ICBS', value: 'Islamic Core Banking' },
            { key: 'EKYC', value: 'eKYC' },
          ]}
          error={tpCreateError['channelCode']}
        />

        <SelectBox
          id="status"
          name="status"
          label="Status"
          onSelect={onChangeEvent}
          value={createTP.status}
          options={[
            { key: 'A', value: 'Active' },
            { key: 'I', value: 'Inactive' },
          ]}
          error={tpCreateError['status']}
        />

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
