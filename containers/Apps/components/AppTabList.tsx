import React from 'react'

import { Tab, TabList, Tabs } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { AppTab } from 'containers/Apps/hooks/useAppTabs'

type AppTabListProps = {
  activeTabIndex: number
  handleTabsChange: (index: number) => void
  availableTabs: AppTab[]
}

export const AppTabList: React.FC<AppTabListProps> = ({
  activeTabIndex,
  handleTabsChange,
  availableTabs = [],
}) => {
  return (
    <Tabs index={activeTabIndex} onChange={handleTabsChange}>
      <TabList data-testid="app-tabs" borderBottom="0">
        {availableTabs.includes('about') && (
          <Tab data-testid="app-about-tab">
            <Trans i18nKey="apps:app.tabs.about.header" defaults="About" />
          </Tab>
        )}
        {availableTabs.includes('settings') && (
          <Tab data-testid="app-settings-tab">
            <Trans i18nKey="apps:app.tabs.settings" defaults="Settings" />
          </Tab>
        )}
      </TabList>
    </Tabs>
  )
}
