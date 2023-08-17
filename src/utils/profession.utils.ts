import { IOptionsData } from '@components/common/SelectBox'
import { getCBSProfession, postABSProfession } from '@config/urls.config'
import { CHANNEL } from '@interfaces/channel.interface'
import { IABSProfessionRes, ICBSProfessionRes } from '@interfaces/onboarding.interface'
import axios from 'axios'
import { toast } from 'react-toastify'

export async function getProfessionData(channelCode: CHANNEL): Promise<IOptionsData[]> {
  const accessToken = localStorage.getItem('accessToken')
  const config = {
    headers: {
      'x-auth-token': `${accessToken}`,
    },
  }
  const data = {
    channelCode: channelCode,
  }
  const newArr: IOptionsData[] = []
  if (channelCode === CHANNEL.ABS) {
    try {
      const response: IABSProfessionRes | null = await axios.post(postABSProfession, data, config)
      if (response && response.data.statusCode === 200) {
        const newProfession = response?.data.data
        for (const item of newProfession) {
          const resProfession = {} as IOptionsData
          resProfession['key'] = item.code
          resProfession['value'] = item.displayName
          newArr.push(resProfession)
        }
      }
    } catch (error) {
      toast.error('Profession is Not Found')
    }
  } else if (channelCode === CHANNEL.CBS) {
    try {
      const response: ICBSProfessionRes | null = await axios.get(getCBSProfession, config)
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
      toast.error('Profession is Not Found')
    }
  }

  return newArr
}
