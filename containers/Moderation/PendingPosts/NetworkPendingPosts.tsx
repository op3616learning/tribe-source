import React from 'react'

import { ModerationItem } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Card, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'
import PostsInfiniteScroll from 'components/PostsInfiniteScroll'

import { ErrorForbidden } from 'containers/Error/ErrorForbidden'
import useGetNetwork from 'containers/Network/useGetNetwork'
import { PostBody } from 'containers/Post/components'

import { useResponsive } from 'hooks/useResponsive'

import { PendingPostsEmpty } from './components/Empty'
import { ModerationPostCard } from './components/ModerationPostCard'
import useGetModerations, {
  DEFAULT_MODERATIONS_LIMIT,
} from './hooks/useGetModerations'

const NetworkPendingPosts = () => {
  const { isMobile } = useResponsive()
  const { network } = useGetNetwork()

  const { authorized: canUpdateModeration } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateModeration',
  )
  const { authorized: canGetModerations } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'getModerations',
  )

  const {
    moderations,
    loading: moderationsLoading,
    hasNextPage,
    loadMore,
    error,
  } = useGetModerations({
    limit: DEFAULT_MODERATIONS_LIMIT,
    skip: !canGetModerations,
  })

  if (error) {
    return <ErrorForbidden />
  }
  return (
    <>
      {!isMobile && (
        <LayoutHeader h="auto" pb={0} mb={5}>
          <Text textStyle="bold/2xlarge">
            <Trans
              i18nKey="admin:moderation.pendingPosts.title"
              defaults="Pending posts"
            />
          </Text>
        </LayoutHeader>
      )}
      {moderationsLoading &&
        moderations?.length < 1 &&
        [...Array(3)].map((_, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Card mb={5} key={index}>
              <PostBody post={null} />
            </Card>
          )
        })}

      {!moderationsLoading && moderations?.length === 0 && (
        <PendingPostsEmpty />
      )}

      <PostsInfiniteScroll
        dataLength={moderations?.length}
        next={loadMore}
        hasMore={hasNextPage}
      >
        {moderations &&
          moderations.map((moderation: ModerationItem) => {
            return (
              <ModerationPostCard
                key={moderation?.id}
                moderation={moderation}
                canUpdateModeration={canUpdateModeration}
              />
            )
          })}
      </PostsInfiniteScroll>
    </>
  )
}

export default NetworkPendingPosts
