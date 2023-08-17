import React from 'react'
import DateRow from '@components/common/DateRow'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { getFullStatusName } from '@components/role/RoleList'
import { IAccount } from '@interfaces/account.interface'

interface AccountViewProps {
  account: IAccount
}

export default function AccountView({ account }: AccountViewProps) {
  const {
    id,
    title,
    type,
    productType,
    productCode,
    productCategoryCode,
    branchOrAgentPointCode,
    transactionOrMaturityAmount,
    status,
    channelCode,
    channelAccountId,
    createdBy,
    createDate,
  } = account

  return (
    <div className="bg-white">
      <Row>
        <>
          <TextRow label="Account ID" value={id} />
          <TextRow label="Account Title " value={title} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Channel Account ID" value={channelAccountId} />
          <TextRow label="Account Type" value={type} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Channel Code" value={channelCode} />
          <TextRow label="Product Category Code" value={productCategoryCode} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Product Name" value={productType} />
          <TextRow label="Product Code" value={productCode} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Status" value={getFullStatusName(status)} />
          <TextRow label="Branch or Agent Point Code" value={branchOrAgentPointCode} />
        </>
      </Row>
      <Row>
        <>
          <TextRow label="Transaction or Maturity Amount" value={transactionOrMaturityAmount} />
          <TextRow label="Created By" value={createdBy} />
          <DateRow label="Create Date" value={createDate} />
        </>
      </Row>
    </div>
  )
}
