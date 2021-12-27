import React from 'react'

import { useMutation } from '@apollo/client'

import {
  UpdateMemberMutation,
  UpdateMemberMutationVariables,
  UPDATE_MEMBER,
} from 'tribe-api/graphql'
import { SkeletonProvider, useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import useDisplayMember from '../hooks/useDisplayMember'
import { UseGetMemberResult } from '../hooks/useGetMember'
import { EditMemberForm, EditMemberFormInput } from './EditMemberForm'

export interface EditMemberProps {
  isInitialLoading: UseGetMemberResult['isInitialLoading']
  loading: UseGetMemberResult['loading']
  member: UseGetMemberResult['member']
  callback?: () => void
}
export const EditMember = ({
  member,
  loading,
  isInitialLoading,
  callback,
}: EditMemberProps) => {
  const { showMember } = useDisplayMember(member?.id, member?.role)

  const toast = useToast()
  const { t } = useTranslation()

  const [updateMember, { loading: updatingMember }] = useMutation<
    UpdateMemberMutation,
    UpdateMemberMutationVariables
  >(UPDATE_MEMBER)

  const onSubmit = async (data: EditMemberFormInput) => {
    if (updatingMember) return

    try {
      await updateMember({
        variables: {
          input: {
            name: data.name,
            tagline: data.tagline,
            profilePictureId: data.profilePictureId,
          },
          id: member?.id,
        },
      })
      if (callback) {
        callback()
      } else {
        await showMember()
      }
    } catch (e) {
      logger.error(e)
      toast({
        title: t('common:profile.edit_error.title', 'An error occured.'),
        description: t(
          'common:profile.edit_error.description',
          'Please try after sometime.',
        ),
        status: 'error',
      })
    }
  }

  return (
    <SkeletonProvider loading={isInitialLoading}>
      <EditMemberForm
        loading={loading}
        defaultValues={member}
        onSubmit={onSubmit}
      />
    </SkeletonProvider>
  )
}
