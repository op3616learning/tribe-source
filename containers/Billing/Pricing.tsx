import React from 'react'

import { Box, chakra, Flex, HStack, VStack } from '@chakra-ui/react'
import CheckIcon from 'remixicon-react/CheckLineIcon'

import { Price } from 'tribe-api'
import { Button, Card, Icon, Text } from 'tribe-components'
import { Trans, withTranslation } from 'tribe-translation'

export enum LevelStatus {
  DOWNGRADE = 'DOWNGRADE',
  CURRENT = 'CURRENT',
  UPGRADE = 'UPGRADE',
}

type PricingProps = {
  name: string
  price: string | Price
  priceDetails?: string
  description: string
  levelStatus?: LevelStatus
  isPopular?: boolean
  ctaText: string
  features?: string[]
  onClick: () => void
}

const cardStyles = {
  container: {
    position: 'relative' as const,
    borderWidth: '2px',
    borderRadius: [0, 4],
    borderStyle: 'solid',
  },
  mostPoular: {
    position: 'absolute' as const,
    backgroundColor: 'accent.lite',
    borderRadius: 'md',
  },
}

export const PricingPrice = ({ price }: { price: string | Price }) => {
  if (typeof price === 'string') {
    return (
      <Text textStyle="regular/2xlarge" color="label.primary">
        {price}
      </Text>
    )
  }
  if (price.__typename === 'Price') {
    return (
      <Text color="label.primary">
        <chakra.span textStyle="regular/2xlarge">
          {price.formattedValue}
        </chakra.span>
        &nbsp;
        <chakra.span textStyle="regular/medium">USD&nbsp;/&nbsp;mo</chakra.span>
      </Text>
    )
  }

  return null
}

const Pricing = ({
  name,
  price,
  priceDetails,
  description,
  levelStatus = LevelStatus.CURRENT,
  isPopular,
  ctaText,
  features,
  onClick,
}: PricingProps) => {
  let buttonType
  switch (levelStatus) {
    case LevelStatus.CURRENT:
      buttonType = 'base'
      break
    case LevelStatus.UPGRADE:
      buttonType = 'primary'
      break
    case LevelStatus.DOWNGRADE:
    default:
      buttonType = 'secondary'
      break
  }
  return (
    <Flex
      {...cardStyles.container}
      borderColor={isPopular ? 'accent.base' : 'transparent'}
    >
      <Card
        h="492px"
        minW={{ base: '100%', sm: '240px' }}
        flexDirection="column"
        justifyContent="space-between"
        display="flex"
        borderColor={isPopular ? 'accent.base' : 'transparent'}
      >
        <VStack align="start" spacing="5">
          <Text textStyle="bold/2xlarge" color="label.primary">
            {name}
          </Text>
          <VStack align="start" spacing="2">
            <PricingPrice price={price} />
            <Text textStyle="medium/small" color="label.secondary">
              {priceDetails}
            </Text>
          </VStack>
          <Text textStyle="medium/small" color="label.primary">
            {description}
          </Text>
          <VStack align="start" spacing="5">
            {features?.map(feature => (
              <HStack spacing="2" key={feature}>
                <Icon as={CheckIcon} />
                <Text textStyle="medium/small" color="label.primary">
                  {feature}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
        <Button
          data-testid={`${name}-button`}
          buttonType={buttonType}
          onClick={onClick}
          disabled={levelStatus === LevelStatus.CURRENT}
          w="full"
        >
          {ctaText}
        </Button>
        {isPopular && (
          <Box top={-4} left={6} px={3} py={2} {...cardStyles.mostPoular}>
            <Text textStyle="medium/medium" color="accent.base">
              <Trans
                i18nKey="billing.pricing.popular"
                defaults="Most Popular"
              />
            </Text>
          </Box>
        )}
      </Card>
    </Flex>
  )
}

export default withTranslation('billing')(Pricing)
