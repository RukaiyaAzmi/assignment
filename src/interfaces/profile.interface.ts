export interface IProfileDataRes {
  statusCode: number
  message: string
  data: IProfileData
}

export interface IProfileCheck {
  name: string
  email: string
  mobile: string
}

export interface IProfileData {
  name: string
  email: string
  mobile: string
  pinAuthStatus: boolean
  userImage: {
    id: number
    data: string
    mimeType: string
    createDate: Date
    updateDate: Date
  }
}

export interface IProfilePicture {
  data: string
}

export interface IProfileUpdate {
  name: string
  email: string
  mobile: string
  pinAuthStatus: boolean
}

export interface IProfileUpdateRes {
  statusCode: number
  message: string
  data: {
    generatedMaps: []
    raw: []
    affected?: number
  }
}

export interface IPasswordChange {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface IPassword {
  oldPassword: string
  newPassword: string
}
