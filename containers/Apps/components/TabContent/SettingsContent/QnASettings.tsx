import React, { FC } from 'react'

import { Box } from '@chakra-ui/react'

import { Text, SkeletonProvider } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import { PostLayoutVariant } from 'containers/Post/components'

import { useResponsive } from 'hooks/useResponsive'

import { BaseSettingsProps } from './@types'
import LayoutSettings from './LayoutSettings'

const QnASettings: FC<BaseSettingsProps> = ({
  settings,
  loading = false,
  update,
}) => {
  const { isMobile } = useResponsive()

  return (
    <SkeletonProvider loading={loading}>
      <Box w="full">
        {!isMobile && (
          <LayoutHeader h="auto" pb={4}>
            <Text textStyle="bold/2xlarge">
              <Trans i18nKey="admin:apps.qna.title" defaults="Q&A" />
            </Text>
          </LayoutHeader>
        )}
        <LayoutSettings
          settings={settings}
          update={update}
          loading={loading}
          initialValue={PostLayoutVariant.LIST}
        />
      </Box>
    </SkeletonProvider>
  )
}

export default QnASettings
