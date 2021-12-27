import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  UpdateModerationSettingsMutation,
  UpdateModerationSettingsMutationVariables,
  UPDATE_MODERATION_SETTING,
} from 'tribe-api/graphql'
import { UpdateModerationSettingsInput } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useGenericError from 'hooks/useGenericError'

const useUpdateModerationSettings = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const showGenericError = useGenericError()
  const [update, { loading }] = useMutation<
    UpdateModerationSettingsMutation,
    UpdateModerationSettingsMutationVariables
  >(UPDATE_MODERATION_SETTING)

  const updateSettings = useCallback(
    async (input: UpdateModerationSettingsInput) => {
      try {
        await update({
          variables: { input },
        })

        toast({
          title: t(
            'admin:moderation.settings.feedback.success',
            'Updated Moderation Settings.',
          ),
          status: 'success',
        })
      } catch (err) {
        showGenericError()
      }
    },

    // `t` function is different each time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast, update],
  )

  return {
    loading,
    updateSettings,
  }
}

export default useUpdateModerationSettings
