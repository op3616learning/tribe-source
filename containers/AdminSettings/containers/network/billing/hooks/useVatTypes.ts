import { useQuery } from '@apollo/client'

import { VatTypesQuery, VatTypesQueryVariables, VAT_TYPES } from 'tribe-api'

const useVatTypes = () => {
  const { data, error, loading, refetch } = useQuery<
    VatTypesQuery,
    VatTypesQueryVariables
  >(VAT_TYPES)

  return {
    refetch,
    data,
    vatTypes: data?.vatTypes,
    error,
    loading,
  }
}

export default useVatTypes
