import { gql, useApolloClient } from '@apollo/client'
import axios from 'axios'

import { AuthTokenFragmentFragment } from 'tribe-api/graphql'
import { AuthToken } from 'tribe-api/interfaces'

import useGetNetwork from 'containers/Network/useGetNetwork'

export const useRefreshToken = () => {
  const apolloClient = useApolloClient()
  const { network } = useGetNetwork()

  const update = async (tokens?: {
    refreshToken: string
  }): Promise<AuthToken | undefined> => {
    try {
      const response = await axios.post<AuthToken>('/api/auth/refresh-token', {
        refreshToken: tokens?.refreshToken,
        networkDomain: network.domain,
      })

      if (response?.data) {
        // let's only update the access token
        const newAuthToken = response.data
        apolloClient.writeFragment<AuthTokenFragmentFragment>({
          data: {
            __typename: 'AuthToken',
            member: newAuthToken.member,
            networkPublicInfo: newAuthToken.networkPublicInfo,
            accessToken: newAuthToken.accessToken,
            refreshToken: newAuthToken.refreshToken,
            role: newAuthToken.role,
          },
          id: 'AuthToken:{}',
          fragmentName: 'AuthTokenFragment',
          fragment: gql`
            fragment AuthTokenFragment on AuthToken {
              accessToken
            }
          `,
        })

        return response.data
      }
    } catch (e) {
      console.warn('Could not update the refresh token', e)
    }
  }

  return {
    update,
  }
}
