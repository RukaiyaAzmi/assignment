import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface UpgradeState {
  step: number
  stepType: 'I' | 'D'
  lastStep: number
  tempStorageId: string
  verificationToken: string
  applicantId: string
  regularAdditionalData: {
    monthlyIncome: string
    sourceOfFund: string
    nationality: string
    riskInfo: string[]
    fatca: {
      fileName: string
      fileType: string
      data: string
    }
    aml: {
      fileName: string
      fileType: string
      data: string
    }
    edd: {
      fileName: string
      fileType: string
      data: string
    }
  }
}

const initState: UpgradeState = {
  step: 1,
  stepType: 'I',
  lastStep: 0,
  tempStorageId: '',
  verificationToken: '',
  applicantId: '',
  regularAdditionalData: {
    monthlyIncome: '',
    sourceOfFund: '',
    nationality: 'Bangladeshi',
    riskInfo: [],
    fatca: {
      fileName: '',
      fileType: '',
      data: '',
    },
    aml: {
      fileName: '',
      fileType: '',
      data: '',
    },
    edd: {
      fileName: '',
      fileType: '',
      data: '',
    },
  },
}

const upgradeSlice = createSlice({
  name: 'upgrade',
  initialState: initState,
  reducers: {
    increment: (state) => {
      state.step = state.step + 1
      state.stepType = 'I'
    },
    decrement: (state) => {
      state.step = state.step - 1
      state.stepType = 'D'
    },
    setPersonal: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.regularAdditionalData[name] = value
    },
    setFileData: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.regularAdditionalData[name].data = value
    },
    setFileType: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.regularAdditionalData[name].fileType = value
    },
    setFileName: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.regularAdditionalData[name].fileName = value
    },
    setApplicantId: (state, action) => {
      const { name, value } = action.payload
      state[name] = value
    },
    setRiskInfo: (state, action) => {
      const { index, value } = action.payload
      state.regularAdditionalData?.riskInfo.splice(index, 1, value)
    },
    // reset the store to Initial state
    resetUpgradeState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const {
  setPersonal,
  setFileData,
  setFileType,
  setFileName,
  setApplicantId,
  setRiskInfo,
  resetUpgradeState,
  increment,
  decrement,
} = upgradeSlice.actions

export default upgradeSlice.reducer
