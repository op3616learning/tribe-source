import { useCallback, useState } from 'react'

import { useApolloClient } from '@apollo/client'

import {
  CREATE_FILES,
  CreateFilesMutation,
  CreateFilesMutationVariables,
  SignedUrl,
} from 'tribe-api'
import { useToast } from 'tribe-components'

import { logger } from 'lib/logger'

import { useGenerateMediaUpload } from './useGenerateMediaUpload'

export type UploadedFile = Omit<
  SignedUrl,
  'signedUrl' | '__typename' | 'fields'
>

const useCreateFiles = () => {
  const apolloClient = useApolloClient()
  const [isUploading, setUploading] = useState<boolean>(false)
  const toast = useToast()
  const { uploadMedia, handleErrors } = useGenerateMediaUpload()

  const upload = useCallback(
    async (input: FileList | File[]): Promise<UploadedFile[] | undefined> => {
      if (!input?.length) return

      try {
        setUploading(true)

        const { data, errors } = await apolloClient.mutate<
          CreateFilesMutation,
          CreateFilesMutationVariables
        >({
          mutation: CREATE_FILES,
          variables: {
            input: Array.from(input).map(file => ({
              contentType: file.type,
              name: file.name,
              extension: file.name.split('.').pop() || '',
              size: file.size,
            })),
          },
        })

        if (!data) {
          logger.error('error - mutating createFiles', errors)

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        if (data?.createFiles?.length !== input.length) {
          logger.error('error - medias are not have same length as files')

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        const resultMedia = await uploadMedia({
          input,
          mutationData: data.createFiles,
        })

        setUploading(false)

        return resultMedia
      } catch (errors) {
        setUploading(false)

        handleErrors(errors)

        return []
      }
    },
    [apolloClient, toast],
  )

  return {
    upload,
    isUploading,
  }
}

export default useCreateFiles
