import React, {
  FC,
  memo,
  forwardRef,
  RefObject,
  useEffect,
  useState,
} from 'react'

import { Box } from '@chakra-ui/react'

import { ComposerRefImperativeHandle, ReactQuillProps } from './@types'
import { Attachments } from './components/Attachment/Attachments'
import ReactQuill from './ReactQuill'
import SlashMenu from './SlashMenu'

const Composer = forwardRef(
  (
    {
      embeds,
      mentions,
      onChange,
      placeholder,
      style,
      value,
      onQuillMount,
      onQuillUnmount,
      attachments = [],
      onAttachmentDelete,
    }: ReactQuillProps,
    forwardedRef: RefObject<ComposerRefImperativeHandle>,
  ): JSX.Element | null => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (forwardedRef?.current) {
        onQuillMount?.()
      }

      return () => {
        onQuillUnmount?.()
      }
    }, [forwardedRef, onQuillMount, onQuillUnmount])

    const modules = () => ({
      magicUrl: true,
    })

    return document ? (
      <>
        <ReactQuill
          embeds={embeds}
          mentions={mentions}
          modules={modules}
          onChange={onChange}
          placeholder={placeholder}
          ref={forwardedRef}
          style={style}
          value={value}
        />
        {mounted && <SlashMenu quill={forwardedRef?.current?.getQuill?.()} />}
        <Box mt={2} overflowY="auto">
          {!!attachments.length && (
            <Attachments
              onAttachmentDelete={onAttachmentDelete}
              readOnly={false}
              attachments={attachments}
            />
          )}
        </Box>
      </>
    ) : null
  },
)

const WrappedComposer: FC<ReactQuillProps> = ({ forwardedRef, ...props }) => (
  <Composer {...props} ref={forwardedRef} />
)

export default memo(WrappedComposer)
