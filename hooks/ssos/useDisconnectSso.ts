import { useCallback } from 'react'

import { useMutation, ApolloError } from '@apollo/client'

import {
  DELETE_SSO_MEMBERSHIP,
  DeleteSsoMembershipMutation,
  DeleteSsoMembershipMutationVariables,
  GET_SSO_MEMBERSHIP,
  GetSsoMembershipsQuery,
} from 'tribe-api/graphql'
import { ActionStatus, Member, SsoType } from 'tribe-api/interfaces'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

const useDisconnectSso = (): {
  data?: DeleteSsoMembershipMutation | null
  error?: ApolloError
  loading: boolean

  disconnectSso: (ssoType: SsoType, userId?: Member['id']) => void
} => {
  const { authUser } = useAuthMember()

  const [deleteSsoMembership, { data, error, loading }] = useMutation<
    DeleteSsoMembershipMutation,
    DeleteSsoMembershipMutationVariables
  >(DELETE_SSO_MEMBERSHIP)

  const disconnectSso = useCallback(
    (ssoType: SsoType, memberId: Member['id'] = authUser?.id) => {
      deleteSsoMembership({
        variables: {
          memberId,
          type: ssoType,
        },
        update(cache, { data }) {
          try {
            const query = {
              query: GET_SSO_MEMBERSHIP,
              variables: { memberId },
            }

            const cachedSsoMemberships = cache.readQuery<
              GetSsoMembershipsQuery
            >(query)
            const actionResponse = data?.deleteSsoMembership?.status
            const hasActionSucceeded = actionResponse === ActionStatus.SUCCEEDED
            const cachedConnectedSsos =
              cachedSsoMemberships?.getSsoMemberships || []

            if (!hasActionSucceeded) return

            const newConnectedSsos = cachedConnectedSsos.filter(
              connectedSso => connectedSso.ssoType !== ssoType,
            )
            cache.writeQuery({
              ...query,
              data: {
                ...cachedSsoMemberships,
                getSsoMemberships: newConnectedSsos,
              },
            })
          } catch (err) {
            logger.error(err)
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteSsoMembership: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
      })
    },
    [authUser?.id, deleteSsoMembership],
  )

  return {
    data,
    error,
    loading,

    disconnectSso,
  }
}

export default useDisconnectSso
