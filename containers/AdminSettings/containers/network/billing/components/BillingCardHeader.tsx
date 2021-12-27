import React from 'react'

import { Box } from '@chakra-ui/react'

import { Button, ButtonProps, Text } from 'tribe-components'

interface BillingCardHeaderProps {
  buttonText?: ButtonProps['children']
  onButtonClick?: ButtonProps['onClick']
  pb?: number
}

export const BillingCardHeader: React.FC<BillingCardHeaderProps> = ({
  buttonText,
  children,
  onButtonClick,
  pb = 4,
}) => (
  <Box pb={pb} position="relative">
    <Text textStyle="medium/large" color="label.primary">
      {children}
    </Text>

    {buttonText && (
      <Box position="absolute" top={0} right={0}>
        <Button
          buttonType="secondary"
          onClick={onButtonClick}
          data-testid="network-login-di"
        >
          {buttonText}
        </Button>
      </Box>
    )}
  </Box>
)
