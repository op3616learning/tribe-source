import axios from 'axios'

import useAuthToken from 'hooks/useAuthToken'

export const useLogout = () => {
  const { authToken } = useAuthToken()
  const { network } = authToken || {}

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout', {
        headers: {
          authorization: `Bearer ${authToken?.accessToken}`,
        },
      })
    } catch (e) {
      console.warn('Could not logout the user')
    }
    window.location.href = network?.activeSso?.logoutUrl || '/auth/login'
  }

  return {
    logout,
  }
}
