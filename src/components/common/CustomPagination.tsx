import { Pagination } from 'flowbite-react'
import React from 'react'

interface CustomPaginationProps {
  page: number
  totalPage: number
  onPagination: (page: number) => void
}

export default function CustomPagination({ page, totalPage, onPagination }: CustomPaginationProps): JSX.Element {
  return (
    <div className="flex items-center justify-center text-center">
      <Pagination
        currentPage={page}
        layout="navigation"
        onPageChange={onPagination}
        showIcons={true}
        totalPages={totalPage}
      />
    </div>
  )
}
