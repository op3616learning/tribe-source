import React, { useCallback, useEffect, useMemo } from 'react'

import { Box, useDisclosure } from '@chakra-ui/react'

import { ActionPermissions, Post, SpaceQuery } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Text, Heading } from 'tribe-components'
import { Trans } from 'tribe-translation'

import Feed from './components/Feed'
import Composer from './Composer'
import useGetPosts, { DEFAULT_POSTS_LIMIT } from './hooks/useGetPosts'
import useLazyGetTopicPosts from './hooks/useLazyGetTopicPosts'
import useSpaceDiscussionSettings from './hooks/useSpaceDiscussionSettings'

export interface DiscussionFeedProps {
  space?: SpaceQuery['space']
  onComposerClose?: () => void
  filteredTopicId: string | null
}

const DiscussionFeed = ({
  space,
  onComposerClose,
  filteredTopicId,
}: DiscussionFeedProps) => {
  const { isOpen, onClose } = useDisclosure()
  const spaceIdArray = useMemo(() => [space?.id || ''], [space?.id])

  const {
    posts,
    hasNextPage,
    loadMore,
    totalCount,
    isInitialLoading,
  } = useGetPosts({
    spaceIds: spaceIdArray,
    limit: DEFAULT_POSTS_LIMIT,
    excludePins: true,
  })

  const {
    posts: filteredPosts,
    hasNextPage: filteredHasNextPage,
    loadMore: filteredLoadMore,
    getTopicPosts,
    totalCount: filteredTotalCount,
    loading: filteredIsLoading,
  } = useLazyGetTopicPosts({
    spaceId: space?.id || '',
    limit: DEFAULT_POSTS_LIMIT,
    topicId: '',
  })

  const { discussionLayout } = useSpaceDiscussionSettings(space)

  const onCloseCallback = useCallback(() => {
    onClose()

    if (typeof onComposerClose === 'function') onComposerClose()
  }, [onClose, onComposerClose])

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: hasAddPostPermission } = hasActionPermission(
    permissions || [],
    'addPost',
  )

  useEffect(() => {
    if (filteredTopicId) {
      getTopicPosts(filteredTopicId)
    }
  }, [filteredTopicId])

  return (
    <>
      {hasAddPostPermission && space && (
        <Composer
          space={space}
          defaultIsOpen={isOpen}
          onCloseCallback={onCloseCallback}
        />
      )}
      {!filteredTopicId && (
        <Feed
          variant={discussionLayout}
          onLoadMore={loadMore}
          loading={isInitialLoading}
          pinnedPosts={(space?.pinnedPosts as Post[]) || []}
          posts={posts}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
        />
      )}

      {filteredTopicId && (
        <Feed
          variant={discussionLayout}
          onLoadMore={filteredLoadMore}
          loading={filteredIsLoading}
          posts={filteredPosts || []}
          totalCount={filteredTotalCount}
          hasNextPage={filteredHasNextPage}
        />
      )}

      {filteredTopicId && !filteredIsLoading && filteredPosts?.length === 0 && (
        <Box textAlign="center">
          <Heading as="h3" size="lg" mb="2">
            <Trans
              i18nKey="space:highlightedTags.empty.title"
              defaults="No discussions found."
            />
          </Heading>
          <Text textStyle="regular/medium">
            <Trans
              i18nKey="space:highlightedTags.empty.description"
              defaults="There were no discussions found with this tag."
            />
          </Text>
        </Box>
      )}
    </>
  )
}

export default DiscussionFeed
