import React, { memo } from 'react'

import { Grid } from '@chakra-ui/react'
import NextLink from 'next/link'
import isEqual from 'react-fast-compare'

import { App } from 'tribe-api'
import { Link, SkeletonProvider } from 'tribe-components'

import useGetNetworkAppInstallations from '../hooks/useGetNetworkAppInstallations'
import AppCard from './AppCard'

const staticProps = {
  grid: {
    templateColumns: ['auto', 'repeat(auto-fit, minmax(350px, 1fr))'],
    gap: 6,
    boxShadow: 'none',
    mx: 0,
  },
}
export type AppsGridProps = {
  apps: App[]
  loading: boolean
}

const NetworkAppsGrid: React.FC<AppsGridProps> = ({
  loading = false,
  apps,
}) => {
  const { appInstallations: networkAIs } = useGetNetworkAppInstallations()
  const findAppInstallation = app => {
    return networkAIs.find(ai => ai.app?.slug === app?.slug)
  }

  return (
    <SkeletonProvider loading={loading}>
      <Grid justifyContent="center" {...staticProps.grid}>
        {/* Loading state */}
        {loading &&
          [...Array(3)].map((_, index) => (
            // It's a static array, so we can use indexes as keys
            // eslint-disable-next-line react/no-array-index-key
            <AppCard key={index} />
          ))}

        {/* Actual cards */}
        {apps.map(app => (
          /* @TODO - join handler */
          <NextLink
            key={app?.slug}
            href={`/admin/network/apps/${app?.slug}`}
            passHref
          >
            <Link display="inline-block">
              {/* TODO: Remove installed bypass */}
              <AppCard app={app} appInstallation={findAppInstallation(app)} />
            </Link>
          </NextLink>
        ))}
      </Grid>
    </SkeletonProvider>
  )
}

export default memo(NetworkAppsGrid, isEqual)
