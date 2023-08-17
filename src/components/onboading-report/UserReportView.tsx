import React from 'react'
import DateRow from '@components/common/DateRow'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { IEkyc } from '@interfaces/admin-report.interface'
import {
  getFullAccountType,
  getFullChanneltName,
  getFullGender,
  getFullUserStatus,
  getFullVerificationStatus,
} from '@utils/status.utils'

interface UserReportProps {
  userReport: IEkyc
}

export default function UserReportView({ userReport }: UserReportProps) {
  const {
    id,
    nid,
    name,
    nameBangla,
    dob,
    gender,
    motherName,
    motherNameBangla,
    fatherName,
    fatherNameBangla,
    spouseName,
    profession,
    mobile,
    email,
    monthlyIncome,
    sourceOfFund,
    nationality,
    religion,
    verificationType,
    onboardingType,
    verificationStatus,
    verificationDate,
    reviewCount,
    account,
    createdBy,
    createDate,
    updatedBy,
    updateDate,
  } = userReport

  return (
    <>
      <label className="text-xl mt-2">Personal Information</label>
      <div className="bg-white animate__animated animate__fadeIn">
        <Row>
          <>
            <TextRow label="EKYC ID " value={id} />
            <TextRow label="Date Of Birth" value={dob} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Name " value={name} />
            <TextRow label="Name Bangla" value={nameBangla} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Gender " value={getFullGender(gender)} />
            <TextRow label="Religion " value={religion} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Verification Status" value={getFullVerificationStatus(verificationStatus)} />
            <TextRow label="Verification Type" value={verificationType} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Onboarding Type" value={onboardingType} />
            <DateRow label="Verification Date " value={verificationDate} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="NID No " value={nid} />
            <TextRow label="mobile" value={mobile} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Father Name " value={fatherName} />
            <TextRow label="Father Name Bangla" value={fatherNameBangla} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Mother Name" value={motherName} />
            <TextRow label="Mother Name Bangla " value={motherNameBangla} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Spouse Name" value={spouseName} />
            <TextRow label="Profession" value={profession} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Email" value={email} />
            <TextRow label="Nationality" value={nationality} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Monthly Income" value={monthlyIncome} />
            <TextRow label="Source Of Fund" value={sourceOfFund} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Review Count" value={reviewCount} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Created By" value={createdBy} />
            <DateRow label="Create Date" value={createDate} />
          </>
        </Row>
        <Row>
          <>
            <TextRow label="Updated By" value={updatedBy} />
            <DateRow label="Update Date" value={updateDate} />
          </>
        </Row>
      </div>
      <div className=" mt-2">
        <label className="text-xl ">Account Information</label>
        <div className="bg-white">
          <Row>
            <>
              <TextRow label="Account ID" value={account.id} />
              <TextRow label="Branch/Agent Point" value={account.branchOrAgentPointCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Title " value={account.title} />
              <TextRow label="Product Code" value={account.productCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Channel Code" value={getFullChanneltName(account.channelCode)} />
              <TextRow label="Product Type" value={account.productType} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Status " value={getFullUserStatus(account.status)} />
              <TextRow label="Type" value={getFullAccountType(account.type)} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label=" Account Number " value={account.channelAccountId} />
            </>
          </Row>
        </div>
      </div>
    </>
  )
}
