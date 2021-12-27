import { useCallback, useRef } from 'react'

import { ApolloError, useMutation } from '@apollo/client'
import produce from 'immer'

import {
  UPDATE_DEFAULT_SSO_STATUS,
  GET_SSOS,
  UpdateDefaultSsoStatusMutation,
  SsosQuery,
  UpdateDefaultSsoStatusMutationVariables,
} from 'tribe-api/graphql'
import {
  SsoType,
  SsoStatus,
  ActionStatus,
  DefaultSsoType,
} from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

type UseUpdateDefaultSsoRef = {
  sso: SsoType
  status: SsoStatus
}

export const useUpdateDefaultSsoStatus = (): {
  data?: UpdateDefaultSsoStatusMutation | null
  error?: ApolloError
  loading: boolean
  updateDefaultSsoStatus: (sso: SsoType, status: SsoStatus) => void
} => {
  const inputRef = useRef<UseUpdateDefaultSsoRef | null>(null)
  const [update, { data, error, loading }] = useMutation<
    UpdateDefaultSsoStatusMutation,
    UpdateDefaultSsoStatusMutationVariables
  >(UPDATE_DEFAULT_SSO_STATUS, {
    optimisticResponse: {
      __typename: 'Mutation',
      updateDefaultSsoStatus: {
        __typename: 'Action',
        status: ActionStatus.SUCCEEDED,
      },
    },
    update: cache => {
      try {
        const cachedDefaultSsos = cache.readQuery<SsosQuery>({
          query: GET_SSOS,
        })

        const defaultSsos = cachedDefaultSsos?.ssos || []

        const newDefaultSsos = produce(defaultSsos, draft => {
          const index = draft.findIndex(
            edge => edge.type === inputRef.current?.sso,
          )

          if (index !== -1 && inputRef.current?.status) {
            draft[index] = {
              ...draft[index],
              status: inputRef.current?.status,
            }
          }
        })

        // setting all ssos
        cache.writeQuery<SsosQuery>({
          query: GET_SSOS,
          data: {
            ssos: newDefaultSsos,
          },
        })

        // setting enabled ssos
        cache.writeQuery<SsosQuery>({
          query: GET_SSOS,
          variables: {
            status: SsoStatus.ENABLE,
          },
          data: {
            ssos:
              newDefaultSsos?.filter(s => s.status === SsoStatus.ENABLE) || [],
          },
        })

        // setting disabled ssos
        cache.writeQuery<SsosQuery>({
          query: GET_SSOS,
          variables: {
            status: SsoStatus.DISABLE,
          },
          data: {
            ssos:
              newDefaultSsos?.filter(s => s.status === SsoStatus.DISABLE) || [],
          },
        })
      } catch (e) {
        logger.error(
          'Error while performing cache update of updateDefaultSsos',
          e?.message,
        )
      }
    },
  })

  const updateDefaultSsoStatus = useCallback(
    (sso: SsoType, status: SsoStatus) => {
      inputRef.current = { status, sso }
      // Its okay to case DefaultSsoType to SsoType since DefaultSsoType is part of SsoType
      update({ variables: { status, sso: (sso as unknown) as DefaultSsoType } })
    },
    [update],
  )

  return {
    data,
    error,
    loading,
    updateDefaultSsoStatus,
  }
}
