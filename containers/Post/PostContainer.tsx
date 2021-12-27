import React, { useCallback, useEffect, useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { Post, PostStatus } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Card, Icon, Link, SkeletonProvider, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { FeedLayout, FeedLayoutMain } from 'components/Layout'

import { useComposer } from 'containers/Composer/hooks/useComposer'
import ErrorContainer from 'containers/Error'
import { ErrorDisclosure } from 'containers/Error/ErrorDisclosure'
import {
  PostBody,
  PostComments,
  POST_REPLY_SECTION_ID,
} from 'containers/Post/components'
import useGetPost from 'containers/Post/hooks/useGetPost'
import { getPostBackURL } from 'containers/Post/utils/postLink'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import { FeedTopicsModal } from 'containers/Space/components/FeedTopicsModal'
import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'
import { TopicsModalProvider } from 'containers/Topic/providers/TopicProvider'

import { useSpace } from 'hooks/space/useSpace'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'
import tracker from 'lib/snowplow'

import { MODAL_ID as COMPOSER_MODAL_ID } from '../Space/Composer'
import { decodePostAddress } from './utils'

const customStyles = {
  backLink: {
    pl: { base: 6, md: 0 },
  },
}

interface PostCardProps {
  isInitialLoading: boolean
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post, isInitialLoading }) => {
  const [composer, setComposerFocus] = useComposer()
  const router = useRouter()

  const { authorized: commentsAreEnabledForSpace } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )
  const hash = router?.asPath?.split('#')?.[1]
  const [isReplyComposerVisible, setReplyComposerVisible] = useState(
    !!post?.totalRepliesCount,
  )

  const showReplyComposer = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    setReplyComposerVisible(true)

    window.setTimeout(() => {
      setComposerFocus()
    }, 200)
  }, [setComposerFocus])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    let showReplyComposerTimeout

    if (hash?.includes(POST_REPLY_SECTION_ID) && !isInitialLoading) {
      showReplyComposerTimeout = window.setTimeout(() => {
        setReplyComposerVisible(true)

        window.setTimeout(() => {
          setComposerFocus()
        }, 500)
      }, 500)
    }

    return () => {
      if (showReplyComposerTimeout) {
        window.clearTimeout(showReplyComposerTimeout)
      }
    }
  }, [hash, isInitialLoading, setComposerFocus])

  return (
    <SkeletonProvider loading={isInitialLoading}>
      <TopicsModalProvider>
        <Card>
          <PostBody
            post={post}
            defaultExpanded
            onReply={
              isReplyComposerVisible ? setComposerFocus : showReplyComposer
            }
            showSpaceOnUserBar
          />
        </Card>
        <PostComments
          isReplyComposerVisible={
            isReplyComposerVisible &&
            post?.status !== PostStatus.DELETED &&
            commentsAreEnabledForSpace
          }
          post={post}
          showReplyComposer={showReplyComposer}
          ref={composer}
        />
        <FeedTopicsModal />
      </TopicsModalProvider>
    </SkeletonProvider>
  )
}

const PostContainer = () => {
  const router = useRouter()
  const { isSearchModalOpen } = useSearch()
  const backURL = getPostBackURL()
  const spaceSlug = String(router?.query['space-slug'])

  // TODO: separate slug from id after we've got it
  const { id: postId } = decodePostAddress(String(router.query['post-address']))
  const { post, isInitialLoading, error } = useGetPost({ postId })
  const { space } = useSpace({
    variables: {
      slug: router?.query['space-slug'] ? spaceSlug : undefined,
    },
  })
  const { isSidebarOpen, mobileHeader } = useResponsive()
  const { isOpen: isComposerOpen } = useSpaceModal(COMPOSER_MODAL_ID)

  // Snowplow Set Post Id fot Target of Events
  useEffect(() => {
    tracker.setTarget({ postId, spaceId: space?.id })
    return () => tracker.setTarget({ postId: undefined, spaceId: undefined })
  }, [])

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen || isComposerOpen) return

    mobileHeader.setRight(null)
  }, [isComposerOpen, isSearchModalOpen, isSidebarOpen, mobileHeader])

  if (error || !post) {
    if (error) {
      logger.error(error)
    }

    const _error = error as any

    return _error?.graphQLErrors[0]?.code === 10 ? (
      <ErrorContainer
        error={{
          code: 102,
        }}
      />
    ) : (
      <ErrorContainer error={error} />
    )
  }

  if (!post) {
    return <ErrorDisclosure />
  }

  return (
    <FeedLayout>
      <FeedLayoutMain>
        <Box pl={customStyles.backLink.pl}>
          <NextLink passHref href={backURL ?? `/${spaceSlug}/posts`}>
            <Link display="inline-block">
              <HStack color="label.secondary">
                <Icon as={ArrowLeftLineIcon} />

                <Text color="inherit">
                  {backURL ? (
                    <Trans i18nKey="common.back" defaults="Back" />
                  ) : (
                    <Trans
                      i18nKey="post:header.back"
                      defaults="Back to {{space}}"
                      values={{ space: space?.name }}
                    />
                  )}
                </Text>
              </HStack>
            </Link>
          </NextLink>
        </Box>
        <PostCard isInitialLoading={isInitialLoading} post={post} />
      </FeedLayoutMain>
    </FeedLayout>
  )
}

export default PostContainer
