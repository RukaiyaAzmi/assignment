import { CHANNEL } from './channel.interface'

export interface IUserLogin {
  userId: string
  password: string
  channelLogin: boolean
}

export interface IUserLoginRes {
  statusCode: number
  message: string
  data: {
    authToken: string
    features: string[]
    branchOrAgentPointCode: string[]
    branchOrAgentPointName: string[]
    channelCode: CHANNEL
    loginToken: string
  }
}

export interface IUserLogoutRes {
  statusCode: number
  message: string
  data: {
    affected?: number
  }
}

export interface IUserData {
  id: number
  roleName: string
  description: string
  status: string
  grantedIPList: string[]
  rolePrivileges: Array<string[]>
  approvedBy: string
  approveDate: Date
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface IUserDetailsRes {
  statusCode: number
  message: string
  data: IUser[]
}

export interface IUser {
  id: number
  userId: string
  name: string
  mobile: string
  email: string
  channelCode: string
  status: string
  pinAuthStatus: boolean
  approvedBy: string
  approveDate: Date
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
  roles: IRole[]
}

export interface IRole {
  id: number
  roleName: string
  description: string
  status: string
  grantedIPList: string[]
  rolePrivileges: Array<string[]>
  approvedBy: string
  approveDate: Date
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface ICreateUser {
  statusCode: number
  message: string
  data: IUserData[]
}

export interface IUserCreate {
  userId: string
  channelCode: string
  name: string
  password: string
  conirmPassword?: string
  email: string
  mobile: string
  pinAuthStatus: boolean
  roles: number[]
}

export interface IUserCreateRes {
  statusCode: number
  message: string
  data: {
    userId: string
    name: string
    mobile: string
    email: string
    channelCode: string
    pinAuthStatus: boolean
    createdBy: string
    approvedBy: string
    approveDate: Date
    updatedBy: string
    updateDate: Date
    id: number
    status: string
    createDate: Date
  }
}

export interface IUserCheck {
  userId: string
  email: string
  mobile: string
}

export interface IUserCheckRes {
  statusCode: number
  message: string
  data: boolean
}

export interface IUserUpdate {
  userId: string
  channelCode: string
  name: string
  email: string
  mobile: string
  pinAuthStatus: boolean
  status: string
  roles: number[]
}
export interface IUserUpdateRes {
  statusCode: number
  message: string
  data: {
    userId: string
    name: string
    mobile: string
    email: string
    channelCode: string
    pinAuthStatus: boolean
    createdBy: string
    approvedBy: string
    approveDate: Date
    updatedBy: string
    updateDate: Date
    id: number
    status: string
    createDate: Date
  }
}
export interface IRoleData {
  id: number
  roleName: string
  description: string
  status: string
  grantedIPList: string[]
  rolePrivileges: Array<string[]>
  approvedBy: string
  approveDate: Date
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface IUserProfileDetailsRes {
  statusCode: number
  message: string
  data: IUserProfileData
}

export interface IUserProfileData {
  name: string
  email: string
  mobile: string
  pinAuthStatus: boolean
  userImage: IUserImage
}

export interface IUserImage {
  id: number
  data: string
  mimeType: string
  createDate: Date
  updateDate: Date
}
export interface IUserData {
  id: number
  userId: string
  name: string
  mobile: string
  email: string
  channelCode: string
  status: string
  pinAuthStatus: boolean
  approvedBy: string
  approveDate: Date
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
  roles: IRoleData[]
}

export interface IUserListRes {
  statusCode: number
  message: string
  data: {
    limit: number
    totalPages: number
    currentPage: number
    totalUsers: number
    users: IUserData[]
  }
}

export interface IUserStatusRes {
  statusCode: number
  message: string
  data: IUserData[]
}

export interface IForgetPassRes {
  statusCode: number
  message: string
  data: {
    convalToken: string
  }
}

export interface IForgetPassVerifyRes {
  statusCode: number
  message: string
  status: boolean
}

export interface IForgetPassConfirmRes {
  statusCode: number
  message: string
  data: {
    generatedMaps: []
    raw: []
    affected: number
  }
}

export interface IForgetPass {
  userId: string
}

export interface IForgetPassVerify {
  otp: string
}

export interface IForgetPassConfirm {
  newPassword: string
  confirmPassword: string
}
