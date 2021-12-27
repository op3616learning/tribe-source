import React from 'react'

import { SidebarKind } from '@types'

import Explore from 'containers/Explore/Explore'

const ExplorePage = () => <Explore />

ExplorePage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'userimport', 'post', 'explore'],
  sidebarKind: SidebarKind.spaces,
  seo: {
    title: 'Explore',
    appendNetworkName: true,
  },
})

ExplorePage.options = {
  permissionScopes: ['getNetwork', 'getFeed'],
  ssr: {
    Component: ExplorePage,
  },
}
export default ExplorePage
