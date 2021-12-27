import React, { useEffect } from 'react'

import { Container, Text } from '@chakra-ui/react'

import { PermissionContext } from 'tribe-api'
import { Trans } from 'tribe-translation'

import { useResponsive } from 'hooks/useResponsive'

import NetworkAppsGrid from './components/NetworkAppsGrid'
import { FILTERED_APPS_SET } from './components/TabContent/SettingsContent/DefaultApps'
import useApps from './hooks/useApps'

const NetworkAppsContainer = () => {
  const { apps, isInitialLoading: loading } = useApps()
  const networkApps = apps?.filter(app =>
    app.enabledContexts.includes(PermissionContext.NETWORK),
  )
  const filteredApps = networkApps.filter(
    app =>
      app.enabledContexts.includes(PermissionContext.NETWORK) &&
      !FILTERED_APPS_SET.has(app.slug),
  )
  const { isSidebarOpen, mobileHeader } = useResponsive()
  useEffect(() => {
    if (isSidebarOpen) return
    mobileHeader.setRight(null)
  }, [isSidebarOpen, mobileHeader])
  return (
    <Container maxW="container.2xl" py={[6, 8]} px={6}>
      <Text
        textStyle="bold/2xlarge"
        data-testid="page-title"
        mb={8}
        display={['none', 'block']}
      >
        <Trans i18nKey="apps:all" defaults="All apps" />
      </Text>
      {filteredApps && (
        <NetworkAppsGrid apps={filteredApps} loading={loading} />
      )}
    </Container>
  )
}

export default NetworkAppsContainer
