import { useDispatch } from 'react-redux'
import { changeAlert, IAlert } from '@redux/slices/global.slice'

export type ErrorDispatcher = (payload: IAlert) => void

export default function useErrorDispatch(): ErrorDispatcher {
  const dispatch = useDispatch()
  return (payload: IAlert) => {
    dispatch(
      changeAlert({
        ...payload,
      }),
    )
    setTimeout(() => dispatch(changeAlert({ hidden: true })), 5000)
  }
}
