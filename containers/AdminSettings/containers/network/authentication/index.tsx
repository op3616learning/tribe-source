import React, { useEffect, useCallback } from 'react'

import { Box, VStack, HStack } from '@chakra-ui/react'

import { SsoStatus, SsoType } from 'tribe-api/interfaces'
import {
  Skeleton,
  Accordion,
  Switch,
  Badge,
  Text,
  Divider,
  Heading,
  Tooltip,
  Link,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useGetSsos from 'hooks/ssos/useGetSsos'
import { useUpdateDefaultSsoStatus } from 'hooks/ssos/useUpdateDefaultSso'

import { ssoIcon } from 'icons/svg/SsoLogos'

import { EmailLoginSettings } from './EmailLogin'
import { NetworkAuthenticationSSOSettings } from './SSO'

const NetworkAuthenticationSettings = () => {
  const { getSsos, customSsos, defaultSsos, loading } = useGetSsos()
  const { updateDefaultSsoStatus } = useUpdateDefaultSsoStatus()
  const { network } = useGetNetwork()

  const { isEnabled: isLoginWithEmailEnabled } = useTribeFeature(
    Features.LoginWithEmail,
  )

  const { t } = useTranslation()

  useEffect(() => {
    setTimeout(() => getSsos())
  }, [getSsos])

  const handleStatusChange = useCallback((name: SsoType, status: SsoStatus) => {
    const statusReverse = (() => {
      if (status === SsoStatus.ENABLE) {
        return SsoStatus.DISABLE
      }
      return SsoStatus.ENABLE
    })()
    updateDefaultSsoStatus(name, statusReverse)
  }, [])

  const customSso = customSsos?.[0]

  /*
   Three cases. Either login with email has to be enabled or custom sso or 2 among n social login methods
   needs to enabled so that we can safely turn them off.
   */
  const isNetworkLoginEnabled =
    customSso?.status === SsoStatus.ENABLE ||
    !network?.hideDefaultAuthenticationForm ||
    defaultSsos?.filter?.(sso => sso.status === SsoStatus.ENABLE)?.length > 1

  return (
    <>
      <Box mb={30} pl={[5, 0]}>
        <Text textStyle="bold/2xlarge">
          <Trans
            i18nKey="admin:authentication.title"
            defaults="Authentication"
          />
        </Text>
      </Box>

      {isLoginWithEmailEnabled && (
        <>
          <EmailLoginSettings />
          <Box mb={8} />
        </>
      )}

      <Accordion
        title={
          <Trans
            i18nKey="admin:authentication.socialLogin.title"
            defaults="Social login"
          />
        }
        subtitle={
          <>
            <Trans
              i18nKey="admin:authentication.socialLogin.description"
              defaults="Allow users to register and access the community with social accounts."
            />

            <Link
              color="label.primary"
              ml={1}
              isExternal
              href="https://community.tribe.so/knowledge-base-2-0/post/social-login-rb4VOPw9lceOSIx"
            >
              <Trans
                i18nKey="admin:authentication.learnMoreGuide"
                defaults="Learn more"
              />
            </Link>
          </>
        }
        defaultIndex={0}
      >
        <Skeleton isLoaded={!loading}>
          {defaultSsos.map(({ type, name, status }) => {
            const Header = (
              <VStack key={type} align="strech">
                <HStack justify="space-between" mt={5} mb={3}>
                  <HStack>
                    {ssoIcon[type]}
                    <Text textStyle="regular/medium" pl={1}>
                      <Trans
                        i18nKey="signInWith"
                        defaults="Log in with {{ sso_name }}"
                        values={{ sso_name: name }}
                      />
                    </Text>
                  </HStack>
                  <Tooltip
                    isDisabled={
                      status !== SsoStatus?.ENABLE || isNetworkLoginEnabled
                    }
                    maxW="300px"
                    placement="bottom"
                    offset={[0, 10]}
                    label={t(
                      'admin:authentication.social.tooltipLabel',
                      'You can’t disable social login if you don’t have login with email or single sign-on enabled',
                    )}
                  >
                    <Box>
                      <Switch
                        onChange={() => handleStatusChange(type, status)}
                        data-testid={`${type}-checkbox`}
                        isChecked={status === SsoStatus?.ENABLE}
                        isDisabled={
                          status === SsoStatus?.ENABLE && !isNetworkLoginEnabled
                        }
                      />
                    </Box>
                  </Tooltip>
                </HStack>
                <Divider />
              </VStack>
            )
            return Header
          })}

          <Box mt={4} maxW={['100%', '60%']}>
            <HStack mb={2}>
              <Heading size="sm" as="h5">
                <Trans
                  i18nKey="admin.authentication.social.comingSoon.title"
                  defaults="Use your own credentials"
                />
              </Heading>
              <Badge color="success.base" bg="success.lite">
                <Trans
                  i18nKey="admin.authentication.social.comingSoon.badge"
                  defaults="Coming Soon"
                />
              </Badge>
            </HStack>
            <Text textStyle="regular/small">
              <Trans
                i18nKey="admin.authentication.social.comingSoon.description"
                defaults="Use your own official account to authorize users in the community."
              />
            </Text>
          </Box>
        </Skeleton>
      </Accordion>

      <Box mb={8} />
      <NetworkAuthenticationSSOSettings />
    </>
  )
}

export default NetworkAuthenticationSettings
