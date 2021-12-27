import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GET_POST_MODERATIONS,
  GetModerationsQuery,
  GetModerationsQueryVariables,
} from 'tribe-api/graphql'
import {
  ModerationItem,
  ModerationStatus,
  ModerationEntityType,
} from 'tribe-api/interfaces'

export const DEFAULT_MODERATIONS_LIMIT = 10

type UsegetModerationsResult = PaginatedQueryResult<GetModerationsQuery> & {
  moderations: ModerationItem[]
}

type GetModerationsVariables = {
  limit: number
  after?: string
  spaceId?: string
  skip: boolean
}

const useGetModerations = ({
  limit,
  after,
  skip,
  spaceId,
}: GetModerationsVariables): UsegetModerationsResult => {
  const { loading, data, error, fetchMore } = useQuery<
    GetModerationsQuery,
    GetModerationsQueryVariables
  >(GET_POST_MODERATIONS, {
    variables: {
      status: ModerationStatus.REVIEW,
      limit,
      after,
      spaceId,
      entityType: ModerationEntityType.POST,
    },
    skip,
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getModerations?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getModerations?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getModerations, fetchMore])

  const moderations = useMemo(
    () =>
      data?.getModerations?.edges?.map(edge => edge.node as ModerationItem) ||
      [],
    [data?.getModerations],
  )

  return {
    loading,
    error,
    data,
    moderations,
    totalCount: data?.getModerations?.totalCount,
    isInitialLoading: loading && data?.getModerations === undefined,
    isEmpty: !loading && data?.getModerations?.totalCount === 0,
    hasNextPage,
    loadMore,
  }
}

export default useGetModerations
