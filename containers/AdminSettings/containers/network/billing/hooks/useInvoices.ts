import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  InvoicesQuery,
  InvoicesQueryVariables,
  Invoice,
  INVOICES,
} from 'tribe-api'

export type UseInvoices = QueryResult & {
  invoices: Array<Invoice>
}

export const useInvoices = (): UseInvoices => {
  const { loading, data, error } = useQuery<
    InvoicesQuery,
    InvoicesQueryVariables
  >(INVOICES, { fetchPolicy: 'cache-and-network' })

  return {
    data,
    error,
    invoices: data?.invoices as Array<Invoice>,
    loading,
    isInitialLoading: loading && data?.invoices === undefined,
  }
}
