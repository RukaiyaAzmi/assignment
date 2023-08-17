import React from 'react'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { getFullCategoryName, getFullChanneltName, getFullUserStatus } from '@utils/status.utils'
import { ITransactionProfile } from '@interfaces/tp.interface'
import DateRow from '@components/common/DateRow'
import { getFullEkycType } from './TpList'

interface TpViewProps {
  tp: ITransactionProfile
}

export default function TpViewProps({ tp }: TpViewProps) {
  const {
    ekycType,
    channelCode,
    productCategoryCode,
    minLimit,
    maxLimit,
    status,
    createdBy,
    createDate,
    updatedBy,
    updateDate,
  } = tp

  return (
    <div className="bg-white animate__animated animate__fadeIn">
      <Row>
        <>
          <TextRow label="eKYC Type" value={getFullEkycType(ekycType)} />
          <TextRow label="Category Code" value={getFullChanneltName(channelCode)} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Channel Code" value={getFullCategoryName(productCategoryCode)} />
          <TextRow label="Status" value={getFullUserStatus(status)} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Low Limit" value={minLimit} />
          <TextRow label="High Limit" value={maxLimit} />
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
