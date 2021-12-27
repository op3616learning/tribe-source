import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'

import { AppQuery, AppQueryVariables, APP } from 'tribe-api'

import NetworkAppContainer from 'containers/Apps/components/NetworkAppContainer'

const AppsAppPage = () => <NetworkAppContainer />

AppsAppPage.getInitialProps = async (ctx: NextPageContextApp) => {
  const { apolloClient, query } = ctx
  const appSlug = String(query['app-slug'])
  const res = await apolloClient?.query<AppQuery, AppQueryVariables>({
    query: APP,
    variables: {
      slug: appSlug,
    },
    fetchPolicy: 'cache-first',
  })
  const data = res?.data

  return {
    namespacesRequired: ['common', 'settings', 'apps'],
    sidebarKind: SidebarKind.networkApps,
    seo: {
      title: data?.app?.name || '',
    },
  }
}

AppsAppPage.options = {
  permissionScopes: ['updateNetwork'],
  ssr: {
    Component: AppsAppPage,
  },
}

export default AppsAppPage
