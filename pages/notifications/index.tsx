import { SidebarKind } from '@types'

import NotificationsContainer from 'containers/Notifications'

const NotificataionPage = () => <NotificationsContainer />

NotificataionPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'userimport', 'settings', 'notification'],
  sidebarKind: SidebarKind.spaces,
  seo: {
    title: `Notifications`,
    appendNetworkName: true,
  },
})

NotificataionPage.options = {
  permissionScopes: ['notifications'],
}

export default NotificataionPage
