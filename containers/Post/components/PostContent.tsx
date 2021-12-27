import React from 'react'

import { Post } from 'tribe-api/interfaces'

import { DiscussionPostContent } from 'containers/Discussion/components/DiscussionPostContent'
import { QuestionPostContent } from 'containers/Question/components'
import { AnswerPostContent } from 'containers/Question/components/AnswerPostContent'

import { TribeComposerReadonly } from '../TribeComposerReadonly'

type PostContentProps = { post?: Post | null; defaultExpanded?: boolean }

export const PostContent = ({ post, defaultExpanded }: PostContentProps) => {
  if (!post) {
    return null
  }

  switch (post?.postType?.name?.toLowerCase()) {
    case 'discussion':
      return (
        <DiscussionPostContent post={post} defaultExpanded={defaultExpanded} />
      )
    case 'comment':
      return (
        <TribeComposerReadonly post={post} defaultExpanded={defaultExpanded} />
      )
    case 'question':
      return (
        <QuestionPostContent post={post} defaultExpanded={defaultExpanded} />
      )
    case 'answer':
      return <AnswerPostContent post={post} defaultExpanded={defaultExpanded} />
    default:
      return null
  }
}
