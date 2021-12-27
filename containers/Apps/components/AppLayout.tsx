import React, { FC } from 'react'

import { Flex } from '@chakra-ui/layout'
import { Box, BoxProps } from '@chakra-ui/react'

export const AppLayout: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Flex
      flexFlow={{
        base: 'column-reverse',
        lg: 'wrap-reverse',
      }}
      m={[0, -3]}
      {...rest}
    >
      {children}
    </Flex>
  )
}

export const AppLayoutMain: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      flex="2"
      minW={{
        base: 'unset',
        lg: '440px',
      }}
      p={[0, 3]}
      {...rest}
    >
      {children}
    </Box>
  )
}

export const AppLayoutHighlights: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box flex="1" minW="292px" p={[0, 3]} {...rest}>
      {children}
    </Box>
  )
}
