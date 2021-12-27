import React from 'react'

import { IconButton, IconButtonProps } from 'tribe-components'

export const AttachmentIconButton = (props: IconButtonProps) => (
  <IconButton
    px={0}
    size="sm"
    _hover={{
      bg: 'bg.secondary',
    }}
    cursor="pointer"
    color="var(--attachment-icon-color)"
    {...props}
  />
)
