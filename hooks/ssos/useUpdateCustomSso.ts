import { useCallback } from 'react'

import { ApolloError, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'

import {
  UPDATE_CUSTOM_SSO,
  UpdateCustomSsoMutation,
  UpdateCustomSsoMutationVariables,
  GET_SSOS,
  GET_NETWORK_INFO,
} from 'tribe-api/graphql'
import { UpdateCustomSsoInput } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

const useUpdateCustomSso = (): {
  data?: UpdateCustomSsoMutation | null
  error?: ApolloError
  loading: boolean
  updateSso: (input: UpdateCustomSsoInput) => void
} => {
  const [updateCustomSsoMutation, { data, error, loading }] = useMutation<
    UpdateCustomSsoMutation,
    UpdateCustomSsoMutationVariables
  >(UPDATE_CUSTOM_SSO, {
    onCompleted: () => {
      toast({
        title: t('admin:authentication.singleSignon.form.feedback', {
          defaultValue: 'OAuth2 settings updated',
        }),
        status: 'success',
      })
    },
    onError: error => {
      if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
        error?.graphQLErrors?.forEach((graphQLError: GraphQLError): void => {
          if (graphQLError?.message) {
            toast({
              title: t('admin:error', {
                defaultValue: 'Error',
              }),
              description: graphQLError?.message,
              isClosable: true,
              status: 'error',
            })
          }
        })
      } else if (error?.message) {
        toast({
          title: t('admin:error', {
            defaultValue: 'Error',
          }),
          description: error?.message,
          isClosable: true,
          status: 'error',
        })
      }
    },
    refetchQueries: [
      {
        query: GET_SSOS,
      },
      {
        query: GET_NETWORK_INFO,
        variables: {
          withDefaultSpaces: false,
          withRoles: true,
          anonymize: false,
        },
      },
    ],
  })
  const toast = useToast()
  const { t } = useTranslation()

  const updateSso = useCallback(
    (input: UpdateCustomSsoInput) => {
      updateCustomSsoMutation({ variables: { input } })
    },
    [updateCustomSsoMutation],
  )

  return {
    data,
    error,
    loading,
    updateSso,
  }
}

export default useUpdateCustomSso
