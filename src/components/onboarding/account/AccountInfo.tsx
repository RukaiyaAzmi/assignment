import React, { useEffect, useState } from 'react'
import { useAPIWithToken } from '@hooks/useAPI'
import { Spinner } from 'flowbite-react'
import { postEkycTypeGet, postProductGet, putEkycTemp } from '@config/urls.config'
import { toast } from 'react-toastify'
import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import { IGetEkycTypeRes, IProductGetRes, IProductListData, ITempDataRes } from '@interfaces/onboarding.interface'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import {
  increment,
  setAccount,
  setApplicant,
  setBranchCode,
  setEkycType,
  setProductCodeEmpty,
} from '@redux/slices/ekyc.slice'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import Button from '@components/common/Button'
import Verification from '@components/onboarding/nid-verification/Verification'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'

const schema: Joi.Schema = Joi.object({
  channelCode: Joi.string().valid('ABS', 'CBS', 'ICBS', 'EKYC').min(1).required(),
  productType: Joi.when('channelCode', {
    is: 'ABS',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  productCategoryCode: Joi.string().valid('S0', 'C0', 'TD', 'RD').min(1).required(),
  productCode: Joi.string().min(1).required(),
  transactionOrMaturityAmount: Joi.number().min(1).required(),
})

export default function AccountInfo(): JSX.Element {
  const [productList, setProduct] = useState<IOptionsData[]>([])
  const [subChannel, setSubChannel] = useState(false)
  const [isFinger, setIsFinger] = useState<boolean>(false)
  const [isFace, setIsFace] = useState<boolean>(false)
  const [showTenor, setShowTenor] = useState(false)
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.ekyc.account)
  const applicant = useSelector((state: RootState) => state.ekyc.applicant)
  const ekycType = useSelector((state: RootState) => state.ekyc.ekycType)
  const stepType = useSelector((state: RootState) => state.ekyc.stepType)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)
  const branchOrAgentPointCode = useSelector((state: RootState) => state.user.currentBranchOrAgentPointCode)
  const { ok, errors } = useFormValidationAsync(
    schema,
    account,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { execute: executeProductList } = useAPIWithToken<IProductGetRes>()
  const { execute: executeEkycType } = useAPIWithToken<IGetEkycTypeRes>()

  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  useEffect(() => {
    dispatch(setBranchCode(branchOrAgentPointCode))
  }, [])

  useEffect(() => {
    if (account.productCategoryCode !== '') {
      getProductName(account.productCategoryCode, account.channelCode)
      dispatch(setProductCodeEmpty())
    }
  }, [account.productCategoryCode])

  useEffect(() => {
    if (applicant.verificationType === 'FACE') {
      setIsFace(true)
      setIsFinger(false)
    } else if (applicant.verificationType === 'FINGER') {
      setIsFace(false)
      setIsFinger(true)
    }
  }, [])

  useEffect(() => {
    account.channelCode === 'ABS' ? setSubChannel(true) : setSubChannel(false)
  }, [])

  //**************** Input field ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name
    const value = e.target.value
    const inputObj = {
      name,
      value,
    }
    dispatch(setAccount(inputObj))
    if (e.target.name === 'productCategoryCode') {
      value === 'TD' || value === 'RD' ? setShowTenor(true) : setShowTenor(false)
    }
  }

  //**************** Submit button ************** */
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (ok && applicant.verificationType != '') {
      try {
        const res = await executeEkycType({
          method: 'POST',
          url: postEkycTypeGet,
          data: {
            channelCode: account.channelCode,
            productCategoryCode: account.productCategoryCode,
            amount: Number(account.transactionOrMaturityAmount),
          },
        })
        if (res?.data.ekycType) {
          if (ekycType === '') {
            dispatch(setEkycType(res.data.ekycType))
          } else if (stepType === 'I' && ekycType !== res.data.ekycType) {
            toast.error(`You are not allowed to open ${ekycType === 'R' ? 'Regular' : 'Simplified'} account`)
            return
          } else if (stepType === 'D' && ekycType !== res.data.ekycType) {
            toast.error(`You are not allowed to open ${ekycType === 'R' ? 'Regular' : 'Simplified'} account`)
            return
          } else {
            dispatch(setEkycType(res.data.ekycType))
          }
        } else {
          toast.error('Transaction Profile is Not Configured Properly')
          return
        }

        const tempRes = await executeTempData({
          method: 'PUT',
          url: putEkycTemp,
          params: {
            id: tempStorageId,
          },
          data: {
            data: {
              step: step + 1,
              ekycType: res?.data.ekycType,
              account: {
                ...account,
                branchOrAgentPointCode: branchOrAgentPointCode,
              },
              applicant: applicant,
            },
          },
        })

        if (tempRes) {
          dispatch(increment())
        }
      } catch (error) {
        toast.error('Unknown error')
      }
    } else {
      toast.error('Please provide valid information')
    }
  }

  const getProductName = async (product: string, channel: string) => {
    try {
      const res = await executeProductList({
        method: 'POST',
        url: postProductGet,
        data: {
          categoryCode: product,
          channelCode: channel,
          status: 'A',
        },
      })

      const products: IOptionsData[] = []
      res?.data.forEach((d: IProductListData) => products.push({ key: d.code, value: d.name }))
      setProduct(products)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleFingerprintVerification = () => {
    setIsFinger(true)
    setIsFace(false)
    const data = {
      name: 'verificationType',
      value: 'FINGER',
    }
    dispatch(setApplicant(data))
  }

  const handleFaceVerification = () => {
    setIsFinger(false)
    setIsFace(true)
    const data = {
      name: 'verificationType',
      value: 'FACE',
    }
    dispatch(setApplicant(data))
  }

  return (
    <>
      <OnboardingInputLayout title="Account Information">
        <>
          <SelectBox
            id="channelCode"
            name="channelCode"
            label="Channel Name"
            onSelect={onChangeEvent}
            value={account.channelCode}
            options={[
              { key: 'ABS', value: 'Agent Banking' },
              { key: 'CBS', value: 'Conventional Core Banking' },
              { key: 'ICBS', value: 'Islamic Core Banking' },
              { key: 'EKYC', value: 'eKYC' },
            ]}
            disabled={true}
            error={errors['channelCode']}
          />
          {subChannel && (
            <SelectBox
              id="productType"
              name="productType"
              label="Sub Channel Name"
              value={account.productType}
              onSelect={onChangeEvent}
              options={[
                { key: 'CONVENTIONAL', value: 'Conventional' },
                { key: 'ISLAMIC', value: 'Islamic' },
              ]}
              error={errors['productType']}
            />
          )}
          <SelectBox
            id="productCategoryCode"
            name="productCategoryCode"
            label="Product Category"
            onSelect={onChangeEvent}
            value={account.productCategoryCode}
            options={[
              { key: 'S0', value: 'Savings Account' },
              { key: 'C0', value: 'Current Account' },
              { key: 'TD', value: 'Term Deposit' },
              { key: 'RD', value: 'Recurring Deposit' },
            ]}
            error={errors['productCategoryCode']}
          />
          <SelectBox
            id="productCode"
            name="productCode"
            label="Product Name"
            onSelect={onChangeEvent}
            value={account.productCode}
            options={productList}
            error={errors['productCode']}
          />
          <TextInputWithLabel
            id="transactionOrMaturityAmount"
            placeholder="Transaction Limit"
            type="number"
            name="transactionOrMaturityAmount"
            onChange={onChangeEvent}
            value={account.transactionOrMaturityAmount}
            label="Transaction Limit"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={errors['transactionOrMaturityAmount']}
          />
          {showTenor && (
            <SelectBox
              id="tenor"
              name="tenor"
              label="Tenor"
              onSelect={onChangeEvent}
              value={account.tenor}
              options={[
                { key: '3', value: '3 months' },
                { key: '6', value: '6 months' },
                { key: '9', value: '9 months' },
                { key: '12', value: '12 months' },
                { key: '24', value: '24 months' },
                { key: '36', value: '36 months' },
                { key: '48', value: '48 months' },
              ]}
            />
          )}
          <div className="flex gap-4 justify-center items-center">
            <Verification
              text="Fingerprint"
              isShow={isFinger}
              onClick={handleFingerprintVerification}
              iconUrl="/icon_finger.png"
            />
            <Verification text="Face" isShow={isFace} onClick={handleFaceVerification} iconUrl="/icon_facial.png" />
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <div className="mb-5">
            <Button id="next" label="Next" onClick={onSubmit} disable={isLoading} />
          </div>
        </>
      </OnboardingInputLayout>
    </>
  )
}
