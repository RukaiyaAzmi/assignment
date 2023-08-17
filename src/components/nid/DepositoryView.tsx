import React from 'react'
import DateRow from '@components/common/DateRow'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { IAddress, IDepository } from '@interfaces/nid.interface'

interface DepositoryViewProps {
  depository: IDepository
  permanentAddress: IAddress
  presentAddress: IAddress
}

export default function DepositoryView({ depository, permanentAddress, presentAddress }: DepositoryViewProps) {
  const flag = 'data:image/jpeg;base64,'
  return (
    <div className="bg-white py-5 animate__animated animate__fadeIn">
      <img className="w-60 h-40 rounded-md m-auto mb-10" src={flag + depository.image} alt="profile Image" />
      <Row>
        <>
          <TextRow label="Applicant's Nid No" value={depository.nationalId} />
          <TextRow label="Applicant's Name" value={depository.nameEn} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Applicant's Name Bangla" value={depository.name} />
          <TextRow label="Mother's Name" value={depository.mother} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Father's Name" value={depository.father} />
          <DateRow label="Date of Birth" value={depository.dateOfBirth} />
        </>
      </Row>

      <div className=" mt-2 p-4">
        <label className="font-semibold">Permanent Address Details</label>
        <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
        <div className="mt-4 block max-w-full p-8 bg-white border border-gray-200 rounded-lg shadow">
          <p className="font-normal text-gray-700 ">
            <Row>
              <>
                <TextRow label="Mouza Or Moholla" value={permanentAddress.mouzaOrMoholla} />
                <TextRow label="Village Or Road" value={permanentAddress.villageOrRoad} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="City Corp." value={permanentAddress.cityCorporationOrMunicipality} />
                <TextRow label="District" value={permanentAddress.district} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Division " value={permanentAddress.division} />
                <TextRow label="Home Or Holding No" value={permanentAddress.homeOrHoldingNo} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Post Office" value={permanentAddress.postOffice} />
                <TextRow label="Postal Code" value={permanentAddress.postalCode} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Region" value={permanentAddress.region} />
                <TextRow label="Union Or Ward" value={permanentAddress.unionOrWard} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Upozila" value={permanentAddress.upozila} />
                <TextRow label="Ward For Union Porishod" value={permanentAddress.wardForUnionPorishod} />
              </>
            </Row>
          </p>
        </div>
      </div>
      <div className=" mt-2 p-4">
        <label className="font-semibold">Present Address Details</label>
        <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
        <div className="mt-4 block max-w-full p-8 bg-white border border-gray-200 rounded-lg shadow">
          <p className="font-normal text-gray-700 ">
            <Row>
              <>
                <TextRow label="Mouza Or Moholla" value={presentAddress.mouzaOrMoholla} />
                <TextRow label="Village Or Road" value={presentAddress.villageOrRoad} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="City Corp." value={presentAddress.cityCorporationOrMunicipality} />
                <TextRow label="District" value={presentAddress.district} />
              </>
            </Row>

            <Row>
              <>
                <TextRow label="Division " value={presentAddress.division} />
                <TextRow label="Home Or Holding No" value={presentAddress.homeOrHoldingNo} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Post Office" value={presentAddress.postOffice} />
                <TextRow label="Postal Code" value={presentAddress.postalCode} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Region" value={presentAddress.region} />
                <TextRow label="Union Or Ward" value={presentAddress.unionOrWard} />
              </>
            </Row>
            <Row>
              <>
                <TextRow label="Upozila" value={presentAddress.upozila} />
                <TextRow label="Ward For Union Porishod" value={presentAddress.wardForUnionPorishod} />
              </>
            </Row>
          </p>
        </div>
      </div>
    </div>
  )
}
