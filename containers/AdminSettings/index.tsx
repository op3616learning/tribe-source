import React, { useEffect } from 'react'

import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { CenterLayout } from 'components/Layout'

import NetworkPendingPosts from 'containers/Moderation/PendingPosts/NetworkPendingPosts'
import SpacePendingPosts from 'containers/Moderation/PendingPosts/SpacePendingPosts'

import { useSpace } from 'hooks/space/useSpace'
import { useResponsive } from 'hooks/useResponsive'

import {
  NetworkAnalytics,
  NetworkDomainSetting,
  NetworkGeneralSetting,
  NetworkMembersSetting,
  SpaceGeneralSettings,
  SpaceMembersSettings,
  SpaceNotificationsSettings,
} from './containers'
import NetworkAuthenticationSettings from './containers/network/authentication/index'
import useReport from './hooks/useReport'

const AdminAreaContainer = () => {
  const { query } = useRouter()
  const { section, 'space-slug': spaceSlug } = query
  const { isSidebarOpen, mobileHeader } = useResponsive()

  const slug = spaceSlug ? String(spaceSlug) : null

  const { space } = useSpace({
    variables: {
      slug,
    },
    skip: !spaceSlug,
  })
  const spaceId = space?.id || ''
  useEffect(() => {
    if (isSidebarOpen) return

    mobileHeader.setRight(null)
  }, [isSidebarOpen, mobileHeader])

  if (section === 'analytics') {
    return (
      <Box w="full" my={8} mx="auto" px={6}>
        <NetworkAnalytics getAnalytics={useReport} spaceId={spaceId} />
      </Box>
    )
  }

  // If it's space settings
  if (spaceSlug) {
    if (section === 'members') {
      return (
        <CenterLayout maxW="2xl">
          <SpaceMembersSettings slug={slug as string} />
        </CenterLayout>
      )
    }

    if (section === 'pending-posts') {
      return (
        <CenterLayout maxW="2xl">
          <SpacePendingPosts slug={slug as string} />
        </CenterLayout>
      )
    }

    if (section === 'notifications') {
      return (
        <CenterLayout maxW="2xl">
          <SpaceNotificationsSettings slug={slug as string} />
        </CenterLayout>
      )
    }

    return (
      <CenterLayout maxW="2xl">
        <SpaceGeneralSettings slug={slug as string} />
      </CenterLayout>
    )
  }
  // If it's administration
  if (section === 'members') {
    return (
      <CenterLayout maxW="2xl">
        <NetworkMembersSetting />
      </CenterLayout>
    )
  }
  if (section === 'domain') {
    return (
      <CenterLayout maxW="2xl">
        <NetworkDomainSetting />
      </CenterLayout>
    )
  }
  if (section === 'authentication') {
    return (
      <CenterLayout maxW="2xl">
        <NetworkAuthenticationSettings />
      </CenterLayout>
    )
  }
  if (section === 'analytics') {
    return (
      <CenterLayout>
        <NetworkAnalytics getAnalytics={useReport} spaceId={spaceId} />
      </CenterLayout>
    )
  }
  if (section === 'pending-posts') {
    return (
      <CenterLayout maxW="2xl">
        <NetworkPendingPosts />
      </CenterLayout>
    )
  }
  return (
    <CenterLayout maxW="2xl">
      <NetworkGeneralSetting />
    </CenterLayout>
  )
}

export default AdminAreaContainer
