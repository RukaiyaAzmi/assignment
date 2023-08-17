import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAlert {
  hidden?: boolean
  type?: 'info' | 'danger' | 'success' | 'warning'
  title?: string
  message?: string
}

export interface GlobalState {
  lang: string
  alert: IAlert
}

const initState: GlobalState = {
  lang: 'en',
  alert: {
    hidden: true,
    type: 'info',
    title: '',
    message: '',
  },
}

export const globalSlice = createSlice({
  name: 'global',
  initialState: initState,
  reducers: {
    changeLang: (state, action: PayloadAction<string>) => {
      state.lang = action.payload
    },
    changeAlert: (state, action: PayloadAction<IAlert>) => {
      state.alert = { ...state.alert, ...action.payload }
    },
  },
})

export const { changeLang, changeAlert } = globalSlice.actions

export default globalSlice.reducer
