import { useCallback } from 'react'

import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { SidebarItem, Text } from 'tribe-components'

import { useNeo } from 'hooks/useNeo'

import { Trans } from 'lib/i18n'

export const AdminSidebarBackButton = ({ name, spaceSlug }) => {
  const { push } = useRouter()
  const { isNeo } = useNeo()

  const handleSidebarBackButtonClick = useCallback(
    event => {
      event.preventDefault()
      if (isNeo) {
        const url = spaceSlug ? `/${spaceSlug}` : '/'
        window.location.href = url
      } else {
        const url = spaceSlug ? `/${spaceSlug}/posts` : '/'
        push(url)
      }
    },
    [push, spaceSlug, isNeo],
  )

  return (
    <SidebarItem
      data-testid="sidebar-back-button"
      onClick={handleSidebarBackButtonClick}
      icon={ArrowLeftLineIcon}
      variant="ghost"
    >
      <Text isTruncated textStyle="medium/small" color="label.secondary">
        <Trans
          i18nKey="admin:sidebar.backTitle"
          defaults="Back to {{ name }}"
          values={{ name }}
        />
      </Text>
    </SidebarItem>
  )
}
