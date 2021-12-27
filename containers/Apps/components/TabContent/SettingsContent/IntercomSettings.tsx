import React, { useCallback, useEffect, useMemo } from 'react'

import { Flex, HStack, Link, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  AlertIcon,
  Button,
  Card,
  Skeleton,
  Text,
  TextInput,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { logger } from 'lib/logger'

import { BaseSettingsProps } from './@types'

const IntercomSettings: React.FC<BaseSettingsProps> = ({
  update,
  loading,
  updating,
  settings,
  disabled,
  clearSettingsCache,
}) => {
  const { t } = useTranslation()

  const appSettings = useMemo(() => {
    if (settings) {
      try {
        return JSON.parse(settings)
      } catch (err) {
        logger.error(err)
      }
    }
    return {}
  }, [settings])

  const {
    userIdentitySecret,
    intercomAppId,
    intercomUserPrefix,
    intercomEventPrefix,
    authURL,
    isIntercomAuthenticated,
  } = appSettings

  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isValid },
    reset,
  } = useForm<{
    userIdentitySecret?: string
    intercomAppId?: string
    intercomUserPrefix?: string
    intercomEventPrefix?: string
  }>({
    mode: 'onChange',
    defaultValues: {
      userIdentitySecret,
      intercomAppId,
      intercomUserPrefix,
      intercomEventPrefix,
    },
  })

  useEffect(() => {
    reset({
      userIdentitySecret,
      intercomAppId,
      intercomUserPrefix,
      intercomEventPrefix,
    })
  }, [
    userIdentitySecret,
    intercomAppId,
    intercomUserPrefix,
    intercomEventPrefix,
    reset,
  ])

  const { network } = useGetNetwork()
  const onSave = useCallback(
    data => {
      try {
        const newSettings = {
          userIdentitySecret: data.userIdentitySecret,
          intercomAppId: data.intercomAppId,
          intercomUserPrefix: data.intercomUserPrefix,
          intercomEventPrefix: data.intercomEventPrefix,
        }
        update(JSON.stringify(newSettings))
      } catch (err) {
        logger.error(err)
      }
    },
    [update],
  )

  let returnURL: string
  if (typeof window !== 'undefined') {
    returnURL = window.location.href
  }
  return (
    <Card>
      <Skeleton isLoaded={!loading}>
        <Text textStyle="medium/large" color="label.primary" mb={4}>
          <Trans
            i18nKey="apps:app.intercom.title"
            defaults="Intercom Settings"
          />
        </Text>
        <VStack spacing="6" alignItems="start" w="full">
          <VStack spacing="2" alignItems="start" w="full">
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.intercom.authenticationStatus"
                  defaults="Intercom Authentication"
                />
              </Text>
              <Text textStyle="medium/medium" color="danger.base">
                *
              </Text>
            </Flex>
            <Alert
              variant="subtle"
              status={isIntercomAuthenticated ? 'success' : 'warning'}
            >
              <AlertIcon />
              {isIntercomAuthenticated ? (
                <Trans
                  i18nKey="apps:app.intercom.authComplete"
                  defaults="Intercom is successfully authenticated. "
                />
              ) : (
                <Trans
                  i18nKey="apps:app.intercom.needAuth"
                  defaults="You need to authenticate Intercom to activate this integration"
                />
              )}
            </Alert>
            <Button
              data-testid="intercom-auth-button"
              width="full"
              isDisabled={disabled}
              onClick={() => {
                if (clearSettingsCache) clearSettingsCache()
                window.location.href = `${authURL}?returnURL=${returnURL}&networkId=${network.id}`
              }}
            >
              {isIntercomAuthenticated ? (
                <Trans
                  i18nKey="apps:app.intercom.oAuthReAuthenticate"
                  defaults="Re-authenticate with Intercom"
                />
              ) : (
                <Trans
                  i18nKey="apps:app.intercom.oAuthAuthenticate"
                  defaults="Authenticate with Intercom"
                />
              )}
            </Button>
          </VStack>
          <VStack spacing="2" alignItems="start" w="full">
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.intercom.intercomAppId"
                  defaults="App ID"
                />
              </Text>
              <Text textStyle="medium/medium" color="danger.base">
                *
              </Text>
            </Flex>
            <TextInput
              data-testid="intercom-app-id-input"
              name="intercomAppId"
              ref={register({
                required: true,
              })}
              isDisabled={disabled}
              placeholder={`${t('apps:app.intercom.ie', 'i.e.')} cvt6rup59`}
              error={errors?.intercomAppId?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.intercom.intercomAppIdHelp"
                  defaults="Don't know how to get Intercom app ID?"
                />
                {'\u00A0'}
              </Text>
              <Link
                href="https://www.intercom.com/help/en/articles/3539-where-can-i-find-my-workspace-id-app-id"
                isExternal
              >
                <Text textStyle="regular/small" color="accent.base">
                  <Trans
                    i18nKey="apps:app.intercom.helpLink"
                    defaults="Click here for instructions"
                  />
                </Text>
              </Link>
            </Flex>
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.intercom.userIdentitySecret"
                  defaults="Identity verification secret"
                />
              </Text>
            </Flex>
            <TextInput
              data-testid="intercom-user-identity-secret-input"
              name="userIdentitySecret"
              ref={register({
                required: false,
              })}
              isDisabled={disabled}
              placeholder={`${t(
                'apps:app.intercom.ie',
                'i.e.',
              )} 8eea23352c68a5ad8dd233f8aef142a1`}
              error={errors?.userIdentitySecret?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.intercom.userIdentitySecretHelp"
                  defaults="Don't know how to get Intercom Identity verification secret?"
                />
                {'\u00A0'}
              </Text>
              <Link
                href="https://developers.intercom.com/installing-intercom/docs/enable-identity-verification-on-your-web-product"
                isExternal
              >
                <Text textStyle="regular/small" color="accent.base">
                  <Trans
                    i18nKey="apps:app.intercom.helpLink"
                    defaults="Click here for instructions"
                  />
                </Text>
              </Link>
            </Flex>
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.intercom.userPrefix"
                  defaults="User Properties Prefix"
                />
              </Text>
            </Flex>
            <TextInput
              data-testid="intercom-user-prefix-input"
              name="intercomUserPrefix"
              ref={register({
                required: false,
              })}
              isDisabled={disabled}
              placeholder={`${t('apps:app.intercom.ie', 'i.e.')} Community`}
              error={errors?.intercomUserPrefix?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.intercom.userPrefixHelp"
                  defaults="You can add a prefix to Tribe properties to make sure they don't mix up with yours."
                />
              </Text>
            </Flex>
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.intercom.eventPrefix"
                  defaults="User Events Prefix"
                />
              </Text>
            </Flex>
            <TextInput
              data-testid="intercom-event-prefix-input"
              name="intercomEventPrefix"
              ref={register({
                required: false,
              })}
              isDisabled={disabled}
              placeholder={`${t(
                'apps:app.intercom.ie',
                'i.e.',
              )} tribe-community`}
              error={errors?.intercomEventPrefix?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.intercom.userPrefixHelp"
                  defaults="You can add a prefix to Tribe events to make sure they don't mix up with yours."
                />
              </Text>
            </Flex>
          </VStack>
          <HStack alignSelf="flex-end">
            <Button
              data-testid="intercom-save-btn"
              onClick={handleSubmit(onSave)}
              buttonType="primary"
              isDisabled={loading || updating || !isDirty || !isValid}
            >
              <Trans
                i18nKey="apps:app.intercom.save"
                defaults="Save settings"
              />
            </Button>
          </HStack>
        </VStack>
      </Skeleton>
    </Card>
  )
}

export default IntercomSettings
