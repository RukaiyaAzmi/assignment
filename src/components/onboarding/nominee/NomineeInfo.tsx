import Button from '@components/common/Button'
import PrevButton from '@components/common/PrevButton'
import OnboardingInputLayout from '@components/layout/OnboardingInputLayout'
import { addNominee, decrement, increment } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { Label, Radio, Button as FlowbiteBtn, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Nominee from './Nominee'
import { AiOutlineUserAdd } from 'react-icons/ai'
import Joi from 'joi'
import { toast } from 'react-toastify'
import { useAPIWithToken } from '@hooks/useAPI'
import { ITempDataRes } from '@interfaces/onboarding.interface'
import { putEkycTemp } from '@config/urls.config'

export const nomineeSchema: Joi.Schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  fatherName: Joi.string().min(3).max(50).required(),
  docNo: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(3)
    .max(50)
    .required(),
  percentage: Joi.number().min(1).max(100).required(),
  motherName: Joi.string().min(3).max(50).required(),
  docType: Joi.string().min(1).required(),
  dob: Joi.string().required(),
  relation: Joi.string().min(3).max(50).required(),
  isMinor: Joi.boolean(),
  photo: Joi.string().base64().required(),
  docFrontImage: Joi.string().base64().required(),
  docBackImage: Joi.string().base64().required(),
  guardian: Joi.object().when('isMinor', {
    is: true,
    then: Joi.object({
      photo: Joi.string().base64().required(),
      name: Joi.string().min(3).max(50).required(),
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
      address: Joi.string().min(1).required(),
      relation: Joi.string().min(3).max(50).required(),
    }),
    otherwise: Joi.object().optional(),
  }),
})

const schema: Joi.Schema = Joi.object({
  nominees: Joi.array().items(nomineeSchema),
})

const radioTheme = {
  root: {
    base: 'checked:text-indigo-500 checked:outline-indigo-500',
  },
}

function NomineeTypeSelect() {
  const [nomineeType, setNomineeType] = useState<'A' | 'M'>('A')
  const dispatch = useDispatch()

  const onNextCLick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(addNominee(nomineeType))
  }

  return (
    <OnboardingInputLayout title="Choose Nominee Type">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div
          className={`bg-white rounded-md p-6 w-full flex items-center gap-4 ${
            nomineeType === 'A' ? 'border-2 border-indigo-500' : ''
          }`}
        >
          <Radio
            defaultChecked
            id="adult"
            name="nominee"
            value="A"
            theme={radioTheme}
            onClick={() => setNomineeType('A')}
          />
          <Label htmlFor="adult" className="text-xl">
            Adult
          </Label>
        </div>
        <div
          className={`bg-white rounded-md p-6 w-full flex items-center gap-4 ${
            nomineeType === 'M' ? 'border-2 border-indigo-500' : ''
          }`}
        >
          <Radio id="minor" name="nominee" value="M" theme={radioTheme} onClick={() => setNomineeType('M')} />
          <Label htmlFor="minor" className=" text-xl">
            Minor
          </Label>
        </div>
        <div className="w-full">
          <Button id="next-btn" label="Next" onClick={onNextCLick} />
        </div>
        <PrevButton onPrevStep={() => dispatch(decrement())} />
      </div>
    </OnboardingInputLayout>
  )
}

export default function NomineeInfo() {
  const dispatch = useDispatch()
  const nominees = useSelector((state: RootState) => state.ekyc.nominees)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)
  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  const onNextCLick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { error } = schema.validate({
      nominees: nominees,
    })

    const percentage = nominees.reduce((a, c) => a + c.percentage, 0)
    if (percentage !== 100) {
      toast.error('Percentage must be 100')
      return
    }

    if (!error) {
      const tempRes = await executeTempData({
        method: 'PUT',
        url: putEkycTemp,
        params: {
          id: tempStorageId,
        },
        data: {
          data: {
            step: step + 1,
            nominees: nominees,
          },
        },
      })
      if (tempRes) {
        dispatch(increment())
      }
    } else {
      toast.error(`${error.message}`)
    }
  }

  const handlePrevStep = () => {
    dispatch(decrement())
  }

  if (nominees.length === 0) return <NomineeTypeSelect />
  return (
    <OnboardingInputLayout title="Nominee Information" widthfull>
      <>
        {nominees.map((n, i) => (
          <Nominee key={i} data={n} index={i} />
        ))}
        <div className="flex justify-center items-center gap-4">
          <FlowbiteBtn
            color="light"
            onClick={() => {
              dispatch(addNominee('A'))
            }}
          >
            <AiOutlineUserAdd className="text-lg mr-1" /> Adult
          </FlowbiteBtn>
          <FlowbiteBtn
            color="light"
            onClick={() => {
              dispatch(addNominee('M'))
            }}
          >
            <AiOutlineUserAdd className="text-lg mr-1" /> Minor
          </FlowbiteBtn>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="purple" aria-label="Loading" size="xl" />
          </div>
        ) : (
          ''
        )}
        <div className="w-full lg:w-1/3 mx-auto">
          <Button id="next-submit" label="Next" disable={isLoading} onClick={onNextCLick} />
        </div>
        <div className="mb-8">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </>
    </OnboardingInputLayout>
  )
}
