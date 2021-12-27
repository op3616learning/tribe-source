import React from 'react'

import { SidebarKind } from '@types'

import ModerationSettingsContainer from 'containers/Moderation/Settings'

const ModerationSettingsPage = () => <ModerationSettingsContainer />

ModerationSettingsPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'settings', 'admin', 'moderation'],
  sidebarKind: SidebarKind.admin,
  seo: {
    title: `Moderation Settings`,
    appendNetworkName: true,
  },
})

ModerationSettingsPage.options = {
  permissionScopes: ['updateNetwork'],
}

export default ModerationSettingsPage
