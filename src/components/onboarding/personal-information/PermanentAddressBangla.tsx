import TextInputWithLabel from '@components/common/TextInputWithLabel'
import { setPermanentAddress } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface IPermanentAddressBangla {
  //eslint-disable-next-line
  addressError: {}
}

export default function PermanentAddressBangla({ addressError }: IPermanentAddressBangla) {
  const dispatch = useDispatch()
  const permanentAddress = useSelector((state: RootState) => state.ekyc.applicantPermanentAddress)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }
    dispatch(setPermanentAddress(obj))
  }

  return (
    <div className="bg-gray-200 mx-8 p-4 rounded-md">
      <h4 className="capitalize text-xl font-semibold">permanent Address Bangla</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="division"
            placeholder=""
            type="text"
            name="division"
            value={permanentAddress.division}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['division']}
            label="Division"
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="district"
            placeholder=""
            type="text"
            name="district"
            value={permanentAddress.district}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['district']}
            label="District"
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="upozila"
            placeholder=""
            type="text"
            name="upozila"
            value={permanentAddress.upozila}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['upozila']}
            label="Upazila"
            mandatory
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="unionOrWard"
            placeholder=""
            type="text"
            name="unionOrWard"
            value={permanentAddress.unionOrWard}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['unionOrWard']}
            label="Union or Ward"
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="additionalMouzaOrMoholla"
            placeholder=""
            type="text"
            name="additionalMouzaOrMoholla"
            value={permanentAddress.additionalMouzaOrMoholla}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['additionalMouzaOrMoholla']}
            label="Mouza or Moholla"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="additionalVillageOrRoad"
            placeholder=""
            type="text"
            name="additionalVillageOrRoad"
            value={permanentAddress.additionalVillageOrRoad}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['additionalVillageOrRoad']}
            label="Village or Road"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="cityCorporationOrMunicipality"
            placeholder=""
            type="text"
            name="cityCorporationOrMunicipality"
            value={permanentAddress.cityCorporationOrMunicipality}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['cityCorporationOrMunicipality']}
            label="City Corp. or Municipality"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="homeOrHoldingNo"
            placeholder=""
            type="text"
            name="homeOrHoldingNo"
            value={permanentAddress.homeOrHoldingNo}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['homeOrHoldingNo']}
            label="Home Or Holding NO"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="postOffice"
            placeholder=""
            type="text"
            name="postOffice"
            value={permanentAddress.postOffice}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['postOffice']}
            label="Post Office"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="postalCode"
            placeholder=""
            type="text"
            name="postalCode"
            value={permanentAddress.postalCode}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['postalCode']}
            label="Postal Code"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="region"
            placeholder=""
            type="text"
            name="region"
            value={permanentAddress.region}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['region']}
            label="Region"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="rmo"
            placeholder=""
            type="text"
            name="rmo"
            value={permanentAddress.rmo}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['rmo']}
            label="RMO"
          />
        </div>
      </div>
    </div>
  )
}
