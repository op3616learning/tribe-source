import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'

import { AccountSettingsContainer } from 'containers/AccountSettings/AccountSettingsContainer'

import { PermissionError } from 'lib/error'

const AccountSettingsPage = () => <AccountSettingsContainer />

AccountSettingsPage.getInitialProps = async (context: NextPageContextApp) => {
  const { authToken } = context

  const memberData = authToken?.member

  if (!memberData) {
    throw new PermissionError()
  }

  return {
    namespacesRequired: ['common', 'settings', 'network'],
    sidebarKind: SidebarKind.member,
    seo: {
      title: `Login Settings`,
      appendNetworkName: true,
    },
  }
}

AccountSettingsPage.options = {
  permissionScopes: ['doResetPassword'],
}

export default AccountSettingsPage
