import React, { useState } from 'react'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'

interface ProductViewProps {
  productList: {
    title: string
    description: string
    price: number
    brand: string
    category: string
    thumbnail: string
    stock: number
    images: string[]
  }
}

export default function ProductsView({ productList }: ProductViewProps) {
  const [count, setCount] = useState(0)
  const { title, description, price, brand, category, stock, images } = productList
  const incrementCount = () => {
    setCount(count + 1)
  }
  const decrementCount = () => {
    setCount(count != 0 ? count - 1 : 0)
  }
  console.log('count', count)
  return (
    <div className="bg-white animate__animated animate__fadeIn">
      <img
        className="w-60 h-60 rounded-md m-auto justify-center justify-items-center mb-7"
        src={images[0]}
        alt="product Image"
      />
      <Row>
        <>
          <TextRow label="Product Name" value={title} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Description" value={description} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Brand NAmee" value={brand} />
        </>
      </Row>

      <Row>
        <>
          <TextRow label="Category" value={category} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Available Stock" value={stock - count} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Price" value={price} />
        </>
      </Row>
      {/* <div className="sm:grid-cols-1 grid md:grid-cols-4 gap-2"> */}
      <span className="pt-4 px-8">Quantity: </span>

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
      <span className="pt-4 px-8">Total Price: {price * count}</span>
    </div>
    // </div>
  )
}
