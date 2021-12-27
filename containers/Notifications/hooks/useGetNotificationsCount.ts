import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { NotificationsQuery, hasActionPermission } from 'tribe-api'
import { GET_NOTIFICATIONS_COUNT } from 'tribe-api/graphql/notifications.gql'

import useGetNetwork from 'containers/Network/useGetNetwork'

export type UseGetNotificationsCountResult = QueryResult<NotificationsQuery> & {
  newNotificationsCount: number
}

export const useGetNotificationsCount = (): UseGetNotificationsCountResult => {
  const { network } = useGetNetwork()
  const { authorized: canGetNotifications } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'notifications',
  )

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS_COUNT, {
    pollInterval: 10000,
    fetchPolicy: 'network-only',
    skip: !canGetNotifications,
  })

  return {
    loading,
    error,
    data,
    newNotificationsCount: data?.getNotificationsCount?.new || 0,
    isInitialLoading: loading && data === undefined,
  }
}
