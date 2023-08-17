import { ICreateEkycRes } from '@interfaces/onboarding.interface'
import { createSlice } from '@reduxjs/toolkit'

export interface EKYCUtilState {
  channelResponse: ICreateEkycRes
}

const initState: EKYCUtilState = {
  channelResponse: {
    statusCode: 0,
    message: '',
    data: {
      accountId: '',
      accountStatus: '',
      channelResponse: {
        details: null,
        result: false,
      },
      accountNo: '',
    },
  },
}

const ekycUtilSlice = createSlice({
  name: 'ekycUtil',
  initialState: initState,
  reducers: {
    setChannelRes: (state, action) => {
      state.channelResponse = action.payload
    },
  },
})

export const { setChannelRes } = ekycUtilSlice.actions

export default ekycUtilSlice.reducer
