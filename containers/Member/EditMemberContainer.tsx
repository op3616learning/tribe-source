import React, { useContext, useEffect, useState } from 'react'

import { HStack, Stack, VStack } from '@chakra-ui/react'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'

import { hasActionPermission } from 'tribe-api'
import { Card, IconButton, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { LayoutHeader, FeedLayout, FeedLayoutMain } from 'components/Layout'

import CookieConsentPreferencesModal from 'containers/Apps/components/CookieConsent/CookieConsentPreferencesModal'
import { CookieContext } from 'containers/Apps/components/CookieContext'
import ErrorContainer from 'containers/Error'
import { EditMember } from 'containers/Member/components/EditMember'
import useGetMember from 'containers/Member/hooks/useGetMember'

import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

const EditMemberContainer = ({ memberId }: { memberId: string }) => {
  const { member, loading, error, isInitialLoading } = useGetMember(memberId)
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false)

  const { isMobile, isSidebarOpen, mobileHeader } = useResponsive()
  const { isCookieInstalled } = useContext(CookieContext)
  useEffect(() => {
    if (isSidebarOpen) return

    mobileHeader.setRight(null)
  }, [isSidebarOpen, mobileHeader])

  const { authorized: canUpdateMember } = hasActionPermission(
    member?.authMemberProps?.permissions || [],
    'updateMember',
  )

  if (error || canUpdateMember === false) {
    if (error) {
      logger.error(error)
    }

    return canUpdateMember === false ? (
      <ErrorContainer
        error={{
          code: 102,
        }}
      />
    ) : (
      <ErrorContainer error={error} />
    )
  }

  return (
    <FeedLayout>
      <FeedLayoutMain>
        <Stack spacing={6}>
          {!isMobile && (
            <LayoutHeader h="auto" pb={0} pl={{ base: 6, sm: 0 }}>
              <VStack alignItems="flex-start">
                <Text
                  data-testid="profile-settings-page-title"
                  textStyle="bold/2xlarge"
                >
                  <Trans
                    i18nKey="common:profile.settings"
                    defaults="Profile Settings"
                  />
                </Text>
              </VStack>
            </LayoutHeader>
          )}
          <Card>
            <EditMember
              isInitialLoading={isInitialLoading}
              loading={loading}
              member={member}
            />
          </Card>
          {isCookieInstalled && (
            <>
              <Text
                px={[6, 0]}
                textStyle="regular/large"
                color="label.secondary"
              >
                <Trans i18nKey="common:profile.privacy" defaults="Privacy" />
              </Text>
              <Card onClick={() => setIsCookieModalOpen(true)} cursor="pointer">
                <HStack justifyContent="space-between">
                  <VStack spacing={1} alignItems="start">
                    <Text textStyle="regular/regular" color="label.primary">
                      <Trans
                        i18nKey="common:profile.cookie.title"
                        defaults="Cookie Consent"
                      />
                    </Text>
                    <Text textStyle="regular/small" color="label.secondary">
                      <Trans
                        i18nKey="common:profile.cookie.description"
                        defaults="Functional, Analytics, Tracking"
                      />
                    </Text>
                  </VStack>
                  <IconButton
                    aria-label="cookie-consent"
                    icon={<ArrowRightSLineIcon size="16px" />}
                  />
                  <CookieConsentPreferencesModal
                    isOpen={isCookieModalOpen}
                    onClose={() => setIsCookieModalOpen(false)}
                  />
                </HStack>
              </Card>
            </>
          )}
        </Stack>
      </FeedLayoutMain>
    </FeedLayout>
  )
}

export default EditMemberContainer
