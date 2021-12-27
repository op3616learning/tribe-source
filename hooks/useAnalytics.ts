import * as Sentry from '@sentry/node'

import { AuthToken } from 'tribe-api/interfaces'

import { getRuntimeConfigVariable } from 'utils/config'

import useAuthToken from './useAuthToken'
import useSnowplowTracker from './useSnowplowTracker'

const useAnalytics = () => {
  const { authToken } = useAuthToken()

  const dsn = getRuntimeConfigVariable('SHARED_SENTRY_DSN')

  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [], // TODO: add an integration
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    })
    Sentry.setTag('user.networkId', authToken?.networkPublicInfo?.id || '')
    Sentry.setTag('user.networkName', authToken?.networkPublicInfo?.name || '')
    Sentry.setTag(
      'user.networkDomain',
      authToken?.networkPublicInfo?.domain || '',
    )
    Sentry.setTag('user.roleType', authToken?.member?.role?.type || '')
    Sentry.setTag('user.status', authToken?.member?.status || '')
    Sentry.setUser({
      name: authToken?.member?.name || '',
      id: authToken?.member?.id || '',
      email: authToken?.member?.email || '',
    })
  }

  return useSnowplowTracker('tribe-analytics', authToken as AuthToken)
}

export default useAnalytics
