import React from 'react'
import PermanentAddressBangla from './PermanentAddressBangla'
import IndividualInfo from './IndividualInfo'
import PresentAddressBangla from './PresentAddressBangla'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import Joi from 'joi'
import { useFormValidation } from '@hooks/useFormValidation'
import { toast } from 'react-toastify'
import { increment } from '@redux/slices/ekyc.slice'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { useAPIWithToken } from '@hooks/useAPI'
import { ITempDataRes } from '@interfaces/onboarding.interface'
import { putEkycTemp } from '@config/urls.config'
import AbsPermanentAddressEnglish from './abs/AbsPermanentAddressEnglish'
import AbsPresentAddressEnglish from './abs/AbsPresentAddressEnglish'
import CbsPermanentAddressEnglish from './cbs/CbsPermanentAddressEnglish'
import CbsPresentAddressEnglish from './cbs/CbsPresentAddressEnglish'

const schema: Joi.Schema = Joi.object({
  name: Joi.string().min(3).required(),
  nameBangla: Joi.string().min(3).required(),
  fatherName: Joi.string().min(3).required(),
  fatherNameBangla: Joi.string().min(3).required(),
  motherName: Joi.string().min(3).required(),
  motherNameBangla: Joi.string().min(3).required(),
  gender: Joi.string().min(1).required(),
  profession: Joi.string().min(1).required(),
  spouseName: Joi.string().min(1).allow('').optional(),
  religion: Joi.string().min(1).allow('').optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
})

const getRegularSchema = (ekycType: string) => {
  if (ekycType === 'R') {
    return Joi.object({
      monthlyIncome: Joi.string().min(1).required(),
      sourceOfFund: Joi.string().min(1).required(),
      nationality: Joi.string().min(1).required(),
      tin: Joi.string().min(1).allow('').optional(),
    })
  } else {
    return Joi.object({})
  }
}

const addressBanglaSchema: Joi.Schema = Joi.object({
  division: Joi.string().min(1).required(),
  district: Joi.string().min(1).required(),
  upozila: Joi.string().min(1).required(),
  unionOrWard: Joi.string().min(1).required(),
  additionalMouzaOrMoholla: Joi.string().min(1).allow('').optional(),
  additionalVillageOrRoad: Joi.string().min(1).allow('').optional(),
  cityCorporationOrMunicipality: Joi.string().min(1).allow('').optional(),
  homeOrHoldingNo: Joi.string().min(1).allow('').optional(),
  postOffice: Joi.string().min(1).allow('').optional(),
  postalCode: Joi.string().min(1).allow('').optional(),
  region: Joi.string().min(1).allow('').optional(),
  rmo: Joi.string().min(1).allow('').optional(),
})

const addressEnglishSchema: Joi.Schema = Joi.object({
  divisionEng: Joi.string().min(1).required(),
  districtEng: Joi.string().min(1).required(),
  upozilaEng: Joi.string().min(1).required(),
  unionOrWardEng: Joi.string().min(1).required(),
  additionalMouzaOrMoholla: Joi.string().min(1).allow('').optional(),
  additionalVillageOrRoad: Joi.string().min(1).allow('').optional(),
  cityCorporationOrMunicipality: Joi.string().min(1).allow('').optional(),
  homeOrHoldingNo: Joi.string().min(1).allow('').optional(),
  postOffice: Joi.string().min(1).allow('').optional(),
  region: Joi.string().min(1).allow('').optional(),
})

export default function PersonalInfo() {
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.ekyc.account)
  const applicant = useSelector((state: RootState) => state.ekyc.applicant)
  const presentAddress = useSelector((state: RootState) => state.ekyc.applicantPresentAddress)
  const permanentAddress = useSelector((state: RootState) => state.ekyc.applicantPermanentAddress)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)
  const ekycType = useSelector((state: RootState) => state.ekyc.ekycType)
  const regularAdditionalData = useSelector((state: RootState) => state.ekyc.regularAdditionalData)

  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  const { ok: applicantOk, errors: applicantError } = useFormValidation(
    schema,
    applicant,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const regularSchema = getRegularSchema(ekycType)

  const { ok: additionalDataOk, errors: regularAdditionalError } = useFormValidation(
    regularSchema,
    regularAdditionalData,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { ok: permanentAddressBanglaOk, errors: permanentAddressBanglaError } = useFormValidation(
    addressBanglaSchema,
    permanentAddress,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { ok: permanentAddressEnglishOk, errors: permanentAddressEnglishError } = useFormValidation(
    addressEnglishSchema,
    permanentAddress,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { ok: presentAddressBanglaOk, errors: presentAddressBanglaError } = useFormValidation(
    addressBanglaSchema,
    presentAddress,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { ok: presentAddressEnglishOk, errors: presentAddressEnglishError } = useFormValidation(
    addressEnglishSchema,
    presentAddress,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const handleSubmit = async () => {
    if (
      applicantOk &&
      permanentAddressBanglaOk &&
      permanentAddressEnglishOk &&
      presentAddressBanglaOk &&
      presentAddressEnglishOk &&
      additionalDataOk
    ) {
      const tempRes = await executeTempData({
        method: 'PUT',
        url: putEkycTemp,
        params: {
          id: tempStorageId,
        },
        data: {
          data: {
            step: step + 1,
            applicant: applicant,
            applicantPermanentAddress: permanentAddress,
            applicantPresentAddress: presentAddress,
          },
        },
      })
      if (tempRes) {
        dispatch(increment())
      }
    } else {
      toast.error('Please Provide All Mandetory Field')
    }
  }

  const getPermanentAddressEng = (channelCode: string): JSX.Element => {
    switch (channelCode) {
      case 'ABS':
        return <AbsPermanentAddressEnglish addressError={permanentAddressEnglishError} />
      case 'CBS':
        return <CbsPermanentAddressEnglish addressError={permanentAddressEnglishError} />
      default:
        return <></>
    }
  }

  const getPresentAddressEng = (channelCode: string): JSX.Element => {
    switch (channelCode) {
      case 'ABS':
        return (
          <AbsPresentAddressEnglish
            isLoading={isLoading}
            addressError={presentAddressEnglishError}
            onSubmit={handleSubmit}
          />
        )
      case 'CBS':
        return (
          <CbsPresentAddressEnglish
            isLoading={isLoading}
            addressError={presentAddressEnglishError}
            onSubmit={handleSubmit}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <OnboardingInputLayout title="Personal Information" widthfull>
      <>
        <IndividualInfo applicantError={applicantError} regularAdditionalError={regularAdditionalError} />
        <PermanentAddressBangla addressError={permanentAddressBanglaError} />
        {getPermanentAddressEng(account.channelCode)}
        <PresentAddressBangla addressError={presentAddressBanglaError} />
        {getPresentAddressEng(account.channelCode)}
      </>
    </OnboardingInputLayout>
  )
}
