import { useCallback } from 'react'

import { ApolloError, QueryHookOptions, useLazyQuery } from '@apollo/client'

import { SsosQuery, SsosQueryVariables, GET_SSOS } from 'tribe-api/graphql'
import { SsoType } from 'tribe-api/interfaces'

const useGetSsos = (
  options?: QueryHookOptions,
): {
  data?: SsosQuery
  error?: ApolloError
  loading: boolean
  ssos: SsosQuery['ssos']
  customSsos: SsosQuery['ssos']
  defaultSsos: SsosQuery['ssos']
  getSsos: (variables?: SsosQueryVariables) => void
} => {
  const [ssosQuery, { data, error, loading }] = useLazyQuery<
    SsosQuery,
    SsosQueryVariables
  >(GET_SSOS, options)

  const getSsos = useCallback(
    variables => {
      ssosQuery({ variables })
    },
    [ssosQuery],
  )

  const ssos = data?.ssos || []

  return {
    getSsos,
    data,
    error,
    loading,
    ssos,
    customSsos: ssos?.filter(sso => sso.type === SsoType.OAUTH2) || [],
    defaultSsos: ssos?.filter(sso => sso.type !== SsoType.OAUTH2) || [],
  }
}

export default useGetSsos
