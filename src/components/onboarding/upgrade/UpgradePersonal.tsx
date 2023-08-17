import React from 'react'
import { toast } from 'react-toastify'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import Button from '@components/common/Button'
import PrevButton from '@components/common/PrevButton'
import Joi from 'joi'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import { decrement, increment, setPersonal } from '@redux/slices/upgrade.slice'

const schema: Joi.Schema = Joi.object({
  monthlyIncome: Joi.number().min(1).required(),
  sourceOfFund: Joi.string().min(1).required(),
})

export default function UpgradePersonal(): JSX.Element {
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.upgrade)

  const { errors } = useFormValidationAsync(schema, account.regularAdditionalData, {
    abortEarly: true,
    allowUnknown: true,
  })

  //**************** Input field ************** */
  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name
    const value = e.target.value
    const inputObj = {
      name,
      value,
    }
    dispatch(setPersonal(inputObj))
  }

  const handlePrevStep = () => {
    dispatch(decrement())
  }

  //**************** Submit button ************** */
  const onSubmit = () => {
    if (account.regularAdditionalData.monthlyIncome === '') {
      toast.error('Please Provide Monthly Income')
      return
    }
    if (account.regularAdditionalData.sourceOfFund === '') {
      toast.error('Please Provide Source of Fund')
      return
    }
    dispatch(increment())
  }

  return (
    <>
      <OnboardingInputLayout title="Personal Information">
        <>
          <TextInputWithLabel
            id="monthlyIncome"
            placeholder="Monthly Income"
            type="number"
            name="monthlyIncome"
            onChange={onChangeEvent}
            value={account.regularAdditionalData.monthlyIncome}
            label="Monthly Income"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={errors['monthlyIncome']}
          />
          <TextInputWithLabel
            id="sourceOfFund"
            placeholder="Source of Fund"
            type="text"
            name="sourceOfFund"
            onChange={onChangeEvent}
            value={account.regularAdditionalData.sourceOfFund}
            label="Source of Fund"
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={errors['sourceOfFund']}
          />
          <TextInputWithLabel
            id="nationality"
            placeholder="Nationality"
            type="text"
            name="nationality"
            onChange={onChangeEvent}
            value={account.regularAdditionalData.nationality}
            label="Nationality"
            iconUrl="/icon/icon_forAllTextFild.svg"
            readonly={true}
          />
          <div className="flex mt-4 flex-col justify-center items-center">
            <div className="w-2/3">
              <Button id="button" label="Next" onClick={() => onSubmit()} />
            </div>
            <div className="mb-10">
              <PrevButton onPrevStep={handlePrevStep} />
            </div>
          </div>
        </>
      </OnboardingInputLayout>
    </>
  )
}
