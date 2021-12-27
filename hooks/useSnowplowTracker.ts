import { useMemo } from 'react'

import { AuthToken } from 'tribe-api'

import {
  actorDataContext,
  SnowplowTracker,
  targetDataContext,
} from 'lib/snowplow'

function getLang() {
  if (typeof window === 'undefined') return
  if (Array.isArray(navigator?.languages)) return navigator.languages[0]
  return navigator?.language
}

const trackers: Record<string, SnowplowTracker> = {}
const useSnowplowTracker = (
  name: string,
  authToken: AuthToken,
): SnowplowTracker => {
  const { network, member } = authToken || {}

  const { id: networkId, organizationId } = network || {}

  const actor: actorDataContext = {
    id: member?.id || '',
    roleId: member?.role?.id || '',
    roleType: member?.role?.type || '',
    locale: member?.attributes?.locale || getLang(),
  }

  const target: targetDataContext = useMemo(
    () => ({
      organizationId: organizationId || '',
      networkId,
    }),
    [networkId, organizationId],
  )

  let tracker: SnowplowTracker

  if (name in trackers) {
    tracker = trackers[name]
    tracker.setActor(actor)
    tracker.setTarget(target)
  } else {
    tracker = new SnowplowTracker(name, actor, target)
    trackers[name] = tracker
  }
  return tracker
}

export default useSnowplowTracker
