export interface IAbsAccouontCheck {
  statusCode: number
  message: string
  data: {
    result: boolean
    channelResponse: {
      AC_INFO: {
        RESPONSE_CODE: string
        RESPONSE_MSG: string
      }
    }
  }
}

export interface ICbsAccouontCheck {
  statusCode: number
  message: string
  data: {
    result: boolean
    details: {
      responseMessage: string
      status: boolean
      responseCode: string
    }
  }
}

export interface IProductGetRes {
  statusCode: number
  message: string
  data: IProductListData[]
}

export interface IProductListData {
  id: number
  name: string
  code: string
  categoryCode: string
  channelCode: string
  subChannelCode: string
  status: string
  description: string
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface IAccountinfo {
  title: string
  type: string
  productType: string
  productCode: string
  productCategoryCode: string
  branchOrAgentPointCode: string
  transactionOrMaturityAmount: number
  channelCode: string
}

export interface IGetEkycTypeRes {
  statusCode: number
  message: string
  data: {
    ekycType: string
  }
}

export interface ISendOtpRes {
  statusCode: number
  message: string
  data: {
    convalToken: string
  }
}

export interface ISendOtp {
  mobile: string
}

export interface IverifyOtpRes {
  statusCode: number
  message: string
  status: boolean
}

export interface IVerifyOtp {
  otp: string
}

export interface IGetTempDataRes {
  statusCode: number
  message: string
  data: {
    id: string
    mobile: string
    data: null
    status: string
    createdBy: string
    createDate: Date
    updatedBy: string
    updateDate: Date
  }
}

export interface ICreateTemp {
  statusCode: number
  message: string
  data: {
    mobile: string
    data: null
    createdBy: string
    updatedBy: string
    id: string
    status: string
    createDate: Date
    updateDate: Date
  }
}
export interface IFingerPrintRes {
  '0': {
    fingerId: number
    fingerLength: number
    fingerScore: number
    fingerData: string
  }
  '1': {
    fingerId: number
    fingerLength: number
    fingerScore: number
    fingerData: string
  }
  '2': {
    fingerId: number
    fingerLength: number
    fingerScore: number
    fingerData: string
  }
  '3': {
    fingerId: number
    fingerLength: number
    fingerScore: number
    fingerData: string
  }
}

export interface IFingerprintVerificationRes {
  statusCode: number
  message: string
  data: {
    fingerVerificationResult: {
      status: boolean
      details: {
        result: boolean
        details: {
          name: string
          nameEn: string
          bloodGroup: string
          dateOfBirth: Date
          father: string
          mother: string
          spouse: string
          nationalId: string
          pin: string
          occupation: string
          permanentAddress: IAddress
          photo: string
          presentAddress: IAddress
        }
      }
    }
    verificationToken: string
  }
}

export interface IFaceVerificationRes {
  statusCode: number
  message: string
  data: {
    faceVerificationResult: {
      status: boolean
      details: {
        distance: number
        result: string
      }
    }
    verificationToken: string
  }
}

export interface INidRpaRes {
  statusCode: number
  message: string
  data: {
    nameBan: string
    nameEng: string
    bloodGroup: string
    dob: string
    fatherName: string
    motherName: string
    spouseName: string
    nid: string
    pin: string
    occupation: string
    permanentAddress: IAddress
    image: string
    presentAddress: IAddress
  }
}
export interface IAddress {
  division: string
  district: string
  rmo: string
  upozila: string
  postOffice: string
  postalCode: string
  additionalMouzaOrMoholla: string
  additionalVillageOrRoad: string
  homeOrHoldingNo: string
  region: string
  cityCorporationOrMunicipality?: string
  unionOrWard?: string
  wardForUnionPorishod?: number
  villageOrRoad?: string
  mouzaOrMoholla?: string
}

export interface IDivisionRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    divisionShortName: string
    divisionName: string
  }[]
}

export interface ICBSDivisionRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    divisionName: string
  }[]
}

export interface IDivision {
  divisionCode: string
  divisionShortName: string
  divisionName: string
}

export interface IDistrictRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    districtCode: string
    districtCodeGov: string
    districtShortName: string
    districtName: string
  }[]
}

export interface ICBSDistrictRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    districtCode: string
    districtName: string
  }[]
}

export interface IUpazilaRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    districtCode: string
    upazilaCode: string
    upazilaCodeGov: string
    upazilaShortName: string
    upazilaName: string
  }[]
}

export interface ICBSUpazilaRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    districtCode: string
    upazilaCode: string
    upazilaName: string
  }[]
}

export interface IUnionOrWardRes {
  statusCode: number
  message: string
  data: {
    divisionCode: string
    districtCode: string
    upazilaCode: string
    unionCode: string
    unionCodeGov: string
    unionShortName: string
    unionName: string
  }[]
}

export interface ICBSUnionOrWardRes {
  statusCode: number
  message: string
  data: {
    countryCode: string
    divisionCode: string
    districtCode: string
    upazilaCode: string
    unionCode: string
    unionName: string
  }[]
}

export interface IRiskInfo {
  onBoardingValue: string
  geoRiskClient: string
  foreignOrigin: string
  highOfficial: string
  closeHighOfficial: string
  isClientIp: string
  productTypes: string
  // occupation: string
  // businessName: string
  professionName: string
  yearlyTransaction: string
  hasSourceOfFunds: string
}

export interface IUpgradeRiskInfo {
  onBoardingValue: string
  geoRiskClient: string
  foreignOrigin: string
  highOfficial: string
  closeHighOfficial: string
  isClientIp: string
  productTypes: string
  occupation: string
  professionName: string
  yearlyTransaction: string
  hasSourceOfFunds: string
}

export interface ISimplifiedEkycRes {
  statusCode: number
  message: string
  data: ISimplifiedData[]
}

export interface ISimplifiedData {
  id: string
  nid: string
  tin: string
  name: string
  nameBangla: string
  dob: string
  dobDate: string
  motherName: string
  motherNameBangla: string
  fatherName: string
  fatherNameBangla: string
  spouseName: string
  gender: string
  profession: string
  mobile: string
  email: string
  monthlyIncome: string
  sourceOfFund: string
  nationality: string
  religion: string
  pin: string
  operatorType: string
  verificationType: string
  onboardingType: string
  verificationStatus: string
  verificationDate: string
  reviewCount: number
  createdBy: string
  createDate: string
  updatedBy: string
  updateDate: string
  presentAddress: {
    id: number
    addressType: string
    districtCode: string
    upozilaCode: string
    unionCode: string
    additionalMouzaOrMoholla: string
    additionalVillageOrRoad: string
    cityCorporationOrMunicipality: string
    district: string
    division: string
    homeOrHoldingNo: string
    postOffice: string
    region: string
    unionOrWard: string
    upozila: string
    postalCode: string
    rmo: string
    wardForUnionPorishod: string
    additionalMouzaOrMohollaEng: string
    additionalVillageOrRoadEng: string
    cityCorporationOrMunicipalityEng: string
    districtEng: string
    divisionEng: string
    homeOrHoldingNoEng: string
    postOfficeEng: string
    regionEng: string
    unionOrWardEng: string
    upozilaEng: string
  }
  permanentAddress: {
    id: number
    addressType: string
    districtCode: string
    upozilaCode: string
    unionCode: string
    additionalMouzaOrMoholla: string
    additionalVillageOrRoad: string
    cityCorporationOrMunicipality: string
    district: string
    division: string
    homeOrHoldingNo: string
    postOffice: string
    region: string
    unionOrWard: string
    upozila: string
    postalCode: string
    rmo: string
    wardForUnionPorishod: string
    additionalMouzaOrMohollaEng: string
    additionalVillageOrRoadEng: string
    cityCorporationOrMunicipalityEng: string
    districtEng: string
    divisionEng: string
    homeOrHoldingNoEng: string
    postOfficeEng: string
    regionEng: string
    unionOrWardEng: string
    upozilaEng: string
  }
  account: {
    id: string
    title: string
    type: string
    productType: string
    productCode: string
    productCategoryCode: string
    branchOrAgentPointCode: string
    transactionOrMaturityAmount: number
    tenor: string
    status: string
    channelCode: string
    channelResponse: string
    channelAccountId: string
    createdBy: string
    createDate: string
  }
}

export interface ISimplifiedFullProfileRes {
  statusCode: number
  message: string
  data: {
    id: string
    nid: string
    tin: string
    name: string
    nameBangla: string
    dob: string
    dobDate: string
    motherName: string
    motherNameBangla: string
    fatherName: string
    fatherNameBangla: string
    spouseName: string
    gender: string
    profession: string
    mobile: string
    email: string
    monthlyIncome: string
    sourceOfFund: string
    nationality: string
    religion: string
    pin: string
    operatorType: string
    verificationType: string
    onboardingType: string
    verificationStatus: string
    verificationDate: string
    reviewCount: number
    createdBy: string
    createDate: string
    updatedBy: string
    updateDate: string
    presentAddress: {
      id: number
      addressType: string
      districtCode: string
      upozilaCode: string
      unionCode: string
      additionalMouzaOrMoholla: string
      additionalVillageOrRoad: string
      cityCorporationOrMunicipality: string
      district: string
      division: string
      homeOrHoldingNo: string
      postOffice: string
      region: string
      unionOrWard: string
      upozila: string
      postalCode: string
      rmo: string
      wardForUnionPorishod: string
      additionalMouzaOrMohollaEng: string
      additionalVillageOrRoadEng: string
      cityCorporationOrMunicipalityEng: string
      districtEng: string
      divisionEng: string
      homeOrHoldingNoEng: string
      postOfficeEng: string
      regionEng: string
      unionOrWardEng: string
      upozilaEng: string
    }
    permanentAddress: {
      id: number
      addressType: string
      districtCode: string
      upozilaCode: string
      unionCode: string
      additionalMouzaOrMoholla: string
      additionalVillageOrRoad: string
      cityCorporationOrMunicipality: string
      district: string
      division: string
      homeOrHoldingNo: string
      postOffice: string
      region: string
      unionOrWard: string
      upozila: string
      postalCode: string
      rmo: string
      wardForUnionPorishod: string
      additionalMouzaOrMohollaEng: string
      additionalVillageOrRoadEng: string
      cityCorporationOrMunicipalityEng: string
      districtEng: string
      divisionEng: string
      homeOrHoldingNoEng: string
      postOfficeEng: string
      regionEng: string
      unionOrWardEng: string
      upozilaEng: string
    }
    account: {
      id: string
      title: string
      type: string
      productType: string
      productCode: string
      productCategoryCode: string
      branchOrAgentPointCode: string
      transactionOrMaturityAmount: number
      tenor: string
      status: string
      channelCode: string
      channelResponse: string
      channelAccountId: string
      createdBy: string
      createDate: string
    }
  }
}

export interface IUpgradeRes {
  statusCode: number
  message: string
  data: {
    generatedMaps: []
    raw: string[]
    affected?: number
  }
}

export interface IABSProfessionRes {
  data: {
    statusCode: number
    message: string
    data: {
      id: number
      displayName: string
      code: string
      channelCode: string
      status: string
      createdBy: string
      createDate: Date
      updatedBy: string
      updateDate: Date
    }[]
  }
}

export interface ICBSProfessionRes {
  data: {
    statusCode: number
    message: string
    data: {
      code: string
      name: string
    }[]
  }
}

export interface ICBSRelationRes {
  data: {
    statusCode: number
    message: string
    data: {
      code: string
      name: string
    }[]
  }
}

export interface ITempDataRes {
  statusCode: number
  message: string
  data: {
    generatedMaps: string[]
    raw: string[]
    affected?: number
  }
}

export interface INidOcrRes {
  statusCode: number
  message: string
  data: {
    nidFront: {
      banName: string
      engName: string
      banFatherName: string
      banMotherName: string
      dob: string
      nid: string
    }
    nidBack: {
      banAddress: string
      bloodGroup: string
      placeOfBirth: string
      issueDate: string
    }
    nidFrontRaw: string
    nidBackRaw: string
    formatted: {
      dob: string
    }
  }
}

export interface IUpgrade {
  applicantId: string
  regularAdditionalData: {
    monthlyIncome: number
    sourceOfFund: string
    nationality: string
    riskInfo: string[]
    fatca: {
      fileName: string
      fileType: string
      data: string
    }
    aml: {
      fileName: string
      fileType: string
      data: string
    }
    edd: {
      fileName: string
      fileType: string
      data: string
    }
  }
}
// export interface ICreateEkycRes {
//   statusCode: number
//   message: string
//   data: {
//     accountId: string
//     accountStatus: string
//     channelResponse: {
//       details: any
//       result: boolean
//     }
//   }
// }
export interface ICreateEkycRes {
  statusCode: number
  message: string
  data: {
    accountId: string
    accountStatus: string
    channelResponse: {
      //eslint-disable-next-line
      details: any
      result: boolean
    }
    accountNo: string
  }
}
