import React, { FC } from 'react'

import { Box, BoxProps } from '@chakra-ui/react'

const MobileFullWidth: FC<BoxProps> = ({ children, ...rest }) => (
  <Box mx={[-4, 0]} {...rest}>
    {children}
  </Box>
)

export default MobileFullWidth
