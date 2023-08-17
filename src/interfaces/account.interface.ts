export interface IAccountRes {
  statusCode: number
  message: string
  data: {
    limit: number
    totalPages: number
    currentPage: number
    totalAccount: number
    accounts: IAccount[]
  }
}

export interface IAccount {
  id: number
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
  createDate: Date
}

export interface IAccountData {
  channelCode: string
  productCategoryCode: string
  status: string
  type: string
}

export interface IAccountReopenRes {
  statusCode: number
  message: string
  data: {
    accountId: string
    channelResponse: string
    accountStatus: string
  }
}

export interface IAccountDiscard {
  statusCode: number
  message: string
  data: {
    generatedMaps: []
    raw: string[]
    affected?: number
  }
}

export interface IChannelRes {
  statusCode: number
  message: string
  data: {
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
    createDate: Date
    applicants: IApplicants[]
  }
}

export interface IApplicants {
  id: string
  nid: string
  tin: string
  name: string
  nameBangla: string
  dob: Date
  dobDate: Date
  motherName: string
  motherNameBangla: string
  fatherName: string
  fatherNameBangla: string
  spouseName: string
  gender: string
  profession: string
  mobile: string
  email: string
  monthlyIncome: number
  sourceOfFund: string
  nationality: string
  religion: string
  pin: string
  operatorType: string
  verificationType: string
  onboardingType: string
  verificationStatus: string
  verificationDate: Date
  reviewCount: number
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
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
  nominees: []
  files: {
    id: number
    nidFront: string
    nidBack: string
    photo: string
    signature: string
    nidFrontImage: string
    otherFiles: string
  }
  riskGrading: {
    id: number
    riskGradingData: []
    score: number
    createdBy: string
    createDate: Date
    updatedBy: string
    updateDate: Date
  }
  sanctionScreening: string
  additionalFiles: []
}

export interface IChannelData {
  channelCode: string
  channelAccountId: string
}
