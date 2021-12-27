import gql from 'graphql-tag';
import { MEDIA_FRAGMENT } from './media.gql';
export const PAYLOAD_FRAGMENT = gql `
  fragment PayloadFields on Payload {
    id
    media {
      ...MediaFragment
    }
    name
    summary
    type
    __typename
  }
  ${MEDIA_FRAGMENT}
`;
export const NOTIFICATION_FRAGMENT = gql `
  fragment NotificationFields on Notification {
    actor {
      ...PayloadFields
    }
    object {
      ...PayloadFields
    }
    target {
      ...PayloadFields
    }
    space {
      slug
    }
    id
    read
    createdAt
    verb
    meta {
      relativeUrl
      url
      textTitle
      title
      reason
    }
    __typename
  }
  ${PAYLOAD_FRAGMENT}
`;
export const GET_NOTIFICATIONS = gql `
  query notifications($limit: Int! = 10, $after: String) {
    notifications(limit: $limit, after: $after) {
      totalCount
      edges {
        cursor
        node {
          ...NotificationFields
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
export const GET_NOTIFICATIONS_COUNT = gql `
  query getNotificationsCount {
    getNotificationsCount {
      new
    }
  }
`;
export const CLEAR_NOTIFICATIONS_COUNT = gql `
  mutation clearNotificationsCount {
    clearNotificationsCount {
      __typename
      status
    }
  }
`;
export const READ_NOTIFICATION = gql `
  mutation readNotification($notificationId: ID!) {
    readNotification(notificationId: $notificationId) {
      __typename
      status
    }
  }
`;
export const DELETE_ALL_NOTIFICATIONS = gql `
  mutation deleteNotifications($ids: [ID!]!) {
    deleteNotifications(ids: $ids) {
      __typename
      status
    }
  }
`;
export const READ_ALL_NOTIFICATIONS = gql `
  mutation readNotifications($ids: [ID!]!) {
    readNotifications(ids: $ids) {
      __typename
      status
    }
  }
`;
export const NETWORK_NOTIFICATION_SETTINGS_FRAGMENT = gql `
  fragment NetworkNotificationSettingsFragment on MemberNetworkNotificationSettings {
    __typename
    enabled
    channel
    isDefault
    mention
    reaction
    sameAsDefault
  }
`;
export const SPACE_NOTIFICATION_SETTINGS_FRAGMENT = gql `
  fragment SpaceNotificationSettingsFragment on MemberSpaceNotificationSettings {
    __typename
    space {
      __typename
      id
      name
      slug
      image {
        ...MediaFragment
      }
    }
    channel
    isDefault
    preference
    sameAsDefault
  }
  ${MEDIA_FRAGMENT}
`;
export const GET_NOTIFICATION_SETTINGS = gql `
  query getNotificationSettings($memberId: ID) {
    getMemberNotificationSettings(memberId: $memberId) {
      __typename
      network {
        ...NetworkNotificationSettingsFragment
      }
      spaces {
        ...SpaceNotificationSettingsFragment
      }
    }
  }
  ${NETWORK_NOTIFICATION_SETTINGS_FRAGMENT}
  ${SPACE_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const UPDATE_NETWORK_NOTIFICATION_SETTINGS = gql `
  mutation updateNetworkNotificationSettings(
    $channel: NotificationChannel!
    $input: UpdateMemberNetworkNotificationSettingsInput!
    $memberId: ID
  ) {
    updateMemberNetworkNotificationSettings(
      channel: $channel
      input: $input
      memberId: $memberId
    ) {
      ...NetworkNotificationSettingsFragment
    }
  }
  ${NETWORK_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const MEMBER_POST_NOTIFICATION_SETTINGS_FRAGMENT = gql `
  fragment MemberPostNotificationSettingsFragment on MemberPostNotificationSettings {
    __typename
    enabled
    memberId
    postId
  }
`;
export const UPDATE_MEMBER_POST_NOTIFICATION_SETTINGS = gql `
  mutation updateMemberPostNotificationSettings(
    $input: UpdateMemberPostNotificationSettingsInput!
    $memberId: ID
    $postId: ID!
  ) {
    updateMemberPostNotificationSettings(
      input: $input
      memberId: $memberId
      postId: $postId
    ) {
      ...MemberPostNotificationSettingsFragment
    }
  }
  ${MEMBER_POST_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const UPDATE_SPACE_NOTIFICATION_SETTINGS = gql `
  mutation updateSpaceNotificationSettings(
    $channel: NotificationChannel!
    $input: UpdateMemberSpaceNotificationSettingsInput!
    $memberId: ID
    $spaceId: ID!
  ) {
    updateMemberSpaceNotificationSettings(
      channel: $channel
      input: $input
      memberId: $memberId
      spaceId: $spaceId
    ) {
      ...SpaceNotificationSettingsFragment
    }
  }
  ${SPACE_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const UNSUBSCRIBE_WITH_TOKEN = gql `
  mutation unsubscribeWithToken(
    $token: String!
    $context: UnsubscribeTokenContext!
  ) {
    unsubscribeWithToken(input: { token: $token, context: $context }) {
      status
    }
  }
`;
//# sourceMappingURL=notifications.gql.js.map