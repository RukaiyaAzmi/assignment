import React from 'react'
import AgentPointSelect from './AgentPointSelect'
import { CHANNEL } from '@interfaces/channel.interface'
import BranchSelect from './BranchSelect'

interface BranchSelectContainerProps {
  channelCode: CHANNEL
}

export default function BranchSelectContainer({ channelCode }: BranchSelectContainerProps): JSX.Element {
  switch (channelCode) {
    case CHANNEL.CBS:
      return <BranchSelect />
    case CHANNEL.ICBS:
      return <div></div>
    default:
      return <AgentPointSelect />
  }
}
