import React from 'react'

import { Box } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import DownloadLineIcon from 'remixicon-react/DownloadLineIcon'

import {
  Card,
  Icon,
  Link,
  TableColumnWrapper,
  TableWrapper,
  Text,
  Tooltip,
  useResponsive,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { capitalize } from 'utils/strings'

import { useInvoices } from '../hooks/useInvoices'

import { BillingCardHeader } from '.'

dayjs.extend(relativeTime)

const dateColumnPropsFunction = () => ({
  flexGrow: 1,
  overflow: 'hidden',
})

const downloadColumnPropsFunction = () => ({
  flexShrink: 1,
  maxWidth: '20px',
})

export const Invoices = () => {
  const { invoices, loading, error } = useInvoices()
  const { isMobile } = useResponsive()

  const { t } = useTranslation()
  if (loading || invoices?.length < 1 || error) return null

  return (
    <Card px={0}>
      <Box pl={6}>
        <BillingCardHeader>
          <Trans i18nKey="admin:billing.invoices.title" defaults="Payments" />
        </BillingCardHeader>
      </Box>

      <TableWrapper
        data={invoices}
        hasMore={false}
        total={invoices?.length}
        loading={loading}
        skeletonRowCount={8}
        hasBorder={false}
        hasTab
      >
        <TableColumnWrapper
          id="invoice"
          title={t('admin:billing.invoices.table.headings.invoice', 'Invoice')}
          getColumnProps={dateColumnPropsFunction}
        >
          {invoice => <Text>{dayjs(invoice.date).format('MMMM D, YYYY')}</Text>}
        </TableColumnWrapper>

        {!isMobile && (
          <TableColumnWrapper
            id="payment"
            title={t(
              'admin:billing.invoices.table.headings.payment',
              'Payment Method',
            )}
          >
            {invoice => (
              <Text>
                {invoice?.cardLastFourDigits ? (
                  <Trans
                    i18nKey="admin:billing.paymentMethod.card.lastDigits"
                    defaults="Ending with {{lastDigits}}"
                    values={{
                      lastDigits: invoice?.cardLastFourDigits,
                    }}
                  />
                ) : (
                  '-'
                )}
              </Text>
            )}
          </TableColumnWrapper>
        )}

        <TableColumnWrapper
          id="total"
          title={t('admin:billing.invoices.table.headings.total', 'Total')}
        >
          {invoice => (
            <Text>
              {invoice.total
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: invoice.currency,
                })
                .concat(` ${invoice.currency.toUpperCase()}`)}
            </Text>
          )}
        </TableColumnWrapper>

        <TableColumnWrapper
          id="status"
          title={t('admin:billing.invoices.table.headings.status', 'Status')}
        >
          {invoice => <Text>{capitalize(invoice.status)}</Text>}
        </TableColumnWrapper>

        <TableColumnWrapper
          getColumnProps={downloadColumnPropsFunction}
          id="view"
        >
          {invoice => (
            <Tooltip
              label={t(
                'admin:billing.invoices.table.headings.view',
                'Download Invoice',
              )}
            >
              <Link href={invoice?.invoiceUrl} color="accent.base">
                <Icon
                  cursor="pointer"
                  mr={3}
                  boxSize="4"
                  as={DownloadLineIcon}
                />
              </Link>
            </Tooltip>
          )}
        </TableColumnWrapper>
      </TableWrapper>
    </Card>
  )
}
