import React, { useCallback, useEffect, useState } from 'react'

import { Box, HStack, Skeleton } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { SsoStatus } from 'tribe-api/interfaces'
import {
  CustomSsoType,
  SsoProvider,
} from 'tribe-api/interfaces/interface.generated'
import {
  Alert,
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
  Tooltip,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useGetSsos from 'hooks/ssos/useGetSsos'
import useUpdateCustomSso from 'hooks/ssos/useUpdateCustomSso'

import { URL_DETECTOR } from 'utils/validator.utils'

import OuterAccordionHeader from './components/Header'
import SsoProviderSelect from './components/SsoProvidersSelect'
import {
  CUSTOM,
  SSO_PROVIDERS_IDP_URL_LABEL,
  SUPPORTED_SSO_PROVIDERS,
} from './utils/sso.config'

export const NetworkAuthenticationSSOSettings = () => {
  const { t } = useTranslation()
  const { network } = useGetNetwork()

  const { loading: updateSsoLoading, updateSso } = useUpdateCustomSso()

  type FormValues = {
    provider: SsoProvider
    clientId: string | null
    clientSecret: string | null
    idpURL: string | null
    tokenURL: string | null
    authorizationURL: string | null
    scopes: string | null
    userProfileURL: string | null
    buttonText: string | null
    logoutUrl: string | null
    settingsUrl: string | null
    enable: boolean
  }

  const {
    getSsos,
    defaultSsos,
    customSsos,
    loading: initialLoading,
  } = useGetSsos()

  const customSso = customSsos?.[0]

  const callbackUrl = `https://${network.domain}/ssos/redirect`

  useEffect(() => {
    // Without timeout `loading` variable stays `true` always
    // even after the backend`s response.
    setTimeout(() => getSsos())
  }, [getSsos])
  const [showExtraFields, setShowExtraFields] = useState(false)

  const { handleSubmit, control, errors, reset, watch, getValues } = useForm<
    FormValues
  >({
    defaultValues: {
      provider: customSso?.provider || undefined,
      clientId: customSso?.clientId || '',
      clientSecret: customSso?.clientSecret || '',
      idpURL: customSso?.idpUrl || '',
      buttonText: customSso?.buttonText || '',
      authorizationURL: customSso?.authorizationUrl || '',
      tokenURL: customSso?.tokenUrl || '',
      userProfileURL: customSso?.userProfileUrl || '',
      scopes: customSso?.scopes?.join(', ') || '',
      enable: customSso?.status === SsoStatus.ENABLE,
      logoutUrl: customSso?.logoutUrl,
      settingsUrl: customSso?.settingsUrl,
    },
    shouldUnregister: true,
  })

  const watchedProvider = watch('provider')

  useEffect(() => {
    if (customSso) {
      // eslint-disable-next-line no-nested-ternary
      const provider = customSso.provider
        ? customSso.provider
        : SUPPORTED_SSO_PROVIDERS.includes(customSso.name?.toLowerCase() as any)
        ? (customSso.name?.toLowerCase() as SsoProvider)
        : SsoProvider.CUSTOM

      reset({
        ...getValues(),
        provider,
        enable: customSso.status === SsoStatus.ENABLE,
        buttonText: customSso.buttonText || '',
        clientId: customSso.clientId,
        clientSecret: customSso.clientSecret,
        idpURL: customSso.idpUrl,
        authorizationURL: customSso.authorizationUrl,
        tokenURL: customSso.tokenUrl,
        userProfileURL: customSso.userProfileUrl,
        scopes: customSso?.scopes?.join(', '),
        logoutUrl: customSso?.logoutUrl,
        settingsUrl: customSso?.settingsUrl,
      })

      // See if provider is present in supported providers
      setShowExtraFields(!SUPPORTED_SSO_PROVIDERS.includes(provider))
    }
  }, [customSso])

  useEffect(() => {
    if (watchedProvider === CUSTOM) {
      setShowExtraFields(true)
    } else {
      setShowExtraFields(false)
    }
  }, [watchedProvider])

  const isNetworkLoginEnabled =
    !network?.hideDefaultAuthenticationForm ||
    defaultSsos?.some?.(sso => sso.status === SsoStatus.ENABLE)

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const {
        provider,
        clientId,
        clientSecret,
        idpURL,
        buttonText,
        enable,
        scopes = '',
        authorizationURL,
        tokenURL,
        userProfileURL,
      } = data || {}
      if (!provider) return

      const scopesArray = scopes
        ? scopes
            .trim()
            .replace(/,$/gi, '')
            .split(',')
        : []
      updateSso({
        clientId,
        clientSecret,
        idpUrl: idpURL,
        name: provider,
        provider,
        scopes: scopesArray,
        buttonText,
        status: enable ? SsoStatus.ENABLE : SsoStatus.DISABLE,
        type: CustomSsoType.OAUTH2,
        authorizationUrl: authorizationURL,
        tokenUrl: tokenURL,
        userProfileUrl: userProfileURL,
        logoutUrl: data.logoutUrl,
        settingsUrl: data.settingsUrl,
      })
    },
    [updateSso],
  )

  return (
    <>
      <Card>
        <OuterAccordionHeader />
        <Skeleton isLoaded={!initialLoading}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt={6}>
              <FormLabel textStyle="semibold/medium" color="label.primary">
                <Trans
                  i18nKey="admin:authentication.singleSignon.form.placeholder.provider"
                  defaults="SSO Provider"
                />
              </FormLabel>
              <Controller
                name="provider"
                control={control}
                render={({ onChange, name, value }) => (
                  <SsoProviderSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />

              {watchedProvider === SsoProvider.WORDPRESS && (
                <FormHelperText>
                  <Trans
                    i18nKey="admin:authentication.singleSignon.form.helpers.ssoProvider.wordpress"
                    defaultValue="You need to install WP OAuth Server plugin on your WordPress to use WordPress SSO Provider."
                  />
                </FormHelperText>
              )}
            </FormControl>
            {watchedProvider && (
              <>
                <FormControl mt={6} isInvalid={Boolean(errors.clientId)}>
                  <FormLabel textStyle="semibold/medium" color="label.primary">
                    <Trans
                      i18nKey="admin:authentication.singleSignon.form.placeholder.clientId"
                      defaults="Client ID"
                    />
                  </FormLabel>
                  <Controller
                    as={Input}
                    data-testid="client-id"
                    name="clientId"
                    textStyle="regular/medium"
                    control={control}
                  />
                  {errors?.clientId && (
                    <FormErrorMessage>
                      {t(
                        'admin:authentication.singleSignon.form.errors.clientId',
                        {
                          defaultValue: 'Client ID is required.',
                        },
                      )}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl mt={6} isInvalid={Boolean(errors.clientSecret)}>
                  <FormLabel textStyle="semibold/medium" color="label.primary">
                    <Trans
                      i18nKey="admin:authentication.singleSignon.form.placeholder.clientSecret"
                      defaults="Client Secret"
                    />
                  </FormLabel>
                  <Controller
                    as={Input}
                    data-testid="client-secret"
                    name="clientSecret"
                    textStyle="regular/medium"
                    control={control}
                  />
                  {errors?.clientSecret && (
                    <FormErrorMessage>
                      {t(
                        'admin:authentication.singleSignon.form.errors.clientSecret',
                        {
                          defaultValue: 'Client Secret is required.',
                        },
                      )}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl mt={6} isInvalid={Boolean(errors.idpURL)}>
                  <FormLabel textStyle="semibold/medium" color="label.primary">
                    {SSO_PROVIDERS_IDP_URL_LABEL[watchedProvider]}
                  </FormLabel>
                  <Controller
                    as={Input}
                    name="idpURL"
                    textStyle="regular/medium"
                    control={control}
                    data-testid="idp-url"
                  />
                  {errors?.idpURL && (
                    <FormErrorMessage>
                      {t(
                        'admin:authentication.singleSignon.form.errors.idpURL',
                        {
                          defaultValue: 'IDP Url is required.',
                        },
                      )}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {showExtraFields && (
                  <FormControl
                    mt={6}
                    isInvalid={Boolean(errors.authorizationURL)}
                  >
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      <Trans
                        i18nKey="admin:authentication.singleSignon.form.placeholder.authorizationURL"
                        defaults="Authorization URL"
                      />
                    </FormLabel>
                    <Controller
                      as={Input}
                      name="authorizationURL"
                      textStyle="regular/medium"
                      control={control}
                      data-testid="authorization-url"
                    />
                    {errors?.authorizationURL && (
                      <FormErrorMessage>
                        {t(
                          'admin:authentication.singleSignon.form.errors.authorizationURL',
                          {
                            defaultValue: 'Authorization Url is required.',
                          },
                        )}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showExtraFields && (
                  <FormControl mt={6} isInvalid={Boolean(errors.tokenURL)}>
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      <Trans
                        i18nKey="admin:authentication.singleSignon.form.placeholder.tokenURL"
                        defaults="Token URL"
                      />
                    </FormLabel>
                    <Controller
                      as={Input}
                      name="tokenURL"
                      textStyle="regular/medium"
                      control={control}
                      data-testid="token-url"
                    />
                    {errors?.tokenURL && (
                      <FormErrorMessage>
                        {t(
                          'admin:authentication.singleSignon.form.errors.tokenURL',
                          {
                            defaultValue: 'Token Url is required.',
                          },
                        )}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showExtraFields && (
                  <FormControl
                    mt={6}
                    isInvalid={Boolean(errors.userProfileURL)}
                  >
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      <Trans
                        i18nKey="admin:authentication.singleSignon.form.placeholder.userProfileURL"
                        defaults="User Profile URL"
                      />
                    </FormLabel>
                    <Controller
                      as={Input}
                      name="userProfileURL"
                      textStyle="regular/medium"
                      control={control}
                      data-testid="user-profile-url"
                    />
                    {errors?.userProfileURL && (
                      <FormErrorMessage>
                        {t(
                          'admin:authentication.singleSignon.form.errors.userProfileURL',
                          {
                            defaultValue: 'User Profile Url is required.',
                          },
                        )}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showExtraFields && (
                  <FormControl mt={6} isInvalid={Boolean(errors.scopes)}>
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      <Trans
                        i18nKey="admin:authentication.singleSignon.form.placeholder.scopes"
                        defaults="Scope (Comma Separated)"
                      />
                    </FormLabel>
                    <Controller
                      as={Input}
                      name="scopes"
                      textStyle="regular/medium"
                      control={control}
                      data-testid="scopes"
                    />
                    {errors?.userProfileURL && (
                      <FormErrorMessage>
                        {t(
                          'admin:authentication.singleSignon.form.errors.scopes',
                          {
                            defaultValue: 'Scope is required.',
                          },
                        )}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showExtraFields && (
                  <FormControl mt={6} isInvalid={Boolean(errors.settingsUrl)}>
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      Settings Url
                    </FormLabel>
                    <Controller
                      as={Input}
                      rules={{
                        pattern: URL_DETECTOR,
                      }}
                      name="settingsUrl"
                      textStyle="regular/medium"
                      control={control}
                    />
                    {errors?.settingsUrl && (
                      <FormErrorMessage>
                        Settings Url is invalid.
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showExtraFields && (
                  <FormControl mt={6} isInvalid={Boolean(errors.logoutUrl)}>
                    <FormLabel
                      textStyle="semibold/medium"
                      color="label.primary"
                    >
                      Logout Url
                    </FormLabel>
                    <Controller
                      as={Input}
                      rules={{
                        pattern: URL_DETECTOR,
                      }}
                      name="logoutUrl"
                      textStyle="regular/medium"
                      control={control}
                    />
                    {errors?.logoutUrl && (
                      <FormErrorMessage>
                        Logout Url is invalid.
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}

                <FormControl
                  mt={6}
                  id="tribe-description"
                  isInvalid={Boolean(errors.buttonText)}
                >
                  <FormLabel textStyle="semibold/medium" color="label.primary">
                    <Trans
                      i18nKey="admin:authentication.singleSignon.form.placeholder.loginButtonText"
                      defaults="Login Button Text"
                    />
                  </FormLabel>
                  <Controller
                    as={Input}
                    name="buttonText"
                    textStyle="regular/medium"
                    control={control}
                    data-testid="login-button-text"
                  />
                  {errors?.buttonText && (
                    <FormErrorMessage>
                      {t(
                        'admin:authentication.singleSignon.form.errors.buttonText',
                        {
                          defaultValue: 'Login button text is required.',
                        },
                      )}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <Alert status="warning" mt={5}>
                  Please use {callbackUrl} as the callback url.
                </Alert>
                <HStack align="center" mt={5}>
                  <FormControl mt={4} display="flex" alignItems="center">
                    <Controller
                      control={control}
                      name="enable"
                      render={({ value, onChange }) => (
                        <Tooltip
                          isDisabled={!value || isNetworkLoginEnabled}
                          maxW="300px"
                          placement="top"
                          offset={[0, 10]}
                          label={t(
                            'admin:authentication.singleSignOn.tooltipLabel',
                            'You can’t disable single sign-on if you don’t have login with email or social login enabled',
                          )}
                        >
                          <Box>
                            <Switch
                              isChecked={value}
                              isDisabled={value && !isNetworkLoginEnabled}
                              data-testid="enable-switch"
                              onChange={() => {
                                onChange(!value)
                              }}
                            />
                          </Box>
                        </Tooltip>
                      )}
                    />
                    <FormLabel htmlFor="enable" mb={1} ml={3}>
                      <Trans
                        i18nKey="admin:moderation.settings.useDefaultBlacklissting"
                        defaults="Enable OAuth2"
                      />
                    </FormLabel>
                  </FormControl>
                  <Button
                    isLoading={updateSsoLoading}
                    type="submit"
                    buttonType="primary"
                    isDisabled={updateSsoLoading}
                    mt={6}
                    data-testid="update-button"
                  >
                    <Trans
                      i18nKey="admin:authentication.singleSignon.form.updateButtonText"
                      defaults="Update"
                    />
                  </Button>
                </HStack>
              </>
            )}
          </Box>
        </Skeleton>
      </Card>
    </>
  )
}
