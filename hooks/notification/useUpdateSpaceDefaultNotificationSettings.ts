import { useCallback } from 'react'

import {
  FetchResult,
  MutationHookOptions,
  MutationResult,
  useMutation,
} from '@apollo/client'

import {
  UPDATE_SPACE_DEFAULT_NOTIFICATION_SETTINGS,
  UpdateSpaceDefaultNotificationSettingsMutation,
  UpdateSpaceDefaultNotificationSettingsMutationVariables,
} from 'tribe-api'

export type UseUpdateSpaceDefaultNotificationSettings = MutationResult<
  UpdateSpaceDefaultNotificationSettingsMutation
> & {
  updateSpaceDefaultNotificationSettings: (
    variables: UpdateSpaceDefaultNotificationSettingsMutationVariables,
  ) => Promise<
    FetchResult<
      UpdateSpaceDefaultNotificationSettingsMutation,
      Record<string, unknown>,
      Record<string, unknown>
    >
  >
}

export const useUpdateSpaceDefaultNotificationSettings = (
  options?: MutationHookOptions<
    UpdateSpaceDefaultNotificationSettingsMutation,
    UpdateSpaceDefaultNotificationSettingsMutationVariables
  >,
): UseUpdateSpaceDefaultNotificationSettings => {
  const [
    updateDefaultNotificationSettingsMutation,
    { called, client, data, error, loading },
  ] = useMutation<
    UpdateSpaceDefaultNotificationSettingsMutation,
    UpdateSpaceDefaultNotificationSettingsMutationVariables
  >(UPDATE_SPACE_DEFAULT_NOTIFICATION_SETTINGS, {
    ...options,
  })

  const updateSpaceDefaultNotificationSettings = useCallback(
    (variables: UpdateSpaceDefaultNotificationSettingsMutationVariables) =>
      updateDefaultNotificationSettingsMutation({
        variables,
      }),
    [updateDefaultNotificationSettingsMutation],
  )

  return {
    called,
    client,
    data,
    error,
    loading,
    updateSpaceDefaultNotificationSettings,
  }
}
