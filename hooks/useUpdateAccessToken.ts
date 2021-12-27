import { useEffect } from 'react'

import { useRefreshToken } from './useRefreshToken'

export const useUpdateAccessToken = () => {
  const { update } = useRefreshToken()
  // interval to update the accessToken silently each 5min
  useEffect(() => {
    const interval = setInterval(() => {
      update()
    }, 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
}
