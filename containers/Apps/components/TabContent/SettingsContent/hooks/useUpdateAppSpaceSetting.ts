import { useCallback } from 'react'

import { ApolloCache, useApolloClient, useMutation } from '@apollo/client'

import {
  ActionStatus,
  AppSetting,
  GET_APP_SPACE_SETTINGS,
  GetAppSpaceSettingsQuery,
  Space,
  UPDATE_APP_SPACE_SETTING,
  UpdateAppSpaceSettingMutation,
  UpdateAppSpaceSettingMutationVariables,
} from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

type useUpdateAppSpaceSettingResult = {
  update: (newSettings: string) => Promise<string | void | null | undefined>
  loading: boolean
  clearSettingsCache: () => void
}

const useUpdateAppSpaceSetting = (
  appId: AppSetting['id'],
  spaceId: Space['id'],
): useUpdateAppSpaceSettingResult => {
  const { t } = useTranslation()
  const toast = useToast()

  const [updateAppSpaceSetting, { loading }] = useMutation<
    UpdateAppSpaceSettingMutation,
    UpdateAppSpaceSettingMutationVariables
  >(UPDATE_APP_SPACE_SETTING)

  const onUpdate = (
    appId: AppSetting['id'],
    spaceId: Space['id'],
    updateCache: boolean,
  ) => (cache: ApolloCache<UpdateAppSpaceSettingMutation>, { data }) => {
    if (!updateCache) return
    try {
      cache.writeQuery<GetAppSpaceSettingsQuery>({
        query: GET_APP_SPACE_SETTINGS,
        variables: { appId, spaceId },
        data: {
          getAppSpaceSettings: data?.updateAppSpaceSettings?.data,
        },
      })
    } catch (err) {
      logger.error('error updating cache for useUpdateAppSpaceSetting')
    }
  }

  const update = useCallback(
    (settings: string, updateCache = true) =>
      updateAppSpaceSetting({
        variables: {
          appId,
          spaceId,
          settings,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateAppSpaceSetting: {
            __typename: 'AppAction',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdate(appId, spaceId, updateCache),
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
              title: t(
                'admin:apps.discussions.successful',
                'Settings successfully updated.',
              ),
              status: 'success',
              isClosable: false,
            })
          }
          return data?.updateAppSpaceSetting?.data
        })
        .catch(err => {
          logger.error('error - Updating AppSpaceSetting', err)
        }),
    [appId, spaceId, t, toast, updateAppSpaceSetting],
  )

  const client = useApolloClient()
  const clearSettingsCache = useCallback(() => {
    client.cache.modify({
      fields: {
        getAppSpaceSettings(_, { DELETE }) {
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

export default useUpdateAppSpaceSetting
