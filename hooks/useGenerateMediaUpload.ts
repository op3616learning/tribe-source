import { useCallback } from 'react'

import axios from 'axios'

import { SignedUrl } from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import { parseXMLErrorMessage } from 'utils/xml.utils'

export type UploadedMedia = Omit<
  SignedUrl,
  'signedUrl' | '__typename' | 'fields'
>

type UploadMediaParams = {
  input: any
  mutationData: any
}

export const useGenerateMediaUpload = () => {
  const api = axios.create({
    validateStatus: undefined,
  })
  const toast = useToast()
  const { t } = useTranslation()

  const uploadMedia = useCallback(
    async ({ input, mutationData }: UploadMediaParams) => {
      const resultMedia: UploadedMedia[] = []

      const promises = mutationData.map((media, index) => {
        try {
          const file = input[index]
          const { fields } = media
          const formData = new FormData()
          const parsedFields = JSON.parse(fields)

          // The order of appended key-value into the formData matters.
          Object.entries(parsedFields).forEach(([key, value]) => {
            formData.append(key, String(value))
          })
          formData.append('Content-Type', file.type)
          formData.append('file', file)

          return api
            .post(media.signedUrl, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(res => {
              if (res?.status >= 200 && res?.status < 300) {
                resultMedia.push({
                  mediaId: media.mediaId,
                  mediaUrl: media.mediaUrl,
                  mediaDownloadUrl: media.mediaDownloadUrl,
                  urls: media.urls,
                })
              } else {
                const xmlErrorMessage = parseXMLErrorMessage(res?.data)

                if (xmlErrorMessage) {
                  toast({
                    title: t('common:error', 'Error'),
                    description: xmlErrorMessage,
                    status: 'error',
                    isClosable: true,
                  })
                }

                logger.error(
                  'error - uploading media with status code of %s',
                  res?.status,
                  media,
                )
              }
            })
            .catch(e => {
              logger.error('error - uploading media', media, e)

              toast({
                title: t('common:error', 'Error'),
                description: t(
                  'common:errorUploading',
                  'Something went wrong. Please try again later.',
                ),
                status: 'error',
                isClosable: true,
              })

              return undefined
            })
        } catch (e) {
          logger.error('error - upload media', media, e)

          toast({
            title: t('common:error', 'Error'),
            description: t(
              'common:errorUploading',
              'Something went wrong. Please try again later.',
            ),
            status: 'error',
            isClosable: true,
          })

          return undefined
        }
      })

      await Promise.all(promises.filter(Boolean))

      return resultMedia
    },
    [api, toast],
  )

  const handleErrors = useCallback(
    errors => {
      if (errors && Array.isArray(errors) && errors?.length > 0) {
        errors?.forEach(({ message }): void => {
          if (message) {
            toast({
              title: t('common:error', 'Error'),
              description: message,
              status: 'error',
              isClosable: true,
            })
          }
        })
      } else if (errors && !Array.isArray(errors) && errors?.message) {
        toast({
          title: t('common:error', 'Error'),
          description: errors?.message,
          status: 'error',
          isClosable: true,
        })
      }

      logger.error('error - uploading', errors)
    },
    [t, toast],
  )

  return {
    uploadMedia,
    handleErrors,
  }
}
