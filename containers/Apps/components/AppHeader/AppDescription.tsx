import React, { memo } from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import isEqual from 'react-fast-compare'

import { App } from 'tribe-api'
import { Skeleton, Text, useResponsive } from 'tribe-components'

import { AppIcon } from 'containers/Apps/components/AppIcon'

export interface AppDescriptionProps {
  app: App
  loading?: boolean
}

const AppDescription: React.FC<AppDescriptionProps> = ({ app, loading }) => {
  const { isMobile } = useResponsive()
  return (
    <HStack spacing="3" alignItems="start">
      <Skeleton flexShrink={0} isLoaded={!loading}>
        <AppIcon
          app={app}
          size={isMobile ? '8' : '14'}
          data-testid="app-header-image"
        />
      </Skeleton>
      <VStack align="left" spacing="1">
        <Text textStyle="semibold/xlarge" lineHeight={6} color="label.primary">
          {app?.name}
        </Text>
        <Text
          display="flex"
          alignItems="center"
          textStyle="regular/small"
          color="label.secondary"
        >
          {app?.description}
        </Text>
      </VStack>
    </HStack>
  )
}

export default memo(AppDescription, isEqual)
