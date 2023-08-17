import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import { getABSDivision, postABSDistrict, postABSUnionOrWard, postABSUpazila } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { IDistrictRes, IDivisionRes, IUnionOrWardRes, IUpazilaRes } from '@interfaces/onboarding.interface'
import { setPermanentAddress } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

interface IPermanentAddressEnglish {
  //eslint-disable-next-line
  addressError: {}
}

export default function AbsPermanentAddressEnglish({ addressError }: IPermanentAddressEnglish) {
  const [division, setDivision] = useState<IOptionsData[]>([])
  const [district, setDistrict] = useState<IOptionsData[]>([])
  const [upazila, setUpazila] = useState<IOptionsData[]>([])
  const [union, setUnion] = useState<IOptionsData[]>([])
  const dispatch = useDispatch()
  const permanentAddress = useSelector((state: RootState) => state.ekyc.applicantPermanentAddress)
  const { execute: getDivisionData } = useAPIWithToken<IDivisionRes>()
  const { execute: getDistrictData } = useAPIWithToken<IDistrictRes>()
  const { execute: getUpazilaData } = useAPIWithToken<IUpazilaRes>()
  const { execute: getUnionOrWardData } = useAPIWithToken<IUnionOrWardRes>()

  useEffect(() => {
    getDivision()
  }, [])

  useEffect(() => {
    if (permanentAddress.divisionCode !== '') getDistrict()
  }, [permanentAddress.divisionCode])

  useEffect(() => {
    if (permanentAddress.districtCode !== '') getUpazila()
  }, [permanentAddress.districtCode])

  useEffect(() => {
    if (permanentAddress.upozilaCode !== '') getUnionOrWard()
  }, [permanentAddress.upozilaCode])

  const getDivision = async () => {
    try {
      const response = await getDivisionData({
        method: 'GET',
        url: getABSDivision,
      })
      if (response?.statusCode === 200) {
        const newDivision = response?.data
        const newArr: IOptionsData[] = []
        for (const item of newDivision) {
          const resDivision = {} as IOptionsData
          resDivision['key'] = item.divisionCode
          resDivision['value'] = item.divisionName
          newArr.push(resDivision)
        }
        setDivision(newArr)
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getDistrict = async () => {
    try {
      const response = await getDistrictData({
        method: 'POST',
        url: postABSDistrict,
        data: { divisionCode: permanentAddress.divisionCode },
      })
      if (response?.statusCode === 200) {
        const newDistrict = response?.data
        const newArr: IOptionsData[] = []
        for (const item of newDistrict) {
          const resDistrict = {} as IOptionsData
          resDistrict['key'] = item.districtCode
          resDistrict['value'] = item.districtName
          newArr.push(resDistrict)
        }
        setDistrict(newArr)
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getUpazila = async () => {
    try {
      const response = await getUpazilaData({
        method: 'POST',
        url: postABSUpazila,
        data: {
          divisionCode: permanentAddress.divisionCode,
          districtCode: permanentAddress.districtCode,
        },
      })
      if (response?.statusCode === 200) {
        const newUpazila = response?.data

        const newArr: IOptionsData[] = []
        for (const item of newUpazila) {
          const resUpazila = {} as IOptionsData
          resUpazila['key'] = item.upazilaCode
          resUpazila['value'] = item.upazilaName
          newArr.push(resUpazila)
        }
        setUpazila(newArr)
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getUnionOrWard = async () => {
    try {
      const response = await getUnionOrWardData({
        method: 'POST',
        url: postABSUnionOrWard,
        data: {
          divisionCode: permanentAddress.divisionCode,
          districtCode: permanentAddress.districtCode,
          upazilaCode: permanentAddress.upozilaCode,
        },
      })

      if (response?.statusCode === 200) {
        const newUnion = response?.data
        const newArr: IOptionsData[] = []
        for (const item of newUnion) {
          const resUnion = {} as IOptionsData
          resUnion['key'] = item.unionCode
          resUnion['value'] = item.unionName
          newArr.push(resUnion)
        }
        setUnion(newArr)
      }
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }
    dispatch(setPermanentAddress(obj))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name
    const value = e.target.value
    const obj = {
      name,
      value,
    }
    dispatch(setPermanentAddress(obj))
    let obj1
    if (name === 'divisionCode') {
      obj1 = {
        name: 'divisionEng',
        value: e.target.selectedOptions[0].getAttribute('custom-value') ?? '',
      }
    } else if (name === 'districtCode') {
      obj1 = {
        name: 'districtEng',
        value: e.target.selectedOptions[0].getAttribute('custom-value') ?? '',
      }
    } else if (name === 'upozilaCode') {
      obj1 = {
        name: 'upozilaEng',
        value: e.target.selectedOptions[0].getAttribute('custom-value') ?? '',
      }
    } else {
      obj1 = {
        name: 'unionOrWardEng',
        value: e.target.selectedOptions[0].getAttribute('custom-value') ?? '',
      }
    }
    dispatch(setPermanentAddress(obj1))
  }

  return (
    <div className="bg-gray-200 mx-8 p-4 rounded-md">
      <h4 className="capitalize text-xl font-semibold">permanent Address English</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <SelectBox
            id="divisionCode"
            name="divisionCode"
            label="Divison"
            onSelect={handleSelectChange}
            value={permanentAddress.divisionCode}
            options={division}
            error={addressError['divisionEng']}
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <SelectBox
            id="districtCode"
            name="districtCode"
            label="District"
            onSelect={handleSelectChange}
            value={permanentAddress.districtCode}
            options={district}
            error={addressError['districtEng']}
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <SelectBox
            id="upozilaCode"
            name="upozilaCode"
            label="Upazila"
            onSelect={handleSelectChange}
            value={permanentAddress.upozilaCode}
            options={upazila}
            error={addressError['upozilaEng']}
            mandatory
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <SelectBox
            id="unionCode"
            name="unionCode"
            label="Union"
            onSelect={handleSelectChange}
            value={permanentAddress.unionCode}
            options={union}
            error={addressError['unionOrWardEng']}
            mandatory
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="additionalMouzaOrMohollaEng"
            placeholder=""
            type="text"
            name="additionalMouzaOrMohollaEng"
            value={permanentAddress.additionalMouzaOrMohollaEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['additionalMouzaOrMohollaEng']}
            label="Mouza or Moholla"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="additionalVillageOrRoadEng"
            placeholder=""
            type="text"
            name="additionalVillageOrRoadEng"
            value={permanentAddress.additionalVillageOrRoadEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['additionalVillageOrRoadEng']}
            label="Village or Road"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="cityCorporationOrMunicipalityEng"
            placeholder=""
            type="text"
            name="cityCorporationOrMunicipalityEng"
            value={permanentAddress.cityCorporationOrMunicipalityEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['cityCorporationOrMunicipalityEng']}
            label="City Corp. or Municipality"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="homeOrHoldingNoEng"
            placeholder=""
            type="text"
            name="homeOrHoldingNoEng"
            value={permanentAddress.homeOrHoldingNoEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['homeOrHoldingNoEng']}
            label="Home Or Holding NO"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="postOfficeEng"
            placeholder=""
            type="text"
            name="postOfficeEng"
            value={permanentAddress.postOfficeEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['postOfficeEng']}
            label="Post Office"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <TextInputWithLabel
            id="regionEng"
            placeholder=""
            type="text"
            name="regionEng"
            value={permanentAddress.regionEng}
            onChange={handleChange}
            iconUrl="/icon/icon_forAllTextFild.svg"
            error={addressError['regionEng']}
            label="Region"
          />
        </div>
      </div>
    </div>
  )
}
