import jwt, { JwtPayload } from 'jsonwebtoken'
import { isArray } from 'lodash'

export function isAuthorized(features: string[], code: string | string[]): boolean {
  if (isArray(code)) {
    const c = features.find((elem) => {
      const foundCode = code.find((e) => elem === e)
      return foundCode ? true : false
    })
    return c ? true : false
  } else {
    if (code === '*') return true
    const c = features.find((elem) => elem === code)
    return c ? true : false
  }
}

export function isTokenValid(token: string): boolean {
  try {
    let decoded = jwt.decode(token)
    if (decoded) {
      decoded = decoded as JwtPayload
      const isValid = Date.now() >= (decoded.exp as number) * 1000
      return !isValid
    } else return false
  } catch {
    return false
  }
}
