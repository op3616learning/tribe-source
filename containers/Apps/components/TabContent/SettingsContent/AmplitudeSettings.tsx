import React, { useMemo } from 'react'

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

import { logger } from 'lib/logger'

import { BaseSettingsProps } from './@types'

const AMPLITUDE_API_KEY_REGEX = /^([0-9a-f]+)$/

const AmplitudeSettings: React.FC<BaseSettingsProps> = ({
  update,
  loading,
  updating,
  settings,
  disabled,
}) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState: { isDirty },
  } = useForm<{
    apiKey?: string
  }>({
    mode: 'onChange',
  })
  const watchApiKey = watch('apiKey')

  const onSave = () => {
    try {
      const newSettings = {
        apiKey: watchApiKey,
      }
      update(JSON.stringify(newSettings))
    } catch (err) {
      logger.error(err)
    }
  }

  const appApiKey = useMemo(() => {
    if (settings) {
      try {
        return JSON.parse(settings)?.apiKey
      } catch (err) {
        logger.error(err)
      }
    }
    return null
  }, [settings])

  return (
    <Card>
      <Skeleton isLoaded={!loading}>
        <Text textStyle="medium/large" color="label.primary" mb={4}>
          <Trans
            i18nKey="apps:app.amplitude.title"
            defaults="Amplitude Settings"
          />
        </Text>
        <VStack spacing="6" alignItems="start" w="full">
          {!loading && !appApiKey && (
            <Alert variant="subtle" status="warning">
              <AlertIcon />
              <Trans
                i18nKey="apps:app.amplitude.needUpdate"
                defaults="You need to enter your Amplitude API key to activate this integration"
              />
            </Alert>
          )}
          <VStack spacing="2" alignItems="start" w="full">
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.amplitude.apiKey"
                  defaults="Amplitude API Key"
                />
              </Text>
              <Text textStyle="medium/medium" color="danger.base">
                *
              </Text>
            </Flex>
            <TextInput
              data-testid="amplitude-api-key-input"
              name="apiKey"
              ref={register({
                pattern: {
                  value: AMPLITUDE_API_KEY_REGEX,
                  message: 'Invalid API key format',
                },
                required: true,
              })}
              isDisabled={disabled}
              defaultValue={appApiKey}
              placeholder={`${t(
                'apps:app.amplitude.ie',
                'i.e.',
              )} 8eea23352c68a5ad8dd233f8aef142a1`}
              error={errors?.apiKey?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.amplitude.help"
                  defaults="Don't know how to get Amplitude API key? "
                />
              </Text>
              <Link
                href="https://help.amplitude.com/hc/en-us/articles/207108137-Quick-start-guide-Create-your-organization-and-first-project"
                isExternal
              >
                <Text textStyle="regular/small" color="accent.base">
                  <Trans
                    i18nKey="apps:app.amplitude.helpLink"
                    defaults="Click here for instructions"
                  />
                </Text>
              </Link>
            </Flex>
          </VStack>
          <HStack alignSelf="flex-end">
            <Button
              data-testid="amplitude-save-btn"
              onClick={handleSubmit(onSave)}
              buttonType="primary"
              isDisabled={!watchApiKey || loading || updating || !isDirty}
            >
              <Trans
                i18nKey="apps:app.amplitude.save"
                defaults="Save settings"
              />
            </Button>
          </HStack>
        </VStack>
      </Skeleton>
    </Card>
  )
}

export default AmplitudeSettings
