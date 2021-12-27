import React, { memo } from 'react'

import { useRouter } from 'next/router'
import isEqual from 'react-fast-compare'

import ErrorContainer from 'containers/Error'
import NotFoundError from 'containers/Error/NotFoundError'

import { useAppBySlug } from '../hooks/useAppBySlug'
import useGetNetworkAppInstallations from '../hooks/useGetNetworkAppInstallations'
import AppContainer from './AppContainer'
import useGetAppNetworkSettings from './TabContent/SettingsContent/hooks/useGetAppNetworkSettings'

const NetworkAppContainer = () => {
  const router = useRouter()
  const { 'app-slug': appSlug } = router?.query
  const { app, isInitialLoading: appLoading, error } = useAppBySlug({
    slug: String(appSlug),
  })
  const {
    appInstallations,
    isInitialLoading: aiLoading,
  } = useGetNetworkAppInstallations()
  const appInstallation = appInstallations.find(
    ai => ai?.app?.slug === String(appSlug),
  )
  const { settings, loading: settingsLoading } = useGetAppNetworkSettings({
    appId: appInstallation?.app?.id || app?.id || '',
  })

  const loading = appLoading || aiLoading
  if (!loading && error) {
    return app ? <ErrorContainer error={error} /> : <NotFoundError />
  }

  return (
    <AppContainer
      app={app}
      appInstallation={appInstallation}
      loading={!app && loading && !settingsLoading}
      settings={settings}
      settingsLoading={settingsLoading}
    />
  )
}
export default memo(NetworkAppContainer, isEqual)
