export interface IAccessLogRes {
  statusCode: number
  message: string
  data: IAccessLogAll
}

export interface IAccessLogAll {
  limit: number
  totalPages: number
  currentPage: number
  totalLogs: number
  data: IAccessLog[]
}

export interface IAccessLog {
  id: number
  loginDateTime: Date
  logoutDateTime: Date
  userIdRef: string
}
