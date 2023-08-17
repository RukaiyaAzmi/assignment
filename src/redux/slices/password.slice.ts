import { createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface ResetPasswordState {
  step: number
  stepType: 'I' | 'D'
  lastStep: number
  userId: string
  otp: string
  newPassword: string
  convalToken: string
  mobileToken: string
}

const initState: ResetPasswordState = {
  step: 1,
  stepType: 'I',
  lastStep: 0,
  userId: '',
  otp: '',
  newPassword: '',
  convalToken: '',
  mobileToken: '',
}

const resetPasswordSlice = createSlice({
  name: 'password',
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
    setConvalToken: (state, action) => {
      const { name, value } = action.payload
      state[name] = value
    },
    setMobileToken: (state, action) => {
      const { name, value } = action.payload
      state[name] = value
    },
    resetPasswordState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const { increment, decrement, setConvalToken, setMobileToken, resetPasswordState } = resetPasswordSlice.actions

export default resetPasswordSlice.reducer
