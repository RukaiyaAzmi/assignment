export interface IAdditionalRes {
  statusCode: number
  message: string
  data: IAdditionalFileData
}

export interface IAdditionalFileData {
  id: string
  nid: string
  additionalFiles: IAdditionalFile[]
}

export interface IAdditionalFile {
  id: number
  type: string
  fileName: string
  fileType: string
  data: string
  createdBy: string
  createDate: Date
  updatedBy: null
  updateDate: Date
}
