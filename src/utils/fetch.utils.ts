import axios from 'axios'

export const fetcher = (input: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json())

export const fetchWithToken = (url: string, token: string) =>
  axios.get(url, { headers: { 'x-auth-token': token } }).then((res) => res.data)
