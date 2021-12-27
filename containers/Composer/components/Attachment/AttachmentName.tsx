import React from 'react'

import { VStack } from '@chakra-ui/layout'
import filesize from 'filesize'

import { Text } from 'tribe-components'

import { Attachment } from '../../@types'

export const AttachmentName = ({ name, extension, size }: Attachment) => (
  <VStack align="baseline" overflow="hidden" maxW="lg">
    <Text textStyle="regular/medium" color="label.primary" isTruncated w="full">
      {name}
    </Text>
    <Text mt={2} color="label.secondary">
      {filesize(size, { round: size < 100_000_0 ? 0 : 1 })}{' '}
      {extension.toUpperCase()}
    </Text>
  </VStack>
)
