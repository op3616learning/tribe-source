import { useCallback } from 'react'

import { ApolloCache, useMutation } from '@apollo/client'

import {
  App,
  AppInstallation,
  AppInstallationEdge,
  AppInstallationStatus,
  GET_SPACE_APP_INSTALLATIONS,
  GetSpaceAppInstallationsQuery,
  GetSpaceAppInstallationsQueryVariables,
  InstallAppInput,
  PermissionContext,
} from 'tribe-api'
import {
  GET_NETWORK_APP_INSTALLATIONS,
  GetNetworkAppInstallationsQuery,
  GetNetworkAppInstallationsQueryVariables,
  INSTALL_APP_MUTATION,
  InstallAppMutation,
  InstallAppMutationVariables,
} from 'tribe-api/graphql'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

import { DEFAULT_APP_INSTALLATIONS_LIMIT } from './useGetNetworkAppInstallations'

type UseInstallAppResult = {
  installApp: (input?: InstallAppInput) => void
}
export type UseInstallAppProps = {
  app: App
}

export default function useInstallApp({
  app,
}: UseInstallAppProps): UseInstallAppResult {
  const { authUser } = useAuthMember()
  const { t } = useTranslation()
  const toast = useToast()
  const [callInstallApp] = useMutation<
    InstallAppMutation,
    InstallAppMutationVariables
  >(INSTALL_APP_MUTATION)

  const updateAppInstallationsCache = (
    cache: ApolloCache<InstallAppMutation>,
    newData: AppInstallation,
    entityId?: string,
  ) => {
    if (newData.context === PermissionContext.NETWORK) {
      try {
        const { getNetworkAppInstallations: appInstallations } =
          cache.readQuery<
            GetNetworkAppInstallationsQuery,
            GetNetworkAppInstallationsQueryVariables
          >({
            query: GET_NETWORK_APP_INSTALLATIONS,
            variables: { limit: DEFAULT_APP_INSTALLATIONS_LIMIT },
          }) || {}
        if (!appInstallations) return
        const newAppInstallation: AppInstallationEdge = {
          __typename: 'AppInstallationEdge',
          cursor: '',
          node: {
            ...newData,
          },
        }
        const newEdges = appInstallations?.edges
          ? ([
              newAppInstallation,
              ...appInstallations.edges,
            ] as AppInstallationEdge[])
          : [newAppInstallation]
        cache.writeQuery<
          GetNetworkAppInstallationsQuery,
          GetNetworkAppInstallationsQueryVariables
        >({
          query: GET_NETWORK_APP_INSTALLATIONS,
          variables: { limit: DEFAULT_APP_INSTALLATIONS_LIMIT },
          data: {
            getNetworkAppInstallations: {
              ...appInstallations,
              totalCount: appInstallations.totalCount + 1,
              edges: newEdges,
            },
          },
        })
        return
      } catch (e) {
        logger.debug(
          'error - updating GET_NETWORK_APP_INSTALLATIONS for useInstallApp',
          e,
        )
      }
    }
    try {
      if (!entityId) return
      const cachedQuery = cache.readQuery<
        GetSpaceAppInstallationsQuery,
        GetSpaceAppInstallationsQueryVariables
      >({
        query: GET_SPACE_APP_INSTALLATIONS,
        variables: {
          limit: DEFAULT_APP_INSTALLATIONS_LIMIT,
          spaceId: entityId,
        },
      })
      if (cachedQuery) {
        const { getSpaceAppInstallations: appInstallations } = cachedQuery
        const newAppInstallation: AppInstallationEdge = {
          __typename: 'AppInstallationEdge',
          cursor: '',
          node: newData,
        }
        const newEdges = appInstallations.edges
          ? [...appInstallations.edges, newAppInstallation]
          : [newAppInstallation]
        cache.writeQuery<
          GetSpaceAppInstallationsQuery,
          GetSpaceAppInstallationsQueryVariables
        >({
          query: GET_SPACE_APP_INSTALLATIONS,
          variables: {
            limit: DEFAULT_APP_INSTALLATIONS_LIMIT,
            spaceId: entityId,
          },
          data: {
            getSpaceAppInstallations: {
              ...appInstallations,
              __typename: 'PaginatedAppInstallation',
              totalCount: appInstallations.totalCount + 1,
              edges: newEdges,
            },
          },
        })
      }
    } catch (e) {
      logger.debug(
        'error - updating GET_SPACE_APP_INSTALLATIONS for useInstallApp',
        e,
      )
    }
  }

  const installApp = useCallback(
    async (input: InstallAppInput) => {
      const optimisticInstallApp: AppInstallation = {
        __typename: 'AppInstallation',
        context: input.context ?? PermissionContext.NETWORK,
        permissions: input.permissions ?? [],
        id: 'appInstallationId',
        status: AppInstallationStatus.ENABLED,
        app,
        appVersion: '',
        createdAt: new Date().toISOString(),
        installedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        installedBy: authUser,
      }

      callInstallApp({
        variables: {
          appId: app.id,
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          installApp: optimisticInstallApp,
        },
        update: (cache: ApolloCache<InstallAppMutation>, { data }) =>
          updateAppInstallationsCache(
            cache,
            data?.installApp as AppInstallation,
            input?.entityId,
          ),
      })
        .then(({ errors }) => {
          if (errors?.length) {
            toast({
              title: app.name,
              description: t(
                'apps:app.error',
                'Something went wrong.\n Please try again later',
              ),
              status: 'error',
              isClosable: false,
            })
          } else {
            toast({
              title: t('apps:app.installSuccessful', {
                defaultValue: '{{name}} has been successfully installed',
                name: app.name,
              }),
              status: 'success',
              isClosable: false,
              position: 'top-right',
            })
          }
        })
        .catch(err => {
          logger.error('error - Installing app', err)
        })
    },
    [app, callInstallApp, t, toast, authUser],
  )

  return { installApp }
}
