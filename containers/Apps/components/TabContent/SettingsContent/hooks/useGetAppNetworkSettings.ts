import { ApolloQueryResult, useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GetAppNetworkSettingsQuery,
  GetAppNetworkSettingsQueryVariables,
  GET_APP_NETWORK_SETTINGS,
} from 'tribe-api'

export const DEFAULT_APP_INSTALLATIONS_LIMIT = 10

export type useGetAppNetworkSettingsResult = QueryResult<
  GetAppNetworkSettingsQuery
> & {
  settings?: string | null
  refetch: (
    variables?: GetAppNetworkSettingsQueryVariables,
  ) => Promise<ApolloQueryResult<GetAppNetworkSettingsQuery>>
}

const useGetAppNetworkSettings = (
  props: GetAppNetworkSettingsQueryVariables,
): useGetAppNetworkSettingsResult => {
  const { data, loading, error, refetch } = useQuery<
    GetAppNetworkSettingsQuery,
    GetAppNetworkSettingsQueryVariables
  >(GET_APP_NETWORK_SETTINGS, {
    variables: {
      ...props,
    },
    skip: !props.appId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  })

  return {
    data,
    settings: data?.getAppNetworkSettings,
    loading,
    error,
    isInitialLoading: loading && data === undefined,
    refetch,
  }
}

export default useGetAppNetworkSettings
