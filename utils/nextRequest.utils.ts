import { IncomingMessage } from 'http'
import Url from 'url'

import absoluteUrl from 'next-absolute-url'

import { logger } from 'lib/logger'

export const getReqHostname = (
  req?: IncomingMessage,
): string | undefined | null => {
  try {
    return Url.parse(absoluteUrl(req).origin).hostname
  } catch (e) {
    logger.error(
      'error - parsing nextjs req',
      e,
      '\nheaders:',
      JSON.stringify(req?.headers),
    )

    return undefined
  }
}
