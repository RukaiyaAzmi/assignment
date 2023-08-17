import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import TextRowFull from '@components/common/TextRowFull'
import { RootState } from '@redux/store'
import { imageConverter } from '@utils/converter.utils'
import React from 'react'
import { useSelector } from 'react-redux'

export default function NidVerificationPreview() {
  const nidValue = useSelector((state: RootState) => state.verification)
  return (
    <div className="bg-white shadow-md m-8">
      <div className="flex flex-col justify-center items-center p-4">
        <img className=" w-24 h-24 rounded-full" src={imageConverter(nidValue.applicantFile.nidFrontImage)} alt="" />
        <p className=" font-semibold">{nidValue.applicant.name}</p>
      </div>

      <div className="flex flex-col p-4 gap-4">
        <div className="w-full shadow-md">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Details</span>
          </h4>
          <div className="mt-4">
            <Row>
              <>
                <TextRow label="Applicant Nid No" value={nidValue.applicant.nid} />
                <TextRow label="Applicant Name" value={nidValue.applicant.name} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Applicant Name Bangla" value={nidValue.applicant.nameBangla} />
                <TextRow label="Mother Name Bangla" value={nidValue.applicant.motherNameBangla} />
              </>
            </Row>
            <Row>
              <TextRowFull label="Father Name Bangla" value={nidValue.applicant.fatherNameBangla} />
            </Row>
          </div>
        </div>
        <div className="w-full shadow-md">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Present Address</span>
          </h4>
          <div className="mt-4">
            <Row>
              <>
                <TextRow label="Mouza or Moholla" value={nidValue.applicantPresentAddress.additionalMouzaOrMoholla} />
                <TextRow label="Postal Code" value={nidValue.applicantPresentAddress.postalCode} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Village or Road" value={nidValue.applicantPresentAddress.additionalVillageOrRoad} />
                <TextRow label="Region" value={nidValue.applicantPresentAddress.region} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="City Corp." value={nidValue.applicantPresentAddress.cityCorporationOrMunicipality} />
                <TextRow label="RMO" value={nidValue.applicantPresentAddress.rmo} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="District" value={nidValue.applicantPresentAddress.district} />
                <TextRow label="Union or Ward" value={nidValue.applicantPresentAddress.unionOrWard} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="District Code" value={nidValue.applicantPresentAddress.districtCode} />
                <TextRow label="Union or Ward Code" value={nidValue.applicantPresentAddress.unionCode} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Division" value={nidValue.applicantPresentAddress.division} />
                <TextRow label="Upazila" value={nidValue.applicantPresentAddress.upozila} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Home or Holding No" value={nidValue.applicantPresentAddress.homeOrHoldingNo} />
                <TextRow label="Upazila Code" value={nidValue.applicantPresentAddress.upozilaCode} />
              </>
            </Row>

            <Row>
              <TextRowFull label="Post Office" value={nidValue.applicantPresentAddress.postOffice} />
            </Row>
            <Row>
              <TextRowFull
                label="Ward for Union Parishad"
                value={nidValue.applicantPresentAddress.wardForUnionPorishod}
              />
            </Row>
          </div>
        </div>
        <div className="w-full mb-8">
          <h4 className="text-lg mb-4 capitalize bg-gray-300 p-3 rounded-md">
            <span className="ml-6">Permanent Address</span>
          </h4>
          <div className="mt-4">
            <Row>
              <>
                <TextRow label="Mouza or Moholla" value={nidValue.applicantPermanentAddress.additionalMouzaOrMoholla} />
                <TextRow label="Postal Code" value={nidValue.applicantPermanentAddress.postalCode} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Village or Road" value={nidValue.applicantPermanentAddress.additionalVillageOrRoad} />
                <TextRow label="Region" value={nidValue.applicantPermanentAddress.region} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="City Corp." value={nidValue.applicantPermanentAddress.cityCorporationOrMunicipality} />
                <TextRow label="RMO" value={nidValue.applicantPermanentAddress.rmo} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="District" value={nidValue.applicantPermanentAddress.district} />
                <TextRow label="Union or Ward" value={nidValue.applicantPermanentAddress.unionOrWard} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="District Code" value={nidValue.applicantPermanentAddress.districtCode} />
                <TextRow label="Union or Ward Code" value={nidValue.applicantPermanentAddress.unionCode} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Division" value={nidValue.applicantPermanentAddress.division} />
                <TextRow label="Upazila" value={nidValue.applicantPermanentAddress.upozila} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Home or Holding No" value={nidValue.applicantPermanentAddress.homeOrHoldingNo} />
                <TextRow label="Upazila Code" value={nidValue.applicantPermanentAddress.upozilaCode} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Post Office" value={nidValue.applicantPermanentAddress.postOffice} />
                <TextRow
                  label="Ward for Union Parishad"
                  value={nidValue.applicantPermanentAddress.wardForUnionPorishod}
                />
              </>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}
