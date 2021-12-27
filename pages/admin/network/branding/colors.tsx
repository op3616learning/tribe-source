import React from 'react'

import { SidebarKind } from '@types'

import AdminAreaContainer from 'containers/AdminSettings'

const AdminPage = () => <AdminAreaContainer />

AdminPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'settings', 'admin'],
  sidebarKind: SidebarKind.adminTheme,
  seo: {
    title: `Administration`,
    appendNetworkName: true,
  },
})

AdminPage.options = {
  permissionScopes: ['updateNetwork'],
}

export default AdminPage
