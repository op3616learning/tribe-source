import { useCallback, useRef } from 'react'

import { useMutation } from '@apollo/client'

import {
  UpdateModerationMutation,
  UpdateModerationMutationVariables,
  UPDATE_MODERATION,
} from 'tribe-api/graphql'
import {
  ModerationStatus,
  UpdateModerationItemInput,
} from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

type useUpdateModerationVariables = {
  moderationId: string
}
const useUpdateModeration = ({
  moderationId,
}: useUpdateModerationVariables) => {
  const toast = useToast()
  const { t } = useTranslation()
  const statusRef: { current: ModerationStatus | null } = useRef(null)
  const [update, { loading, error }] = useMutation<
    UpdateModerationMutation,
    UpdateModerationMutationVariables
  >(UPDATE_MODERATION, {
    update: cache => {
      try {
        cache.modify({
          fields: {
            getModerations(existingModerationsRef, { readField }) {
              return {
                ...existingModerationsRef,
                edges: existingModerationsRef?.edges?.filter(
                  moderationRef =>
                    moderationId !== readField('id', moderationRef?.node),
                ),
              }
            },
          },
        })
        if (statusRef.current === ModerationStatus.REJECTED) {
          toast({
            title: t('admin:moderation.pendingPosts.feedback.allowed', {
              defaultValue: 'Post has been allowed',
            }),
          })
        } else if (statusRef.current === ModerationStatus.ACCEPTED) {
          toast({
            title: t('admin:moderation.pendingPosts.feedback.rejected', {
              defaultValue: 'Post has been rejected',
            }),
          })
        }
      } catch (e) {
        logger.error('Error while updating mutations', e.message)
      }
    },
  })

  const updateModeration = useCallback(
    (input: UpdateModerationItemInput) => {
      statusRef.current = input?.status
      update({
        variables: { input, id: moderationId },
      })
    },
    [update],
  )

  if (error) {
    toast({
      title: t('admin:moderation.pendingPosts.feedback.error', {
        defaultValue: 'An error occured. Please try again later.',
      }),
    })
  }

  return {
    loading,
    updateModeration,
    error,
  }
}

export default useUpdateModeration
