import React, { useMemo, useState } from 'react'

import {
  Box,
  Button as ChakraButton,
  HStack,
  Link,
  useClipboard,
  VStack,
} from '@chakra-ui/react'
import ExternalLinkLineIcon from 'remixicon-react/ExternalLinkLineIcon'
import FileCopyLineIcon from 'remixicon-react/FileCopyLineIcon'

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardDivider,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Skeleton,
  SkeletonText,
  Text,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import { BaseSettingsProps } from './@types'
import useGetAppNetworkSettings from './hooks/useGetAppNetworkSettings'

const ZapierSettings: React.FC<BaseSettingsProps> = ({
  loading,
  app,
  update,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [updatedSettings, setUpdatedSettings] = useState({
    apiToken: null,
    hasToken: null,
  })
  const { settings, loading: refetching } = useGetAppNetworkSettings({
    appId: app?.id || '',
  })
  const { apiToken, hasToken } = useMemo(() => {
    if (settings) {
      try {
        return JSON.parse(settings)
      } catch (err) {
        logger.error(err)
      }
    }
    return ''
  }, [settings])
  const zapierApiKey = updatedSettings?.apiToken || apiToken
  const zapierHasKey = updatedSettings?.hasToken || hasToken
  const { onCopy } = useClipboard(zapierApiKey)
  const copyTextToClipboard = () => {
    onCopy()
    toast({
      title: t('apps:app.zapier.copySucceeded', 'Zapier API Key Copied!'),
      duration: 1000,
      icon: FileCopyLineIcon,
    })
  }
  const onGenerateKey = async () => {
    try {
      const regenerateRequest = {
        regenerateIdentifier: true,
      }
      update(
        JSON.stringify(regenerateRequest),
        false,
        t('apps:app.zapier.regenerateSuccess', 'New API Key Generated!'),
      ).then(updatedSettings => {
        try {
          setUpdatedSettings(JSON.parse(updatedSettings as string))
        } catch (err) {
          logger.error(err)
        }
      })
    } catch (err) {
      logger.error(err)
    }
  }
  return (
    <Skeleton isLoaded={!loading}>
      <Card w="full">
        <VStack spacing="4" alignItems="start" w="full" mb={6}>
          <Text textStyle="medium/large" color="label.primary">
            <Trans i18nKey="apps:app.zapier.title" defaults="API Key" />
          </Text>
          <Text textStyle="medium/regular" color="label.secondary">
            <Trans
              i18nKey="apps:app.zapier.info"
              defaults="The API Key is generated only after the user clicks on “Generate API key“. After the user navigates away from the page, the key is hidden forever."
            />
          </Text>
          {(zapierHasKey || zapierApiKey) && (
            <Alert
              w="full"
              variant="subtle"
              status="warning"
              mx={-6}
              borderRadius="base"
            >
              <AlertIcon />
              <Box flex="1">
                <AlertTitle color="label.primary" textStyle="regular/medium">
                  {zapierApiKey ? (
                    <Trans
                      i18nKey="apps:app.zapier.copyTip"
                      defaults="Copy your API key now, and treat it like a password."
                    />
                  ) : (
                    <Trans
                      i18nKey="apps:app.zapier.existenceTip"
                      defaults="An API key exists for this site. Generating a new one invalidates the existing key."
                    />
                  )}
                </AlertTitle>
              </Box>
            </Alert>
          )}
          {zapierApiKey && (
            <FormControl id="zapier-api-key" isRequired>
              <InputGroup>
                <Skeleton
                  isLoaded={!refetching}
                  w="full"
                  fallback={<SkeletonText noOfLines={1} w="full" />}
                >
                  <Input
                    data-testid="zapier-api-key"
                    type="text"
                    readOnly
                    focusBorderColor="border.base"
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                    value={zapierApiKey}
                  />
                </Skeleton>
                <InputRightAddon bg="bg.secondary" w="auto" padding={0}>
                  <ChakraButton
                    onClick={copyTextToClipboard}
                    isLazy
                    strategy="fixed"
                    size="sm"
                    data-testid="zapier-copy-key"
                  >
                    <Trans
                      i18nKey="apps:app.zapier.copyApiKey"
                      defaults="Copy"
                    />
                  </ChakraButton>
                </InputRightAddon>
              </InputGroup>
            </FormControl>
          )}
          <Button
            buttonType="primary"
            onClick={onGenerateKey}
            data-testid="zapier-generate-key"
          >
            <Trans
              i18nKey="apps:app.zapier.generateToken"
              defaults="Generate API key"
            />
          </Button>
        </VStack>
        <CardDivider />
        <VStack spacing="4" alignItems="start" w="full">
          <Text textStyle="medium/large" color="label.primary">
            <Trans
              i18nKey="apps:app.zapier.connection"
              defaults="Set up your Zapier connection"
            />
          </Text>
          <Text textStyle="medium/regular" color="label.secondary">
            <Trans
              i18nKey="apps:app.zapier.tip"
              defaults="The easiest way is to create new zap and choose “Tribe New” under “Choose app & event” dropdown. After picking your trigger or action, click on “Sign in to Tribe” button. There you will be prompted to add the API Key generated in the field above."
            />
          </Text>
          <Button variant="outline">
            <Link
              href="https://zapier.com/developer/public-invite/141233/01c08d182f7a7cda304a68067a396d71/"
              target="_blank"
            >
              <HStack spacing="1">
                <Icon as={ExternalLinkLineIcon} color="label.primary" />
                <Text textStyle="medium/medium" color="label.primary">
                  <Trans
                    i18nKey="apps:app.zapier.open"
                    defaults="Open zapier.com"
                  />
                </Text>
              </HStack>
            </Link>
          </Button>
        </VStack>
      </Card>
    </Skeleton>
  )
}

export default ZapierSettings
