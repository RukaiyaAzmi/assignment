import React, { useEffect, useRef, useState } from 'react'
import useAPI from '@hooks/useAPI'
import { toast } from 'react-toastify'
import TextInput from '@components/common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { setProducts } from '@redux/slices/product.slice'
import { setCategory } from '@redux/slices/category.slice'
import Button from '@components/common/Button'
import ButtonForCart from '@components/common/ButtonForCart'
import { setIdToCart } from '@redux/slices/add-to-cart.slice'
import { setCart } from '@redux/slices/cart.slice'

export default function test() {
  const [count, setCount] = useState(0)
  const [showCartModal, setShowCartModal] = useState<boolean>(false)
  const products = useSelector((state: RootState) => state.product.products)
  const category = useSelector((state: RootState) => state.category)
  const idOfCart = useSelector((state: RootState) => state.addToCart)
  const cart = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()
  const { execute } = useAPI<any>()
  const initialized = useRef(false)

  useEffect(() => {
    getProducts()
    if (!initialized.current) {
      initialized.current = true
      getCategory()
    }
  }, [])

  const incrementCount = () => {
    setCount(count + 1)
    //dispatch(setCart(count))
  }
  const decrementCount = () => {
    setCount(count - 1)
  }

  const getProducts = async () => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products',
      })
      dispatch(setProducts(pro.products))
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    getProductByTitle(e.target.value)
  }

  const handleDetailsClose = () => {
    setShowCartModal(false)
  }

  const handleAddToCart = async (id: any) => {
    dispatch(setIdToCart(id))
    try {
      const res = await execute({
        method: 'GET',
        url: `https://dummyjson.com/products/${id}`,
      })
      console.log('data', res)
      let count = 1

      for (let i = 0; i < idOfCart.id.length; i++) {
        if (idOfCart.id[i] == id) count++
      }
      const a = {}
      //   console.log('idddd', cart[i].id, id)
      if (!idOfCart.id.includes(id)) {
        Object.assign(a, res)
        const b = {}
        b['count'] = count

        const obj = Object.assign({}, a, b)
        dispatch(setCart(obj))
        setCount(count)
      }

      // let ss: any = []
      // ss.push(obj)
      // // setArr(cart.idCount.at(cart.idCount.length - 1))
      // // console.log('aa', Object.keys(obj)[Object.keys(obj).length - 1])

      // console.log('count', ss)

      //console.log('naaaaa', obj)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleShowCart = () => {
    setShowCartModal(true)
  }

  const getProductByCategory = async (category: string) => {
    try {
      const pro = await execute({
        method: 'GET',
        url: `https://dummyjson.com/products/category/${category}`,
      })
      dispatch(setProducts(pro.products))
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getProductByTitle = async (title: string) => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products/search',
        params: { q: title },
      })
      dispatch(setProducts(pro.products))
    } catch (error) {
      toast.error('Unknown Error')
    }
  }

  const getCategory = async () => {
    try {
      const pro = await execute({
        method: 'GET',
        url: 'https://dummyjson.com/products/categories',
      })
      dispatch(setCategory(pro))
    } catch (error) {
      toast.error('Unknown Error')
    }
  }
  // const ab: any = []
  // ab.push(cart.idCount.at(cart.idCount.length - 1))
  console.log('pro', cart)
  return (
    <div className="p-10">
      {/* <h1 className="flex justify-center text-2xl text-gray-900 font-bold pt-5">List of Products</h1> */}
      <div className="flex flex-wrap justify-end items-center w-full my-4">
        <div className="sm:text-xs w-2/5 py-5">
          <div className="justify-end pl-96">
            <Button width="w-32" id="submit" label="Cart" onClick={() => handleShowCart()} />
          </div>
          <TextInput
            id="title"
            placeholder="Search by Title"
            name="title"
            type="text"
            onChange={handleChange}
            //value={value.val}
            iconUrl="/icon/icon_search.svg"
          />
        </div>
      </div>

      <div className="flex flex-row">
        <div className=" w-1/4">
          <h1 className="flex justify-start text-2xl text-gray-900 font-bold py-5 px-3">Category</h1>
          <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <button
              type="button"
              onClick={() => getProducts()}
              className="w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              All
            </button>
          </div>
          {category &&
            category.map((category) => (
              <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <button
                  type="button"
                  onClick={() => getProductByCategory(category)}
                  className="w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                >
                  {category}
                </button>
              </div>
            ))}
        </div>
        <div className="sm:grid-cols-1 grid md:grid-cols-4 gap-5 mt-15">
          {products &&
            products.map((product) => (
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img className="object-scale-down h-48 w-96 py-3" src={product.thumbnail} alt="product image" />
                </a>
                <div className="px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white py-4">
                      {product.title}
                    </h5>
                  </a>
                  {/* <div className="flex items-center mt-2.5 mb-5">
                    <span className="text-md text-gray-900 dark:text-white">{product.description}</span>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                    <ButtonForCart
                      width="w-30"
                      id="submit"
                      label="Add to Cart"
                      onClick={() => handleAddToCart(product.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <Modal
        show={showCartModal}
        size="2xl"
        onClose={handleDetailsClose}
        popup={true}
        position="top-right"
        dismissible={false}
      >
        <Modal.Header className="bg-slate-100">
          <p className="ml-3 my-2">Product Details</p>
        </Modal.Header>
        <Modal.Body className=" bg-slate-100">
          {products.length && <ProductsView productList={products[0]} />}
        </Modal.Body>
      </Modal> */}
      {showCartModal && (
        <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                          Shopping cart
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={handleDetailsClose}
                          >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cart.products.length > 1
                            ? cart.products.map((carts) => (
                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                  <li className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={carts.thumbnail}
                                        alt="image"
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href="#">{carts.title}</a>
                                          </h3>
                                          <p className="ml-4">${carts.price}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{carts.category}</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        {/* {cart.idCount.length >= 1 &&
                                          cart.idCount.map((idcount) => ( */}
                                        <p className="text-gray-500">
                                          Qty:
                                          <button
                                            type="button"
                                            onClick={decrementCount}
                                            className=" w-10 px-4 mx-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                                          >
                                            -
                                          </button>
                                          <span className="pt-4">{count}</span>
                                          <button
                                            type="button"
                                            onClick={incrementCount}
                                            className=" w-10 px-4 mx-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                                          >
                                            +
                                          </button>
                                        </p>
                                        {/* ))} */}
                                        <div className="flex">
                                          <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              ))
                            : 'No Data Found'}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$262.00</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
