import React from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import MailLineIcon from 'remixicon-react/MailLineIcon'

import { NotificationChannel } from 'tribe-api/interfaces'
import {
  AccordionGroup,
  Card,
  Icon,
  Switch,
  Text,
  UserBar,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import { NetworkNotificationAccordionItem } from 'containers/AccountSettings/NetworkNotificationAccordionItem'
import { SpaceNotificationPreferences } from 'containers/AccountSettings/SpaceNotificationPreferences'
import SettingsGroupHeader from 'containers/AdminSettings/components/SettingsGroupHeader'
import { useGetNotificationSettings } from 'containers/Notifications/hooks/useGetNotificationSettings'
import { useUpdateNetworkNotificationSettings } from 'containers/Notifications/hooks/useUpdateNetworkNotificationSettings'

import { useResponsive } from 'hooks/useResponsive'

import { groupBy } from 'utils/arrays.utils'

export const NotificationSettings = () => {
  const { isMobile } = useResponsive()
  const { t } = useTranslation()

  const { networkSettings, spacesSettings } = useGetNotificationSettings()
  const {
    loading: isUpdatingNetworkSettings,
    update: updateNetworkSettings,
  } = useUpdateNetworkNotificationSettings()

  const networkSettingsEmail = networkSettings?.find(
    it => it.channel === NotificationChannel.EMAIL,
  )
  const networkSettingsInApp = networkSettings?.find(
    it => it.channel === NotificationChannel.IN_APP,
  )

  const toggleEmailNotifications = () =>
    updateNetworkSettings(NotificationChannel.EMAIL, {
      enabled: !networkSettingsEmail?.enabled,
    })

  const spaceSettingsMap = groupBy(spacesSettings, it => it?.space?.id || '')

  return (
    <Box>
      {!isMobile && (
        <LayoutHeader h="auto" pb={0}>
          <Text
            data-testid="notification-settings-page-title"
            textStyle="bold/2xlarge"
          >
            <Trans
              i18nKey="settings:account.notifications.title"
              defaults="Notifications"
            />
          </Text>
        </LayoutHeader>
      )}

      <SettingsGroupHeader>
        <Trans
          i18nKey="settings:account.notifications.channels.title"
          defaults="Channels"
        />
      </SettingsGroupHeader>

      <Card>
        <HStack justify="space-between">
          <Icon as={MailLineIcon} boxSize="1em" mr={2} />
          <UserBar
            withPicture={false}
            title={
              <Trans
                i18nKey="settings:account.notifications.channels.email.title"
                defaults="Email notifications"
              />
            }
            subtitle={
              <Trans
                i18nKey="settings:account.notifications.channels.email.subtitle"
                defaults="Get notifications as emails"
              />
            }
          />
          <Switch
            data-testid="network-notifications-email-toggle"
            onChange={toggleEmailNotifications}
            isChecked={Boolean(networkSettingsEmail?.enabled)}
            isDisabled={isUpdatingNetworkSettings && !networkSettings}
          />
        </HStack>
      </Card>

      <SettingsGroupHeader>
        <Trans
          i18nKey="settings:account.notifications.notify.title"
          defaults="Notify me about"
        />
      </SettingsGroupHeader>

      <AccordionGroup>
        {/* <NetworkNotificationAccordionItem
          title={t(
            'settings:account.notifications.notify.followedPosts.title',
            'Followed posts',
          )}
          subtitle={t(
            'settings:account.notifications.notify.followedPosts.subtitle',
            'Notifications related to posts I follow.',
          )}
          channels={[
            {
              name: NotificationChannel.IN_APP,
              active: true,
              onChange: () => null,
            },
            {
              name: NotificationChannel.EMAIL,
              active: true,
              onChange: () => null,
            },
          ]}
        /> */}
        <NetworkNotificationAccordionItem
          title={t(
            'settings:account.notifications.notify.mentions.title',
            'Mentions',
          )}
          subtitle={t(
            'settings:account.notifications.channels.mentions.subtitle',
            'Notifications related to posts I’m @mentioned in.',
          )}
          channels={[
            {
              name: NotificationChannel.IN_APP,
              active: Boolean(networkSettingsInApp?.mention),
              disabled: true,
              onChange: () => null,
            },
            {
              name: NotificationChannel.EMAIL,
              active: Boolean(
                networkSettingsEmail?.enabled && networkSettingsEmail?.mention,
              ),
              disabled: !networkSettingsEmail?.enabled,
              isSwitchDisabled: isUpdatingNetworkSettings,
              onChange: () =>
                updateNetworkSettings(NotificationChannel.EMAIL, {
                  mention: !networkSettingsEmail?.mention,
                  sameAsDefault: false,
                }),
            },
          ]}
        />
        <NetworkNotificationAccordionItem
          title={t(
            'settings:account.notifications.notify.reactions.title',
            'Reactions',
          )}
          subtitle={t(
            'settings:account.notifications.channels.reactions.subtitle',
            '',
          )}
          channels={[
            {
              name: NotificationChannel.IN_APP,
              active: Boolean(networkSettingsInApp?.reaction),
              isSwitchDisabled: isUpdatingNetworkSettings,
              onChange: () =>
                updateNetworkSettings(NotificationChannel.IN_APP, {
                  reaction: !networkSettingsInApp?.reaction,
                }),
            },
            {
              name: NotificationChannel.EMAIL,
              active: Boolean(
                networkSettingsEmail?.enabled && networkSettingsEmail?.reaction,
              ),
              disabled: !networkSettingsEmail?.enabled,
              isSwitchDisabled: isUpdatingNetworkSettings,
              onChange: () =>
                updateNetworkSettings(NotificationChannel.EMAIL, {
                  reaction: !networkSettingsEmail?.reaction,
                  sameAsDefault: false,
                }),
            },
          ]}
        />
        {/*  <NetworkNotificationAccordionItem
          title={t(
            'settings:account.notifications.notify.resolvedQuestions.title',
            'Resolved questions',
          )}
          subtitle={t(
            'settings:account.notifications.channels.resolvedQuestions.subtitle',
            '',
          )}
          channels={[
            {
              name: NotificationChannel.IN_APP,
              active: true,
              onChange: () => null,
            },
            {
              name: NotificationChannel.EMAIL,
              active: true,
              onChange: () => null,
            },
          ]}
        /> */}
      </AccordionGroup>

      <SettingsGroupHeader>
        <Trans
          i18nKey="settings:account.notifications.spaces.title"
          defaults="Spaces"
        />
      </SettingsGroupHeader>

      <Card>
        <VStack align="stretch" spacing="5">
          {Object.entries(spaceSettingsMap).map(([key, value]) => {
            const space = value?.[0]?.space
            if (!space) {
              return null
            }
            return (
              <SpaceNotificationPreferences
                key={key}
                space={space}
                emailNotificationsEnabled={Boolean(
                  networkSettingsEmail?.enabled,
                )}
                notificationSettings={value}
              />
            )
          })}
        </VStack>
      </Card>
    </Box>
  )
}
