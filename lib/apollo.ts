import {
  ApolloCache,
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { relayStylePagination } from '@apollo/client/utilities'

import { AuthTokenFragmentFragment } from 'tribe-api/graphql'

import { logger } from 'lib/logger'

import { getRuntimeConfigVariable } from 'utils/config'
import { extractApiError } from 'utils/errors'
import { isOfflineEnabled, persistApolloCache } from 'utils/offline.utils'

function getGatewayUri(): string {
  const isServer = typeof window === 'undefined'

  if (process.env.NODE_ENV !== 'development' && isServer) {
    return `${getRuntimeConfigVariable('SHARED_PRIVATE_GATEWAY_ADDRESS') || ''}`
  }
  return `${getRuntimeConfigVariable('SHARED_TRIBE_BASE_URL') || ''}`
}

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null

function createApolloClient(initialState = {}) {
  const httpLink = new HttpLink({
    uri: getGatewayUri(),
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  })

  const logLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(result => {
      const { operationName, query, variables } = operation
      const operationType = (query.definitions[0] as any).operation

      const {
        headers: { authorization },
      } = operation.getContext()

      const message = `${operationType} ${operationName}`
      logger.debug(message, {
        variables,
        accessToken: authorization?.substr(-8),
        result,
      })

      return result
    })
  })

  const errorLink = onError(errorResponse => {
    const { operation, graphQLErrors, networkError } = errorResponse
    const { operationName, query, variables } = operation
    const operationType = (query.definitions[0] as any).operation

    const apiError = extractApiError(errorResponse)
    const message = `${operationType} ${operationName} - ${apiError?.message}`
    const details = {
      variables,
      graphQLErrors,
      networkError,
    }

    logger.warn(message, details)
  })

  const cache = new InMemoryCache({
    possibleTypes: {
      Media: ['Image', 'Emoji'],
      ReportableEntity: ['Post', 'Space', 'Member', 'Tag'],
    },
    typePolicies: {
      // we should have this as singleton for now since we only recieve one transfer status from backend
      DomainTransferStatus: {
        keyFields: [],
      },
      Network: {
        // Since Network is a Singleton type, its possible to use an empty array for keyFields
        keyFields: [],
      },
      AuthToken: {
        // Since AuthToken is a Singleton type, its possible to use an empty array for keyFields
        keyFields: [],
      },
      Space: {
        keyFields: ['slug'],
        fields: {
          pinnedPosts: {
            merge: false,
          },
        },
      },
      App: {
        keyFields: ['slug'],
      },
      MemberNotificationSettings: {
        keyFields: [],
      },
      Post: {
        fields: {
          reactions: {
            // Short for always preferring incoming over existing data.
            merge: false,
          },
          pinnedInto: {
            merge: false,
          },
        },
      },
      Query: {
        fields: {
          apps: relayStylePagination(),
          notifications: relayStylePagination(),
          getPosts: relayStylePagination([
            'spaceIds',
            'excludePins',
            'postTypeIds',
            'filterBy',
            'orderBy',
          ]),
          getFeed: relayStylePagination([
            'postTypeIds',
            'onlyMemberSpaces',
            'filterBy',
            'orderBy',
          ]),
          getModerations: relayStylePagination(),
          getSpaceTopicPosts: relayStylePagination(),
          getSpaces: relayStylePagination(['memberId']),
          getNetworks: relayStylePagination(),
          exploreSpaces: relayStylePagination(['collectionId']),
          memberSpaces: relayStylePagination(['memberId', 'collectionId']),
          getMembers: relayStylePagination(),
          getSpaceMembers: relayStylePagination(['spaceId', 'roleIds']),
          getReplies: relayStylePagination(['postId']),
          getMemberPosts: relayStylePagination(['memberId']),
          memberInvitations: relayStylePagination(),
          getNetworkAppInstallations: relayStylePagination(),
          getPost: (_, { args, toReference }) => {
            return toReference({
              __typename: 'Post',
              id: args?.postId,
            })
          },
          getMember: (_, { args, toReference }) => {
            return toReference({
              __typename: 'Member',
              id: args?.memberId,
            })
          },
          space: (existingData, { args, toReference }) => {
            if (args?.id) {
              return (
                existingData ||
                toReference({
                  __typename: 'Space',
                  id: args.id,
                  slug: args?.slug,
                })
              )
            }
            if (args?.slug) {
              return (
                existingData ||
                toReference({
                  __typename: 'Space',
                  slug: args.slug,
                })
              )
            }
          },
          getGroup: (existingData, { args, toReference }) => {
            return (
              existingData ||
              toReference({
                __typename: 'Collection',
                id: args?.groupId,
              })
            )
          },
        },
      },
    },
  }).restore(initialState)

  const ssrMode = typeof window === 'undefined'

  if (!ssrMode && isOfflineEnabled()) {
    persistApolloCache(cache)
  }

  // let's retrieve the accessToken from the cache and set it as header
  const apolloAuthContext = setContext(async (_, { headers, cache }) => {
    let cachedAccessToken
    try {
      const cachedAuthToken = (cache as ApolloCache<
        NormalizedCacheObject
      >).readFragment<AuthTokenFragmentFragment>({
        id: 'AuthToken:{}',
        fragmentName: 'AuthTokenFragment',
        fragment: gql`
          fragment AuthTokenFragment on AuthToken {
            accessToken
          }
        `,
      })
      cachedAccessToken = cachedAuthToken?.accessToken
    } catch (e) {
      console.log('Could not read the authToken from the cache', e)
    }

    return {
      headers: {
        ...headers,
        Authorization: cachedAccessToken ? `Bearer ${cachedAccessToken}` : '',
      },
    }
  })

  const links = [apolloAuthContext, logLink, errorLink, httpLink]

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  }

  return new ApolloClient({
    ssrMode,
    link: ApolloLink.from(links),
    cache,
    defaultOptions,
    ssrForceFetchDelay: 100,
  })
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
export const initializeApollo = (
  initialState?: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState)
  }

  return globalApolloClient
}

export const resetState = async (callback?: () => void) => {
  if (globalApolloClient) {
    await globalApolloClient.clearStore()
  }
  globalApolloClient = createApolloClient({})

  if (typeof callback === 'function') {
    callback()
  }

  return globalApolloClient
}
