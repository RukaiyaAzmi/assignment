//***  Create Role ***//
export interface ICreateRole {
  roleName: string
  description: string
}

export interface IRoleCreateRes {
  statusCode: number
  message: string
  data: {
    roleName: string
    description: string
    grantedIPList: string
    rolePrivileges: string[]
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

export interface IRoleListRes {
  statusCode: number
  message: string
  data: IRoleData[]
}

/******************* Role Update **************** */

export interface IRoleUpdateRes {
  statusCode: number
  message: string
  data: {
    roleName: string
    description: string
    grantedIPList: string
    rolePrivileges: string[]
    createdBy: string
    approvedBy: string
    approveDate: Date
    updatedBy: string
    updateDate: Date
    id: number
    status: string
    createDate: Date
    raw: []
    affected?: number
  }
}

export interface IRoleUpdate {
  roleName: string
  description: string
  status: string
}

export interface IRoleApprove {
  generatedMaps: string[]
  raw: string[]
  affected?: number
}

export interface IRoleApproveRes {
  statusCode: number
  message: string
  data: IRoleApprove[]
}
