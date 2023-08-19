import { createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

const categorySlice = createSlice({
  name: 'category',
  initialState: [],
  reducers: {
    setCategory: (state: any, action: any) => {
      for (let i = 0; i < action.payload.length; i++) {
        state.push(action.payload[i])
      }
    },
  },
})

export const { setCategory } = categorySlice.actions
export default categorySlice.reducer
