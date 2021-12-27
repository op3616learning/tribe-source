import React, { memo } from 'react'

import isEqual from 'react-fast-compare'

import { App, ThemeTokens } from 'tribe-api'
import { Card, NonIdealState } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { ComposerReadonly } from 'containers/Composer'

type AboutContentProps = {
  app: App
}

const AboutContent: React.FC<AboutContentProps> = ({ app }) => {
  const { themeSettings } = useThemeSettings()
  const { t } = useTranslation()

  if (app && !app?.about) {
    return (
      <Card>
        <NonIdealState
          title=""
          description={t('apps:app.noAbout', 'This app has no description')}
          py={10}
        />
      </Card>
    )
  }

  return (
    <Card>
      <ComposerReadonly
        value={app?.about ?? ''}
        themeSettings={themeSettings as ThemeTokens}
      />
    </Card>
  )
}

export default memo(AboutContent, isEqual)
