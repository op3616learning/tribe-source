import React, { FC, memo, useEffect } from 'react'

import { Box, Container } from '@chakra-ui/react'
import isEqual from 'react-fast-compare'

import { App, AppInstallation, AppInstallationStatus } from 'tribe-api'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BannerProvider,
  Skeleton,
  TabPanel,
  TabPanels,
  Tabs,
  useResponsive,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import MobileFullWidth from 'components/common/MobileFullWidth'
import { UpgradeTouchpointLink } from 'components/common/UpgradeTouchpointLink'
import { MOBILE_HEADER_HEIGHT } from 'components/Layout/MobileHeader'

import {
  AppLayout,
  AppLayoutHighlights,
  AppLayoutMain,
} from 'containers/Apps/components/AppLayout'
import NotFoundError from 'containers/Error/NotFoundError'
import { useNavbarHeight } from 'containers/Network/components/Navbar'

import tracker from 'lib/snowplow'

import { useAppTabs } from '../hooks/useAppTabs'
import AppHeader from './AppHeader'
import { AppTabList } from './AppTabList'
import AppWidget from './AppWidget'
import AboutContent from './TabContent/AboutContent'
import SettingsContent from './TabContent/SettingsContent'

type AppContainerProps = {
  app: App
  spaceId?: string
  loading?: boolean
  appInstallation?: AppInstallation
  settings?: string | null
  settingsLoading?: boolean
}

const AppContainer: FC<AppContainerProps> = ({
  app,
  spaceId,
  loading,
  appInstallation,
  settings,
  settingsLoading,
}) => {
  const navbarHeight = useNavbarHeight()
  const { isMobile } = useResponsive()

  const { activeTabIndex, availableTabs, handleTabsChange } = useAppTabs({
    app,
    appInstallation,
  })

  useEffect(() => {
    tracker.setTarget({ appId: app?.id })
    return () => tracker.setTarget({ appId: undefined })
  }, [])

  if (!loading && !app) {
    return <NotFoundError />
  }

  return (
    <BannerProvider>
      <Box bg="bg.base" borderBottom="1px" borderColor="border.base">
        <Container maxW="container.xl">
          <AppHeader
            app={app}
            loading={loading || settingsLoading}
            appInstallation={appInstallation}
            spaceId={spaceId}
            settings={settings}
          />
        </Container>
      </Box>
      <Box
        bg="bg.base"
        borderBottom="1px"
        borderColor="border.base"
        pos="sticky"
        zIndex="sticky"
        top={isMobile ? MOBILE_HEADER_HEIGHT : navbarHeight}
      >
        <Container maxW="container.xl">
          <Skeleton isLoaded={!loading}>
            <AppTabList
              activeTabIndex={activeTabIndex}
              handleTabsChange={handleTabsChange}
              availableTabs={availableTabs}
            />
          </Skeleton>
        </Container>
      </Box>

      <Container maxW="container.xl" py={5}>
        <MobileFullWidth>
          {appInstallation?.status === AppInstallationStatus.DISABLED && (
            <Alert status="error" mb={8}>
              <AlertIcon />
              <AlertDescription>
                <Trans
                  i18nKey="apps:app.installation.disabled"
                  defaults="This app is currently disabled."
                />{' '}
                <UpgradeTouchpointLink
                  requiredPlan={app?.requiredPlan}
                  color="danger.base"
                  data-tracker-noun="Disabled App Alert Upgrade link"
                >
                  <Trans
                    i18nKey="apps:app.installation.disabledCta"
                    defaults="Click here to upgrade your plan and re-enable it."
                  />
                </UpgradeTouchpointLink>
              </AlertDescription>
            </Alert>
          )}

          <Tabs index={activeTabIndex}>
            <TabPanels>
              {availableTabs.includes('about') && (
                <TabPanel data-testid="app-about-tab-content">
                  <AppLayout>
                    <AppLayoutMain>
                      <Skeleton isLoaded={!loading}>
                        <AboutContent app={app} />
                      </Skeleton>
                    </AppLayoutMain>
                    <AppLayoutHighlights>
                      <Skeleton isLoaded={!loading}>
                        <AppWidget
                          app={app}
                          appInstallation={appInstallation}
                          openHighlight
                        />
                      </Skeleton>
                    </AppLayoutHighlights>
                  </AppLayout>
                </TabPanel>
              )}
              {availableTabs.includes('settings') && (
                <TabPanel data-testid="app-settings-tab-content">
                  <AppLayout>
                    <AppLayoutMain>
                      <Skeleton isLoaded={!loading} w="full">
                        <SettingsContent
                          app={app}
                          appInstallation={appInstallation}
                          spaceId={spaceId}
                          settings={settings}
                          loading={settingsLoading}
                        />
                      </Skeleton>
                    </AppLayoutMain>
                    <AppLayoutHighlights>
                      <Skeleton isLoaded={!loading}>
                        <AppWidget
                          app={app}
                          appInstallation={appInstallation}
                          openHighlight={false}
                        />
                      </Skeleton>
                    </AppLayoutHighlights>
                  </AppLayout>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </MobileFullWidth>
      </Container>
    </BannerProvider>
  )
}

export default memo(AppContainer, isEqual)
