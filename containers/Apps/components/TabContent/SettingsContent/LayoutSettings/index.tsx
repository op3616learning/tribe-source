import React, { useEffect, useState, FC } from 'react'

import { Flex, VStack } from '@chakra-ui/react'

import { Text, Card, Radio, RadioGroup, Button } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { PostLayoutVariant } from 'containers/Post/components'

import { logger } from 'lib/logger'

import LayoutPreview from './LayoutPreview'

export type BaseSettingsProps = {
  settings?: string | null
  initialValue?: PostLayoutVariant
  loading: boolean
  update: (newSettings: string) => void
}

const LayoutSettings: FC<BaseSettingsProps> = ({
  settings,
  initialValue = PostLayoutVariant.CARDS,
  loading = false,
  update,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<PostLayoutVariant>(
    initialValue,
  )

  useEffect(() => {
    if (settings) {
      try {
        setSelectedStyle(JSON.parse(settings).layout)
      } catch (err) {
        logger.error(err)
        setSelectedStyle(initialValue)
      }
    }
  }, [settings, initialValue])

  const onChange = (newStyle: PostLayoutVariant) => setSelectedStyle(newStyle)
  const onSave = () => {
    update(JSON.stringify({ layout: selectedStyle }))
  }

  return (
    <Card w="full">
      <VStack spacing="4" alignItems="flex-start">
        <Text textStyle="medium/medium">
          <Trans i18nKey="admin:apps.postLayout.layout" defaults="Layout" />
        </Text>
        <RadioGroup
          data-testid="postLayout-settings-layout-options"
          value={selectedStyle}
          onChange={onChange}
          w="full"
        >
          <Flex
            flexDirection={{
              base: 'column',
              sm: 'row',
            }}
            w="full"
            style={{
              gap: 20,
            }}
          >
            <VStack spacing="3" alignItems="flex-start" w="full">
              <LayoutPreview layout={PostLayoutVariant.CARDS} />
              <Radio
                data-testid="postLayout-settings-layout-cards"
                value={PostLayoutVariant.CARDS}
              >
                <Text color="label.primary" textStyle="medium/medium">
                  <Trans
                    i18nKey="admin:apps.postLayout.cards"
                    defaults="Cards"
                  />
                </Text>
              </Radio>
            </VStack>
            <VStack spacing="3" alignItems="flex-start" w="full">
              <LayoutPreview layout={PostLayoutVariant.LIST} />
              <Radio
                data-testid="postLayout-settings-layout-list"
                value={PostLayoutVariant.LIST}
              >
                <Text color="label.primary" textStyle="medium/medium">
                  <Trans i18nKey="admin:apps.postLayout.list" defaults="List" />
                </Text>
              </Radio>
            </VStack>
          </Flex>
        </RadioGroup>

        <Button
          data-testid="postLayout-settings-save-btn"
          onClick={onSave}
          buttonType="primary"
          size="sm"
          isDisabled={loading}
          _disabled={{
            opacity: 0.5,
          }}
        >
          <Trans i18nKey="admin:apps.postLayout.save" defaults="Save" />
        </Button>
      </VStack>
    </Card>
  )
}

export default LayoutSettings
