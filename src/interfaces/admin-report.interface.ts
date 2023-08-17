export interface IAdminReport {
  statusCode: number
  message: string
  data: {
    limit: number
    totalPages: number
    currentPage: number
    totalEkyc: number
    ekyc: IEkyc[]
  }
}
export interface ISearchRes {
  statusCode: number
  message: string
  data: IEkyc[]
}

export interface IEkyc {
  id: string
  nid: string
  tin: number
  name: string
  nameBangla: string
  dob: string
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
  pin: number
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
  presentAddress: IAddress
  permanentAddress: IAddress
  account: IAccount
}

export interface IAccount {
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
  channelAccountId: number
  createdBy: string
  createDate: Date
}

export interface IAddress {
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
