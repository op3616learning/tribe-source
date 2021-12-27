import { useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { GET_POST_TYPES, GetPostTypesQuery } from 'tribe-api/graphql'
import { PaginatedPostType } from 'tribe-api/interfaces'

type UseGetPostTypesResult = QueryResult<GetPostTypesQuery> & {
  postTypes: PaginatedPostType
}

export const useGetPostTypes = (limit = 10): UseGetPostTypesResult => {
  const { loading, error, data } = useQuery(GET_POST_TYPES, {
    variables: {
      limit,
    },
  })

  const postTypes = useMemo(
    () => data?.getPostTypes?.edges?.map(edge => edge.node) || [],
    [data?.getPostTypes],
  )

  return {
    data,
    postTypes,
    loading,
    error,
    isInitialLoading: loading && data?.getPostTypes === undefined,
  }
}
