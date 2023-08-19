import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IActionState {
  name: string
  value: string
}

export interface CartState {
  idCount: [
    {
      count: number
      id: number
    },
  ]
  products: [
    {
      count: number
      id: number
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

const initState: CartState = {
  idCount: [
    {
      count: 1,
      id: 0,
    },
  ],
  products: [
    {
      count: 0,
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

const cartSlice = createSlice({
  name: 'cart',
  initialState: initState,
  reducers: {
    setCart: (state, action) => {
      //for (let i = 0; i < action.payload; i++) {
      state.products.push(action.payload)
      //}
    },
    setIdCount: (state, action) => {
      console.log('okk', action.payload)
      state.idCount.push(action.payload)
    },
    // resetCartState: () => {
    //   return {
    //     ...initState,
    //   }
    // },
  },
})

export const { setCart, setIdCount } = cartSlice.actions

export default cartSlice.reducer
