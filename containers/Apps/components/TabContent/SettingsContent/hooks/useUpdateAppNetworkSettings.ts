import { useCallback } from 'react'

import { ApolloCache, useMutation, useApolloClient } from '@apollo/client'

import {
  ActionStatus,
  AppSetting,
  GET_APP_NETWORK_SETTINGS,
  GetAppNetworkSettingsQuery,
  UPDATE_APP_NETWORK_SETTINGS,
  UpdateAppNetworkSettingsMutation,
  UpdateAppNetworkSettingsMutationVariables,
} from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

type useUpdateAppNetworkSettingsResult = {
  update: (
    newSettings: string,
    updateCache?: boolean,
    successMessage?: string,
  ) => Promise<string | void | null | undefined>
  loading: boolean
  clearSettingsCache: () => void
}

const useUpdateAppNetworkSettings = (
  appId: AppSetting['id'],
): useUpdateAppNetworkSettingsResult => {
  const { t } = useTranslation()
  const toast = useToast()

  const [updateAppNetworkSettings, { loading }] = useMutation<
    UpdateAppNetworkSettingsMutation,
    UpdateAppNetworkSettingsMutationVariables
  >(UPDATE_APP_NETWORK_SETTINGS)

  const onUpdate = (
    appId: AppSetting['id'],
    updateCache: boolean,
    updatedSettings: string,
  ) => (cache: ApolloCache<UpdateAppNetworkSettingsMutation>, { data }) => {
    if (!updateCache) return
    try {
      const { getAppNetworkSettings: currentSettings } = cache.readQuery<
        GetAppNetworkSettingsQuery
      >({
        query: GET_APP_NETWORK_SETTINGS,
        variables: { appId },
      }) || { getAppNetworkSettings: '{}' }

      const {
        updateAppNetworkSettings: { data: incomingSettings },
      } = data

      const mergedSettings = {
        ...JSON.parse(currentSettings),
        ...JSON.parse(updatedSettings),
        ...JSON.parse(incomingSettings),
      }

      cache.writeQuery<GetAppNetworkSettingsQuery>({
        query: GET_APP_NETWORK_SETTINGS,
        variables: { appId },
        data: {
          getAppNetworkSettings: JSON.stringify(mergedSettings),
        },
      })
    } catch (err) {
      logger.error('error updating cache for useUpdateAppNetworkSettings')
    }
  }

  const update = useCallback(
    (settings: string, updateCache = true, successMessage?: string) =>
      updateAppNetworkSettings({
        variables: {
          appId,
          settings,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateAppNetworkSettings: {
            __typename: 'AppAction',
            status: ActionStatus.SUCCEEDED,
            data: '{}',
          },
        },
        update: onUpdate(appId, updateCache, settings),
      })
        .then(({ data, errors }) => {
          if (errors?.length) {
            toast({
              title: t(
                'admin:apps.discussions.error',
                'Something went wrong.\n Please try again.',
              ),
              status: 'error',
              isClosable: false,
            })
          } else {
            toast({
              title:
                successMessage ||
                t(
                  'admin:apps.discussions.successful',
                  'Settings successfully updated.',
                ),
              status: 'success',
              isClosable: false,
            })
          }
          return data?.updateAppNetworkSettings?.data
        })
        .catch(err => {
          logger.error('error - Updating AppNetworkSetting', err)
        }),
    [appId, t, toast, updateAppNetworkSettings],
  )

  const client = useApolloClient()
  const clearSettingsCache = useCallback(() => {
    client.cache.modify({
      fields: {
        getAppNetworkSettings(_, { DELETE }) {
          return DELETE
        },
      },
      broadcast: false,
    })
  }, [client])

  return {
    update,
    loading,
    clearSettingsCache,
  }
}

export default useUpdateAppNetworkSettings
