import React from 'react'

import { Box, HStack } from '@chakra-ui/layout'
import DownloadLineIcon from 'remixicon-react/DownloadLineIcon'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Text,
  useResponsive,
  Tooltip,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { AttachmentModalProps } from '../../@types'
import { AttachmentIconButton } from './AttachmentIconButton'
import { AttachmentName } from './AttachmentName'

export const PREVIEW_SUPPORTED_EXTENSION = [
  'jpg',
  'jpeg',
  'png',
  'jiff',
  'jfif',
  'gif',
  'pdf',
  'svg',
]

export const AttachmentModal = ({
  attachment,
  onClose,
  onAttachmentDownload,
}: AttachmentModalProps) => {
  const { isMobile } = useResponsive()
  const { name, extension, url, downloadUrl } = attachment

  return (
    <Modal
      isOpen
      onClose={onClose}
      size={isMobile ? 'full' : '6xl'}
      isCentered
      trapFocus={false}
    >
      <ModalOverlay>
        <ModalContent my={0} overflow="hidden">
          <ModalHeader>
            <HStack justify="space-between" align="flex-start">
              <AttachmentName {...attachment} />
              <Tooltip
                placement="auto"
                label={
                  <Trans
                    i18nKey="composer:attachment.download"
                    defaults="Download"
                  />
                }
              >
                <AttachmentIconButton
                  icon={<DownloadLineIcon size="20px" />}
                  aria-label="Download"
                  style={{ marginRight: 25 }}
                  onClick={() => onAttachmentDownload?.(attachment)}
                  as="a"
                  href={downloadUrl}
                  download={name}
                />
              </Tooltip>
            </HStack>
          </ModalHeader>
          <ModalCloseButton
            mt="12px"
            size="md"
            fontSize="14px"
            _hover={{
              bg: 'bg.secondary',
            }}
          />

          <ModalBody
            justifyContent="center"
            alignItems="center"
            minH="70vh"
            maxH={isMobile ? 'auto' : '70vh'}
            p={0}
            bgColor="bg.secondary"
          >
            {PREVIEW_SUPPORTED_EXTENSION.includes(extension) ? (
              <>
                {extension === 'pdf' ? (
                  <Box as="iframe" w="full" flexGrow={1} src={url} />
                ) : (
                  <Image
                    src={url}
                    maxHeight="inherit"
                    objectFit="contain"
                    alt={name}
                  />
                )}
              </>
            ) : (
              <Text textAlign="center">
                <Trans
                  i18nKey="composer:attachment.noPreview"
                  defaults="Preview not supported"
                />
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
