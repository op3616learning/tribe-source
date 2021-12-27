import React from 'react'

import { Box, HStack, Tag } from '@chakra-ui/react'
import NextLink from 'next/link'
import LockFillIcon from 'remixicon-react/LockFillIcon'

import { App, PermissionContext } from 'tribe-api'
import { Button, Icon } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useInstallApp from 'containers/Apps/hooks/useInstallApp'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { useUpgradeTouchpoint } from 'hooks/useUpgradeTouchpoint'

type AppDropdownProps = {
  app: App
  spaceId?: string | null
}
const AppDropdown = ({ app, spaceId }: AppDropdownProps) => {
  const { network } = useGetNetwork()
  const { isUpperPlan, upgradeLink, onUpgradeClick } = useUpgradeTouchpoint(
    app?.requiredPlan,
  )

  const { installApp } = useInstallApp({ app })
  const onClick = () => {
    const context = spaceId
      ? PermissionContext.SPACE
      : PermissionContext.NETWORK
    installApp({
      context,
      entityId: spaceId || network.id,
    })
  }

  if (app?.comingSoon) {
    return (
      <Tag variant="subtle" size="lg" bg="info.base" color="info.strong">
        <Trans i18nKey="apps:app.comingSoon" defaults="Coming soon" />
      </Tag>
    )
  }

  return (
    <HStack>
      {isUpperPlan(app?.requiredPlan) ? (
        <NextLink href={upgradeLink} passHref>
          <Button
            onClick={onUpgradeClick}
            data-tracker-noun="App Main Upgrade Button"
            buttonType="primary"
            size="sm"
            leftIcon={<Icon as={LockFillIcon} />}
          >
            <Trans i18nKey="apps:app.header.upgrade" defaults="Upgrade" />
          </Button>
        </NextLink>
      ) : (
        <Button
          data-testid="app-install-button"
          onClick={onClick}
          buttonType="primary"
          size="sm"
        >
          <Box display={{ base: 'none', sm: 'block' }}>
            <Trans
              i18nKey="apps:app.header.install"
              defaults="Install this app"
            />
          </Box>
          <Box display={{ base: 'block', sm: 'none' }}>
            <Trans
              i18nKey="apps:app.header.mobile.install"
              defaults="Install"
            />
          </Box>
        </Button>
      )}
    </HStack>
  )
}

export default AppDropdown
