import React, { FC, useEffect, useState } from 'react'

import { ReactQuillProps } from 'containers/Composer/@types'

import ComposerControls, { ComposerControlsProps } from './ComposerControls'

interface ComposerControlsLoaderProps
  extends Pick<ComposerControlsProps, 'onAttachmentSelect'> {
  composerRef: ReactQuillProps['forwardedRef']
}

const ComposerControlsLoader: FC<ComposerControlsLoaderProps> = ({
  composerRef,
  children,
  onAttachmentSelect,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ComposerControls
      onAttachmentSelect={onAttachmentSelect}
      quill={composerRef?.current?.getQuill?.()}
    >
      {children}
    </ComposerControls>
  )
}

export default ComposerControlsLoader
