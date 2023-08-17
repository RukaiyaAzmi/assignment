import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface ProductState {
  products: [
    {
      id: number
      title: string
      description: string
      price: string
      brand: string
      category: string
      thumbnail: string
      stock: string
    },
  ]
}

const initState: ProductState = {
  products: [
    {
      id: 0,
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      thumbnail: '',
      stock: '',
    },
  ],
}

const productSlice = createSlice({
  name: 'product',
  initialState: initState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
      //   const { name, value } = action.payload
      //   state[name] = value
    },
    // reset the store to Initial state
    resetUpgradeState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const { setProducts, resetUpgradeState } = productSlice.actions

export default productSlice.reducer
