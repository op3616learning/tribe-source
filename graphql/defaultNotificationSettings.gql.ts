import gql from 'graphql-tag';
export const SPACE_DEFAULT_NOTIFICATION_SETTINGS_FRAGMENT = gql `
  fragment SpaceDefaultNotificationSettingsFields on SpaceDefaultNotificationSettings {
    __typename
    channel
    isDefault
    sameAsDefault
    enabled
    preference
  }
`;
export const SPACE_DEFAULT_NOTIFICATION_SETTINGS = gql `
  query spaceDefaultNotificationSettings($spaceId: ID!) {
    spaceDefaultNotificationSettings(spaceId: $spaceId) {
      ...SpaceDefaultNotificationSettingsFields
    }
  }
  ${SPACE_DEFAULT_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const UPDATE_SPACE_DEFAULT_NOTIFICATION_SETTINGS = gql `
  mutation updateSpaceDefaultNotificationSettings(
    $spaceId: ID!
    $channel: NotificationChannel!
    $input: UpdateSpaceDefaultNotificationSettingsInput!
  ) {
    updateSpaceDefaultNotificationSettings(
      spaceId: $spaceId
      channel: $channel
      input: $input
    ) {
      ...SpaceDefaultNotificationSettingsFields
    }
  }
  ${SPACE_DEFAULT_NOTIFICATION_SETTINGS_FRAGMENT}
`;
//# sourceMappingURL=defaultNotificationSettings.gql.js.map