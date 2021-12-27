import { useCallback } from 'react'

import { ApolloError, useLazyQuery } from '@apollo/client'

import {
  LOGIN_WITH_SSO,
  LoginWithSsoQuery,
  LoginWithSsoQueryVariables,
} from 'tribe-api/graphql'
import { SsoType } from 'tribe-api/interfaces'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { getSsoCallbackUrl } from './utils'

const useConnectSso = (): {
  data?: LoginWithSsoQuery
  error?: ApolloError
  loading: boolean

  connectSso: (type: SsoType, redirectUri?: string) => void
  loginURL?: LoginWithSsoQuery['loginWithSso']['url']
} => {
  const { network } = useGetNetwork()
  const [loginWithSsoQuery, { data, error, loading }] = useLazyQuery<
    LoginWithSsoQuery,
    LoginWithSsoQueryVariables
  >(LOGIN_WITH_SSO)

  const connectSso = useCallback(
    (type, redirectUri) => {
      const callbackUrl = getSsoCallbackUrl(type, network?.domain, redirectUri)

      loginWithSsoQuery({
        variables: {
          input: {
            type,
            callbackUrl,
          },
        },
      })
    },
    [loginWithSsoQuery, network?.domain],
  )

  const loginURL = data?.loginWithSso?.url

  return {
    data,
    error,
    loading,

    connectSso,
    loginURL,
  }
}

export default useConnectSso
