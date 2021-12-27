import { App } from 'tribe-api'

import { DefaultApps } from '../TabContent/SettingsContent/DefaultApps'

export const isAppReady = (app?: App | null, settings?: string | null) => {
  if (!app) return false
  try {
    const parsedSettings = settings ? JSON.parse(settings) : {}
    switch (app.slug) {
      case DefaultApps.Amplitude:
        return Boolean(parsedSettings?.apiKey)
      case DefaultApps.GoogleAnalytics:
        return Boolean(parsedSettings?.measurementId)
      default:
        return true
    }
  } catch (err) {
    return false
  }
}
