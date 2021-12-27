import React, { useEffect, useCallback, useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'

import { Sso } from 'tribe-api'
import { SsoStatus } from 'tribe-api/interfaces'
import { Card, UserBar, Switch, Tooltip } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useGetSsos from 'hooks/ssos/useGetSsos'
import useUpdateNetwork from 'hooks/useUpdateNetwork'

export const EmailLoginSettings = () => {
  const { network } = useGetNetwork()
  const { updateNetwork } = useUpdateNetwork()
  const isEnabled = !network?.hideDefaultAuthenticationForm || false
  const [isCheckBoxEnabled, setIsCheckBoxEnabled] = useState<boolean>(isEnabled)
  const { t } = useTranslation()
  const { getSsos, customSsos, defaultSsos } = useGetSsos()

  const customSso = customSsos && (customSsos[0] as Sso)

  const handleChange = useCallback(
    e => {
      setIsCheckBoxEnabled(e?.target?.checked)
      updateNetwork({ hideDefaultAuthenticationForm: !e?.target?.checked })
    },
    [updateNetwork],
  )

  // Sso is custom or default
  const isSsoEnabled =
    customSso?.status === SsoStatus.ENABLE ||
    defaultSsos?.some?.(sso => sso.status === SsoStatus.ENABLE)

  useEffect(() => {
    // Without timeout `loading` variable stays `true` always
    // even after the backend`s response.
    setTimeout(() => getSsos())
  }, [getSsos])

  return (
    <Card>
      <Flex justify="space-between">
        <UserBar
          title={t('admin:emailLogin.title', 'Login & register with email')}
          subtitle={t(
            'admin:emailLogin.description',
            'Allow users to register and access the community with an email and password.',
          )}
          withPicture={false}
        />
        <Box>
          <Tooltip
            isDisabled={!isCheckBoxEnabled || isSsoEnabled}
            maxW="300px"
            placement="bottom"
            offset={[0, 20]}
            label={t(
              'admin:emailLogin.tooltipLabel',
              'You can’t disable login with email if you don’t have a social login or single sign-on enabled',
            )}
          >
            <Box>
              <Switch
                onChange={handleChange}
                isDisabled={isCheckBoxEnabled && !isSsoEnabled}
                isChecked={isCheckBoxEnabled}
                data-testid="email-login-checkbox"
              />
            </Box>
          </Tooltip>
        </Box>
      </Flex>
    </Card>
  )
}
