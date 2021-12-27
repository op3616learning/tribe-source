import React from 'react'

import { Flex } from '@chakra-ui/react'
import CheckLineIcon from 'remixicon-react/CheckLineIcon'

import { NonIdealState } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export const PendingPostsEmpty = () => {
  const { t } = useTranslation()
  return (
    <Flex align="center" justify="center" height="70vh">
      <NonIdealState
        icon={<CheckLineIcon />}
        title={t('common:profile.feed.empty.title', 'No posts')}
        description={t(
          'admin:moderation.pendingPosts.empty',
          'You have no pending posts to review.',
        )}
      ></NonIdealState>
    </Flex>
  )
}
