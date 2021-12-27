import Quill from 'quill'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

import useCreateImages, { UploadedImage } from 'hooks/useCreateImages'

import {
  ComposerMediaCompleteEvent,
  ComposerMediaCreateEvent,
} from './hooks/useMediaUploadStatus'

const useComposerFile = () => {
  const { upload: uploadMedia } = useCreateImages()
  const { themeSettings } = useThemeSettings()

  const insertImage = (
    quill: Quill,
    uploadPromise: Promise<any>,
    blobUrl?: string,
  ) => {
    if (!uploadPromise) return

    const range = quill.getSelection(true)

    quill.insertEmbed(
      range?.index,
      'image',
      { uploadPromise, themeSettings, blobUrl },
      'user',
    )
    // eslint-disable-next-line i18next/no-literal-string
    quill.setSelection(range?.index + 1, 0, 'silent')
  }

  const upload = async (
    files: FileList,
    quill?: Quill | null,
  ): Promise<UploadedImage[] | undefined> => {
    let blobUrl = ''
    try {
      if (!files) {
        return
      }
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCreateEvent))
      const uploadFiles = Array.from(files).map(f => ({ imageFile: f }))
      const file = uploadFiles?.[0]?.imageFile
      if (file?.type?.includes('image/')) {
        blobUrl = window.URL.createObjectURL(file)
      }

      const uploadMediaPromise = uploadMedia(uploadFiles)

      if (quill) {
        insertImage(quill, uploadMediaPromise, blobUrl)
      }

      await uploadMediaPromise
      window.URL.revokeObjectURL(blobUrl)
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCompleteEvent))
    } catch (e) {
      window.URL.revokeObjectURL(blobUrl)
      // Feedback and error handling happens elsewhere.
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCompleteEvent))
    }
  }

  return {
    upload,
    insertImage,
  }
}

export default useComposerFile
