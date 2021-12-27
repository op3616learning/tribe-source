import { ApolloCache, gql, useApolloClient } from '@apollo/client'

import {
  PinPostToSpaceMutation,
  PinPostToSpaceMutationVariables,
  UnpinPostFromSpaceMutation,
  UnpinPostFromSpaceMutationVariables,
  PIN_POST_TO_SPACE,
  UNPIN_POST_FROM_SPACE,
  SPACE,
  GET_POSTS,
  SpaceQuery,
  SpaceQueryVariables,
} from 'tribe-api/graphql'
import { Post, PinnedInto, ActionStatus, Space } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'

import { DEFAULT_POSTS_LIMIT } from 'containers/Space/hooks/useGetPosts'

import { logger } from 'lib/logger'

const onUpdatePost = (post: Post, pinnedInto: PinnedInto[]) => (
  cache: ApolloCache<PinPostToSpaceMutation>,
) => {
  try {
    cache.writeFragment({
      id: cache.identify(post),
      fragment: gql`
        fragment _ on Post {
          pinnedInto
        }
      `,
      data: {
        pinnedInto,
      },
      broadcast: false,
    })

    if (pinnedInto?.length > 0) {
      const { space } =
        cache.readQuery<SpaceQuery, SpaceQueryVariables>({
          query: SPACE,
          variables: {
            slug: post?.space?.slug,
          },
        }) || {}
      if (space) {
        const updatedPinnedPosts = [
          { ...post, pinnedInto },
          ...(space.pinnedPosts || []),
        ]

        cache.modify({
          id: cache.identify(post?.space as Space),
          fields: {
            pinnedPosts: () => {
              return updatedPinnedPosts
            },
          },
          broadcast: false,
        })
      }
    }
  } catch (e) {
    logger.error('error - updating cache for pin post', e)
  }
}

const usePinPost = (post: Post) => {
  const toast = useToast()
  const apolloClient = useApolloClient()

  const pin = async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }
    apolloClient
      .mutate<PinPostToSpaceMutation, PinPostToSpaceMutationVariables>({
        mutation: PIN_POST_TO_SPACE,
        variables: {
          postId: post?.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          pinPostToSpace: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdatePost(post, [PinnedInto.SPACE]),
        errorPolicy: 'all',
      })
      .then(res => {
        const { errors } = res
        if (errors) {
          errors.forEach(error => {
            toast({
              description: error.message,
              status: 'error',
              position: 'top-right',
            })
          })
        }
        return res
      })
  }

  const unpin = async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }
    apolloClient
      .mutate<UnpinPostFromSpaceMutation, UnpinPostFromSpaceMutationVariables>({
        mutation: UNPIN_POST_FROM_SPACE,
        variables: {
          postId: post?.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          unpinPostFromSpace: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        refetchQueries: () => [
          { query: SPACE, variables: { slug: post?.space?.slug } },
          {
            query: GET_POSTS,
            variables: {
              limit: DEFAULT_POSTS_LIMIT,
              spaceIds: [post?.space?.id ?? ''],
              excludePins: true,
            },
          },
        ],
      })
      .then(res => {
        return res
      })
  }

  const isPinned = post?.pinnedInto?.includes(PinnedInto.SPACE)

  return {
    pin,
    unpin,
    isPinned,
  }
}

export default usePinPost
