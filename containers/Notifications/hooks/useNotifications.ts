import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import { GET_NOTIFICATIONS } from 'tribe-api/graphql/notifications.gql'
import {
  NotificationsQuery,
  NotificationsQueryVariables,
} from 'tribe-api/graphql/notifications.gql.generated'
import { Notification } from 'tribe-api/interfaces'

export const DEFAULT_NOTIFICATIONS_LIMIT = 20

export type UseNotificationsResult = PaginatedQueryResult<
  NotificationsQuery
> & {
  notifications: Notification[]
}

export const useNotifications = ({
  limit,
  after,
}: NotificationsQueryVariables): UseNotificationsResult => {
  const { data, loading, error, fetchMore } = useQuery<
    NotificationsQuery,
    NotificationsQueryVariables
  >(GET_NOTIFICATIONS, {
    variables: {
      limit,
      after,
    },
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.notifications?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.notifications?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.notifications, fetchMore])

  const notifications = useMemo(
    () =>
      data?.notifications?.edges?.map(edge => edge.node as Notification) || [],
    [data?.notifications],
  )

  return {
    loading,
    error,
    data,
    notifications,
    totalCount: data?.notifications?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.notifications?.totalCount === 0,
  }
}
