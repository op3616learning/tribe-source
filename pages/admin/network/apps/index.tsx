import React from 'react'

import { SidebarKind } from '@types'

import NetworkAppsContainer from 'containers/Apps/NetworkAppsContainer'

const AppsPage = () => <NetworkAppsContainer />

AppsPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'settings', 'apps'],
  sidebarKind: SidebarKind.networkApps,
  seo: {
    title: `Tribe App Store`,
    appendNetworkName: true,
  },
})

AppsPage.options = {
  permissionScopes: ['updateNetwork'],
}

export default AppsPage
