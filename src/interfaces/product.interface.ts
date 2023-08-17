//***  Create Product*********** */

export interface ICreateProduct {
  name: string
  channelCode: string
  code: string
  categoryCode: string
  subChannelCode: string
  description: string
  status: string
}

export interface ICreateProductRes {
  statusCode: number
  message: string
  data: {
    name: string
    code: string
    description: string
    categoryCode: string
    channelCode: string
    subChannelCode: string
    status: string
    createdBy: string
    updatedBy: string
    id: number
    createDate: Date
    updateDate: Date
  }
}

//***  Product  List *********** */

export interface IProductData {
  id: number
  name: string
  code: string
  description: string
  categoryCode: string
  channelCode: string
  subChannelCode: string
  status: string
}

export interface IProductListRes {
  statusCode: number
  message: string
  data: IProductreDetails[]
}

///************      Product Update  ********* */

export interface IProductUpdate {
  statusCode: number
  message: string
  data: {
    generatedMaps: string[]
    raw: string[]
    affected?: number
  }
}

export interface IProductUpdateRes {
  statusCode: number
  message: string
  data: {
    id: number
    name: string
    code: string
    categoryCode: string
    subChannelCode: string
    channelCode: string
    status: string
    description: string
  }
}

export interface IUpdateProduct {
  name: string
  code: string
  description: string
  categoryCode: string
  channelCode: string
  subChannelCode: string
  status: string
}

export interface IProductreDetails {
  id: number
  name: string
  code: string
  description: string
  categoryCode: string
  channelCode: string
  subChannelCode: string
  status: string
  createdBy: string
  updatedBy: string
  createDate: Date
  updateDate: Date
}
