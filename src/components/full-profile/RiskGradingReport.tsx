import React, { useState } from 'react'
import SelectBox from '@components/common/SelectBox'

interface RiskGrading {
  riskValue: string[]
}

export default function RiskGradingReport({ riskValue }: RiskGrading) {
  const [business] = useState<boolean>(riskValue[7].includes('5.a'))

  return (
    <>
      <div className="my-33 mx-auto px-4 md:px-12">
        <div>
          <SelectBox
            id="onBoardingValue"
            name="onBoardingValue"
            label="Type of Onboarding"
            value={riskValue[0]}
            options={[
              { key: '1.1', value: 'Branch/Relationship Manager/Agent' },
              { key: '1.2', value: 'Direct Sales Agent' },
              { key: '1.3', value: 'Walk-in' },
              { key: '1.4', value: 'Internet/Self check-in/Other non Face to Face' },
            ]}
          />
          <SelectBox
            id="geoRiskClient"
            label="Geographic Risks"
            name="geoRiskClient"
            value={riskValue[1]}
            options={[
              { key: '2.1.1', value: 'Resident Bangladeshi' },
              { key: '2.1.2', value: 'Non-resident Bangladeshi' },
              { key: '2.1.3', value: 'Foreign Citizen' },
            ]}
          />
          <SelectBox
            id="foreignOrigin"
            label="Does client's country of
                      citizenship feature in
                      FATF/EU/OFAC/UN Black
                      List/Grey List?"
            name="foreignOrigin"
            value={riskValue[2]}
            options={[
              { key: '2.2.1', value: 'No' },
              { key: '2.2.2', value: 'Yes' },
            ]}
          />

          <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Type of Customer</h6>

          <SelectBox
            id="highOfficial"
            name="highOfficial"
            label="Is client a PEP/Chief or High Official of International Organization, as per BFIU Circular?"
            value={riskValue[3]}
            options={[
              { key: '3.1.2', value: 'Yes' },
              { key: '3.1.1', value: 'No' },
            ]}
          />
          <SelectBox
            id="closeHighOfficial"
            label="Is client’s family/close associates related to PEP/Chief or High Official of International Organization?"
            name="closeHighOfficial"
            value={riskValue[4]}
            options={[
              { key: '3.2.2', value: 'Yes' },
              { key: '3.2.1', value: 'No' },
            ]}
          />

          <SelectBox
            id="isClientIp"
            name="isClientIp"
            label="Is client a IP? or his family/close associates related to IP?"
            value={riskValue[5]}
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
            value={riskValue[6]}
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
          {business === true ? (
            <SelectBox
              id="businessName"
              label="Business"
              name="businessName"
              value={riskValue[7]}
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
          ) : (
            <SelectBox
              id="professionName"
              label="Profession"
              name="professionName"
              value={riskValue[7]}
              options={[
                { key: '5.b.1', value: 'Pilot/Flight Attendant' },
                { key: '5.b.2', value: 'Trustee' },
                {
                  key: '5.b.3',
                  value: 'Professional (Journalist, Lawyer, Doctor, Engineer, Chartered Accountant, etc.',
                },
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
          )}

          <h6 className="text-lg font-bold dark:text-white bg-indigo-100 py-2 my-5 text-center">Transactional Risks</h6>

          <SelectBox
            id="yearlyTransaction"
            label="What is the Client's Average Yearly Transactions Worth?"
            name="yearlyTransaction"
            value={riskValue[8]}
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
            label="Does client has Provided credible source of funds"
            name="hasSourceOfFunds"
            value={riskValue[9]}
            options={[
              { key: '7.1.1', value: 'No' },
              { key: '7.1.2', value: 'Yes' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
