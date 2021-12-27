import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import { ReportQuery, ReportQueryVariables, REPORT } from 'tribe-api/graphql'
import { Report, ReportSlug, ReportTimeFrame } from 'tribe-api/interfaces'

export type UseReportResult = QueryResult<ReportQuery> & {
  report: Report
}

interface UseReportArgs {
  slug: ReportSlug
  timeFrame: ReportTimeFrame
  spaceId?: string | null | undefined
}

export type UseReport = (args: UseReportArgs) => UseReportResult

const useReport: UseReport = ({
  slug,
  timeFrame,
  spaceId,
}): UseReportResult => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const { data, error, loading } = useQuery<ReportQuery, ReportQueryVariables>(
    REPORT,
    {
      variables: {
        slug,
        timeFrame,
        timeZone,
        spaceId,
      },
      skip: !slug || !timeFrame || !timeZone,
      // Seems related to this. Aliased keys raise a violation when cacheing
      // https://github.com/apollographql/apollo-client/discussions/8195
      fetchPolicy: 'no-cache',
      partialRefetch: true,
      returnPartialData: true,
    },
  )
  const report = data?.report as Report

  return {
    data,
    error,
    loading,
    report,
    isInitialLoading: loading && data === undefined,
  }
}

export default useReport
