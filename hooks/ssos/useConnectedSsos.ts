import { useCallback } from 'react'

import { ApolloError, useQuery } from '@apollo/client'

import {
  GET_SSO_MEMBERSHIP,
  GetSsoMembershipsQueryVariables,
  GetSsoMembershipsQuery,
} from 'tribe-api/graphql'
import { Member, SsoType } from 'tribe-api/interfaces'

import useAuthMember from '../useAuthMember'

const useConnectedSsos = (
  userId?: Member['id'],
): {
  data?: GetSsoMembershipsQuery
  error?: ApolloError
  loading: boolean

  getSsoMembership: (
    ssoType: SsoType,
  ) => GetSsoMembershipsQuery['getSsoMemberships'][0] | undefined
  connectedSsos: GetSsoMembershipsQuery['getSsoMemberships'] | undefined
} => {
  const { authUser } = useAuthMember()

  const memberId = userId ?? authUser?.id

  const { data, error, loading } = useQuery<
    GetSsoMembershipsQuery,
    GetSsoMembershipsQueryVariables
  >(GET_SSO_MEMBERSHIP, {
    variables: { memberId },
  })

  const connectedSsos = data?.getSsoMemberships

  const getSsoMembership = useCallback(
    (ssoType: SsoType) => {
      return connectedSsos?.find(membership => membership.ssoType === ssoType)
    },
    [connectedSsos],
  )

  return {
    data,
    error,
    loading,

    getSsoMembership,
    connectedSsos,
  }
}

export default useConnectedSsos
