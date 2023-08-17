/* eslint-disable @typescript-eslint/no-explicit-any */
import { EKYCState } from '@redux/slices/ekyc.slice'
import _ from 'lodash'

export default function getJsonObjectToArray(obj: any) {
  const result: any = []
  // recursive funciton
  function recursiveConverter(objToConvert) {
    if (objToConvert && typeof objToConvert === 'object') {
      const keys = Object.keys(objToConvert)
      for (let i = 0; i < keys.length; i++) {
        const currentKeyValue = objToConvert[keys[i]]
        if (Array.isArray(currentKeyValue)) result.push([keys[i], currentKeyValue])
        else if (typeof currentKeyValue === 'object') recursiveConverter(currentKeyValue)
        else {
          result.push([keys[i], currentKeyValue])
        }
      }
    }
  }
  recursiveConverter(obj)

  return result
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const result = {}

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      result[key] = obj[key]
    } else {
      delete obj[key]
    }
  }

  return result
}

export function sanitizeAPIPayload(payload: EKYCState): any {
  switch (payload.account.channelCode) {
    case 'ABS':
      return sanitizeABSPayload(payload)
    case 'CBS':
      return sanitizeABSPayload(payload)
    case 'ICBS':
      return sanitizeICBSPayload(payload)
    default:
      return payload
  }
}

function sanitizeABSPayload(payload: EKYCState): any {
  const payloadCopy = _.cloneDeep(payload)
  const sPayload: Record<string, any> = {
    account: {
      ...sanitizeObject(payloadCopy.account),
      transactionOrMaturityAmount: Number(payloadCopy.account.transactionOrMaturityAmount),
    },
    applicant: {
      ...sanitizeObject(payloadCopy.applicant),
    },
    applicantPresentAddress: {
      ...sanitizeObject(payloadCopy.applicantPresentAddress),
    },
    applicantPermanentAddress: {
      ...sanitizeObject(payloadCopy.applicantPermanentAddress),
    },
    applicantFile: {
      ...sanitizeObject(payloadCopy.applicantFile),
    },
    nominees: payloadCopy.nominees,
  }
  if (payloadCopy.ekycType === 'R') {
    sPayload['regularAdditionalData'] = {
      ...sanitizeObject(payloadCopy.regularAdditionalData),
      monthlyIncome: Number(payloadCopy.regularAdditionalData.monthlyIncome),
    }
    if (sPayload?.regularAdditionalData.edd.data === '') {
      delete sPayload.regularAdditionalData.edd
    }
  }
  if (payloadCopy.applicant.verificationType === 'FINGER') {
    sPayload['fingerprint'] = {
      rIndex: payloadCopy.fingerprint?.rIndex,
    }
  }

  delete sPayload.applicantPresentAddress.divisionCode
  delete sPayload.applicantPermanentAddress.divisionCode

  return sPayload
}

// function sanitizeCBSPayload(payload: EKYCState): any {
//   return payload
// }

function sanitizeICBSPayload(payload: EKYCState): any {
  return payload
}
