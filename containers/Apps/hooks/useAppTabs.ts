import { useCallback, useEffect, useMemo, useState } from 'react'

import { App, AppInstallation } from 'tribe-api'

import {
  APPS_WITH_SETTINGS,
  FILTERED_APPS_SET,
} from 'containers/Apps/components/TabContent/SettingsContent/DefaultApps'

export type AppTab = 'about' | 'settings'

export type UseAppTabsResult = {
  availableTabs: AppTab[]
  activeTabIndex: number
  handleTabsChange: (index: number) => void
}

export const useAppTabs = ({
  app,
  appInstallation,
}: {
  app: App
  appInstallation?: AppInstallation
}): UseAppTabsResult => {
  const availableTabs = useMemo(() => {
    const isPostTypeApp = FILTERED_APPS_SET.has(app?.slug)

    const result: AppTab[] = ['about']
    if (
      APPS_WITH_SETTINGS.has(app?.slug) &&
      (appInstallation || isPostTypeApp)
    ) {
      result.push('settings')
    }
    return result
  }, [app, appInstallation])

  const findIndex = useCallback(
    (section: string) => {
      return availableTabs.includes(section as AppTab)
        ? availableTabs.indexOf(section as AppTab)
        : 0
    },
    [availableTabs],
  )

  const [activeTabIndex, setActiveTabIndex] = useState(0)

  useEffect(() => {
    const isPostTypeApp = FILTERED_APPS_SET.has(app?.slug)

    setActiveTabIndex(
      findIndex(appInstallation || isPostTypeApp ? 'settings' : 'about'),
    )
  }, [app, appInstallation, findIndex])

  return {
    activeTabIndex,
    handleTabsChange: setActiveTabIndex,
    availableTabs,
  }
}
