import axiosWithToken from '@utils/axios-interceptor.utils'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useCallback, useState } from 'react'
import useErrorDispatch from './useErrorDispatch'
import { IErrorResponse } from '@interfaces/global.interface'

export default function useAPI<Response>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AxiosError | undefined>(undefined)
  const [data, setData] = useState<Response | null>(null)
  const errorDispatcher = useErrorDispatch()

  const execute = async (options: AxiosRequestConfig): Promise<Response | null> => {
    try {
      setIsLoading(true)
      const res = await axios<Response>(options)
      setIsLoading(false)
      setData(res.data)
      return res.data
    } catch (e) {
      const err = e as AxiosError
      setError(err)
      setIsLoading(false)
      if (err.response) {
        const errData = err.response.data as IErrorResponse
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: err.response.status.toString(),
          message: errData.message,
        })
      } else if (err.request) {
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: 'Error',
          message: 'Could not send request',
        })
      } else {
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: 'Error',
          message: 'Unknown error occured during HTTP request',
        })
      }
      return null
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}

/**
 * API call with token
 */
export function useAPIWithToken<Response>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AxiosError | undefined>(undefined)
  const [data, setData] = useState<Response | null>(null)
  const errorDispatcher = useErrorDispatch()

  const execute = async (options: AxiosRequestConfig): Promise<Response | null> => {
    try {
      setIsLoading(true)
      const res = await axiosWithToken<Response>(options)
      setIsLoading(false)
      setData(res.data)
      return res.data
    } catch (e) {
      const err = e as AxiosError
      setError(err)
      setIsLoading(false)
      if (err.response) {
        const errData = err.response.data as IErrorResponse
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: err.response.status.toString(),
          message: errData.message,
        })
      } else if (err.request) {
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: 'Error',
          message: 'Could not send request',
        })
      } else {
        errorDispatcher({
          hidden: false,
          type: 'info',
          title: 'Error',
          message: 'Unknown error occured during HTTP request',
        })
      }
      return null
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}
