import { useCallback } from 'react'

import { useMutation } from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'
import produce from 'immer'

import {
  GET_SPACE_MEMBERS,
  GetSpaceMembersQuery,
  UPDATE_SPACE_MEMBER_ROLE,
  UpdateMemberSpaceRoleMutation,
  UpdateMemberSpaceRoleMutationVariables,
} from 'tribe-api/graphql'
import {
  ActionStatus,
  Member,
  PaginatedSpaceMember,
  SpaceRole,
} from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

export const useUpdateMemberSpaceRole = ({ spaceId }: { spaceId: string }) => {
  const updateSpaceMembers = (
    cache: ApolloCache<UpdateMemberSpaceRoleMutation>,
    spaceId: string,
    memberId: string,
    role: SpaceRole,
  ) => {
    const cachedQuery = cache.readQuery<GetSpaceMembersQuery>({
      query: GET_SPACE_MEMBERS,
      variables: { spaceId },
    })
    if (cachedQuery) {
      const { getSpaceMembers: spaceMembers } = cachedQuery
      const newSpaceMembers = produce(
        spaceMembers as PaginatedSpaceMember,
        draft => {
          const edge = draft.edges?.find(
            edge => edge.node?.member?.id === memberId,
          )
          if (edge?.node.role) {
            edge.node.role.id = role?.id
            edge.node.role.name = role?.name
          }
        },
      )

      cache.writeQuery<GetSpaceMembersQuery>({
        query: GET_SPACE_MEMBERS,
        variables: { spaceId },
        data: {
          getSpaceMembers: newSpaceMembers,
        },
      })
    }
  }

  const [updateRole, { data, loading, error }] = useMutation<
    UpdateMemberSpaceRoleMutation,
    UpdateMemberSpaceRoleMutationVariables
  >(UPDATE_SPACE_MEMBER_ROLE)

  const updateMemberSpaceRole = useCallback(
    ({ role, memberId }: { role: SpaceRole; memberId: Member['id'] }) => {
      return updateRole({
        variables: {
          roleId: role?.id,
          memberId,
          spaceId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateMemberSpaceRole: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: (cache: ApolloCache<UpdateMemberSpaceRoleMutation>) => {
          try {
            updateSpaceMembers(cache, spaceId, memberId, role)
          } catch (e) {
            // this is normal when there is no GET_SPACE_MEMBERS query in ROOT_QUERY
            logger.debug(
              'error - updating GET_SPACE_MEMBERS for useUpdateMemberSpaceRole',
              e,
            )
          }
        },
      })
    },
    [updateRole, spaceId],
  )
  return {
    error,
    loading,
    data,
    updateMemberSpaceRole,
  }
}
