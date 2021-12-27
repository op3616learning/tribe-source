import {
  MutableRefObject,
  RefObject,
  useCallback,
  useImperativeHandle,
} from 'react'

import Quill from 'quill'

import { logger } from 'lib/logger'

import { ComposerRefImperativeHandle } from '../@types'
import { eliminateUnnecessaryHTML } from '../helpers'
import { embedSanitizer } from '../modules/quill-embed/blots/sanitizer'
import { imageSanitizer } from '../modules/quill-image/blots/sanitizer'
import { mentionSanitizer } from '../modules/quill-mention/blots/sanitizer'

interface UseEnrichQuill {
  quillRef: MutableRefObject<Quill>
  forwardedRef: RefObject<ComposerRefImperativeHandle>
  initialHTMLRef: MutableRefObject<string>
}

/**
 * Adds more functionality to Quill's ref.
 * @param quillRef - Original quill object
 * @param forwardedRef - Forwarded ref from parent components (E.g: <Space />)
 * @param initialHTMLRef - Initial rendered html content (not input value but resulted)
 */
const useEnrichQuill = ({
  quillRef,
  forwardedRef,
  initialHTMLRef,
}: UseEnrichQuill) => {
  const sanitizeContent = useCallback(() => {
    try {
      const editor = quillRef.current?.root
      const ops = quillRef.current?.getContents()?.ops
      const sanitizer = {
        image: false,
        embed: false,
        mention: false,
      }
      ops.forEach(op => {
        if (op?.insert?.image) {
          sanitizer.image = true
        }
        if (op?.insert?.embed) {
          sanitizer.embed = true
        }
        if (op?.insert?.mention) {
          sanitizer.mention = true
        }
      })

      if (sanitizer.image) {
        imageSanitizer(editor)
      }

      if (sanitizer.embed) {
        embedSanitizer(editor)
      }

      if (sanitizer.mention) {
        mentionSanitizer(editor)
      }
    } catch (e) {
      logger.error('Error while sanitizing composer content', e.message)
    }
  }, [quillRef])

  useImperativeHandle(
    forwardedRef,
    (): ComposerRefImperativeHandle => ({
      clear: () => {
        if (quillRef.current) {
          quillRef.current.setText('')
        }
      },
      isEmpty: (): boolean => {
        try {
          return (
            JSON.stringify(quillRef.current.getContents()) ===
            '{"ops":[{"insert":"\\n"}]}'
          )
        } catch (e) {
          logger.error('Error while checking quill isEmpty', e.message)
          return false
        }
      },
      getQuill: (): Quill => quillRef.current,
      focus: () => {
        if (quillRef.current) {
          quillRef.current.focus()
        }
      },
      getEditorHTML: () => {
        try {
          sanitizeContent()
          return quillRef.current?.root.innerHTML
        } catch (e) {
          logger.error(
            'Error while trying to get the html of the editor',
            e.message,
          )
        }
      },
      isTouched: () => {
        // Quill content's actual HTML
        let currentHTML = quillRef.current?.root.innerHTML.trim()

        if (typeof currentHTML !== 'string') return false

        currentHTML = eliminateUnnecessaryHTML(currentHTML)

        const initialHTML = eliminateUnnecessaryHTML(initialHTMLRef.current)

        return initialHTML !== currentHTML
      },
    }),
    [initialHTMLRef, quillRef, sanitizeContent],
  )
}

export default useEnrichQuill
