import gql from 'graphql-tag';
export const POST_TYPE_FRAGMENT = gql `
  fragment PostTypeFields on PostType {
    __typename
    context
    id
    name
    pluralName
    createdAt
    slug
    primaryReactionType
    singleChoiceReactions
    updatedAt
    validReplyTypes {
      __typename
      id
      name
      pluralName
      validReplyTypes {
        __typename
        id
        name
        pluralName
      }
    }
  }
`;
export const GET_POST_TYPES = gql `
  query getPostTypes($limit: Int!, $query: String, $after: String) {
    postTypes(limit: $limit, query: $query, after: $after) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      edges {
        cursor
        __typename
        node {
          ...PostTypeFields
        }
      }
    }
  }
  ${POST_TYPE_FRAGMENT}
`;
//# sourceMappingURL=postTypes.gql.js.map