export interface IEkycRes {
  statusCode: number
  message: string
  data: {
    count: number
  }
}

export interface IEkycCountRes {
  statusCode: number
  message: string
  data: ICount
}

export interface ICount {
  count: number
}

export interface IEkycCount {
  startDate: Date
  endDate: Date
}

export interface IReportCountRes {
  statusCode: number
  message: string
  data: ICountReport
}

export interface ICountReport {
  accountCount: number
  userCount: number
  roleCount: number
  ekycCount: number
  verificationCount: number
}

export interface IChartRes {
  statusCode: number
  message: string
  data: {
    month: number
    count: string
  }[]
}

export interface IBarChartRes {
  statusCode: number
  message: string
  data: {
    day: string
    count: string
  }[]
}

export interface IChart {
  month: number
  count: string
}

export interface IBarChart {
  day: string
  count: string
}

export interface ILineData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    pointBackgroundColor: string
    pointBorderColor: string
  }[]
}
