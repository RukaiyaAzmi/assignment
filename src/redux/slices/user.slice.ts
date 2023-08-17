import { CHANNEL } from '@interfaces/channel.interface'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  channelCode: CHANNEL
  branchOrAgentPointCode: string[]
  branchOrAgentPointName: string[]
  features: string[]
  currentBranchOrAgentPointCode?: string
}

const initState: UserState = {
  channelCode: CHANNEL.EKYC,
  branchOrAgentPointCode: [],
  branchOrAgentPointName: [],
  features: [],
  currentBranchOrAgentPointCode: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    updateUserDetails: (state, action: PayloadAction<UserState>) => {
      state.channelCode = action.payload.channelCode
      state.branchOrAgentPointName = action.payload.branchOrAgentPointName
      state.branchOrAgentPointCode = action.payload.branchOrAgentPointCode
      state.features = action.payload.features
    },
    updateCurrentBranchOrAgentPoint: (state, action: PayloadAction<string>) => {
      state.currentBranchOrAgentPointCode = action.payload
    },
  },
})

export const { updateUserDetails, updateCurrentBranchOrAgentPoint } = userSlice.actions

export default userSlice.reducer
