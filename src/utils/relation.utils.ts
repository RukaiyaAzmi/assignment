import { IOptionsData } from '@components/common/SelectBox'
import { getCBSRelation } from '@config/urls.config'
import { CHANNEL } from '@interfaces/channel.interface'
import { ICBSRelationRes } from '@interfaces/onboarding.interface'
import axios from 'axios'
import { toast } from 'react-toastify'

export async function getRelationData(channelCode: CHANNEL | ''): Promise<IOptionsData[]> {
  const relationData = {
    [CHANNEL.ABS]: [
      { key: 'FAT', value: 'Father' },
      { key: 'MOT', value: 'Mother' },
      { key: 'BRO', value: 'Brother' },
      { key: 'SIS', value: 'Sister' },
      { key: 'HUS', value: 'Husband' },
      { key: 'WIF', value: 'Wife' },
      { key: 'SON', value: 'Son' },
      { key: 'DAU', value: 'Daughter' },
    ],
    [CHANNEL.CBS]: getCBSRelationData(),
    [CHANNEL.ICBS]: [],
  }
  if (channelCode === '' || channelCode === CHANNEL.EKYC) return relationData[CHANNEL.ABS]
  return relationData[channelCode]
}

async function getCBSRelationData(): Promise<IOptionsData[]> {
  const accessToken = localStorage.getItem('accessToken')
  const config = {
    headers: {
      'x-auth-token': `${accessToken}`,
    },
  }
  const newArr: IOptionsData[] = []
  try {
    const response: ICBSRelationRes | null = await axios.get(getCBSRelation, config)
    if (response && response.data.statusCode === 200) {
      const newProfession = response?.data.data
      for (const item of newProfession) {
        const resProfession = {} as IOptionsData
        resProfession['key'] = item.code
        resProfession['value'] = item.name
        newArr.push(resProfession)
      }
    }
  } catch (error) {
    toast.error('No Relation is Found')
  }
  return newArr
}
