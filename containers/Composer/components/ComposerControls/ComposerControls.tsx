import React, {
  ChangeEvent,
  CSSProperties,
  FC,
  useCallback,
  useState,
} from 'react'

import { Box, HStack } from '@chakra-ui/react'
import Quill from 'quill'
import AddLineIcon from 'remixicon-react/AddLineIcon'
import AttachmentLineIcon from 'remixicon-react/AttachmentLineIcon'
import EmotionLineIcon from 'remixicon-react/EmotionLineIcon'
import Image2LineIcon from 'remixicon-react/Image2LineIcon'

import { EmojiPickerResult, EmojiPicker } from 'tribe-components'

import useEmbed from 'containers/Composer/hooks/useEmbed'
import useInsertEmoji from 'containers/Composer/hooks/useInsertEmoji'

import useToggle from 'hooks/useToggle'

import Menu, { MenuItemType } from '../Menu'
import { ComposerIconButton } from './ComposerIconButton'

export interface ComposerControlsProps {
  quill: Quill | null
  onAttachmentSelect?: (event: ChangeEvent<HTMLInputElement>) => void
}

const menuTriggerStyles: CSSProperties = {
  position: 'relative',
  top: 0,
  left: 0,
}

const ComposerControls: FC<ComposerControlsProps> = ({
  quill,
  children,
  onAttachmentSelect,
}) => {
  const [isMenuVisible, toggleMenu] = useToggle(false)
  const quillId = (quill?.container as HTMLElement)?.id
  const attachmentInputId = `attachment-input-${quillId}`
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { insertEmoji } = useInsertEmoji(quill)

  const { embed } = useEmbed()

  const onEmojiSelect = useCallback(
    (emoji: EmojiPickerResult) => {
      quill.focus()

      const cursor = quill.getSelection()
      insertEmoji(emoji, cursor.index)
      setShowEmojiPicker(false)
    },
    [insertEmoji, quill],
  )

  const selectImage = useCallback(() => {
    const fileInput = document.getElementById(`${quillId}-fileInput`)
    if (fileInput) fileInput.click()
  }, [quillId])

  const onMenuItemClick = (menuItemType: MenuItemType) => {
    setShowEmojiPicker(menuItemType === MenuItemType.Emoji)
  }

  const handleEmbedPaste = useCallback(
    (value: string) => {
      return new Promise((resolve, reject) => {
        embed(value)
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    [embed],
  )

  const onAttachmentInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onAttachmentSelect?.(event)

      event.target.value = ''
    },
    [onAttachmentSelect],
  )

  if (!quill) {
    return null
  }

  const slashMenuTrigger = (
    <ComposerIconButton
      icon={AddLineIcon}
      aria-label="Options"
      onClick={toggleMenu}
      position={isMenuVisible ? 'absolute' : 'relative'}
    />
  )

  return (
    <HStack
      spacing={2}
      pr={2}
      // Prevents tag hashes from oveflowing
      overflow="hidden"
    >
      {isMenuVisible ? (
        <Box>
          <Menu
            quill={quill}
            hide={toggleMenu}
            triggerStyles={menuTriggerStyles}
            onMenuItemClick={onMenuItemClick}
            handleEmbedPaste={handleEmbedPaste}
          >
            {slashMenuTrigger}
          </Menu>
        </Box>
      ) : (
        slashMenuTrigger
      )}

      <EmojiPicker shouldShow={showEmojiPicker} onSelect={onEmojiSelect}>
        <ComposerIconButton icon={EmotionLineIcon} aria-label="Emoji" />
      </EmojiPicker>
      <ComposerIconButton
        icon={Image2LineIcon}
        aria-label="Image"
        onClick={selectImage}
      />
      {typeof onAttachmentSelect === 'function' && (
        <>
          <ComposerIconButton
            icon={AttachmentLineIcon}
            aria-label="Attachment"
            as="label"
            cursor="pointer"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            htmlFor={attachmentInputId}
          />
          <Box
            as="input"
            onChange={onAttachmentInputChange}
            id={attachmentInputId}
            type="file"
            display="none"
            multiple
          />
        </>
      )}
      {children}
    </HStack>
  )
}

export default ComposerControls
