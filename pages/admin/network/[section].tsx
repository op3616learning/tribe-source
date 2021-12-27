import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'
import Router from 'next/router'

import { RoleType } from 'tribe-api'

import AdminAreaContainer from 'containers/AdminSettings'

import getTokensQuery from 'lib/auth/getTokensQuery'

const AdminPage = () => <AdminAreaContainer />

AdminPage.getInitialProps = async (
  context: NextPageContextApp,
  { isServer },
) => {
  const { authToken, query, res } = context
  let _authToken = authToken

  if (!_authToken?.role && isServer) {
    const res = await getTokensQuery(context)
    _authToken = res?.authToken
  }

  if (String(query?.section) === 'settings') {
    if (_authToken?.role?.type === RoleType.MODERATOR) {
      const destination = '/admin/network/pending-posts'
      if (isServer) {
        res?.writeHead(302, {
          Location: destination,
        })
        res?.end()
      } else {
        Router.replace(destination)
      }

      return { props: {} }
    }
  }

  return {
    namespacesRequired: ['common', 'settings', 'admin'],
    sidebarKind: SidebarKind.admin,
    seo: {
      title: `Administration`,
      appendNetworkName: true,
    },
  }
}

AdminPage.options = {
  permissionScopes: ['updateNetwork'],
}

export default AdminPage
