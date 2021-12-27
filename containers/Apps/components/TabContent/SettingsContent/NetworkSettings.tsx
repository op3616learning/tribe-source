import React from 'react'

import { AppInstallationStatus } from 'tribe-api'

import { SettingsContentProps } from './@types'
import AmplitudeSettings from './AmplitudeSettings'
import CustomCodeSettings from './CustomCodeSettings'
import { DefaultApps } from './DefaultApps'
import GoogleAnalyticsSettings from './GoogleAnalyticsSettings'
import useUpdateAppNetworkSettings from './hooks/useUpdateAppNetworkSettings'
import IntercomSettings from './IntercomSettings'
import ZapierSettings from './ZapierSettings'

const NetworkSettings: React.FC<SettingsContentProps> = ({
  app,
  appInstallation,
  settings,
  loading = false,
}) => {
  const {
    update,
    loading: updating,
    clearSettingsCache,
  } = useUpdateAppNetworkSettings(appInstallation?.app?.id || '')

  const settingsProps = {
    settings,
    loading,
    updating,
    update,
    clearSettingsCache,
    disabled: appInstallation?.status === AppInstallationStatus.DISABLED,
  }

  switch (app?.slug) {
    case DefaultApps.Amplitude:
      return <AmplitudeSettings app={app} {...settingsProps} />
    case DefaultApps.Zapier:
      return <ZapierSettings app={app} {...settingsProps} />
    case DefaultApps.GoogleAnalytics:
      return <GoogleAnalyticsSettings {...settingsProps} />
    case DefaultApps.CustomCodeSnippet:
      return <CustomCodeSettings {...settingsProps} />
    case DefaultApps.Intercom:
      return <IntercomSettings app={app} {...settingsProps} />
    default:
      return null
  }
}

export default NetworkSettings
