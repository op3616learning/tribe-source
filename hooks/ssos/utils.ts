import { SsoType } from 'tribe-api/interfaces'

import { getRuntimeConfigVariable } from 'utils/config'

export const getSsoCallbackUrl = (
  type,
  domain: string,
  redirect?: string,
): string => {
  const SsoCallbackUrl = getRuntimeConfigVariable('SHARED_SSOS_CALLBACK_URL')
  let callbackUrl
  if (SsoCallbackUrl) {
    if (type === SsoType.OAUTH2) {
      callbackUrl = `https://${domain}/ssos/redirect${
        redirect ? `?redirect_uri=${redirect}` : ''
      }`
    } else {
      callbackUrl = `${SsoCallbackUrl}?redirect_uri=${redirect || '/'}`
    }
  }

  return callbackUrl
}
