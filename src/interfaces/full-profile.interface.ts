export interface IProfileDataRes {
  statusCode: number
  message: string
  data: IProfileData
}

export interface IProfileData {
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
  presentAddress: IEntAddress
  permanentAddress: IEntAddress
  account: IAccount
  additionalFiles: IAdditionalFile[]
  nominees: INominee[]
  files: IFiles
  riskGrading: IRiskGrading
  sanctionScreening: string
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
  channelAccountId: string
  createdBy: string
  createDate: Date
}

export interface IAdditionalFile {
  id: number
  type: string
  fileName: string
  fileType: string
  data: IAdditionalFileData
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface IAdditionalFileData {
  type: string
  data: number[]
}

export interface IFiles {
  id: number
  nidFront: string
  nidBack: string
  photo: string
  signature: string
  nidFrontImage: string
  otherFiles: string
}

export interface INominee {
  id: number
  name: string
  relation: string
  dob: Date
  photo: string
  isMinor: boolean
  percentage: number
  fatherName: string
  motherName: string
  docType: string
  docNo: string
  docFrontImage: string
  docBackImage: string
  guardian: IGuardian
}

export interface IGuardian {
  id: number
  nid: string
  name: string
  relation: string
  address: string
  photo: string
}

export interface IEntAddress {
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

export interface IRiskGrading {
  id: number
  riskGradingData: string[]
  score: number
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}
