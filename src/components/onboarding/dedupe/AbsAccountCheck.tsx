/* eslint-disable react/no-unknown-property */

import React from 'react'
import DateInput from '@components/common/DateInput'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import Button from '@components/common/Button'
import { toast } from 'react-toastify'
import { useAPIWithToken } from '@hooks/useAPI'
import { postABSAccouontCheck, putEkycTemp } from '@config/urls.config'
import { IAbsAccouontCheck, ITempDataRes } from '@interfaces/onboarding.interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { decrement, increment, setApplicant } from '@redux/slices/ekyc.slice'
import { getOnboardingDateFormat } from '@utils/date.utils'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import PrevButton from '@components/common/PrevButton'
import { Spinner } from 'flowbite-react'

const schema: Joi.Schema = Joi.object({
  nid: Joi.alternatives().try(
    Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    Joi.string()
      .length(17)
      .pattern(/^[0-9]+$/)
      .required(),
  ),
  dob: Joi.string().required(),
})

export default function AbsAccountCheck() {
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.ekyc.account)
  const applicant = useSelector((state: RootState) => state.ekyc.applicant)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)
  const branchOrAgentPointCode = useSelector((state: RootState) => state.user.currentBranchOrAgentPointCode)

  const { ok, errors: dedupeCheckError } = useFormValidationAsync(
    schema,
    applicant,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )

  const { execute: executeAccountCheck } = useAPIWithToken<IAbsAccouontCheck>()
  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    const inputObj = {
      name,
      value,
    }
    dispatch(setApplicant(inputObj))
  }
  const handleDateChange = (selectedDate: Date) => {
    const date = getOnboardingDateFormat(selectedDate)
    const objDob = {
      name: 'dob',
      value: date,
    }
    const objDobDate = {
      name: 'dobDate',
      value: selectedDate.toISOString(),
    }
    dispatch(setApplicant(objDob))
    dispatch(setApplicant(objDobDate))
  }

  const handleSubmit = async () => {
    if (ok) {
      try {
        const response = await executeAccountCheck({
          method: 'POST',
          url: postABSAccouontCheck,
          data: {
            nid: applicant.nid,
            productCode: account.productCode,
            productType: account.productType,
            agentPointId: branchOrAgentPointCode,
          },
        })
        if (response?.data.result) {
          toast.error(response?.data.channelResponse.AC_INFO.RESPONSE_MSG)
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

  const handlePrevStep = () => {
    dispatch(decrement())
  }

  return (
    <>
      <OnboardingInputLayout title="dedupe check">
        <>
          <TextInputWithLabel
            id="nid"
            placeholder="Enter Your NID No"
            type="text"
            name="nid"
            value={applicant.nid}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={dedupeCheckError['nid']}
            label="NID No"
          />
          <DateInput
            isShow={true}
            label="Date of Birth"
            error={dedupeCheckError['dob']}
            onDateChange={handleDateChange}
            dob={applicant.dob}
          />
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading" size="xl" />
            </div>
          ) : (
            ''
          )}
          <Button id="button" label="Next" disable={isLoading} onClick={handleSubmit} />
          <PrevButton onPrevStep={handlePrevStep} />
        </>
      </OnboardingInputLayout>
    </>
  )
}
