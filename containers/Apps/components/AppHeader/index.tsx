import React, { memo, useEffect, useMemo } from 'react'

import { Box } from '@chakra-ui/layout'
import { HStack } from '@chakra-ui/react'
import isEqual from 'react-fast-compare'

import { App, AppInstallation } from 'tribe-api'
import { Skeleton, useResponsive } from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'

import { FILTERED_APPS_SET } from '../TabContent/SettingsContent/DefaultApps'
import AppDescription from './AppDescription'
import AppDropdown from './AppDropdown'
import { BackToApps } from './BackToApps'
import InstalledDropdown from './InstalledDropdown'

export interface AppHeaderProps {
  app: App
  loading?: boolean
  appInstallation?: AppInstallation | null
  spaceId?: string | null
  settings?: string | null
}

const AppHeader: React.FC<AppHeaderProps> = ({
  app,
  loading = true,
  appInstallation,
  spaceId,
  settings,
}) => {
  const { isEnabled: isAppStoreEnabled } = useTribeFeature(
    Features.AppsInitialRelease,
  )
  const { mobileHeader, isSidebarOpen, isMobile } = useResponsive()
  const shouldHideDropdown = FILTERED_APPS_SET.has(app?.slug) || isMobile

  const DropdownElement = useMemo(
    () =>
      appInstallation ? (
        <InstalledDropdown
          appInstallation={appInstallation}
          settings={settings}
        />
      ) : (
        <AppDropdown app={app} spaceId={spaceId} />
      ),
    [app, appInstallation, settings, spaceId],
  )
  useEffect(() => {
    if (isSidebarOpen) return
    mobileHeader.setRight(DropdownElement)
  }, [DropdownElement, isSidebarOpen, mobileHeader])

  return (
    <Box py={7}>
      {isAppStoreEnabled && isMobile && <BackToApps />}
      <Skeleton isLoaded={!loading}>
        <HStack w="full" flexGrow={1} justifyContent="space-between">
          <AppDescription app={app} loading={loading} />
          {!shouldHideDropdown && DropdownElement}
        </HStack>
      </Skeleton>
    </Box>
  )
}

export default memo(AppHeader, isEqual)
