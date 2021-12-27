import { useCallback } from 'react'

import {
  MutationResult,
  MutationHookOptions,
  useMutation,
  FetchResult,
} from '@apollo/client'

import {
  UPDATE_MEMBER_POST_NOTIFICATION_SETTINGS,
  UpdateMemberPostNotificationSettingsMutation,
  UpdateMemberPostNotificationSettingsMutationVariables,
  Post,
} from 'tribe-api'
import { FEED_POST_FRAGMENT } from 'tribe-api/graphql'
import { PostAuthMemberProps } from 'tribe-api/interfaces'

export type UseUpdateMemberPostNotificationSettings = MutationResult<
  UpdateMemberPostNotificationSettingsMutation
> & {
  updateMemberPostNotificationSettings: (
    variables: UpdateMemberPostNotificationSettingsMutationVariables,
  ) => Promise<
    FetchResult<
      UpdateMemberPostNotificationSettingsMutation,
      Record<string, unknown>,
      Record<string, unknown>
    >
  >
}

export const useUpdateMemberPostNotificationSettings = (
  options?: MutationHookOptions<
    UpdateMemberPostNotificationSettingsMutation,
    UpdateMemberPostNotificationSettingsMutationVariables
  >,
): UseUpdateMemberPostNotificationSettings => {
  const [
    updateMemberPostNotificationSettingsMutation,
    { called, client, data, error, loading },
  ] = useMutation<
    UpdateMemberPostNotificationSettingsMutation,
    UpdateMemberPostNotificationSettingsMutationVariables
  >(UPDATE_MEMBER_POST_NOTIFICATION_SETTINGS, {
    update: (cache, { data }) => {
      const { postId, enabled } =
        data?.updateMemberPostNotificationSettings || {}

      const cachedPost = cache.readFragment<Post>({
        fragment: FEED_POST_FRAGMENT,
        id: `Post:${postId}`,
        fragmentName: 'FeedPostFields',
      })
      let followersCount = cachedPost?.followersCount || 1
      if (enabled) {
        followersCount += 1
      } else {
        followersCount -= 1
      }

      if (cachedPost) {
        cache.writeFragment<Post>({
          fragment: FEED_POST_FRAGMENT,
          id: `Post:${postId}`,
          fragmentName: 'FeedPostFields',
          data: {
            ...cachedPost,
            followersCount,
            authMemberProps: {
              ...(cachedPost.authMemberProps as PostAuthMemberProps),
              memberPostNotificationSettingsEnabled: !!enabled,
            },
          },
        })
      }
    },
    ...options,
  })

  const updateMemberPostNotificationSettings = useCallback(
    (variables: UpdateMemberPostNotificationSettingsMutationVariables) =>
      updateMemberPostNotificationSettingsMutation({
        variables,
        optimisticResponse: {
          updateMemberPostNotificationSettings: {
            __typename: 'MemberPostNotificationSettings',
            enabled: variables.input.enabled,
            memberId: variables.memberId || '',
            postId: variables.postId,
          },
        },
      }),
    [updateMemberPostNotificationSettingsMutation],
  )

  return {
    called,
    client,
    data,
    error,
    loading,
    updateMemberPostNotificationSettings,
  }
}
