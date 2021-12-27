import { useCallback } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import { AppsQuery, AppsQueryVariables, APPS } from 'tribe-api'
import { App } from 'tribe-api/interfaces'

export const DEFAULT_APPS_LIMIT = 10

export type useAppsResult = PaginatedQueryResult<AppsQuery> & {
  apps: App[]
}

const useApps = (props?: Partial<AppsQueryVariables>): useAppsResult => {
  const { limit = DEFAULT_APPS_LIMIT } = props || {}
  const { data, loading, error, fetchMore } = useQuery<
    AppsQuery,
    AppsQueryVariables
  >(APPS, {
    variables: {
      limit,
      ...props,
    },
    fetchPolicy: 'cache-and-network',
    // https://github.com/apollographql/apollo-client/issues/7436
    nextFetchPolicy: 'cache-first',
  })

  const hasNextPage = data?.apps?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      fetchMore({
        variables: {
          after: data?.apps?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.apps, fetchMore])

  return {
    data,
    apps: data?.apps?.edges?.map(edge => edge.node as App) || [],
    loading,
    error,
    totalCount: data?.apps?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.apps?.totalCount === 0,
  }
}

export default useApps
