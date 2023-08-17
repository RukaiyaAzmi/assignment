export interface ISettingRes {
  statusCode: number
  message: string
  data: ISettingData[]
}

export interface ISettingData {
  id: number
  key: string
  value: string
  data: string
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface ISetting {
  EKYC_SANCTION_SCREENING: boolean
  EKYC_DEPOSITORY_USE: boolean
  EKYC_MOBILE_VERIFICATION: boolean
  USER_IDLE_TIMEOUT: string
}

export interface IUpdateSettingRes {
  statusCode: number
  message: string
  data: {
    generatedMaps: Array<object>[]
    raw: Array<object>[]
    affected?: number
  }
}
