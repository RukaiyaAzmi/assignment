import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface ProductState {
  products: [
    {
      id: any
      title: string
      description: string
      price: number
      brand: string
      category: string
      thumbnail: string
      stock: number
      images: string[]
    },
  ]
}

const initState: ProductState = {
  products: [
    {
      id: 0,
      title: '',
      description: '',
      price: 0,
      brand: '',
      category: '',
      thumbnail: '',
      stock: 0,
      images: [],
    },
  ],
}

const productSlice = createSlice({
  name: 'product',
  initialState: initState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    resetUpgradeState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const { setProducts, resetUpgradeState } = productSlice.actions

export default productSlice.reducer
