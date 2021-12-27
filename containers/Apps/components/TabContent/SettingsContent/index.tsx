import React from 'react'

import { SettingsContentProps } from './@types'
import NetworkSettings from './NetworkSettings'
import SpaceSettings from './SpaceSettings'

const SettingsContent: React.FC<SettingsContentProps> = ({
  spaceId,
  ...rest
}) => {
  if (spaceId) return <SpaceSettings spaceId={spaceId} {...rest} />
  return <NetworkSettings {...rest} />
}

export default SettingsContent
