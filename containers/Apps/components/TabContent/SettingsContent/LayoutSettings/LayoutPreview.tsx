import React from 'react'

import { Box } from '@chakra-ui/react'

import { Card } from 'tribe-components'

import { PostLayoutVariant } from 'containers/Post/components'

const PreviewDimensions: Record<
  PostLayoutVariant,
  Record<'h' | 'w' | 'count', number | string>
> = {
  CARDS: {
    w: '40%',
    h: '54%',
    count: 2,
  },
  LIST: {
    w: '66%',
    h: '33%',
    count: 4,
  },
}

type Props = {
  layout: PostLayoutVariant
}

const LayoutPreview = ({ layout }: Props) => {
  return (
    <Box
      borderRadius={1}
      w="full"
      h={167}
      overflow="hidden"
      pt={4}
      background="bg.secondary"
      border="1px solid"
      borderColor="border.base"
    >
      {[...Array(PreviewDimensions[layout].count)].map((_, index) => (
        <Box // eslint-disable-next-line react/no-array-index-key
          key={index}
          w={PreviewDimensions[layout].w}
          mx="auto"
          mb={2}
          h={PreviewDimensions[layout].h}
        >
          <Card h="full" p={0} />
        </Box>
      ))}
    </Box>
  )
}

export default LayoutPreview
