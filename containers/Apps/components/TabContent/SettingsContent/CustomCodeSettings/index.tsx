import React, { FC, useEffect, useState } from 'react'

import { VStack } from '@chakra-ui/react'

import { Card, CardDivider, Text } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import { BaseSettingsProps } from '../@types'
import CodeSnippet from './CodeSnippet'

const CustomCodeSettings: FC<BaseSettingsProps> = ({
  disabled,
  settings,
  loading,
  updating,
  update,
}) => {
  const { t } = useTranslation()
  const [headCode, setHeadCode] = useState<string>()
  const [bodyCode, setBodyCode] = useState<string>()
  useEffect(() => {
    if (settings) {
      try {
        const { headCode, bodyCode } = JSON.parse(settings)
        if (headCode) {
          setHeadCode(headCode)
        }
        if (bodyCode) {
          setBodyCode(bodyCode)
        }
      } catch (err) {
        logger.error(err)
      }
    }
  }, [settings])
  const onHeadSave = (headCode: string) => {
    const updatedSettings = {
      headCode,
      bodyCode,
    }
    update(JSON.stringify(updatedSettings))
    setHeadCode(headCode)
  }
  const onBodySave = (bodyCode: string) => {
    const updatedSettings = {
      headCode,
      bodyCode,
    }
    update(JSON.stringify(updatedSettings))
    setBodyCode(bodyCode)
  }

  return (
    <Card w="full" variant="shadow">
      <VStack spacing="4" alignItems="start">
        <Text textStyle="medium/large" color="label.primary">
          <Trans
            i18nKey="apps:app.customCode.settings.title"
            defaults="Custom Tags & Scripts"
          />
        </Text>
        <Text textStyle="regular/medium" color="label.secondary">
          <Trans
            i18nKey="apps:app.customCode.settings.description"
            defaults="Custom code is sometimes needed for ultimate flexibility. Add custom code to the public pages of your community."
          />
        </Text>
      </VStack>
      <CardDivider my={6} />
      {!loading && (
        <>
          <CodeSnippet
            header={t(
              'apps:app.customCode.settings.head',
              'Custom code for <head>',
            )}
            warning={t(
              'apps:app.customCode.settings.warning',
              `Tribe doesn't validate custom code for you, so be sure to check your code before publishing.`,
            )}
            initialValue={headCode}
            onSave={onHeadSave}
            loading={updating}
            disabled={disabled}
            placeholder="<!-- Start Here -->"
            data-testid="codemirror-head"
          />
          <CardDivider my={6} borderColor="border.lite" />
          <CodeSnippet
            header={t(
              'apps:app.customCode.settings.body',
              'Custom code for <body>',
            )}
            warning={t(
              'apps:app.customCode.settings.warning',
              `Tribe doesn't validate custom code for you, so be sure to check your code before publishing.`,
            )}
            initialValue={bodyCode}
            onSave={onBodySave}
            loading={loading}
            disabled={disabled}
            placeholder="<!-- Start Here -->"
            data-testid="codemirror-body"
          />
        </>
      )}
    </Card>
  )
}

export default CustomCodeSettings
