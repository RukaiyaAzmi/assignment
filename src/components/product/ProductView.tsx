import React from 'react'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'

import { IProductreDetails } from '@interfaces/product.interface'
import { getFullChanneltName, getFullCategoryName, getFullUserStatus } from '@utils/status.utils'
import DateRow from '@components/common/DateRow'

interface ProductViewProps {
  productList: IProductreDetails
}

export default function ProductView({ productList }: ProductViewProps) {
  const {
    name,
    code,
    description,
    categoryCode,
    channelCode,
    subChannelCode,
    status,
    createdBy,
    updatedBy,
    createDate,
    updateDate,
  } = productList

  return (
    <div className="bg-white animate__animated animate__fadeIn">
      <Row>
        <>
          <TextRow label="Product Name" value={name} />
          <TextRow label="Channel Name" value={getFullChanneltName(channelCode)} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Sub-Channel Name" value={subChannelCode} />
          <TextRow label="Product Category" value={getFullCategoryName(categoryCode)} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Product Code" value={code} />
          <TextRow label="Product Status" value={getFullUserStatus(status)} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Description" value={description} />
        </>
      </Row>

      <Row>
        <>
          <TextRow label="Created By" value={createdBy} />
          <DateRow label="Create Date" value={createDate} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Updated By" value={updatedBy} />
          <DateRow label="Update Date" value={updateDate} />
        </>
      </Row>
    </div>
  )
}
