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

// same REGEX check done from the backend
const GA_TRACKING_ID_REGEX = /^(UA-\d+-\d+|G-[A-Z0-9]+)$/

const GoogleAnalyticsSettings: React.FC<BaseSettingsProps> = ({
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
    trackingId?: string
  }>({
    mode: 'onChange',
  })
  const watchTrackingId = watch('trackingId')

  const onSave = () => {
    try {
      const newSettings = {
        measurementId: watchTrackingId,
      }
      update(JSON.stringify(newSettings))
    } catch (err) {
      logger.error(err)
    }
  }

  const appTrackingId = useMemo(() => {
    if (settings) {
      try {
        return JSON.parse(settings)?.measurementId
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
          <Trans i18nKey="apps:app.ga.title" defaults="Tracking ID" />
        </Text>
        <VStack spacing="6" alignItems="start" w="full">
          {!loading && !appTrackingId && (
            <Alert variant="subtle" status="warning">
              <AlertIcon />
              <Trans
                i18nKey="apps:app.ga.needUpdate"
                defaults="You need to update your tracking ID to receive data in Analytics"
              />
            </Alert>
          )}
          <VStack spacing="2" alignItems="start" w="full">
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="medium/medium" color="label.primary">
                <Trans
                  i18nKey="apps:app.ga.trackingId"
                  defaults="Google Universal Analytics Tracking ID"
                />
              </Text>
              <Text textStyle="medium/medium" color="danger.base">
                *
              </Text>
            </Flex>
            <TextInput
              data-testid="ga-trackingId-input"
              name="trackingId"
              ref={register({
                pattern: {
                  value: GA_TRACKING_ID_REGEX,
                  message: 'Invalid Tracking ID Format',
                },
                required: true,
              })}
              isDisabled={disabled}
              defaultValue={appTrackingId}
              placeholder={`${t('apps:app.ga.ie', 'i.e.')} UA-000000-2`}
              error={errors?.trackingId?.message}
            />
            <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
              <Text textStyle="regular/small" color="label.secondary">
                <Trans
                  i18nKey="apps:app.ga.help"
                  defaults="Don't know how to get Tracking ID? "
                />
              </Text>
              <Link
                href="https://support.google.com/analytics/answer/1008015?hl=en"
                isExternal
              >
                <Text textStyle="regular/small" color="accent.base">
                  <Trans
                    i18nKey="apps:app.ga.helpLink"
                    defaults="Click here for instructions"
                  />
                </Text>
              </Link>
            </Flex>
          </VStack>
          <HStack alignSelf="flex-end">
            <Button
              data-testid="ga-save-btn"
              onClick={handleSubmit(onSave)}
              buttonType="primary"
              isDisabled={!watchTrackingId || loading || updating || !isDirty}
            >
              <Trans i18nKey="apps:app.ga.save" defaults="Save settings" />
            </Button>
          </HStack>
        </VStack>
      </Skeleton>
    </Card>
  )
}

export default GoogleAnalyticsSettings
