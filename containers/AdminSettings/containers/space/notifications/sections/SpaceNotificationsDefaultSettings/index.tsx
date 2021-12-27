import React, { FC, memo, useCallback, useEffect, useMemo } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'

import {
  Space,
  SpaceDefaultNotificationSettingsQuery,
  SpaceDefaultNotificationSettingsQueryVariables,
  SpaceNotificationPreference,
  SPACE_DEFAULT_NOTIFICATION_SETTINGS,
} from 'tribe-api'
import { NotificationChannel } from 'tribe-api/interfaces'
import {
  Accordion,
  Button,
  Divider,
  Skeleton,
  SkeletonProvider,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { SpaceNotificationDefaultSettingsCheckboxFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsCheckboxFormControl'
import { SpaceNotificationDefaultSettingsRadioGroupFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsRadioGroupFormControl'
import { SpaceNotificationDefaultSettingsSelectFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsSelectFormControl'

import { useSpaceDefaultNotificationSettings } from 'hooks/notification/useSpaceDefaultNotificationSettings'
import { useUpdateSpaceDefaultNotificationSettings } from 'hooks/notification/useUpdateSpaceDefaultNotificationSettings'
import { useSpace } from 'hooks/space/useSpace'

import { logger } from 'lib/logger'

import {
  SpaceNotificationPreferenceOption,
  SpaceNotificationsDefaultSettingsFormValues,
} from './@types'

export const SpaceNotificationsDefaultSettings: FC<{
  slug: Space['slug']
}> = memo(({ slug }) => {
  const { t } = useTranslation()

  const { space, loading: isLoadingSpace } = useSpace({
    variables: {
      slug,
    },
  })

  const {
    loading: isUpdatingMemberSpaceNotificationSettings,
    updateSpaceDefaultNotificationSettings,
  } = useUpdateSpaceDefaultNotificationSettings({
    update: (cache, { data }) => {
      try {
        // Read SpaceDefaultNotificationSettingsQuery from cache
        const spaceDefaultNotificationSettingsQuery = cache.readQuery<
          SpaceDefaultNotificationSettingsQuery,
          SpaceDefaultNotificationSettingsQueryVariables
        >({
          query: SPACE_DEFAULT_NOTIFICATION_SETTINGS,
          variables: {
            spaceId: space?.id,
          },
        })

        const { spaceDefaultNotificationSettings } =
          spaceDefaultNotificationSettingsQuery || {}

        if (spaceDefaultNotificationSettings) {
          // Update SpaceDefaultNotificationSettingsQuery
          const updatedSpaceDefaultNotificationSettings = spaceDefaultNotificationSettings.map(
            spaceDefaultNotificationSetting => {
              if (
                spaceDefaultNotificationSetting?.channel ===
                data?.updateSpaceDefaultNotificationSettings?.channel
              ) {
                return data?.updateSpaceDefaultNotificationSettings
              }
              return spaceDefaultNotificationSetting
            },
          )

          // Write updated query to cache
          cache.writeQuery<SpaceDefaultNotificationSettingsQuery>({
            query: SPACE_DEFAULT_NOTIFICATION_SETTINGS,
            variables: {
              spaceId: space?.id,
            },
            data: {
              spaceDefaultNotificationSettings: updatedSpaceDefaultNotificationSettings,
            },
          })
        }
      } catch (error) {
        logger.warn(
          'SpaceDefaultNotificationSettingsQuery cache update warn => ',
          error,
        )
      }
    },
  })

  const {
    spaceDefaultNotificationSettings,
    loading: isLoadingDefaultSpaceNotificationSettings,
    refetch,
  } = useSpaceDefaultNotificationSettings({
    variables: {
      spaceId: space?.id,
    },
    skip: !space?.id,
  })

  useEffect(() => {
    if (space?.id) {
      refetch({
        spaceId: space?.id,
      })
    }
  }, [refetch, space?.id])

  const toast = useToast()

  const SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS: SpaceNotificationPreferenceOption[] = useMemo(
    () => [
      {
        description: t(
          'admin:notifications.allPostsAndReplies.description',
          'Notify about new posts and replies',
        ),
        label: t(
          'admin:notifications.allPostsAndReplies.label',
          'All posts and replies',
        ),
        value: SpaceNotificationPreference.ALL,
      },
      {
        description: t(
          'admin:notifications.newPosts.description',
          'Notify about new posts only',
        ),
        label: t('admin:notifications.newPosts.label', 'New posts'),
        value: SpaceNotificationPreference.NEW_POST,
      },
      // TODO: Add this option when follow/unfollow logic for individual posts will be implemented
      // {
      //   description: t(
      //     'admin:notifications.onlyRelatedNotifications.description',
      //     'Replies to followed posts.',
      //   ),
      //   label: t(
      //     'admin:notifications.onlyRelatedNotifications.label',
      //     'Only related notifications',
      //   ),
      //   value: SpaceNotificationPreference.RELATED,
      // },
      {
        description: t(
          'admin:notifications.postsOfInterest.description',
          'Notify members about new comments and reactions to their posts, and the posts they previously commented on',
        ),
        label: t(
          'admin:notifications.postsOfInterest.label',
          'Posts of Interest',
        ),
        value: SpaceNotificationPreference.NONE,
      },
    ],
    [t],
  )

  const currentSpaceAppNotificationSettings = spaceDefaultNotificationSettings?.find(
    ({ channel }) => channel === NotificationChannel.IN_APP,
  )

  const currentSpaceEmailNotificationSettings = spaceDefaultNotificationSettings?.find(
    ({ channel }) => channel === NotificationChannel.EMAIL,
  )

  const onSubmit = useCallback(
    async (input: SpaceNotificationsDefaultSettingsFormValues) => {
      const spaceId = space?.id

      if (spaceId) {
        const promises = await Promise.all([
          updateSpaceDefaultNotificationSettings({
            spaceId,
            channel: NotificationChannel.IN_APP,
            input: {
              preference: input?.preference,
            },
          }),
          updateSpaceDefaultNotificationSettings({
            spaceId,
            channel: NotificationChannel.EMAIL,
            input: {
              preference: input?.emailPreference,
              sameAsDefault: input?.sameAsDefault,
            },
          }),
        ])

        if (isEmpty(promises[0]?.errors) && isEmpty(promises[1]?.errors)) {
          toast({
            description: t('admin:notifications.defaultNotificationsUpdated', {
              defaultValue: 'Default notifications updated.',
            }),
            title: t('admin:notifications.changesSaved', {
              defaultValue: 'Changes saved',
            }),
            status: 'success',
          })
        } else {
          toast({
            description: t('admin:notifications.somethingWentWrong', {
              defaultValue:
                'Something went wrong during default notifications update. Please try again.',
            }),
            title: t('common:error', {
              defaultValue: 'Error',
            }),
            status: 'error',
          })

          logger.warn(
            `Notifications default settings update for ${slug} error => `,
          )
        }
      }
    },
    [slug, space?.id, t, toast, updateSpaceDefaultNotificationSettings],
  )

  const { control, handleSubmit, watch, reset } = useForm<
    SpaceNotificationsDefaultSettingsFormValues
  >({
    defaultValues: {
      emailPreference: currentSpaceEmailNotificationSettings?.preference as SpaceNotificationPreference,
      preference: currentSpaceAppNotificationSettings?.preference as SpaceNotificationPreference,
      sameAsDefault: currentSpaceEmailNotificationSettings?.sameAsDefault,
    },
  })

  const emailPreference = watch('emailPreference')
  const preference = watch('preference')
  const sameAsDefault = watch('sameAsDefault')
  const isTouched = useMemo(
    () =>
      emailPreference !== currentSpaceEmailNotificationSettings?.preference ||
      preference !== currentSpaceAppNotificationSettings?.preference ||
      sameAsDefault !== currentSpaceEmailNotificationSettings?.sameAsDefault,
    [
      currentSpaceAppNotificationSettings?.preference,
      currentSpaceEmailNotificationSettings?.preference,
      currentSpaceEmailNotificationSettings?.sameAsDefault,
      emailPreference,
      preference,
      sameAsDefault,
    ],
  )

  useEffect(() => {
    if (
      !currentSpaceEmailNotificationSettings?.preference ||
      !currentSpaceAppNotificationSettings?.preference ||
      typeof currentSpaceEmailNotificationSettings?.sameAsDefault ===
        'undefined'
    ) {
      return
    }

    reset({
      emailPreference: currentSpaceEmailNotificationSettings?.preference as SpaceNotificationPreference,
      preference: currentSpaceAppNotificationSettings?.preference as SpaceNotificationPreference,
      sameAsDefault: currentSpaceEmailNotificationSettings?.sameAsDefault,
    })
  }, [
    currentSpaceAppNotificationSettings?.preference,
    currentSpaceEmailNotificationSettings?.preference,
    currentSpaceEmailNotificationSettings?.sameAsDefault,
    reset,
  ])

  const isDisabled =
    isUpdatingMemberSpaceNotificationSettings ||
    isLoadingDefaultSpaceNotificationSettings

  return (
    <SkeletonProvider
      loading={isLoadingDefaultSpaceNotificationSettings || isLoadingSpace}
    >
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Skeleton>
          <Accordion
            title={t(
              'admin:notifications.defaultNotificationSettings',
              'Default notification settings',
            )}
            subtitle={t(
              'admin:notifications.configureWhatTheDefaultNotificationSettings',
              'Configure what the default notification setting should be when new users join this space.',
            )}
          >
            <SpaceNotificationDefaultSettingsRadioGroupFormControl
              control={control}
              isDisabled={isDisabled}
              options={SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS}
            />

            <Divider my={6} />

            <SpaceNotificationDefaultSettingsCheckboxFormControl
              control={control}
              isDisabled={isDisabled}
              sameAsDefault={sameAsDefault}
            />

            <SpaceNotificationDefaultSettingsSelectFormControl
              control={control}
              isDisabled={isDisabled}
              options={SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS}
              sameAsDefault={sameAsDefault}
            />

            <HStack justifyContent="flex-end">
              <Button
                isLoading={isDisabled}
                buttonType="primary"
                type="submit"
                isDisabled={isDisabled || !isTouched}
                mt={6}
                data-testid="update-button"
              >
                <Trans i18nKey="admin:update" defaults="Update" />
              </Button>
            </HStack>
          </Accordion>
        </Skeleton>
      </Box>
    </SkeletonProvider>
  )
})
