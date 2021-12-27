import React, { useCallback } from 'react'

import Notification2LineIcon from 'remixicon-react/Notification2LineIcon'

import { Post } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Button, ButtonProps, Icon } from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { useUpdateMemberPostNotificationSettings } from 'hooks/notifications/useUpdateMemberPostNotificationSettings'
import useAuthMember from 'hooks/useAuthMember'

type FollowButtonProps = Omit<ButtonProps, 'onClick'> & {
  post: Post | null
}

export const FollowButton = ({ post, ...rest }: FollowButtonProps) => {
  const { authUser, isGuest } = useAuthMember()
  const { network } = useGetNetwork()

  const {
    updateMemberPostNotificationSettings,
    loading: isUpdatingMemberPostNotificationSettings,
  } = useUpdateMemberPostNotificationSettings()

  const {
    authorized: hasUpdateMemberPostNotificationSettingsPermission,
  } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateMemberPostNotificationSettings',
  )
  const { authorized: hasReplyPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )

  const { isEnabled: isFollowUnfollowPostsEnabled } = useTribeFeature(
    Features.FollowUnfollowPosts,
  )

  const handleBtnClick = useCallback(() => {
    if (hasUpdateMemberPostNotificationSettingsPermission && post?.id) {
      updateMemberPostNotificationSettings?.({
        input: {
          enabled: !post?.authMemberProps
            ?.memberPostNotificationSettingsEnabled,
        },
        postId: post?.id,
      })
    }
  }, [
    hasUpdateMemberPostNotificationSettingsPermission,
    post?.authMemberProps?.memberPostNotificationSettingsEnabled,
    post?.id,
    updateMemberPostNotificationSettings,
  ])

  if (
    authUser?.id === post?.owner?.member?.id ||
    isGuest ||
    (!isGuest && !hasUpdateMemberPostNotificationSettingsPermission) ||
    (!isGuest && !hasReplyPermission) ||
    !isFollowUnfollowPostsEnabled
  ) {
    return null
  }

  return (
    <Button
      buttonType={
        post?.authMemberProps?.memberPostNotificationSettingsEnabled
          ? 'primary'
          : 'secondary'
      }
      {...(!post?.authMemberProps?.memberPostNotificationSettingsEnabled && {
        color: 'label.secondary',
      })}
      size="xs"
      leftIcon={<Icon as={Notification2LineIcon} />}
      onClick={handleBtnClick}
      isDisabled={isUpdatingMemberPostNotificationSettings}
      {...rest}
    >
      {post?.authMemberProps?.memberPostNotificationSettingsEnabled ? (
        <Trans i18nKey="common:post.following" defaults="Following" />
      ) : (
        <Trans i18nKey="common:post.follow" defaults="Follow" />
      )}
      {typeof post?.followersCount === 'number' && post?.followersCount > 1 && (
        <>
          {' · '}
          {post?.followersCount - 1}
        </>
      )}
    </Button>
  )
}
