import React, { useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CheckFillIcon from 'remixicon-react/CheckboxCircleFillIcon'
import DeleteBinFillIcon from 'remixicon-react/DeleteBinFillIcon'

import { AppInstallation, AppInstallationStatus } from 'tribe-api'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Tag,
  TagLeftIcon,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useUninstallApp from 'containers/Apps/hooks/useUninstallApp'

import { useSpace } from 'hooks/space/useSpace'

import UninstallModal from './Modals/UninstallModal'
import { isAppReady } from './utils'

type InstalledDropdownProps = {
  appInstallation: AppInstallation
  settings?: string | null
}
const InstalledDropdown: React.FC<InstalledDropdownProps> = ({
  appInstallation,
  settings,
}) => {
  const { query } = useRouter()
  const spaceSlug = query['space-slug']
  const { space } = useSpace({
    variables: {
      slug: spaceSlug ? String(spaceSlug) : undefined,
    },
  })
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false)
  const { uninstallApp } = useUninstallApp({
    appInstallation,
    spaceId: space?.id,
  })
  const shouldShowWarning =
    !isAppReady(appInstallation?.app, settings) ||
    appInstallation.status === AppInstallationStatus.DISABLED

  return (
    <>
      <HStack
        alignSelf={{
          base: 'baseline',
          lg: 'inherit',
        }}
      >
        <Box>
          <Tag
            size="lg"
            data-testid={
              shouldShowWarning
                ? 'app-header-installed-warning-tag'
                : 'app-header-installed-tag'
            }
            variant={shouldShowWarning ? 'warningOutline' : 'successOutline'}
          >
            <TagLeftIcon as={CheckFillIcon} />
            <Trans i18nKey="apps:app.header.installed" defaults="Installed" />
          </Tag>
        </Box>
        <Box zIndex="popover">
          <Dropdown>
            <DropdownIconButton
              variant="solid"
              size="sm"
              borderRadius="md"
              bgColor="bg.secondary"
              data-testid="app-options-dd"
            />
            <DropdownList>
              <DropdownItem
                onClick={() => setIsUninstallModalOpen(true)}
                icon={DeleteBinFillIcon}
                data-testid="app-settings-uninstall"
              >
                <Text textStyle="regular/small" color="label.primary">
                  <Trans
                    i18nKey="apps:app.dropdown.uninstall"
                    defaults="Uninstall"
                  />
                </Text>
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </Box>
      </HStack>
      <UninstallModal
        appName={appInstallation?.app?.name || ''}
        onClose={() => setIsUninstallModalOpen(false)}
        isVisible={isUninstallModalOpen}
        onUninstall={uninstallApp}
      />
    </>
  )
}

export default InstalledDropdown
