import { useCallback } from 'react'

import { FetchResult, useApolloClient } from '@apollo/client'

import {
  UPDATE_BILLING_DETAILS,
  UpdateBillingDetailsMutation,
  UpdateBillingDetailsMutationVariables,
} from 'tribe-api/graphql'
import { BillingDetailsInput } from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

export type UsePurchaseResult = {
  updateBillingDetails: (
    input: BillingDetailsInput,
  ) => Promise<FetchResult<UpdateBillingDetailsMutation>>
}

export const useUpdateBillingDetails = (): UsePurchaseResult => {
  const apolloClient = useApolloClient()

  const updateBillingDetails = useCallback(
    async (input: BillingDetailsInput) => {
      const { data, errors } = await apolloClient.mutate<
        UpdateBillingDetailsMutation,
        UpdateBillingDetailsMutationVariables
      >({
        mutation: UPDATE_BILLING_DETAILS,
        variables: {
          input,
        },
        update: (cache, { data }) => {
          try {
            cache.modify({
              fields: {
                billingDetails(existingbillingDetails) {
                  return {
                    ...existingbillingDetails,
                    ...(data?.updateBillingDetails || {}),
                  }
                },
              },
            })
          } catch (e) {
            logger.error('Error in updating cache for billing details', e)
          }
        },
      })

      return { data, errors }
    },
    [apolloClient],
  )

  return {
    updateBillingDetails,
  }
}
