import Button from '@components/common/Button'
import DateRow from '@components/common/DateRow'
import ImagePreview from '@components/common/ImagePreview'
import PrevButton from '@components/common/PrevButton'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { postRegularEkyc, postSimplifiedEkyc } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { ICreateEkycRes } from '@interfaces/onboarding.interface'
import { setChannelRes } from '@redux/slices/ekyc-utils.slice'
import { decrement } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { sanitizeAPIPayload } from '@utils/ekyc-sanitize.utils'
import { Spinner } from 'flowbite-react'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function Preview() {
  const dispatch = useDispatch()
  const router = useRouter()
  const ekyc = useSelector((state: RootState) => state.ekyc)

  const { isLoading, execute: executeCreateEkyc } = useAPIWithToken<ICreateEkycRes>()

  const handleSubmit = async () => {
    if (ekyc.ekycType !== '') {
      try {
        const res = await executeCreateEkyc({
          method: 'POST',
          url: ekyc.ekycType === 'R' ? postRegularEkyc : postSimplifiedEkyc,
          data: sanitizeAPIPayload(ekyc),
          headers: {
            'x-verification-token': ekyc.verificationToken,
          },
        })
        if (res?.data.channelResponse && res.data.channelResponse.result) {
          dispatch(setChannelRes(res.data))
          // redirect
          router.push('/admin/onboarding/account-report')
        } else toast.error(`${ekyc.account.channelCode} is not responding. Failed to create account`)
      } catch (error) {
        toast.error('Unknown Error')
      }
    } else {
      toast.error('Something gose wrong')
    }
  }
  const handlePrevStep = () => {
    dispatch(decrement())
  }
  return (
    <>
      <div className="bg-white m-8 animate__animated animate__fadeIn">
        <div>
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Account Details</span>
          </h4>
          <Row>
            <>
              <TextRow label="Account Type" value={ekyc.account.type === 'S' ? 'Single' : 'Joint'} />
              <TextRow label="Product Type" value={ekyc.account.productType} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Channel Name" value={ekyc.account.channelCode} />
              <TextRow label="Product Name" value={ekyc.account.productCategoryCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Transaction Amount" value={ekyc.account.transactionOrMaturityAmount} />
              <TextRow label="eKYC Type" value={ekyc.ekycType === 'R' ? 'Regular' : 'Simplified'} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Religion" value={ekyc.applicant.religion} />
              <TextRow label="Email" value={ekyc.applicant.email} />
            </>
          </Row>
          {ekyc.ekycType === 'R' && (
            <>
              <Row>
                <>
                  <TextRow label="Monthly Income" value={ekyc.regularAdditionalData.monthlyIncome} />
                  <TextRow label="Source of Fund" value={ekyc.regularAdditionalData.sourceOfFund} />
                </>
              </Row>
              <Row>
                <>
                  <TextRow label="Nationality" value={ekyc.regularAdditionalData.nationality} />
                </>
              </Row>
            </>
          )}
        </div>
        <div className="mt-4">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Personal Information</span>
          </h4>
          <Row>
            <>
              <TextRow label="Applicant's NID No" value={ekyc.applicant.nid} />
              <DateRow label="Applicant's Date of Birth" value={new Date(ekyc.applicant.dob)} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Applicant's Name" value={ekyc.applicant.name} />
              <TextRow label="Applicant's Name(Bangla)" value={ekyc.applicant.nameBangla} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Mother's Name" value={ekyc.applicant.motherName} />
              <TextRow label="Mother's Name(Bangla)" value={ekyc.applicant.motherNameBangla} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Father's Name" value={ekyc.applicant.fatherName} />
              <TextRow label="Father's Name(Bangla)" value={ekyc.applicant.fatherNameBangla} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Spouse Name" value={ekyc.applicant.spouseName} />
              <TextRow label="Gender" value={ekyc.applicant.gender} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Profession" value={ekyc.applicant.profession} />
            </>
          </Row>
        </div>
        <div className="mt-4">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Permanent Address Details</span>
          </h4>
          <Row>
            <>
              <TextRow label="Mouza or Moholla" value={ekyc.applicantPermanentAddress.additionalMouzaOrMoholla} />
              <TextRow label="Postal Code" value={ekyc.applicantPermanentAddress.postalCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Village or Road" value={ekyc.applicantPermanentAddress.additionalVillageOrRoad} />
              <TextRow label="Region" value={ekyc.applicantPermanentAddress.region} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="City Corp." value={ekyc.applicantPermanentAddress.cityCorporationOrMunicipality} />
              <TextRow label="RMO" value={ekyc.applicantPermanentAddress.rmo} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="District" value={ekyc.applicantPermanentAddress.district} />
              <TextRow label="Union or Ward" value={ekyc.applicantPermanentAddress.unionOrWard} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="District Code" value={ekyc.applicantPermanentAddress.districtCode} />
              <TextRow label="Union or Ward Code" value={ekyc.applicantPermanentAddress.unionCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Division" value={ekyc.applicantPermanentAddress.divisionEng} />
              <TextRow label="Upazila" value={ekyc.applicantPermanentAddress.upozilaEng} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Home or Holding No" value={ekyc.applicantPermanentAddress.homeOrHoldingNoEng} />
              <TextRow label="Upazila Code" value={ekyc.applicantPermanentAddress.upozilaCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Post Office" value={ekyc.applicantPermanentAddress.postOfficeEng} />
              <TextRow label="Ward for Union Parishad" value={ekyc.applicantPermanentAddress.wardForUnionPorishod} />
            </>
          </Row>
        </div>
        <div className="mt-4">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Present Address Details</span>
          </h4>
          <Row>
            <>
              <TextRow label="Mouza or Moholla" value={ekyc.applicantPresentAddress.additionalMouzaOrMoholla} />
              <TextRow label="Postal Code" value={ekyc.applicantPresentAddress.postalCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Village or Road" value={ekyc.applicantPresentAddress.additionalVillageOrRoad} />
              <TextRow label="Region" value={ekyc.applicantPresentAddress.region} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="City Corp." value={ekyc.applicantPresentAddress.cityCorporationOrMunicipality} />
              <TextRow label="RMO" value={ekyc.applicantPresentAddress.rmo} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="District" value={ekyc.applicantPresentAddress.district} />
              <TextRow label="Union or Ward" value={ekyc.applicantPresentAddress.unionOrWard} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="District Code" value={ekyc.applicantPresentAddress.districtCode} />
              <TextRow label="Union or Ward Code" value={ekyc.applicantPresentAddress.unionCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Division" value={ekyc.applicantPresentAddress.divisionEng} />
              <TextRow label="Upazila" value={ekyc.applicantPresentAddress.upozilaEng} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Home or Holding No" value={ekyc.applicantPresentAddress.homeOrHoldingNoEng} />
              <TextRow label="Upazila Code" value={ekyc.applicantPresentAddress.upozilaCode} />
            </>
          </Row>
          <Row>
            <>
              <TextRow label="Post Office" value={ekyc.applicantPresentAddress.postOfficeEng} />
              <TextRow label="Ward for Union Parishad" value={ekyc.applicantPresentAddress.wardForUnionPorishod} />
            </>
          </Row>
        </div>
        <div className="mt-4">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Nominee Details</span>
          </h4>
          {ekyc.nominees.map((nominee, index) => {
            return (
              <div key={index}>
                <Row>
                  <>
                    <h4>{`Nominee ${index + 1}`}</h4>
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Name" value={nominee.name} />
                    <TextRow label="Relation" value={nominee.relation} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Father Name" value={nominee.fatherName} />
                    <TextRow label="Mother Name" value={nominee.motherName} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Document Type" value={nominee.docType} />
                    <TextRow label="Document No" value={nominee.docNo} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Percentage" value={nominee.percentage} />
                    <DateRow label="Nominee Date of Birth" value={new Date(nominee.dob)} />
                  </>
                </Row>
                {nominee.isMinor && (
                  <>
                    <Row>
                      <>
                        <TextRow label="Guardian Name" value={nominee.guardian?.name} />
                        <TextRow label="Guardian NID" value={nominee.guardian?.nid} />
                      </>
                    </Row>
                    <Row>
                      <>
                        <TextRow label="Guardian Address" value={nominee.guardian?.address} />
                        <TextRow label="Guardian Relation" value={nominee.guardian?.relation} />
                      </>
                    </Row>
                  </>
                )}

                <div className="p-4 flex flex-col justify-center items-center gap-4 md:flex-row">
                  <ImagePreview
                    label="Nominee Photo"
                    data={nominee.photo}
                    url="/img/placeholder_nominee_photo@2x.png"
                  />
                  <ImagePreview
                    label="Nominee Doc Front Image"
                    data={nominee.docFrontImage}
                    url="/icon/icon_nid_front.svg"
                  />
                  <ImagePreview
                    label="Nominee Doc Back Image"
                    data={nominee.docBackImage}
                    url="/icon/icon_nid_back.svg"
                  />
                  {nominee.isMinor && (
                    <ImagePreview
                      label="Nominee Guardian Image"
                      data={nominee.guardian?.photo}
                      url="/img/placeholder_nominee_photo@2x.png"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Document Details</span>
          </h4>
          <div className="p-4 flex flex-col justify-center items-center gap-4 md:flex-row">
            <ImagePreview
              label="Applicant Photo"
              data={ekyc.applicantFile.photo}
              url="/img/placeholder_nominee_photo@2x.png"
            />
            <ImagePreview label="NID Front Image" data={ekyc.applicantFile.nidFront} url="/icon/icon_nid_front.svg" />
            <ImagePreview label="NID Back Image" data={ekyc.applicantFile.nidBack} url="/icon/icon_nid_back.svg" />
            <ImagePreview
              label="Signature"
              data={ekyc.applicantFile.signature}
              url="/img/placeholder_signature@2x.png"
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="purple" aria-label="Loading" size="xl" />
        </div>
      ) : (
        ''
      )}
      <div className="flex mt-4 flex-col justify-center items-center">
        <div className="w-1/3">
          <Button id="button" label="Confirm" disable={isLoading} onClick={handleSubmit} />
        </div>
        <div className="mt-4 mb-16">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </div>
    </>
  )
}
