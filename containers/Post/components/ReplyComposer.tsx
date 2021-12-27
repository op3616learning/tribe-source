import React, {
  RefObject,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react'

import { Box, HStack, useToken } from '@chakra-ui/react'
import { __DEV__ } from '@chakra-ui/utils'

import { Post, PostType } from 'tribe-api/interfaces'
import { Button, Card, UserBar } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { ComposerControls, ComposerWidget } from 'containers/Composer'
import { ComposerRefImperativeHandle } from 'containers/Composer/@types'
import { useMediaUploadStatus } from 'containers/Composer/hooks/useMediaUploadStatus'
import useAddReply from 'containers/Post/hooks/useAddReply'
import { COMPOSER_SPACING } from 'containers/Space/Composer'
import { useAttachments } from 'containers/Space/hooks/useAttachments'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

export interface ReplyComposerProps {
  placeholder?: string
  replyTo: Post
}

export const ReplyComposer = forwardRef(
  (
    { placeholder, replyTo }: ReplyComposerProps,
    inputRef: RefObject<ComposerRefImperativeHandle>,
  ) => {
    const { authUser, isGuest } = useAuthMember()
    const [content, setContent] = useState('')
    const internalRef = useRef<ComposerRefImperativeHandle>()
    const [space2, composerGap, space8] = useToken('space', [
      2,
      COMPOSER_SPACING,
      8,
    ])
    const composerRef = inputRef || internalRef
    const {
      attachments,
      deleteAttachment,
      clearAttachments,
      handleAttachmentSelect,
    } = useAttachments()

    const {
      isMediaUploading,
      onQuillMount,
      onQuillUnmount,
    } = useMediaUploadStatus(composerRef)

    let replyType = replyTo?.authMemberProps?.availableReplyTypes?.find(
      type => type.name === 'Comment',
    )
    if (!replyType) {
      replyType = replyTo?.authMemberProps?.availableReplyTypes?.[0]
    }

    const { addReply } = useAddReply(
      replyTo,
      composerRef?.current?.getQuill?.(),
      {
        onCompleted: () => {
          composerRef.current?.clear()
        },
      },
    )

    const onComposerChange = useCallback(val => setContent(val), [])
    let isEmpty = true
    if (composerRef?.current?.isEmpty) {
      isEmpty = composerRef?.current?.isEmpty()
    }

    const publish = useCallback(() => {
      if (isEmpty) {
        return
      }

      const postType = {
        ...replyTo?.postType,
        ...replyType,
      } as PostType

      const commonFields = {
        postType,
        attachmentIds: attachments.map(({ id }) => id),
      }

      if (postType) {
        try {
          addReply({
            ...commonFields,
            content: composerRef?.current?.getEditorHTML() || '',
          })
        } catch (e) {
          logger.error('Error while sanitizing reply post content', e.message)
          addReply({
            ...commonFields,
            content,
          })
        }
        composerRef.current?.clear()
        clearAttachments()
      }
    }, [
      isEmpty,
      replyTo?.postType,
      replyType,
      attachments,
      composerRef,
      clearAttachments,
      addReply,
      content,
    ])

    if (isGuest) return null

    return (
      <Card>
        <UserBar
          title={authUser?.name}
          picture={authUser?.profilePicture}
          subtitle={authUser?.tagline}
          w="full"
        />
        <Box
          data-testid="reply-box"
          mx={-COMPOSER_SPACING}
          sx={{
            '.composer.edit > .ql-editor:before': {
              left: COMPOSER_SPACING,
            },
          }}
        >
          <ComposerWidget
            ref={composerRef}
            value={content}
            onChange={onComposerChange}
            placeholder={placeholder}
            attachments={attachments}
            onAttachmentDelete={deleteAttachment}
            onQuillMount={onQuillMount}
            onQuillUnmount={onQuillUnmount}
            style={{
              minHeight: '76px',
              marginTop: space2,
              marginBottom: space8,
              paddingLeft: composerGap,
              paddingRight: composerGap,
            }}
          />
        </Box>

        <HStack justify="space-between" mt={3}>
          <Box>
            <ComposerControls
              onAttachmentSelect={handleAttachmentSelect}
              composerRef={composerRef}
            />
          </Box>

          <Button
            data-testid="publish-reply"
            disabled={isEmpty || isMediaUploading}
            onClick={publish}
            buttonType="primary"
          >
            <Trans i18nKey="post:comments.reply_button" defaults="Reply" />
          </Button>
        </HStack>
      </Card>
    )
  },
)

if (__DEV__) {
  ReplyComposer.displayName = 'ReplyComposer'
}
