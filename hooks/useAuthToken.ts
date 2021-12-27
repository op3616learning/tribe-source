import { useQuery } from '@apollo/client'

import {
  TokensQuery,
  TokensQueryVariables,
  GET_TOKENS,
} from 'tribe-api/graphql'

const useAuthToken = () => {
  const { data, loading, error } = useQuery<TokensQuery, TokensQueryVariables>(
    GET_TOKENS,
  )

  return {
    data,
    authToken: data?.tokens,
    error,
    loading,
  }
}

export default useAuthToken
