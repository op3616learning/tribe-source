import React, { useCallback, useRef } from 'react'

import { ComposerRefImperativeHandle } from 'containers/Composer/@types'

export const useComposer = (): [
  { current: ComposerRefImperativeHandle | null },
  () => void,
] => {
  const inputRef: React.Ref<ComposerRefImperativeHandle> = useRef(null)

  const setFocus = useCallback(() => {
    const quill = inputRef?.current?.getQuill()

    quill?.update()
    quill?.blur()
    quill?.focus()
  }, [])

  return [inputRef, setFocus]
}
