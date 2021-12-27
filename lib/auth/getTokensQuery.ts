import { ApolloQueryResult, gql } from '@apollo/client'
import { NextPageContextApp } from '@types'

import {
  GetAuthMemberQuery,
  GetAuthMemberQueryVariables,
  GetNetworkQuery,
  GetNetworkQueryVariables,
  TokensQuery,
  TokensQueryVariables,
  GET_AUTH_MEMBER,
  GET_NETWORK_INFO,
  GET_TOKENS,
  AuthTokenFragmentFragment,
} from 'tribe-api/graphql'
import { AuthToken } from 'tribe-api/interfaces/interface.generated'

import { isExpired, parseToken } from 'lib/accessToken'
import { initializeApollo } from 'lib/apollo'
import { logger } from 'lib/logger'
import {
  getTokens,
  resetSSRAuthCookies,
  setSSRAuthCookies,
} from 'lib/ssr/authCookies.utils'

import { getActualError } from 'utils/errors'
import { getReqHostname } from 'utils/nextRequest.utils'

const getTokensQuery = async (
  context: NextPageContextApp,
): Promise<{
  response: ApolloQueryResult<TokensQuery>
  authToken: AuthToken
  error: ApolloQueryResult<TokensQuery>['error']
  errors: ApolloQueryResult<TokensQuery>['errors']
}> => {
  try {
    const { req, res } = context
    const { refreshToken, accessToken } = getTokens({ req, res })
    const apolloClient = context.apolloClient || initializeApollo(undefined)
    const envNetworkDomain =
      process.env.NODE_ENV === 'development' &&
      process.env.SHARED_COMMUNITY_DOMAIN_NAME
    const networkDomain = envNetworkDomain || getReqHostname(req)

    // we should not update the refresh token if the access token still valid
    const hasAccessTokenExpired = isExpired(parseToken(accessToken))

    // setting access token in cache to use it on the req header
    if (!hasAccessTokenExpired) {
      apolloClient.writeFragment<AuthTokenFragmentFragment>({
        data: {
          __typename: 'AuthToken',
          accessToken,
          member: {} as any,
          networkPublicInfo: {} as any,
          refreshToken,
          role: {} as any,
        },
        id: 'AuthToken:{}',
        fragmentName: 'AuthTokenFragment',
        fragment: gql`
          fragment AuthTokenFragment on AuthToken {
            accessToken
          }
        `,
      })
    }

    const response = await apolloClient.query<
      TokensQuery,
      TokensQueryVariables
    >({
      query: GET_TOKENS,
      variables: {
        networkDomain,
        refreshToken: hasAccessTokenExpired ? refreshToken : undefined,
      },
      fetchPolicy: 'network-only',
    })

    const {
      refreshToken: newRefreshToken,
      member,
      network,
      accessToken: newAt,
    } = response?.data?.tokens || {}
    // only throw error if newRefreshToken is not provided but we send an old one
    if (refreshToken && !newRefreshToken) {
      throw new Error('Refresh token has not been provided')
    }

    if (req && res) {
      setSSRAuthCookies({
        req,
        res,
        refreshToken: newRefreshToken,
        accessToken: newAt,
      })
    }

    if (response?.data?.tokens) {
      // Add the tokens query to the cache without any variables (as Singleton)
      apolloClient.writeQuery<TokensQuery, TokensQueryVariables>({
        query: GET_TOKENS,
        data: { tokens: response?.data?.tokens },
      })
    }
    if (network) {
      apolloClient.writeQuery<GetNetworkQuery, GetNetworkQueryVariables>({
        query: GET_NETWORK_INFO,
        data: { getNetwork: network },
        variables: {
          withDefaultSpaces: false,
          withRoles: true,
        },
      })

      if (member) {
        apolloClient.writeQuery<
          GetAuthMemberQuery,
          GetAuthMemberQueryVariables
        >({
          query: GET_AUTH_MEMBER,
          data: {
            getAuthMember: {
              ...member,
              network,
            },
          },
        })
      }
    }

    return {
      response,
      authToken: response?.data?.tokens as AuthToken,
      error: response?.error,
      errors: response?.errors,
    }
  } catch (err) {
    logger.warn('error - fetching token =>', err)
    if (context?.req && context?.res) {
      resetSSRAuthCookies({ req: context?.req, res: context?.res })
    }
    context.authToken = null

    throw getActualError(err)
  }
}

export default getTokensQuery
