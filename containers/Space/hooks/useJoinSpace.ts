import { useCallback } from 'react'

import { FetchResult, useApolloClient } from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'

import {
  GET_SPACE_MEMBERS,
  BASIC_SPACE_FRAGMENT,
  GetSpaceMembersQuery,
  JOIN_SPACE,
  JoinSpaceMutation,
  JoinSpaceMutationVariables,
  SPACE,
  SpaceQuery,
  GET_POSTS,
} from 'tribe-api/graphql'
import {
  ActionStatus,
  Member,
  Space,
  SpaceMemberEdge,
  SpaceMembershipStatus,
  SpaceRole,
  SpaceRoleType,
} from 'tribe-api/interfaces'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

import { DEFAULT_POSTS_LIMIT } from './useGetPosts'

interface UseJoinSpaceProps {
  space: SpaceQuery['space']
}

export type UseJoinSpace = (
  props: UseJoinSpaceProps,
) => {
  joinSpace: () => Promise<FetchResult<JoinSpaceMutation>>
}

export const useJoinSpace: UseJoinSpace = ({ space }: UseJoinSpaceProps) => {
  const { authUser } = useAuthMember()
  const apolloClient = useApolloClient()

  const updateSpace = (
    cache: ApolloCache<JoinSpaceMutation>,
    space: SpaceQuery['space'],
  ) => {
    const spaceFragment = cache.readFragment<Space>({
      id: cache.identify(space),
      fragment: BASIC_SPACE_FRAGMENT,
      fragmentName: 'BasicSpaceFragment',
    })

    if (spaceFragment) {
      cache.writeFragment({
        id: cache.identify(space),
        fragment: BASIC_SPACE_FRAGMENT,
        fragmentName: 'BasicSpaceFragment',
        data: {
          ...spaceFragment,
          membersCount: space?.membersCount + 1,
          authMemberProps: {
            ...spaceFragment?.authMemberProps,
            membershipStatus: SpaceMembershipStatus.JOINED,
          },
        },
      })
    }
  }

  const updateSpaceMembers = (
    cache: ApolloCache<JoinSpaceMutation>,
    space: SpaceQuery['space'],
    authUser: Member,
  ) => {
    const spaceRoles = space?.roles
    const cachedSpaceMembers = cache.readQuery<GetSpaceMembersQuery>({
      query: GET_SPACE_MEMBERS,
      variables: { spaceId: space.id },
    })

    if (spaceRoles && cachedSpaceMembers) {
      const { getSpaceMembers: spaceMembers } = cachedSpaceMembers

      const newSpaceMember: SpaceMemberEdge = {
        __typename: 'SpaceMemberEdge',
        cursor: '',
        node: {
          __typename: 'SpaceMember',
          member: authUser,
          role: (spaceRoles as SpaceRole[]).find(
            it => it.type === SpaceRoleType.MEMBER,
          ),
        },
      }

      const newEdges = spaceMembers.edges?.length
        ? ([...spaceMembers.edges, newSpaceMember] as SpaceMemberEdge[])
        : [newSpaceMember]

      cache.writeQuery<GetSpaceMembersQuery>({
        query: GET_SPACE_MEMBERS,
        variables: { spaceId: space.id },
        data: {
          getSpaceMembers: {
            ...spaceMembers,
            totalCount: spaceMembers.totalCount + 1,
            edges: newEdges,
          },
        },
      })
    }
  }

  const updateSpaceMembersByRoleId = (
    cache: ApolloCache<JoinSpaceMutation>,
    space: SpaceQuery['space'],
    authUser: Member,
  ) => {
    const spaceRoles = space?.roles
    let memberRole

    if (spaceRoles) {
      memberRole = (spaceRoles as SpaceRole[]).find(
        it => it.type === SpaceRoleType.MEMBER,
      )
    }

    if (!memberRole) {
      return
    }

    const cachedSpaceMembers = cache.readQuery<GetSpaceMembersQuery>({
      query: GET_SPACE_MEMBERS,
      variables: { spaceId: space.id, roleIds: [memberRole.id] },
    })

    if (cachedSpaceMembers) {
      const { getSpaceMembers: spaceMembers } = cachedSpaceMembers

      const newSpaceMember: SpaceMemberEdge = {
        __typename: 'SpaceMemberEdge',
        cursor: '',
        node: {
          __typename: 'SpaceMember',
          member: authUser,
          role: memberRole,
        },
      }

      const newEdges = spaceMembers.edges?.length
        ? ([...spaceMembers.edges, newSpaceMember] as SpaceMemberEdge[])
        : [newSpaceMember]

      cache.writeQuery<GetSpaceMembersQuery>({
        query: GET_SPACE_MEMBERS,
        variables: { spaceId: space.id, roleIds: [memberRole.id] },
        data: {
          getSpaceMembers: {
            ...spaceMembers,
            totalCount: spaceMembers.totalCount + 1,
            edges: newEdges,
          },
        },
      })
    }
  }

  const joinSpace = useCallback(async () => {
    const mutateResult = await apolloClient.mutate<
      JoinSpaceMutation,
      JoinSpaceMutationVariables
    >({
      mutation: JOIN_SPACE,
      variables: { spaceId: space?.id },
      refetchQueries: [
        {
          query: SPACE,
          variables: {
            slug: space.slug,
          },
        },
        {
          query: GET_POSTS,
          variables: {
            spaceIds: [space.id],
            limit: DEFAULT_POSTS_LIMIT,
            excludePins: true,
          },
        },
      ],
      optimisticResponse: {
        __typename: 'Mutation',
        joinSpace: {
          __typename: 'Action',
          status: ActionStatus.SUCCEEDED,
        },
      },
      update: (cache: ApolloCache<JoinSpaceMutation>) => {
        try {
          updateSpace(cache, space)
        } catch (e) {
          logger.error('error - updating GET_SPACE for useJoinSpace', e)
        }
        try {
          updateSpaceMembers(cache, space, authUser)
        } catch (e) {
          // this is normal when there is no GET_SPACE_MEMBERS query in ROOT_QUERY
          logger.debug('error - updating GET_SPACE_MEMBERS for useJoinSpace', e)
        }
        try {
          updateSpaceMembersByRoleId(cache, space, authUser)
        } catch (e) {
          // this is normal when there is no GET_SPACE_MEMBERS query in ROOT_QUERY
          logger.debug(
            'error - updating GET_SPACE_MEMBERS by roleId for useJoinSpace',
            e,
          )
        }
      },
    })
    return mutateResult
  }, [space, authUser, apolloClient])

  return {
    joinSpace,
  }
}
