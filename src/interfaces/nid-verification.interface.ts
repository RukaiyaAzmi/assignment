import { IAddress } from './onboarding.interface'

export interface INidFingerprintVerificationRes {
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
    nidVerification: {
      nid: string
      verificationType: string
      status: string
      createdBy: string
      id: number
      createDate: string
    }
  }
}

export interface INidFaceVerificationRes {
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
    nidVerification: {
      nid: string
      verificationType: string
      status: string
      createdBy: string
      id: number
      createDate: string
    }
  }
}
