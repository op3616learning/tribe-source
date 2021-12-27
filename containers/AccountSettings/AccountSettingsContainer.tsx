import React, { useEffect } from 'react'

import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { CenterLayout } from 'components/Layout'

import LoginSettings from 'containers/Network/Login/Settings'

import { useResponsive } from 'hooks/useResponsive'

import { NotificationSettings } from './NotificationSettings'

export const AccountSettingsContainer = () => {
  const { query } = useRouter()
  const { section } = query

  const { isSidebarOpen, mobileHeader } = useResponsive()

  useEffect(() => {
    if (isSidebarOpen) return

    mobileHeader.setRight(null)
  }, [isSidebarOpen, mobileHeader])

  let content: JSX.Element | null = null

  if (section === 'login') {
    content = <LoginSettings />
  } else if (section === 'notifications') {
    content = <NotificationSettings />
  } else {
    content = <LoginSettings />
  }

  return (
    <CenterLayout pt={[0, 8]}>
      <Box>{content}</Box>
    </CenterLayout>
  )
}
