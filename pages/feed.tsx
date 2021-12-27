import React from 'react'

import { SidebarKind } from '@types'

import LatestFeed from 'containers/LatestFeed'

const LatestFeedPage = () => <LatestFeed />

LatestFeedPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'userimport', 'post'],
  sidebarKind: SidebarKind.spaces,
  seo: {
    title: 'Feed',
    appendNetworkName: true,
  },
})

LatestFeedPage.options = {
  permissionScopes: ['getNetwork', 'getFeed'],
  ssr: {
    Component: LatestFeedPage,
  },
}

export default LatestFeedPage
