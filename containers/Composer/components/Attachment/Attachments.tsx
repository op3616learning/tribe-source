import React, { useState } from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import DownloadLineIcon from 'remixicon-react/DownloadLineIcon'
import EyeLineIcon from 'remixicon-react/EyeLineIcon'

import { Spinner, Tooltip } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { Attachment, AttachmentsProps } from '../../@types'
import { icons } from '../icons'
import { AttachmentIconButton } from './AttachmentIconButton'
import { AttachmentModal, PREVIEW_SUPPORTED_EXTENSION } from './AttachmentModal'
import { AttachmentName } from './AttachmentName'

const extensionIconMap = {
  jpeg: 'jpg',
  jfif: 'jpg',
  pptx: 'ppt',
}

const getExtensionIconName = (extension: Attachment['extension']) => {
  // For unknown file extensions apply "unknown" icon
  if (!extension) return 'unknown'

  // If we have a map for this file extension, show the mapped icon
  if (extensionIconMap[extension]) return extensionIconMap[extension]

  // Otherwise use the extension name as it is
  return extension
}

export const Attachments = ({
  attachments,
  readOnly,
  onAttachmentDelete,
  onAttachmentDownload,
}: AttachmentsProps) => {
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null,
  )

  return (
    <>
      <VStack
        align="baseline"
        spacing={4}
        mt={readOnly ? 4 : 0}
        px={readOnly ? 0 : 6}
      >
        {attachments.map(attachment => {
          const { id, extension, isLoading } = attachment

          const canBePreviewed = PREVIEW_SUPPORTED_EXTENSION.includes(extension)

          const IconComponent =
            icons[getExtensionIconName(extension)] || icons.unknown

          return (
            <HStack
              key={id}
              spacing={3}
              py={2}
              px={4}
              w="full"
              borderRadius="md"
              border="1px solid"
              borderColor="border.base"
              sx={{
                '--attachment-icon-color': 'var(--tribe-colors-border-strong)',

                _hover: {
                  '--attachment-icon-color':
                    'var(--tribe-colors-label-primary)',
                },
              }}
            >
              <IconComponent width={36} height={36} style={{ flexShrink: 0 }} />
              <AttachmentName {...attachment} />
              <HStack spacing={2} ml="auto" style={{ marginLeft: 'auto' }}>
                {readOnly ? (
                  <>
                    {canBePreviewed && (
                      <Tooltip
                        label={
                          <Trans
                            i18nKey="composer:attachment.preview"
                            defaults="Preview"
                          />
                        }
                      >
                        <div>
                          <AttachmentIconButton
                            icon={<EyeLineIcon size="20px" />}
                            aria-label="Preview"
                            onClick={() => setPreviewAttachment(attachment)}
                          />
                        </div>
                      </Tooltip>
                    )}
                    <Tooltip
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
                        onClick={() => onAttachmentDownload?.(attachment)}
                        as="a"
                        href={attachment.downloadUrl}
                        download={attachment.name}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    {isLoading && (
                      <Spinner
                        speed="0.6s"
                        color="label.secondary"
                        thickness="2px"
                        size="md"
                      />
                    )}
                    <Tooltip
                      label={
                        <Trans
                          i18nKey="composer:attachment.delete"
                          defaults="Delete"
                        />
                      }
                    >
                      <div>
                        <AttachmentIconButton
                          icon={<CloseLineIcon size="20px" />}
                          aria-label="Delete"
                          onClick={() => onAttachmentDelete?.(attachment)}
                        />
                      </div>
                    </Tooltip>
                  </>
                )}
              </HStack>
            </HStack>
          )
        })}
      </VStack>
      {previewAttachment && (
        <AttachmentModal
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </>
  )
}
