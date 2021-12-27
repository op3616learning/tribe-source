import React, { memo } from 'react'

import { Box } from '@chakra-ui/layout'
import { Flex, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import isEqual from 'react-fast-compare'
import CheckFillIcon from 'remixicon-react/CheckboxCircleFillIcon'
import CheckLineIcon from 'remixicon-react/CheckLineIcon'
import LockFillIcon from 'remixicon-react/LockFillIcon'

import { App, AppInstallation, AppInstallationStatus } from 'tribe-api'
import {
  Card,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tag,
  TagLeftIcon,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useUpgradeTouchpoint } from 'hooks/useUpgradeTouchpoint'

import { enumI18nPlanName } from 'utils/enums'

type AppCardProps = {
  app?: App
  appInstallation?: AppInstallation
}

const AppCard: React.FC<AppCardProps> = ({ app, appInstallation }) => {
  const { isUpperPlan } = useUpgradeTouchpoint()

  const { image, name, description, comingSoon, requiredPlan } = app || {}
  return (
    <Card
      flexDirection="column"
      justifyContent="space-between"
      minWidth={300}
      maxW={{ base: '100%', sm: '600px' }}
      height={232}
    >
      <Skeleton
        fallback={
          <>
            <Skeleton borderRadius={0} height="120px" />
            <SkeletonText mt={4} mx={2} spacing={4} noOfLines={2} />
          </>
        }
        justifyContent="spcae-between"
        height="100%"
        flexDirection="column"
        display="flex"
      >
        <Box mb="4">
          {image ? (
            <Image data-testid="app-image" src={image} alt={name} h="9" w="9" />
          ) : (
            <SkeletonCircle size="9" bgColor="bg.secondary" />
          )}
        </Box>
        <Flex flexDirection="column" h="100%" justifyContent="space-between">
          <VStack align="start" spacing="2">
            <Text textStyle="medium/large" color="label.primary">
              {name}
            </Text>
            <Text textStyle="regular/small" color="label.secondary">
              {description}
            </Text>
          </VStack>
          <Wrap>
            {comingSoon ? (
              <WrapItem>
                <Tag
                  borderRadius="full"
                  variant="subtle"
                  bg="info.base"
                  color="info.strong"
                >
                  <Trans i18nKey="apps:app.comingSoon" defaults="Coming soon" />
                </Tag>
              </WrapItem>
            ) : (
              <>
                {appInstallation && (
                  <WrapItem>
                    <Tag
                      data-testid="app-card-installed-tag"
                      borderRadius="full"
                      variant={
                        appInstallation?.status ===
                        AppInstallationStatus.DISABLED
                          ? 'warning'
                          : 'success'
                      }
                    >
                      <TagLeftIcon as={CheckFillIcon} />
                      <Trans
                        i18nKey="apps:app.installed"
                        defaults="Installed"
                      />
                    </Tag>
                  </WrapItem>
                )}
                <WrapItem>
                  <Tag
                    borderRadius="full"
                    variant="subtle"
                    bg="bg.secondary"
                    color="label.secondary"
                  >
                    {!isUpperPlan(requiredPlan) ? (
                      <TagLeftIcon as={CheckLineIcon} color="success.base" />
                    ) : (
                      <TagLeftIcon as={LockFillIcon} />
                    )}
                    {enumI18nPlanName(requiredPlan)}
                  </Tag>
                </WrapItem>
              </>
            )}
          </Wrap>
        </Flex>
      </Skeleton>
    </Card>
  )
}

export default memo(AppCard, isEqual)
