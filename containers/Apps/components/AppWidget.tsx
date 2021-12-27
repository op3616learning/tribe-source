import React, { useEffect, useState } from 'react'

import {
  Flex,
  HStack,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import CheckIcon from 'remixicon-react/CheckLineIcon'
import ExternalLinkLineIcon from 'remixicon-react/ExternalLinkLineIcon'
import LockFillIcon from 'remixicon-react/LockFillIcon'

import { App, AppInstallation } from 'tribe-api'
import {
  CardDivider,
  Icon,
  Link,
  Skeleton,
  Text,
  useResponsive,
  Button,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { UpgradeTouchpointLink } from 'components/common/UpgradeTouchpointLink'

import { useUpgradeTouchpoint } from 'hooks/useUpgradeTouchpoint'

import { enumI18nPlanName } from 'utils/enums'

export interface AppWidgetProps {
  app: App
  appInstallation?: AppInstallation
  openHighlight?: boolean
}

const Highlight = ({ children }) => (
  <HStack alignItems="end">
    <Icon as={CheckIcon} color="accent.base" />
    <Flex flexWrap="wrap" flexDirection="row" whiteSpace="pre-wrap">
      {children}
    </Flex>
  </HStack>
)

const AppWidget: React.FC<AppWidgetProps> = ({
  app,
  appInstallation,
  openHighlight,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { isUpperPlan } = useUpgradeTouchpoint()
  const [initialLoad, setInitialLoad] = useState(true)
  useEffect(() => {
    // Need a bit of timeout to ensure that this is triggered after `Accordion` had enough time to render with `reduceMotion={false}`
    const initialLoadTimeout = setTimeout(() => setInitialLoad(false), 200)
    return () => clearTimeout(initialLoadTimeout)
  }, [])
  return (
    <VStack spacing="4" data-testid="app-widget" mb={6}>
      <Accordion
        w="full"
        bg="bg.base"
        borderRadius="base"
        transition={['inherit', 'none']}
        defaultIndex={openHighlight ? [0] : []}
        index={isMobile ? undefined : 0}
        allowToggle={isMobile}
        reduceMotion={initialLoad || !isMobile}
      >
        <AccordionItem>
          <>
            <h2>
              <AccordionButton
                px={6}
                cursor={{
                  base: 'pointer',
                  lg: 'default',
                }}
              >
                <Text textStyle="medium/medium">
                  {t('apps:app.tabs.widget.highlights', 'Highlights')}
                </Text>
                <AccordionIcon
                  display={{
                    base: 'block',
                    lg: 'none',
                  }}
                />
              </AccordionButton>
            </h2>
            <AccordionPanel px={6}>
              <CardDivider mt={0} />
              <Skeleton>
                <VStack spacing="4" alignItems="start" mt="6">
                  <HStack alignItems="end">
                    {!isUpperPlan(app?.requiredPlan) ? (
                      <Icon as={CheckIcon} color="accent.base" />
                    ) : (
                      <Icon as={LockFillIcon} color="label.secondary" />
                    )}
                    <VStack alignItems="start" spacing="1">
                      <Flex
                        flexWrap="wrap"
                        flexDirection="row"
                        whiteSpace="pre-wrap"
                      >
                        <Text textStyle="regular/small" color="label.secondary">
                          <Trans
                            i18nKey="apps:app.tabs.widget.available"
                            defaults="Available on {{plan}} Plans"
                            values={{
                              plan: enumI18nPlanName(app?.requiredPlan),
                            }}
                          />
                        </Text>
                      </Flex>
                      {isUpperPlan(app?.requiredPlan) && (
                        <UpgradeTouchpointLink
                          requiredPlan={app?.requiredPlan}
                          data-tracker-noun="App Highlights Upgrade link"
                        />
                      )}
                    </VStack>
                  </HStack>
                  {app?.authorName && app?.authorUrl && (
                    <Highlight>
                      <Text textStyle="regular/small" color="label.secondary">
                        <Trans
                          i18nKey="apps:app.tabs.widget.builtBy"
                          defaults="Built by <authorLink>{{name}}</authorLink>"
                          values={{ name: app.authorName }}
                          components={{
                            authorLink: (
                              <Link
                                href={app?.authorUrl}
                                isExternal
                                color="accent.base"
                              />
                            ),
                          }}
                        />
                      </Text>
                    </Highlight>
                  )}
                  <Highlight>
                    <Text textStyle="regular/small" color="label.secondary">
                      <Trans i18nKey="apps:app.tabs.widget.tos">
                        Covered by our{' '}
                        <Link
                          href={
                            app?.termsOfServiceUrl ||
                            'https://tribe.so/terms-of-service'
                          }
                          target="_blank"
                          isExternal
                          color="accent.base"
                        >
                          terms of service
                        </Link>{' '}
                        and{' '}
                        <Link
                          href={
                            app?.privacyPolicyUrl ||
                            'https://tribe.so/privacy-policy'
                          }
                          isExternal
                          target="_blank"
                          color="accent.base"
                        >
                          privacy policy
                        </Link>
                        .
                      </Trans>
                    </Text>
                  </Highlight>
                </VStack>
              </Skeleton>
              {app.docsUrl && (
                <Skeleton>
                  <CardDivider mt={6} />
                  <HStack alignItems="center">
                    <Button variant="outline" flex={1}>
                      <Link href={app.docsUrl} target="_blank">
                        <HStack alignItems="center" spacing="1">
                          <Icon
                            as={ExternalLinkLineIcon}
                            color="label.primary"
                          />
                          <Text textStyle="medium/medium" color="label.primary">
                            <Trans
                              i18nKey="apps:app.tabs.widget.viewDocumentation"
                              defaults="View documentation"
                            />
                          </Text>
                        </HStack>
                      </Link>
                    </Button>
                  </HStack>
                </Skeleton>
              )}
            </AccordionPanel>
          </>
        </AccordionItem>
      </Accordion>
      {appInstallation && (
        <Flex
          data-testid="app-installation-detail"
          flexWrap="wrap"
          flexDirection="row"
          px="6"
        >
          <Text textStyle="regular/small" color="label.secondary">
            <Trans
              i18nKey="apps:app.tabs.widget.installedBy"
              defaults="App was installed by <installedBy>{{name}}</installedBy> on {{date}}"
              values={{
                name: appInstallation.installedBy?.name,
                date: dayjs(appInstallation?.installedAt).format(
                  'MMMM D, YYYY',
                ),
              }}
              components={{
                installedBy: (
                  <Text
                    textStyle="regular/small"
                    color="label.primary"
                    as="span"
                  />
                ),
              }}
            />
          </Text>
        </Flex>
      )}
    </VStack>
  )
}

export default AppWidget
