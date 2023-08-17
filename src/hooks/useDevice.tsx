import { useEffect, useState } from 'react'

export enum Devices {
  MOBILE = 'M',
  TABLET = 'T',
  DESKTOP = 'D',
  NONE = 'NONE',
}

export default function useDevice(): Devices {
  const [device, setDevice] = useState<Devices>(Devices.NONE)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      setDevice(Devices.TABLET)
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
    ) {
      setDevice(Devices.MOBILE)
    } else {
      setDevice(Devices.DESKTOP)
    }
  }, [])

  return device
}
