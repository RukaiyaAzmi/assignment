/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
import Joi, { ValidationErrorItem } from 'joi'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

// init errors obejct for equvalent keys from state
function initErrors(state: Object): Object {
  return Object.keys(state).reduce((attrs, key) => {
    return {
      ...attrs,
      [key]: undefined,
    }
  }, {})
}

// validation result interface
export interface FormValidationResult {
  ok: boolean
  errors: Object
}

export function useFormValidation(
  schema: Joi.Schema,
  state: Object,
  options: Joi.ValidationOptions = {},
  initOk = false,
): FormValidationResult {
  // flag for preventing validation trigger in first render
  const isFirst = useRef(0)
  // boolean status true for valid data false for any kind of validaiton error
  const [ok, setOk] = useState(false)
  // errors object as per state object for error message
  let [errors, setErrors] = useState(initErrors(state))

  // effect for validation on state change
  useEffect(() => {
    // condition check for detecting first render
    if (initOk || isFirst.current > 1) {
      errors = initErrors(state)
      // validate using joi
      const { error } = schema.validate(state, options)
      // set ok state
      if (error) setOk(false)
      else setOk(true)
      // add error messages by parsing joi validation error
      error?.details.forEach((d: ValidationErrorItem) => {
        if (d.context?.key) errors[d.context.key] = d.message
      })
      setErrors({ ...errors })
    }
    // during first render make isFirst False
    else isFirst.current++
  }, [state])

  return { ok, errors }
}

export function useFormValidationAsync(
  schema: Joi.Schema,
  state: Object,
  options: Joi.ValidationOptions = {},
  initOk = false,
): FormValidationResult {
  // flag for preventing validation trigger in first render
  const isFirst = useRef(0)
  // boolean status true for valid data false for any kind of validaiton error
  const [ok, setOk] = useState(false)
  // errors object as per state object for error message
  let [errors, setErrors] = useState(initErrors(state))

  // effect for validation on state change
  useEffect(() => {
    // condition check for detecting first render
    if (initOk || isFirst.current > 1) {
      ;(async () => {
        errors = initErrors(state)
        // validate using joi
        try {
          await schema.validateAsync(state, options)
          setOk(true)
        } catch (error: any) {
          if (error instanceof Joi.ValidationError) {
            setOk(false)
            error?.details.forEach((d: ValidationErrorItem) => {
              if (d.context?.key) errors[d.context.key] = d.message
            })
          } else console.error(error)
        }

        setErrors({ ...errors })
      })()
    }
    // during first render make isFirst False
    else isFirst.current++
  }, [state])

  return { ok, errors }
}

useFormValidation.propTypes = {
  schema: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
}

useFormValidationAsync.propTypes = {
  schema: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
}
