import React, { useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'

import { Post, ModerationItem, ModerationStatus } from 'tribe-api/interfaces'
import { Alert, AlertIcon, AlertTitle, Button, Card } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { PostHeader, PostTitle, PostContent } from 'containers/Post/components'
import { getPostFieldValue } from 'containers/Post/utils'

import useUpdateModeration from '../hooks/useUpdateModeration'

export interface ModerationPostCardProps {
  moderation: ModerationItem
  canUpdateModeration: boolean
}
export const ModerationPostCard = ({
  moderation,
  canUpdateModeration,
}: ModerationPostCardProps) => {
  const comeBack = false
  const { updateModeration, error } = useUpdateModeration({
    moderationId: moderation?.id,
  })

  const [allowEnabled, setAllowEnabled] = useState(true)
  const [discardEnabled, setDiscardEnabled] = useState(true)

  // At this point this is only system level flags. Accept means accept the system's choice. (Discard the post)
  const allowPost = () => {
    setAllowEnabled(false)
    updateModeration({
      status: ModerationStatus.REJECTED,
    })
  }

  const discardPost = () => {
    setDiscardEnabled(false)
    updateModeration({
      status: ModerationStatus.ACCEPTED,
    })
  }

  if (error) {
    if (!allowEnabled) {
      setAllowEnabled(true)
    }
    if (!discardEnabled) {
      setDiscardEnabled(true)
    }
  }

  const post: Post | undefined =
    moderation?.entity?.__typename === 'Post' ? moderation?.entity : undefined

  const postType = post?.postType?.name

  if (!post) return null
  return (
    <Card mb={8} data-testid={`moderation-card-${moderation?.id}`}>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <>
          <Flex flexDirection="column" align="stretch">
            <Alert mb={5} variant="neutral" status="warning">
              <AlertIcon color="label.primary" />
              <Box flex="1">
                <AlertTitle color="label.primary">
                  {moderation?.description}
                </AlertTitle>
              </Box>
            </Alert>
            <PostHeader
              post={post}
              comeBack={comeBack}
              showSpaceOnUserBar
              showPostOptions={false}
              showSubtitleLink={
                postType === 'Discussion' || postType === 'Question'
              }
            />
            <Box mt={5} />
            {(postType === 'Discussion' || postType === 'Comment') && (
              <>
                <PostTitle post={post} comeBack={comeBack} titleLink>
                  {getPostFieldValue(post, 'title')}
                </PostTitle>
                <PostContent post={post} />
              </>
            )}

            {(postType === 'Question' || postType === 'Answer') && (
              <>
                <PostTitle post={post} comeBack={comeBack} titleLink>
                  {getPostFieldValue(post, 'question')}
                </PostTitle>
                <PostContent post={post} />
              </>
            )}
          </Flex>

          {canUpdateModeration && (
            <Flex mt={5}>
              <Button
                disabled={!(allowEnabled && discardEnabled)}
                isLoading={!allowEnabled}
                onClick={allowPost}
                mr={2}
                isFullWidth
                buttonType="secondary"
              >
                <Trans
                  i18nKey="admin:moderation.pendingPosts.allow"
                  defaults="Accept post"
                />
              </Button>
              <Button
                disabled={!(allowEnabled && discardEnabled)}
                isLoading={!discardEnabled}
                onClick={discardPost}
                isFullWidth
                buttonType="secondary"
              >
                <Trans
                  i18nKey="admin:moderation.pendingPosts.remove"
                  defaults="Remove post"
                />
              </Button>
            </Flex>
          )}
        </>
      </Box>
    </Card>
  )
}
