export interface INidRes {
  statusCode: number
  message: string
  data: {
    limit: number
    totalPages: number
    currentPage: number
    totalNidVerification: number
    nidVerificaion: INidVerificaion[]
  }
}

export interface INidVerificaion {
  id: number
  nid: string
  verificationType: string
  status: string
  createdBy: string
  createDate: Date
}

export interface IVerificationDepositoryRes {
  statusCode: number
  message: string
  data: IDepository
}

export interface IDepository {
  id: number
  nationalId: string
  name: string
  nameEn: string
  bloodGroup: string
  dateOfBirth: Date
  father: string
  mother: string
  spouse: string
  pin: string
  occupation: string
  image: string
  createdBy: string
  createDate: Date
  presentAddress: IAddress
  permanentAddress: IAddress
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
