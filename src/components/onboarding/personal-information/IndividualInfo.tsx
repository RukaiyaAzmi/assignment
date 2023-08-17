import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import { setAccountTitle, setAdditionalData, setApplicant } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { getProfessionData } from '@utils/profession.utils'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface IIndividualInfo {
  //eslint-disable-next-line
  applicantError: {}
  //eslint-disable-next-line
  regularAdditionalError: {}
}

export default function IndividualInfo({ applicantError, regularAdditionalError }: IIndividualInfo) {
  const [profession, setProfession] = useState<IOptionsData[]>([])
  const dispatch = useDispatch()
  const ekycType = useSelector((state: RootState) => state.ekyc.ekycType)
  const account = useSelector((state: RootState) => state.ekyc.account)
  const applicant = useSelector((state: RootState) => state.ekyc.applicant)
  const regularAdditionalData = useSelector((state: RootState) => state.ekyc.regularAdditionalData)

  useEffect(() => {
    getProfessionData(account.channelCode).then((profession) => setProfession(profession))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }
    dispatch(setApplicant(obj))
    if (name === 'name') {
      dispatch(setAccountTitle(value))
    }
  }

  const handleAdditonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }
    dispatch(setAdditionalData(obj))
  }

  const onBoardingType = (type: string | undefined): JSX.Element => {
    if (type === 'R') {
      return (
        <>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <TextInputWithLabel
                id="monthlyIncome"
                placeholder="Enter Your Monthly Income"
                type="number"
                name="monthlyIncome"
                value={regularAdditionalData.monthlyIncome}
                onChange={handleAdditonalDataChange}
                iconUrl="/icon/icon_forAllTextFild.svg"
                error={regularAdditionalError['monthlyIncome']}
                label="Monthly Income"
                mandatory
              />
            </div>
            <div className="w-full md:w-1/2">
              <TextInputWithLabel
                id="sourceOfFund"
                placeholder="Enter Your Source of Fund"
                type="text"
                name="sourceOfFund"
                value={regularAdditionalData.sourceOfFund}
                onChange={handleAdditonalDataChange}
                iconUrl="/icon/icon_forAllTextFild.svg"
                error={regularAdditionalError['sourceOfFund']}
                label="Source of Fund"
                mandatory
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <TextInputWithLabel
                id="nationality"
                placeholder=""
                type="text"
                name="nationality"
                value={regularAdditionalData.nationality}
                onChange={handleAdditonalDataChange}
                iconUrl="/icon/icon_forAllTextFild.svg"
                error={regularAdditionalError['nationality']}
                label="Nationality"
                readonly
                mandatory
              />
            </div>
            <div className="w-full md:w-1/2">
              <TextInputWithLabel
                id="tinNumber"
                placeholder="Enter Your TIN Number"
                type="text"
                name="tinNumber"
                value={regularAdditionalData.tinNumber}
                onChange={handleAdditonalDataChange}
                iconUrl="/icon/icon_forAllTextFild.svg"
                error={regularAdditionalError['tin']}
                label="TIN Number"
              />
            </div>
          </div>
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className="mx-8 p-4 rounded-md">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="name"
            placeholder="Enter Your Name"
            type="text"
            name="name"
            value={applicant.name}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['name']}
            label="Applicant's Name"
            mandatory
            readonly
          />
        </div>
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="nameBangla"
            placeholder="Enter Your Name Bangla"
            type="text"
            name="nameBangla"
            value={applicant.nameBangla}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['nameBangla']}
            label="Applicant's Name(Bangla)"
            mandatory
            readonly
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="fatherName"
            placeholder="Enter Your Father Name"
            type="text"
            name="fatherName"
            value={applicant.fatherName}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['fatherName']}
            label="Father's Name"
            mandatory
          />
        </div>
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="fatherNameBangla"
            placeholder="Enter Your Father Name Bangla"
            type="text"
            name="fatherNameBangla"
            value={applicant.fatherNameBangla}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['fatherNameBangla']}
            label="Father's Name(Bangla)"
            mandatory
            readonly
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="motherName"
            placeholder="Enter Your Mother Name"
            type="text"
            name="motherName"
            value={applicant.motherName}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['motherName']}
            label="Mother's Name"
            mandatory
          />
        </div>

        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="motherNameBangla"
            placeholder="Enter Your Mother Name Bangla"
            type="text"
            name="motherNameBangla"
            value={applicant.motherNameBangla}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['motherNameBangla']}
            label="Mother's Name(Bangla)"
            mandatory
            readonly
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <SelectBox
            id="gender"
            name="gender"
            label="Gender"
            onSelect={handleChange}
            value={applicant.gender}
            options={[
              { key: 'M', value: 'Male' },
              { key: 'F', value: 'Female' },
              { key: 'T', value: 'Others' },
            ]}
            error={applicantError['gender']}
            mandatory
          />
        </div>

        <div className="w-full md:w-1/2">
          <SelectBox
            id="profession"
            name="profession"
            label="Profession"
            onSelect={handleChange}
            value={applicant.profession}
            options={profession}
            error={applicantError['profession']}
            mandatory
          />
        </div>
      </div>
      {onBoardingType(ekycType)}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="spouseName"
            placeholder="Enter Your Spouse Name"
            type="text"
            name="spouseName"
            value={applicant.spouseName}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['spouseName']}
            label="Spouse's Name"
          />
        </div>
        <div className="w-full md:w-1/2">
          <SelectBox
            id="religion"
            name="religion"
            label="Religion"
            onSelect={handleChange}
            value={applicant.religion}
            options={[
              { key: 'MUS', value: 'ISLAM' },
              { key: 'BUD', value: 'BUDDHISHM' },
              { key: 'CHR', value: 'CHRISTIAN' },
              { key: 'HIN', value: 'HINDU' },
              { key: 'OTH', value: 'OTHERS' },
            ]}
            error={applicantError['religion']}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <TextInputWithLabel
            id="email"
            placeholder="Enter Your Email"
            type="text"
            name="email"
            value={applicant.email}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={applicantError['email']}
            label="Email"
            mandatory
          />
        </div>
      </div>
    </div>
  )
}
