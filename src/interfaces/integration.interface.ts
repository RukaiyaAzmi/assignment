export interface IAgentPointListRes {
  statusCode: number
  message: string
  data: {
    count: number
    points: { pointId: number; pointName: string }[]
  }
}

export interface IBranchListRes {
  statusCode: number
  message: string
  data: {
    branchCode: string
    branchName: string
    branchAddress: string
  }[]
}
