import React from 'react'

import { SidebarKind } from '@types'

import { BillingContainer } from 'containers/AdminSettings/containers/network/billing/BillingContainer'

const BillingPage = () => <BillingContainer />

BillingPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'settings', 'admin'],
  sidebarKind: SidebarKind.admin,
  seo: {
    title: `Administration`,
    appendNetworkName: true,
  },
})

BillingPage.options = {
  permissionScopes: ['updateNetwork'],
}

export default BillingPage
