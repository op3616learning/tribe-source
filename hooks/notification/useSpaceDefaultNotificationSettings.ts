import { QueryHookOptions, QueryResult, useQuery } from '@apollo/client'

import {
  SPACE_DEFAULT_NOTIFICATION_SETTINGS,
  SpaceDefaultNotificationSettingsQuery,
  SpaceDefaultNotificationSettingsQueryVariables,
} from 'tribe-api'

export type UseSpaceDefaultNotificationSettings = QueryResult<
  SpaceDefaultNotificationSettingsQuery
> & {
  isInitialLoading: boolean
  spaceDefaultNotificationSettings: SpaceDefaultNotificationSettingsQuery['spaceDefaultNotificationSettings']
}

export const useSpaceDefaultNotificationSettings = (
  options?: QueryHookOptions<
    SpaceDefaultNotificationSettingsQuery,
    SpaceDefaultNotificationSettingsQueryVariables
  >,
): UseSpaceDefaultNotificationSettings => {
  const queryResult = useQuery<
    SpaceDefaultNotificationSettingsQuery,
    SpaceDefaultNotificationSettingsQueryVariables
  >(SPACE_DEFAULT_NOTIFICATION_SETTINGS, {
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
    ...options,
  })

  const { data, loading } = queryResult || {}

  const spaceDefaultNotificationSettings = data?.spaceDefaultNotificationSettings as SpaceDefaultNotificationSettingsQuery['spaceDefaultNotificationSettings']

  return {
    ...queryResult,
    isInitialLoading: loading && data === undefined,
    spaceDefaultNotificationSettings,
  }
}
