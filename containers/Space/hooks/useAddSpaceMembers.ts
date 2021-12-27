import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'

import { logger } from '@tribefrontend/logger'
import {
  ADD_SPACE_MEMBERS,
  AddSpaceMembersMutation,
  AddSpaceMembersMutationVariables,
  GET_SPACE_MEMBERS,
} from 'tribe-api/graphql'
import { AddSpaceMemberInput, Space } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export type UseAddSpaceMembersProps = () => {
  addSpaceMembers: (space: Space, inputs: AddSpaceMemberInput[]) => Promise<any>
}

export const useAddSpaceMembers: UseAddSpaceMembersProps = () => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const addSpaceMembers = useCallback(
    async (space: Space, input: AddSpaceMemberInput[]) => {
      const mutateResult = await apolloClient.mutate<
        AddSpaceMembersMutation,
        AddSpaceMembersMutationVariables
      >({
        mutation: ADD_SPACE_MEMBERS,
        variables: {
          input,
          spaceId: space?.id,
        },
        refetchQueries: [
          {
            query: GET_SPACE_MEMBERS,
            variables: {
              spaceId: space?.id,
              limit: 100,
            },
          },
        ],
        update: (cache, { data }) => {
          const addedMembersCount = data?.addSpaceMembers?.length as number
          try {
            cache.modify({
              id: cache.identify(space),
              fields: {
                membersCount() {
                  return space.membersCount + addedMembersCount
                },
              },
            })
          } catch (e) {
            logger.error(
              'Error while updating GET_SPACE feed in useAddSpaceMembers',
              e,
            )
          }
        },
      })

      if (mutateResult.errors) {
        toast({
          title: t('space.addmembers.error.members.title', 'Error'),
          description: t(
            'space.addmembers.error.description',
            'Could not add space members',
          ),
          status: 'error',
        })
      }
      return mutateResult
    },
    [],
  )

  return {
    addSpaceMembers,
  }
}

export default useAddSpaceMembers
