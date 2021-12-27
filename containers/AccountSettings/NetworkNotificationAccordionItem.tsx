import React from 'react'

import { HStack, Spacer, VStack } from '@chakra-ui/react'
import MailLineIcon from 'remixicon-react/MailLineIcon'
import WindowLineIcon from 'remixicon-react/WindowLineIcon'

import { NotificationChannel } from 'tribe-api'
import { AccordionItem, Icon, Switch, Text } from 'tribe-components'

import { enumI18nNotificationChannel } from 'utils/enums'

type ChannelSettings = {
  active: boolean
  disabled?: boolean
  isSwitchDisabled?: boolean
  name: NotificationChannel
  onChange: (boolean) => void
}

export const NetworkNotificationAccordionItem = ({
  title,
  subtitle,
  channels,
}: {
  title: string
  subtitle: string
  channels: ChannelSettings[]
}) => {
  const summary = channels
    .filter(it => it.active)
    .map(it => enumI18nNotificationChannel(it.name))
    .join(', ')
  return (
    <AccordionItem title={title} subtitle={summary} panelProps={{ pt: 0 }}>
      <VStack align="stretch" spacing="5">
        <Text color="label.secondary">{subtitle}</Text>
        {channels?.map(channel => {
          const {
            name,
            active = false,
            disabled = false,
            isSwitchDisabled = false,
            onChange,
          } = channel

          const icon = (
            <Icon
              as={
                name === NotificationChannel.IN_APP
                  ? WindowLineIcon
                  : MailLineIcon
              }
            />
          )

          return (
            <HStack key={name} justify="space-between">
              {icon}
              <Text color="label.primary" textStyle="medium/medium">
                {enumI18nNotificationChannel(name)}
              </Text>
              <Spacer />
              {disabled ? (
                <Text px="2">{active ? 'On' : 'Off'}</Text>
              ) : (
                <Switch
                  isDisabled={isSwitchDisabled}
                  isChecked={active}
                  onChange={onChange}
                />
              )}
            </HStack>
          )
        })}
      </VStack>
    </AccordionItem>
  )
}
