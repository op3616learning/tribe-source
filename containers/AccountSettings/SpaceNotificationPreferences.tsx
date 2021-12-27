import React from 'react'

import { Box, HStack } from '@chakra-ui/react'

import {
  MemberSpaceNotificationSettings,
  NotificationChannel,
  Space,
} from 'tribe-api'
import {
  Button,
  ImagePickerDropdown,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UserBar,
  Text,
} from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import { NotificationPreferences } from 'containers/Notifications/components/NotificationPreferences'
import { NotificationPreferencesChannelOverride } from 'containers/Notifications/components/NotificationPreferencesChannelOverride'
import { useUpdateSpaceNotificationSettings } from 'containers/Notifications/hooks/useUpdateSpaceNotificationSettings'

import useToggle from 'hooks/useToggle'

import { enumI18nNotificationChannel } from 'utils/enums'

export const SpaceNotificationPreferences = ({
  space,
  notificationSettings,
  emailNotificationsEnabled,
}: {
  space: Space
  notificationSettings: MemberSpaceNotificationSettings[]
  emailNotificationsEnabled?: boolean
}) => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const { update: updateSpaceSettings } = useUpdateSpaceNotificationSettings({
    space,
  })
  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  const inAppSettings = notificationSettings?.find(
    it => it.channel === NotificationChannel.IN_APP,
  )
  const emailSettings = notificationSettings?.find(
    it => it.channel === NotificationChannel.EMAIL,
  )

  const summary =
    notificationSettings
      ?.filter(it => it.enabled)
      .map(it => enumI18nNotificationChannel(it.channel))
      .join(', ') ?? ''

  return (
    <>
      <HStack justify="space-between">
        {space?.image && isImagePickerDropdownEnabled ? (
          <HStack alignItems="center" spacing={3}>
            <ImagePickerDropdown
              emojiSize="md"
              isDisabled
              imageBoxSize={10}
              image={space?.image}
            />
            <Text color="label.primary" textStyle="bold/medium">
              {space?.name}
            </Text>
          </HStack>
        ) : (
          <UserBar
            picture={space.image}
            title={space.name}
            subtitle={summary}
          />
        )}
        <Button buttonType="secondary" onClick={toggleModal}>
          <Trans
            i18nKey="settings:account.notifications.spaces.action.manage"
            defaults="Manage"
          />
        </Button>
      </HStack>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        isCentered
        size="xl"
        variant="withBorder"
      >
        <ModalOverlay>
          <ModalContent fullSizeOniPhone>
            <ModalHeader>
              <Trans
                i18nKey="settings:account.notifications.spaces.modal.title"
                defaults="{{space}} notifications"
                values={{ space: space.name }}
              />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {inAppSettings?.preference && (
                <NotificationPreferences
                  value={inAppSettings?.preference}
                  onChange={preference =>
                    updateSpaceSettings(NotificationChannel.IN_APP, {
                      preference,
                    })
                  }
                />
              )}
            </ModalBody>

            {emailNotificationsEnabled && inAppSettings?.preference && (
              <ModalFooter justifyContent="flex-start">
                <Box width="100%">
                  <NotificationPreferencesChannelOverride
                    notificationSettings={emailSettings}
                    defaultValue={inAppSettings.preference}
                    onChange={(sameAsDefault, preference) =>
                      updateSpaceSettings(NotificationChannel.EMAIL, {
                        sameAsDefault,
                        preference,
                      })
                    }
                  />
                </Box>
              </ModalFooter>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}
