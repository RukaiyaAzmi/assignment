import React, { useEffect, useState } from 'react'
import TextInput from '@components/common/TextInputWithLabel'
import Joi from 'joi'
import ButtonCom from '@components/common/Button'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postTpList, updateTpList } from '@config/urls.config'
import { toast } from 'react-toastify'
import SelectBox from '@components/common/SelectBox'
import { ITpData, ITpUpdateRes, ITransactionProfileRes } from '@interfaces/tp.interface'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import router from 'next/router'

const schema: Joi.Schema = Joi.object({
  ekycType: Joi.string().valid('S', 'R').required(),
  channelCode: Joi.string().valid('ABS', 'CBS', 'ICBS', 'EKYC').required(),
  productCategoryCode: Joi.string().valid('S0', 'C0', 'TD', 'RD').required(),
  minLimit: Joi.number().min(0).integer().required(),
  maxLimit: Joi.number().min(0).integer().required(),
  status: Joi.string().valid('A', 'I').required(),
})
interface TpUpdateProps {
  tpId: number
}

export default function TpUpdate({ tpId }: TpUpdateProps): JSX.Element {
  const [tpShow, setTpShow] = useState<ITpData>({
    ekycType: '',
    channelCode: '',
    productCategoryCode: '',
    minLimit: '',
    maxLimit: '',
    status: '',
  })
  const { ok, errors: tpUpdateError } = useFormValidationAsync(schema, tpShow, {
    abortEarly: true,
  })
  const { execute: executeUpdateTp } = useAPIWithToken<ITpUpdateRes>()
  const { isLoading, execute: executeTpList } = useAPIWithToken<ITransactionProfileRes>()

  useEffect(() => {
    fetchTpList()
  }, [])

  //   //************** Show from data *************** *//
  const fetchTpList = async () => {
    try {
      const res = await executeTpList({
        method: 'POST',
        url: postTpList,
        data: { id: tpId },
      })
      const TpData: ITpData = {
        ekycType: res?.data[0].ekycType ?? '',
        channelCode: res?.data[0].channelCode ?? '',
        productCategoryCode: res?.data[0].productCategoryCode ?? '',
        minLimit: res?.data[0].minLimit.toString() ?? '',
        maxLimit: res?.data[0].maxLimit.toString() ?? '',
        status: res?.data[0].status ?? '',
      }
      setTpShow({ ...TpData })
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  //**************** Input fild ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value: string = e.target.value
    setTpShow({
      ...tpShow,
      [e.target.name]: value,
    })
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok) {
      try {
        const res = await executeUpdateTp({
          method: 'PUT',
          url: updateTpList,
          data: {
            id: tpId,
            ekycType: tpShow.ekycType,
            channelCode: tpShow.channelCode,
            productCategoryCode: tpShow.productCategoryCode,
            minLimit: parseInt(tpShow.minLimit),
            maxLimit: parseInt(tpShow.maxLimit),
            status: tpShow.status,
          },
        })
        if (res?.statusCode === 200) {
          toast.success('Update successfully', {
            onOpen: () => router.push('/admin/settings/tp/list'),
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
      <div className="container my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold ">Update Transaction Profile</h1>
        <div>
          <SelectBox
            id="ekycType"
            name="ekycType"
            label="eKYC Type"
            onSelect={onChangeEvent}
            value={tpShow.ekycType}
            options={[
              { key: 'S', value: 'Simplified' },
              { key: 'R', value: 'Regular' },
            ]}
            error={tpUpdateError['ekycType']}
          />
        </div>
        <div>
          <SelectBox
            id="productCategoryCode"
            onSelect={onChangeEvent}
            value={tpShow.productCategoryCode}
            name="productCategoryCode"
            label="Category Name"
            options={[
              { key: 'S0', value: 'Savings Account' },
              { key: 'C0', value: 'Current Account' },
              { key: 'TD', value: 'Term Deposit' },
              { key: 'RD', value: 'Recurring Deposit' },
            ]}
            error={tpUpdateError['productCategoryCode']}
          />
        </div>
        <div>
          <TextInput
            id="minLimit"
            placeholder="Low Limit"
            name="minLimit"
            type="text"
            value={tpShow.minLimit}
            onChange={onChangeEvent}
            label="Low Limit"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={tpUpdateError['minLimit']}
          />
        </div>
        <div>
          <TextInput
            id="maxLimit"
            placeholder="High Limit"
            name="maxLimit"
            type="text"
            value={tpShow.maxLimit}
            onChange={onChangeEvent}
            label="High Limit"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={tpUpdateError['maxLimit']}
          />
        </div>
        <div>
          <SelectBox
            id="channelCode"
            name="channelCode"
            label="Channel Code"
            onSelect={onChangeEvent}
            value={tpShow.channelCode}
            options={[
              { key: 'ABS', value: 'Agent Banking' },
              { key: 'CBS', value: 'Conventional Core Banking' },
              { key: 'ICBS', value: 'Islamic Core Banking' },
              { key: 'EKYC', value: 'EKYC' },
            ]}
            error={tpUpdateError['channelCode']}
          />
        </div>
        <div>
          <SelectBox
            id="status"
            label="Status"
            name="status"
            value={tpShow.status}
            onSelect={onChangeEvent}
            options={[
              { key: 'A', value: 'Active' },
              { key: 'I', value: 'Inactive' },
            ]}
            error={tpUpdateError['status']}
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
