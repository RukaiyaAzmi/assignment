export function byteToMB(byte: number) {
  return byte / 1024 / 1024
}

export function byteToGB(byte: number) {
  return byte / 1024 / 1024 / 1024
}

export function imageConverter(image: string) {
  const flag = 'data:image/jpeg|png;base64, '

  return flag + image
}
