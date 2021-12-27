import { useCallback } from 'react'

import { ApolloCache, useMutation } from '@apollo/client'
import produce from 'immer'

import {
  AppInstallation,
  AppInstallationStatus,
  GetSpaceAppInstallationsQuery,
  GetSpaceAppInstallationsQueryVariables,
  GET_SPACE_APP_INSTALLATIONS,
  PaginatedAppInstallation,
  PermissionContext,
  Space,
} from 'tribe-api'
import {
  GetNetworkAppInstallationsQuery,
  GetNetworkAppInstallationsQueryVariables,
  GET_NETWORK_APP_INSTALLATIONS,
  UninstallAppMutation,
  UninstallAppMutationVariables,
  UNINSTALL_APP_MUTATION,
} from 'tribe-api/graphql'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import { DEFAULT_APP_INSTALLATIONS_LIMIT } from './useGetNetworkAppInstallations'

type UseUninstallAppResult = {
  uninstallApp: (reason: string) => void
}
export type UseUninstallAppProps = {
  appInstallation: AppInstallation
  spaceId?: Space['id']
}

export default function useUninstallApp({
  appInstallation,
  spaceId,
}: UseUninstallAppProps): UseUninstallAppResult {
  const { t } = useTranslation()
  const toast = useToast()
  const [callUninstallApp] = useMutation<
    UninstallAppMutation,
    UninstallAppMutationVariables
  >(UNINSTALL_APP_MUTATION)

  const updateAppInstallationsCache = (
    cache: ApolloCache<UninstallAppMutation>,
    appInstallationId: string,
    spaceId,
  ) => {
    if (spaceId) {
      try {
        const { getSpaceAppInstallations: appInstallations } =
          cache.readQuery<
            GetSpaceAppInstallationsQuery,
            GetSpaceAppInstallationsQueryVariables
          >({
            query: GET_SPACE_APP_INSTALLATIONS,
            variables: {
              limit: DEFAULT_APP_INSTALLATIONS_LIMIT,
              spaceId,
            },
          }) || {}

        const newAppInstallations = produce(
          appInstallations as PaginatedAppInstallation,
          draft => {
            if (draft.edges) {
              const index = draft.edges?.findIndex(
                edge => edge.node.id === appInstallationId,
              )
              if (index !== -1) {
                draft.edges?.splice(index, 1)
              }
            }
          },
        )

        cache.writeQuery<
          GetSpaceAppInstallationsQuery,
          GetSpaceAppInstallationsQueryVariables
        >({
          query: GET_SPACE_APP_INSTALLATIONS,
          variables: { limit: DEFAULT_APP_INSTALLATIONS_LIMIT, spaceId },

          data: {
            getSpaceAppInstallations: newAppInstallations,
          },
        })
        return
      } catch (e) {
        logger.debug(
          'error - updating GET_SPACE_APP_INSTALLATIONS for useUninstallApp',
          e,
        )
      }
    }
    try {
      const { getNetworkAppInstallations: appInstallations } =
        cache.readQuery<
          GetNetworkAppInstallationsQuery,
          GetNetworkAppInstallationsQueryVariables
        >({
          query: GET_NETWORK_APP_INSTALLATIONS,
          variables: { limit: DEFAULT_APP_INSTALLATIONS_LIMIT },
        }) || {}

      const newAppInstallations = produce(
        appInstallations as PaginatedAppInstallation,
        draft => {
          if (draft.edges) {
            const index = draft.edges?.findIndex(
              edge => edge.node.id === appInstallationId,
            )
            if (index !== -1) {
              draft.edges?.splice(index, 1)
            }
          }
        },
      )
      cache.writeQuery<
        GetNetworkAppInstallationsQuery,
        GetNetworkAppInstallationsQueryVariables
      >({
        query: GET_NETWORK_APP_INSTALLATIONS,
        variables: { limit: DEFAULT_APP_INSTALLATIONS_LIMIT },

        data: {
          getNetworkAppInstallations: newAppInstallations,
        },
      })
    } catch (e) {
      logger.debug(
        'error - updating GET_NETWORK_APP_INSTALLATIONS for useUninstallApp',
        e,
      )
    }
  }

  const uninstallApp = useCallback(
    async (reason: string) => {
      const optimisticUninstallApp: AppInstallation = {
        ...appInstallation,
        __typename: 'AppInstallation',
        context: PermissionContext.NETWORK,
        permissions: [],
        id: 'appInstallationId',
        status: AppInstallationStatus.DISABLED,
      }

      callUninstallApp({
        variables: {
          appInstallationId: appInstallation?.id,
          reason,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          uninstallApp: optimisticUninstallApp,
        },
        update: (cache: ApolloCache<UninstallAppMutation>, { data }) => {
          if (data?.uninstallApp) {
            updateAppInstallationsCache(cache, data.uninstallApp.id, spaceId)
          }
        },
      })
        .then(({ errors }) => {
          if (errors?.length) {
            toast({
              title: appInstallation?.app?.name,
              description: t(
                'apps:app.error',
                'Something went wrong.\n Please try again later',
              ),
              status: 'error',
              isClosable: false,
            })
          } else {
            toast({
              title: t('apps:app.uninstallSuccessful', {
                defaultValue: '{{name}} has been successfully uninstalled',
                name: appInstallation?.app?.name,
              }),
              status: 'success',
              isClosable: false,
              position: 'top-right',
            })
          }
        })
        .catch(err => {
          logger.error('error - Uninstalling app', err)
        })
    },
    [appInstallation, callUninstallApp, spaceId, t, toast],
  )

  return { uninstallApp }
}
