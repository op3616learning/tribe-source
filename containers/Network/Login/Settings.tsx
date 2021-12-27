import React, { useCallback, useEffect } from 'react'

import { Box } from '@chakra-ui/react'

import { SsoType } from 'tribe-api/interfaces'
import { SsoStatus } from 'tribe-api/interfaces/interface.generated'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Accordion,
  Button,
  Card,
  Skeleton,
  SkeletonProvider,
  Text,
} from 'tribe-components'
import { Trans, useTranslation, withTranslation } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import SettingsGroupHeader from 'containers/AdminSettings/components/SettingsGroupHeader'
import { ErrorForbidden } from 'containers/Error/ForbiddenError'
import useGetNetwork from 'containers/Network/useGetNetwork'

import useConnectedSsos from 'hooks/ssos/useConnectedSsos'
import useConnectSso from 'hooks/ssos/useConnectSso'
import useDisconnectSso from 'hooks/ssos/useDisconnectSso'
import useGetSsos from 'hooks/ssos/useGetSsos'
import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import { ssoIcon } from 'icons/svg/SsoLogos'

import ResetPasswordSettings from './ResetPasswordSettings'

const LoginSettings = () => {
  const { isMobile } = useResponsive()
  const { getSsos, defaultSsos: ssos } = useGetSsos({
    fetchPolicy: 'cache-and-network',
  })
  const { getSsoMembership } = useConnectedSsos()
  const { connectSso, loginURL } = useConnectSso()
  const { disconnectSso } = useDisconnectSso()

  const { t } = useTranslation()
  const { authUser, loading: authUserLoading } = useAuthMember()
  const { network } = useGetNetwork()

  const { authorized: canResetPassword } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'resetPassword',
  )

  useEffect(() => {
    getSsos({ status: SsoStatus.ENABLE })
  }, [getSsos])

  // Redirect to a sign in page of the selected SSO
  useEffect(() => {
    if (loginURL && typeof window !== 'undefined') {
      window.location.href = loginURL
    }
  }, [loginURL])

  const toggleSso = useCallback(
    (type: SsoType) => {
      const isConnected = getSsoMembership(type)

      if (isConnected) {
        disconnectSso(type)
      } else {
        connectSso(type, '/settings/login')
      }
    },
    [connectSso, disconnectSso, getSsoMembership],
  )

  const hideDefaultAuthenticationForm = network?.hideDefaultAuthenticationForm

  if (!canResetPassword) {
    return <ErrorForbidden />
  }

  return (
    <Box mx={[6, 'auto']}>
      <SkeletonProvider loading={authUserLoading}>
        {!isMobile && (
          <LayoutHeader h="auto" pb={0}>
            <Text
              data-testid="login-settings-page-title"
              textStyle="bold/2xlarge"
            >
              <Trans
                i18nKey="network:auth.signinSettings.heading"
                defaults="Login Settings"
              />
            </Text>
          </LayoutHeader>
        )}

        {!hideDefaultAuthenticationForm && (
          <>
            <SettingsGroupHeader>
              <Trans
                i18nKey="network:auth.signinSettings.account.heading"
                defaults="Account"
              />
            </SettingsGroupHeader>

            <Skeleton>
              <Accordion
                title={t(
                  'network:auth.signinSettings.resetPassword.heading',
                  'Password',
                )}
              >
                <ResetPasswordSettings memberId={authUser?.id} />
              </Accordion>
            </Skeleton>
          </>
        )}

        {ssos?.length > 0 && (
          <>
            <SettingsGroupHeader>
              <Trans
                i18nKey="network:auth.signinSettings.account.connected"
                defaults="Connected accounts"
              />
            </SettingsGroupHeader>

            <Card>
              {ssos.map(({ type, name }) => (
                <Button
                  onClick={() => toggleSso(type)}
                  mr={3}
                  leftIcon={ssoIcon[type]}
                  key={type}
                >
                  {getSsoMembership(type) ? (
                    <Trans
                      i18nKey="network:auth.signinSettings.account.disconnect"
                      defaults="Disconnect"
                    />
                  ) : (
                    <Trans
                      i18nKey="network:auth.signinSettings.account.connect_with"
                      defaults="Connect with {{ sso_name }}"
                      values={{ sso_name: name }}
                    />
                  )}
                </Button>
              ))}
            </Card>
          </>
        )}
      </SkeletonProvider>
    </Box>
  )
}

export default withTranslation()(LoginSettings)
