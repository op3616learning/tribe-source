import React, { FC, useCallback, useEffect, useState } from 'react'

import { Flex, HStack, VStack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

import { Button, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

const CodeEditorComponent = dynamic(import('components/common/CodeEditor'), {
  ssr: false,
})
const CodeEditor =
  process.env.NODE_ENV === 'test'
    ? require('components/common/CodeEditor').default
    : CodeEditorComponent

export type CodeSnippetProps = {
  header: string
  warning: string
  onSave: (newVal: string) => void
  loading?: boolean
  initialValue?: string
  placeholder?: string
  disabled?: boolean
}

const CodeSnippet: FC<CodeSnippetProps> = ({
  header,
  warning,
  onSave,
  loading,
  initialValue = '',
  placeholder,
  disabled,
  ...rest
}) => {
  const [content, setContent] = useState(initialValue)
  const [hasError, setHasError] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDirty(false)
    setHasError(false)
  }, [initialValue])

  const handleEditorChange = useCallback(
    (newValue, error) => {
      setHasError(error)
      const isInputDirty = newValue !== initialValue
      setDirty(isInputDirty)
      if (isInputDirty) {
        setContent(newValue)
      }
    },
    [initialValue],
  )
  const handleSave = () => {
    onSave(content || '')
  }

  return (
    <VStack spacing="6" alignItems="start" justifyContent="center">
      <VStack spacing="2" alignItems="start" w="full">
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Text textStyle="medium/medium" color="text.primary">
            {header}
          </Text>
          {/* TODO: Bring back this icon when we get a design */}
          {/* <IconButton
            aria-label="open"
            icon={<Icon as={ExternalLinkLineIcon} color="label.primary" />}
            paddingRight={0}
            justifyContent="flex-end"
          /> */}
        </Flex>
        <CodeEditor
          initialValue={initialValue}
          onCodeChange={handleEditorChange}
          w="full"
          h={268}
          disabled={disabled}
          placeholder={placeholder}
          {...rest}
        />
        <Text textStyle="regular/small" color="label.secondary">
          {warning}
        </Text>
      </VStack>
      <HStack alignSelf="flex-end">
        <Button
          onClick={handleSave}
          buttonType="primary"
          size="sm"
          isDisabled={disabled || loading || hasError || !dirty}
        >
          <Trans
            i18nKey="apps:app.customCode.settings.save"
            defaults="Save settings"
          />
        </Button>
      </HStack>
    </VStack>
  )
}

export default CodeSnippet
