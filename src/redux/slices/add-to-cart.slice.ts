import { createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface AddToCartState {
  id: number[]
}

const initState: AddToCartState = {
  id: [],
}

const addToCartSlice = createSlice({
  name: 'cartId',
  initialState: initState,
  reducers: {
    setIdToCart: (state: any, action: any) => {
      state.id.push(action.payload)
    },
  },
})

export const { setIdToCart } = addToCartSlice.actions
export default addToCartSlice.reducer
