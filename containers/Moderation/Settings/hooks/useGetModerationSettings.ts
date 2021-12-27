import { useQuery } from '@apollo/client'

import {
  GetModerationSettingsQuery,
  GetModerationSettingsQueryVariables,
  GET_MODERATION_SETTINGS,
} from 'tribe-api/graphql'

import { GetModerationSettingsHook } from '../@types'

const useGetModerationSettings = (): Partial<GetModerationSettingsHook> => {
  const response = useQuery<
    GetModerationSettingsQuery,
    GetModerationSettingsQueryVariables
  >(GET_MODERATION_SETTINGS, {
    fetchPolicy: 'cache-and-network',
  })

  return {
    settings: response?.data?.getModerationSetting,
    initialLoading: response?.loading && response?.data === undefined,
    ...response,
  }
}

export default useGetModerationSettings
