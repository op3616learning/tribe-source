import { SsoProvider } from 'tribe-api/interfaces'

export const {
  AUTH0,
  OKTA,
  WORDPRESS,
  CUSTOM,
  OUTSETA,
  MEMBERFUL,
} = SsoProvider

export const SUPPORTED_SSO_PROVIDERS = [
  AUTH0,
  OKTA,
  WORDPRESS,
  OUTSETA,
  MEMBERFUL,
]

export const SSO_PROVIDERS_NAME_DICT = {
  [AUTH0]: 'Auth0',
  [OKTA]: 'Okta',
  [WORDPRESS]: 'WordPress',
  [OUTSETA]: 'Outseta',
  [MEMBERFUL]: 'Memberful',
  [CUSTOM]: 'Custom Provider',
}

export const SSO_PROVIDERS_IDP_URL_LABEL = {
  [AUTH0]: 'Auth0 Domain',
  [OKTA]: 'Okta Domain',
  [WORDPRESS]: 'WordPress Domain',
  [OUTSETA]: 'Outseta Domain',
  [MEMBERFUL]: 'Memberful Domain',
  [CUSTOM]: 'Identity Provider URL',
}
