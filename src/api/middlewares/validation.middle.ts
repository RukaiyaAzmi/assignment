import type { NextApiRequest, NextApiResponse } from 'next'
import { validateOrReject } from 'class-validator'

export default function validates(DtoClass) {
  return async (req: NextApiRequest, res: NextApiResponse, next) => {
    const instance = new DtoClass(req.body)
    try {
      await validateOrReject(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: false,
          value: false,
        },
      })
      next()
    } catch (errors) {
      return res.status(400).json({
        message: 'Validation Error',
        reason: errors,
      })
    }
  }
}

export function validatesQuery(DtoClass) {
  return async (req: NextApiRequest, res: NextApiResponse, next) => {
    const instance = new DtoClass(req.query)
    try {
      await validateOrReject(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: false,
          value: false,
        },
      })
      next()
    } catch (errors) {
      return res.status(400).json({
        message: 'Validation Error: Query Params',
        reason: errors,
      })
    }
  }
}
