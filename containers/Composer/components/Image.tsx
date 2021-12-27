import React, { useState, useCallback } from 'react'

import { Box } from '@chakra-ui/react'

import { Media, ThemeTokens } from 'tribe-api'
import { TribeUIProvider, Image, Spinner } from 'tribe-components'

import { ImageBlotClassName } from '../constants'
import { ComposerMediaCompleteEvent } from '../hooks/useMediaUploadStatus'
import ComposerLoading from './Loading'
import ComposerMediaClose from './MediaClose'
import ComposerMediaError from './MediaError'

export interface ComposerImageProps {
  imageProps?: Record<string, string>
  isReadOnly: boolean
  src: string | null
  blobUrl?: string
  themeSettings?: ThemeTokens
  uploadPromise?: Promise<Media>
}

const ComposerImage = ({
  imageProps = {},
  isReadOnly,
  src,
  themeSettings,
  uploadPromise,
  blobUrl,
}: ComposerImageProps) => {
  const [loading, setLoading] = useState(!!uploadPromise)
  const [error, setError] = useState(false)
  const [source, setSource] = useState(src)
  const [dataId, setDataId] = useState(imageProps['data-id'] || null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(blobUrl || null)

  const handleClick = useCallback(e => {
    const { target } = e
    const quillRoot = target.closest('.ql-editor')
    if (quillRoot) {
      quillRoot.dispatchEvent(new CustomEvent(ComposerMediaCompleteEvent))
    }

    const blot = target.closest('p') || target.closest(`.${ImageBlotClassName}`)
    blot.remove()
  }, [])

  if (uploadPromise) {
    uploadPromise
      .then(result => {
        if (!result[0]) return

        const { mediaUrl, mediaId } = result[0]

        setDataId(mediaId)
        setSource(mediaUrl)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
        setPreviewUrl(null)
      })
  }

  return (
    <TribeUIProvider themeSettings={themeSettings as ThemeTokens}>
      {!previewUrl && loading && <ComposerLoading handleClose={handleClick} />}

      {error && <ComposerMediaError handleClose={handleClick} />}

      {!error && !source && previewUrl && (
        <Box
          background="bg.secondary"
          className={ImageBlotClassName}
          mt={5}
          pos="relative"
          display="flex"
          justifyContent="center"
        >
          <>
            <Box
              bgColor="modalOverlay"
              w="inherit"
              h="inherit"
              position="absolute"
            />
            <Box
              pos="absolute"
              right={4}
              bottom={4}
              px={2}
              py={1}
              bgColor="modalOverlay"
              borderRadius="base"
            >
              <Spinner
                color="bg.base"
                size="sm"
                thickness="2px"
                mr={0}
                emptyColor="transparent"
              />
            </Box>
          </>
          <ComposerMediaClose onClick={handleClick} />
          <Image
            width={imageProps?.width ? `${imageProps.width}` : 'auto'}
            height={imageProps?.height ? `${imageProps.height}` : 'auto'}
            src={previewUrl}
            alt=""
            maxHeight={{ base: '70vh', '2xl': 'lg' }}
            objectFit="fill"
          />
        </Box>
      )}

      {source && (
        <Box
          background="bg.secondary"
          className={ImageBlotClassName}
          mt={5}
          pos="relative"
          display="flex"
          justifyContent="center"
        >
          {!isReadOnly && <ComposerMediaClose onClick={handleClick} />}

          <Image
            width={imageProps?.width ? `${imageProps.width}` : 'auto'}
            height={imageProps?.height ? `${imageProps.height}` : 'auto'}
            src={source}
            data-id={dataId}
            alt=""
            maxHeight={{ base: '70vh', '2xl': 'lg' }}
            objectFit="fill"
          />
        </Box>
      )}
    </TribeUIProvider>
  )
}

export default ComposerImage
