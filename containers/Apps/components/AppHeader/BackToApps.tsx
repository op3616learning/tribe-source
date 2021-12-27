import React, { FC, useCallback } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { Icon, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

export const BackToApps: FC = () => {
  const { query } = useRouter()
  const spaceSlug = query['space-slug']

  const getAs = useCallback(() => {
    if (!spaceSlug) {
      return '/admin/network/apps/'
    }
    return `/admin/space/${spaceSlug}/apps/`
  }, [spaceSlug])

  return (
    <Text color="label.secondary" mb={5}>
      <NextLink href={getAs()} passHref>
        <Link data-testid="app-back-btn" variant="unstyled">
          <Icon as={ArrowLeftLineIcon} mr={2} />
          <Trans i18nKey="apps:app.header.back" defaults="Back to all apps" />
        </Link>
      </NextLink>
    </Text>
  )
}
