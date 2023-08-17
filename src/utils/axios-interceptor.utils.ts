import axios, { AxiosError, AxiosRequestHeaders } from 'axios'

interface CustomAxiosRequestHeaders extends AxiosRequestHeaders {
  'x-auth-token': string
}

const axiosWithToken = axios.create()

// Request Interceptor for adding access token
axiosWithToken.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken')
    config.headers = {
      ...config.headers,
      'x-auth-token': accessToken ?? '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    } as CustomAxiosRequestHeaders

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Response Interceptor for token refresh
axiosWithToken.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const err = error as AxiosError
      console.error('[ERROR] ', err.toString())
      localStorage.clear()
      window.location.href = `${window.location.origin}/login`
    }
    return Promise.reject(error)
  },
)

export default axiosWithToken
