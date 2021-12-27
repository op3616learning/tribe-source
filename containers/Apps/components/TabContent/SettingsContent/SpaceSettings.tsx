import React from 'react'

import { AppInstallationStatus } from 'tribe-api'

import { SettingsContentProps } from './@types'
import { DefaultApps } from './DefaultApps'
import GoogleAnalyticsSettings from './GoogleAnalyticsSettings'
import useGetAppSpaceSettings from './hooks/useGetAppSpaceSettings'
import useUpdateAppSpaceSetting from './hooks/useUpdateAppSpaceSetting'
import QnASettings from './QnASettings'

const SpaceSettings: React.FC<SettingsContentProps & { spaceId: string }> = ({
  app,
  appInstallation,
  spaceId,
}) => {
  const { settings, loading } = useGetAppSpaceSettings({
    spaceId,
    appId: appInstallation?.app?.id || app?.id || '',
  })

  const {
    update,
    loading: updating,
    clearSettingsCache,
  } = useUpdateAppSpaceSetting(
    appInstallation?.app?.id || app?.id || '',
    spaceId,
  )

  const settingsProps = {
    settings,
    loading,
    update,
    clearSettingsCache,
    updating,
    disabled: appInstallation?.status === AppInstallationStatus.DISABLED,
  }

  switch (app?.slug) {
    case DefaultApps.GoogleAnalytics:
      return <GoogleAnalyticsSettings {...settingsProps} />
    case DefaultApps.QA:
      return <QnASettings {...settingsProps} />
    default:
      return null
  }
}

export default SpaceSettings
