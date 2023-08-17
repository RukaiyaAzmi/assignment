export interface ITpCreateRes {
  statusCode: number
  message: string
  data: {
    ekycType: string
    productCategoryCode: string
    channelCode: string
    minLimit: number
    maxLimit: number
    status: string
    createdBy: string
    updatedBy: string
    id: number
    createDate: Date
    updateDate: Date
  }
}

export interface ITpCreate {
  ekycType: string
  productCategoryCode: string
  channelCode: string
  minLimit: string
  maxLimit: string
  status: string
}

export interface ITransactionProfileRes {
  statusCode: number
  message: string
  data: ITransactionProfile[]
}

export interface ITransactionProfile {
  id: number
  ekycType: string
  channelCode: string
  productCategoryCode: string
  minLimit: number
  maxLimit: number
  status: string
  createdBy: string
  createDate: Date
  updatedBy: string
  updateDate: Date
}

export interface ITransactionProfileDeleteRes {
  statusCode: number
  message: string
  data: ITransactionProfilepDelete
}

export interface ITransactionProfilepDelete {
  raw: string[]
  affected?: number
}

export interface ITpUpdateRes {
  statusCode: number
  message: string
  data: ITpDataRes
}

export interface ITpDataRes {
  generatedMaps: string[]
  raw: string[]
  affected?: number
}

export interface ITpData {
  ekycType: string
  channelCode: string
  productCategoryCode: string
  minLimit: string
  maxLimit: string
  status: string
}
