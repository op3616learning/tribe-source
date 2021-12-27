import React, { FC } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import EyeOffLineIcon from 'remixicon-react/EyeOffLineIcon'

import { hasActionPermission } from 'tribe-api'
import { Post } from 'tribe-api/interfaces'
import { Icon, Tooltip } from 'tribe-components'
import { Trans } from 'tribe-translation'

export const BUTTON_SIZE = 8

dayjs.extend(relativeTime)

interface PostHiddenIndicatorProps {
  post: Post
}

export const PostHiddenIndicator: FC<PostHiddenIndicatorProps> = ({ post }) => {
  const isReply = !!post?.repliedTo

  const { authorized: hasHidePostPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'hidePost',
  )

  if (isReply || !post.isHidden || !hasHidePostPermission) return null

  return (
    <Tooltip
      label={
        <Trans
          i18nKey="post:hidden.tooltip"
          defaults="People won’t see this post in their Feed. It will still be available for the author and in search results."
        />
      }
      closeOnClick={false}
    >
      <span>
        <Icon
          borderRadius="base"
          bgColor="bg.secondary"
          as={EyeOffLineIcon}
          w={BUTTON_SIZE}
          h={BUTTON_SIZE}
          p={2}
          color="label.secondary"
        />
      </span>
    </Tooltip>
  )
}
