import { useCallback, useState } from 'react'

import { useApolloClient } from '@apollo/client'

import {
  CreateImagesMutation,
  CreateImagesMutationVariables,
} from 'tribe-api/graphql'
import { CREATE_IMAGES } from 'tribe-api/graphql/media.gql'
import { CreateImageInput, SignedUrl } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'

import { logger } from 'lib/logger'

import { useGenerateMediaUpload } from './useGenerateMediaUpload'

export type UploadedImage = Omit<
  SignedUrl,
  'signedUrl' | '__typename' | 'fields'
>

const useCreateImages = () => {
  const apolloClient = useApolloClient()
  const [isUploading, setUploading] = useState<boolean>(false)

  const toast = useToast()
  const { uploadMedia, handleErrors } = useGenerateMediaUpload()

  const upload = useCallback(
    async (
      input: Array<
        Pick<
          CreateImageInput,
          'cropX' | 'cropY' | 'cropHeight' | 'cropWidth'
        > & {
          imageFile: File
        }
      >,
    ): Promise<UploadedImage[] | undefined> => {
      if (!input?.length) return

      try {
        setUploading(true)

        const { data, errors } = await apolloClient.mutate<
          CreateImagesMutation,
          CreateImagesMutationVariables
        >({
          mutation: CREATE_IMAGES,
          variables: {
            input: input.map(({ imageFile, ...cropData }) => ({
              contentType: imageFile.type,
              ...cropData,
            })),
          },
        })

        if (!data) {
          logger.error('error - mutating createImages', errors)

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        if (data?.createImages?.length !== input.length) {
          logger.error('error - medias are not have same length as files')

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        const resultMedia = await uploadMedia({
          input: input.map(({ imageFile }) => imageFile),
          mutationData: data.createImages,
        })

        setUploading(false)

        return resultMedia
      } catch (errors) {
        setUploading(false)

        handleErrors(errors)
      }
    },
    [apolloClient, toast],
  )

  return {
    upload,
    isUploading,
  }
}

export default useCreateImages
