import { ChangeEvent, useCallback, useState } from 'react'

import filesize from 'filesize'

import { useToast } from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { useTranslation } from 'tribe-translation'

import { Attachment } from 'containers/Composer/@types'

import useCreateFiles from 'hooks/useCreateFiles'

import { FILE_SIZE_LIMIT } from '../constants'

export const useAttachments = (initialValue: Attachment[] = []) => {
  const [attachments, setAttachments] = useState<Attachment[]>(initialValue)
  const { t } = useTranslation()

  const { upload } = useCreateFiles()
  const toast = useToast()

  const { isEnabled } = useTribeFeature(Features.PostFileAttachments)

  const handleAttachmentSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return

      const files = Array.from(event.target.files)

      const selectedTooLargeFile = files.some(
        file => file.size > FILE_SIZE_LIMIT,
      )

      if (selectedTooLargeFile) {
        toast({
          title: t('composer:attachment.tooLarge.title', 'File too large'),
          description: t(
            'composer:attachment.tooLarge.description',
            "Please upload a file that's less than {{ fileSize }}",
            {
              fileSize: filesize(FILE_SIZE_LIMIT),
            },
          ),
          status: 'error',
        })
        return
      }

      // We want to show list of uploading files immediately
      const tempFileData = files.map(({ name, size }) => ({
        id: `${name}-${size}`,
        url: '',
        downloadUrl: '',
        size,
        extension: name.slice(name.lastIndexOf('.') + 1),
        name,
        // Shows the spinner
        isLoading: true,
        // A property for identifying which files need to be replaced
        // with real data after uploading is done
        isNew: true,
      }))

      // Show uploading files first and then append existing files
      setAttachments(attachments => [...tempFileData, ...attachments])

      const uploadedFiles = await upload(files)

      // If anything went wrong
      if (!uploadedFiles) return

      setAttachments(attachments => [
        ...uploadedFiles.map(
          (
            { mediaId: id, mediaUrl: url, mediaDownloadUrl: downloadUrl },
            index,
          ) => ({
            ...tempFileData[index],
            id,
            url,
            downloadUrl,
            isLoading: false,
          }),
        ),
        ...attachments.filter(
          ({ id }) =>
            // Leave only those that are not inside uploading ones
            !tempFileData.find(({ name, size }) => `${name}-${size}` === id),
        ),
      ])
    },
    [upload],
  )

  const deleteAttachment = useCallback((attachment: Attachment) => {
    setAttachments(attachments =>
      attachments.filter(({ id }) => id !== attachment.id),
    )
  }, [])

  const clearAttachments = useCallback(() => {
    setAttachments([])
  }, [])

  return {
    attachments: isEnabled ? attachments : [],
    deleteAttachment,
    clearAttachments,
    handleAttachmentSelect: isEnabled ? handleAttachmentSelect : undefined,
  }
}
