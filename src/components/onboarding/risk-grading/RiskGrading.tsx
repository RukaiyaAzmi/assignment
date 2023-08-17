import Button from '@components/common/Button'
import PrevButton from '@components/common/PrevButton'
import SelectBox from '@components/common/SelectBox'
import { putEkycTemp } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { useFormValidation } from '@hooks/useFormValidation'
import { IRiskInfo, ITempDataRes } from '@interfaces/onboarding.interface'
import { decrement, increment, setRiskInfo } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { Spinner } from 'flowbite-react'
import Joi from 'joi'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const schema: Joi.Schema = Joi.object({
  onBoardingValue: Joi.string().min(1).required(),
  geoRiskClient: Joi.string().min(1).required(),
  foreignOrigin: Joi.when('geoRiskClient', { is: '2.1.3', then: Joi.string().min(1).required() }),
  highOfficial: Joi.string().min(1).required(),
  closeHighOfficial: Joi.string().min(1).required(),
  isClientIp: Joi.string().min(1).required(),
  productTypes: Joi.string().min(1).required(),
  professionName: Joi.string().min(1).required(),
  yearlyTransaction: Joi.string().min(1).required(),
  hasSourceOfFunds: Joi.string().min(1).required(),
})

export default function RiskGrading() {
  const dispatch = useDispatch()
  const risk = useSelector((state: RootState) => state.ekyc.regularAdditionalData.riskInfo)
  const regularAdditionalData = useSelector((state: RootState) => state.ekyc.regularAdditionalData)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)

  const [riskValue, setRiskValue] = useState<IRiskInfo>({
    onBoardingValue: risk.length ? risk[0] : '',
    geoRiskClient: risk.length ? risk[1] : '',
    foreignOrigin: risk.length ? risk[2] : '',
    highOfficial: risk.length ? risk[3] : '',
    closeHighOfficial: risk.length ? risk[4] : '',
    isClientIp: risk.length ? risk[5] : '',
    productTypes: risk.length ? risk[6] : '',
    professionName: risk.length ? risk[7] : '',
    yearlyTransaction: risk.length ? risk[8] : '',
    hasSourceOfFunds: risk.length ? risk[9] : '',
  })
  const [showProfession, setShowProfession] = useState<boolean>(riskValue.professionName.includes('5.b'))

  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()
  const { ok, errors } = useFormValidation(
    schema,
    riskValue,
    {
      abortEarly: true,
    },
    true,
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setRiskValue({
      ...riskValue,
      [e.target.name]: value,
    })
  }

  const handlePrevStep = () => {
    dispatch(decrement())
  }

  const onSubmit = async () => {
    if (ok) {
      dispatch(setRiskInfo({ index: 0, value: riskValue.onBoardingValue }))
      dispatch(setRiskInfo({ index: 1, value: riskValue.geoRiskClient }))
      dispatch(
        setRiskInfo({
          index: 2,
          value: riskValue.geoRiskClient === '2.1.3' ? riskValue.foreignOrigin : '2.2.1',
        }),
      )
      dispatch(setRiskInfo({ index: 3, value: riskValue.highOfficial }))
      dispatch(setRiskInfo({ index: 4, value: riskValue.closeHighOfficial }))
      dispatch(setRiskInfo({ index: 5, value: riskValue.isClientIp }))
      dispatch(setRiskInfo({ index: 6, value: riskValue.productTypes }))
      dispatch(setRiskInfo({ index: 7, value: riskValue.professionName }))
      dispatch(setRiskInfo({ index: 8, value: riskValue.yearlyTransaction }))
      dispatch(setRiskInfo({ index: 9, value: riskValue.hasSourceOfFunds }))

      try {
        const tempRes = await executeTempData({
          method: 'PUT',
          url: putEkycTemp,
          params: {
            id: tempStorageId,
          },
          data: {
            data: {
              step: step + 1,
              regularAdditionalData: {
                ...regularAdditionalData,
                riskInfo: [
                  riskValue.onBoardingValue,
                  riskValue.geoRiskClient,
                  riskValue.foreignOrigin,
                  riskValue.highOfficial,
                  riskValue.closeHighOfficial,
                  riskValue.isClientIp,
                  riskValue.productTypes,
                  riskValue.professionName,
                  riskValue.yearlyTransaction,
                  riskValue.hasSourceOfFunds,
                ],
              },
            },
          },
        })
        if (tempRes) {
          dispatch(increment())
        }
      } catch (error) {
        toast.error('Unknown Error')
      }
    } else {
      toast.error('Please Provide All Information')
    }
  }

  const onProfessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setRiskValue({
      ...riskValue,
      professionName: '',
    })
    if (value === '5.a') {
      setShowProfession(false)
    } else {
      setShowProfession(true)
    }
  }

  return (
    <>
      <div className="container  my-33 mx-auto px-4 md:px-12 animate__animated animate__fadeIn">
        <h1 className="flex justify-center text-2xl text-gray-900 font-bold mt-8 mb-5">Risk Grading</h1>

        <SelectBox
          id="onBoardingValue"
          name="onBoardingValue"
          label="Type of Onboarding"
          onSelect={onInputChange}
          value={riskValue.onBoardingValue}
          error={errors['onBoardingValue']}
          options={[
            { key: '1.1', value: 'Branch/Relationship Manager/Agent' },
            { key: '1.2', value: 'Direct Sales Agent' },
            { key: '1.3', value: 'Walk-in' },
            { key: '1.4', value: 'Internet/Self check-in/Other non Face to Face' },
          ]}
        />

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Geographic Risks</h6>

        <SelectBox
          id="geoRiskClient"
          label="Is Client"
          name="geoRiskClient"
          onSelect={onInputChange}
          value={riskValue.geoRiskClient}
          error={errors['geoRiskClient']}
          options={[
            { key: '2.1.1', value: 'Resident Bangladeshi' },
            { key: '2.1.2', value: 'Non-resident Bangladeshi' },
            { key: '2.1.3', value: 'Foreign Citizen' },
          ]}
        />

        {riskValue.geoRiskClient === '2.1.3' ? (
          <SelectBox
            id="foreignOrigin"
            label="Does client's country of
                      citizenship feature in
                      FATF/EU/OFAC/UN Black
                      List/Grey List?"
            name="foreignOrigin"
            onSelect={onInputChange}
            value={riskValue.foreignOrigin}
            error={errors['foreignOrigin']}
            options={[
              { key: '2.2.1', value: 'No' },
              { key: '2.2.2', value: 'Yes' },
            ]}
          />
        ) : (
          <SelectBox
            id="foreignOrigin"
            label="Does client's country of
                      citizenship feature in
                      FATF/EU/OFAC/UN Black
                      List/Grey List?"
            name="foreignOrigin"
            onSelect={onInputChange}
            value="2.2.1"
            error={errors['foreignOrigin']}
            options={[
              { key: '2.2.1', value: 'No' },
              { key: '2.2.2', value: 'Yes' },
            ]}
            disabled={true}
          />
        )}

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Type of Customer</h6>

        <SelectBox
          id="highOfficial"
          name="highOfficial"
          label="Is client a PEP/Chief or High
                Official of International
                Organization, as per BFIU
                Circular?"
          onSelect={onInputChange}
          value={riskValue.highOfficial}
          error={errors['highOfficial']}
          options={[
            { key: '3.1.2', value: 'Yes' },
            { key: '3.1.1', value: 'No' },
          ]}
        />
        <SelectBox
          id="closeHighOfficial"
          label="Is client’s family/close associates
                related to PEP/Chief or High
                Official of International
                Organization?"
          name="closeHighOfficial"
          onSelect={onInputChange}
          value={riskValue.closeHighOfficial}
          error={errors['closeHighOfficial']}
          options={[
            { key: '3.2.2', value: 'Yes' },
            { key: '3.2.1', value: 'No' },
          ]}
        />

        <SelectBox
          id="isClientIp"
          name="isClientIp"
          label="Is client a IP? or his family/close
                associates related to IP?"
          onSelect={onInputChange}
          value={riskValue.isClientIp}
          error={errors['isClientIp']}
          options={[
            { key: '3.3.2', value: 'Yes - based on assessed risk' },
            { key: '3.3.1', value: 'No' },
          ]}
        />

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">
          Product and Channel Risk
        </h6>

        <SelectBox
          id="productTypes"
          label="Type of Product"
          name="productTypes"
          onSelect={onInputChange}
          value={riskValue.productTypes}
          error={errors['productTypes']}
          options={[
            { key: '4.1.1', value: 'Savings account' },
            { key: '4.1.2', value: 'Current account' },
            { key: '4.1.3', value: 'FDR' },
            { key: '4.1.4', value: 'Deposit Scheme upto12 lac' },
            { key: '4.1.5', value: 'Deposit Scheme above 12 lac' },
            { key: '4.1.6', value: 'Forex account' },
            { key: '4.1.7', value: 'S.N.D.' },
            { key: '4.1.8', value: 'R.F.C.D.' },
          ]}
        />

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">
          Business and Activity Risk
        </h6>

        <div className="flex justify-center items-center gap-4">
          <label>
            <input
              type="radio"
              className="form-check-input mr-2 checked:text-indigo-500 checked:outline-indigo-500 checked:ring-0"
              onChange={onProfessionChange}
              name="typeOfProfession"
              id="business"
              value="5.a"
              checked={!showProfession}
            />
            Business
          </label>

          <label>
            <input
              type="radio"
              className="form-check-input mr-2 checked:text-indigo-500 checked:outline-indigo-500 checked:ring-0"
              onChange={onProfessionChange}
              name="typeOfProfession"
              id="profession"
              value="5.b"
              checked={showProfession}
            />
            Profession
          </label>
        </div>
        {showProfession ? (
          <SelectBox
            id="professionName"
            label="Type of Occupation"
            name="professionName"
            onSelect={onInputChange}
            value={riskValue.professionName}
            error={errors['professionName']}
            options={[
              { key: '5.b.1', value: 'Pilot/Flight Attendant' },
              { key: '5.b.2', value: 'Trustee' },
              { key: '5.b.3', value: 'Professional (Journalist, Lawyer, Doctor, Engineer, Chartered Accountant, etc.' },
              { key: '5.b.4', value: 'Director (Private/Public Limited Company)' },
              { key: '5.b.5', value: 'High Official of Multinational Company (MNC)' },
              { key: '5.b.6', value: 'Homemaker' },
              { key: '5.b.7', value: 'Information Technology (IT) sector employee' },
              { key: '5.b.8', value: 'Athlete/Media Celebrity/Producer/Director' },
              { key: '5.b.9', value: 'Freelance Software Developer' },
              { key: '5.b.10', value: 'Government Service' },
              { key: '5.b.11', value: 'Landlord/Homeowner' },
              { key: '5.b.12', value: 'Private Service: Managerial' },
              { key: '5.b.13', value: 'Teacher (Public/Private/Autonomous Educational Institution)' },
              { key: '5.b.14', value: 'Private Sector Employee' },
              { key: '5.b.15', value: 'Self-employed Professional' },
              { key: '5.b.16', value: 'Student' },
              { key: '5.b.17', value: 'Retiree' },
              { key: '5.b.18', value: 'Farmer/Fisherman/Labourer' },
              { key: '5.b.19', value: 'Others' },
            ]}
          />
        ) : (
          <SelectBox
            id="professionName"
            label="Type of Occupation"
            name="professionName"
            onSelect={onInputChange}
            value={riskValue.professionName}
            error={errors['professionName']}
            options={[
              { key: '5.a.1', value: 'Jeweller/Gold/Valuable Metals Business' },
              { key: '5.a.2', value: 'Money Changer/Courier Service/MobileBanking Agent' },
              { key: '5.a.3', value: 'Real Estate Developer/Agent' },
              { key: '5.a.4', value: 'Promoter/Contractor: ConstructionProjects' },
              { key: '5.a.5', value: 'Art and Antiquities Dealer' },
              { key: '5.a.6', value: 'Restaurant/Bar/NightClub/Parlour/Hotel' },
              { key: '5.a.7', value: 'Export/Import' },
              { key: '5.a.8', value: 'Manpower export' },
              { key: '5.a.9', value: 'Firearms' },
              { key: '5.a.10', value: 'RMG/Garments Accessories/BuyingHouse' },
              { key: '5.a.11', value: 'Share/Stocks Investor' },
              { key: '5.a.12', value: 'Software/Information and Technology Business' },
              { key: '5.a.13', value: 'Travel Agent' },
              { key: '5.a.14', value: 'Merchant with over 10 million takas invested in business' },
              { key: '5.a.15', value: 'Freight/Shipping/Cargo Agent' },
              { key: '5.a.16', value: 'Automobiles business (New or Reconditioned)' },
              { key: '5.a.17', value: 'Leather/Leather goods Business' },
              { key: '5.a.18', value: 'Construction Materials Trader' },
              { key: '5.a.19', value: 'Business Agent' },
              { key: '5.a.20', value: 'Thread/"Jhut" Merchant' },
              { key: '5.a.21', value: 'Transport Operator' },
              { key: '5.a.22', value: 'Tobacco and Cigarettes Business' },
              { key: '5.a.23', value: 'Amusement Park/Entertainment Provider' },
              { key: '5.a.24', value: 'Motor Parts Trader/Workshop' },
              { key: '5.a.25', value: 'Small Business (Investment below BDT 5 million)' },
              { key: '5.a.26', value: 'Computer/Mobile Phone Dealer' },
              { key: '5.a.27', value: 'Manufacturer (except, weapons)' },
              { key: '5.a.28', value: 'Others' },
            ]}
          />
        )}

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Transactional Risks</h6>

        <SelectBox
          id="yearlyTransaction"
          label="What is the Client's Average
                Yearly Transactions Worth?"
          name="yearlyTransaction"
          onSelect={onInputChange}
          value={riskValue.yearlyTransaction}
          error={errors['yearlyTransaction']}
          options={[
            { key: '6.1.1', value: 'Less than BDT 1 million (10 lacs)' },
            { key: '6.1.2', value: 'From BDT 1 million to 5 million (10 lacs to 50 lacs)' },
            { key: '6.1.3', value: 'From BDT 5 million to 50 million (50 lacs to 5 crore)' },
            { key: '6.1.4', value: 'More than BDT 50 million (5 crores)' },
          ]}
        />

        <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Transparency Risk</h6>

        <SelectBox
          id="hasSourceOfFunds"
          label="Does client has Provided
                credible source of funds"
          name="hasSourceOfFunds"
          onSelect={onInputChange}
          value={riskValue.hasSourceOfFunds}
          error={errors['hasSourceOfFunds']}
          options={[
            { key: '7.1.1', value: 'No' },
            { key: '7.1.2', value: 'Yes' },
          ]}
        />

        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="purple" aria-label="Loading" size="xl" />
          </div>
        ) : (
          ''
        )}

        <div className="sm:w-2/4 pt-3 m-auto">
          <Button id="submit" label="Next" disable={isLoading} onClick={onSubmit} />
        </div>
        <div className="mt-4 mb-10">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </div>
    </>
  )
}
