/* eslint-disable no-console */
import { IncomingMessage, ServerResponse } from 'http'

import Cookies from 'cookies'

import { AuthToken } from 'tribe-api'

const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'
const AccessTokenMaxAge = 7 * 24 * 60 * 60 * 1000 // one week
const RefreshTokenMaxAge = 12 * 30 * 24 * 60 * 60 * 1000 // one year

export const getTokens = ({ req, res }) => {
  const cookies = new Cookies(req, res)
  return {
    accessToken: cookies.get(ACCESS_TOKEN),
    refreshToken: cookies.get(REFRESH_TOKEN),
  }
}

export const setSSRAuthCookies = ({
  accessToken,
  refreshToken,
  req,
  res,
}: {
  req: IncomingMessage
  res: ServerResponse
  accessToken: AuthToken['accessToken']
  refreshToken: AuthToken['refreshToken']
}): void => {
  try {
    const cookies = new Cookies(req, res)
    cookies.set(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      maxAge: AccessTokenMaxAge,
    })

    cookies.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: RefreshTokenMaxAge,
    })
  } catch (e) {
    console.error('error setting cookies', e)
  }
}

export const resetSSRAuthCookies = ({
  req,
  res,
}: {
  req: IncomingMessage
  res: ServerResponse
}) => {
  const cookies = new Cookies(req, res)
  cookies.set(ACCESS_TOKEN, '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })
  cookies.set(REFRESH_TOKEN, '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })
}
