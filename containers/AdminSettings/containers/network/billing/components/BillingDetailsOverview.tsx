import React from 'react'

import { VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { BillingDetails } from 'tribe-api'
import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

dayjs.extend(relativeTime)

export type BillingDetailsProps = {
  billingDetails: BillingDetails
}
export const BillingDetailsOverview: React.FC<BillingDetailsProps> = ({
  billingDetails,
}) => (
  <VStack align="stretch">
    <Text color="label.primary" pb={3}>
      {billingDetails.companyName}
    </Text>
    <VStack align="stretch">
      <Text color="label.secondary">{billingDetails.billingEmail}</Text>
      <Text color="label.secondary">
        {billingDetails.address?.streetAddress}
      </Text>
      <Text color="label.secondary">
        {billingDetails.address?.city}
        {billingDetails.address?.state
          ? `, ${billingDetails.address.state}`
          : ''}
      </Text>
      <Text color="label.secondary">{billingDetails.address?.postalCode}</Text>
      <Text color="label.secondary">{billingDetails.address?.country}</Text>
      {billingDetails.vat && (
        <Text color="label.secondary">
          <Trans
            i18nKey="admin:billing.paymentMethod.vatText"
            defaults="VAT / {{vatText}} / {{vatId}}"
            values={{
              vatText: billingDetails.vat?.text,
              vatId: billingDetails.vat?.vatId,
            }}
          />
        </Text>
      )}
    </VStack>
  </VStack>
)
