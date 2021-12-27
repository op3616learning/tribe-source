import React from 'react'

import { Post } from 'tribe-api'
import { ThemeTokens } from 'tribe-api/interfaces'
import { Link, SkeletonText, useToggle } from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { ComposerReadonly } from 'containers/Composer/ComposerReadonly'
import { getPostFieldValue } from 'containers/Post/utils'

import { getPostAttachments } from 'utils/post.utils'

import { useReportAttachmentDownload } from './hooks/useReportAttachmentDownload'

export interface TribeComposerReadonlyProps {
  post: Post | null
  fieldValue?: string
  defaultExpanded?: boolean
}

export const TribeComposerReadonly = ({
  post,
  fieldValue = 'content',
  defaultExpanded,
}: TribeComposerReadonlyProps) => {
  const { themeSettings } = useThemeSettings()
  const onAttachmentDownload = useReportAttachmentDownload(post)
  const [expanded, toggleExpanded] = useToggle(defaultExpanded)
  const { isEnabled: isAttachmentsFeatureEnabled } = useTribeFeature(
    Features.PostFileAttachments,
  )

  if (post === null) {
    return <SkeletonText noOfLines={4} />
  }

  const { embeds, mentions } = post || {}
  // Trims the space before the ellipsis.
  const shortContent =
    post.shortContent?.replace?.(/(\s\.\.\.)<\/p>$/, '...') || ''

  const content = getPostFieldValue(post, fieldValue) || ''
  const attachments = isAttachmentsFeatureEnabled
    ? getPostAttachments(post)
    : []

  if (content === '' && !embeds && !attachments.length) {
    return null
  }

  return (
    <ComposerReadonly
      value={expanded ? content : shortContent}
      embeds={embeds}
      mentions={mentions}
      themeSettings={themeSettings as ThemeTokens}
      attachments={getPostAttachments(post)}
      onAttachmentDownload={onAttachmentDownload}
    >
      {post?.hasMoreContent && !defaultExpanded && (
        <Link
          variant="primary"
          alignSelf="flex-start"
          fontSize="md"
          href="#!"
          mt={3}
          onClick={toggleExpanded}
        >
          {expanded ? (
            <Trans i18nKey="post:seeLess" defaults="See less" />
          ) : (
            <Trans i18nKey="post:seeMore" defaults="See more" />
          )}
        </Link>
      )}
    </ComposerReadonly>
  )
}
