import React from 'react'

import { VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { CardPublicInformation } from 'tribe-api'
import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

dayjs.extend(relativeTime)

export type PaymentMethodDetailsProps = {
  cardInformation: CardPublicInformation
}
export const PaymentMethodOverview: React.FC<PaymentMethodDetailsProps> = ({
  cardInformation,
}) => (
  <VStack align="stretch">
    <Text color="label.primary">
      <Trans
        i18nKey="admin:billing.paymentMethod.card.lastDigits"
        defaults="Ending with {{lastDigits}}"
        values={{
          lastDigits: cardInformation.lastFourDigits,
        }}
      />
    </Text>
    <Text color="label.secondary">
      <Trans
        i18nKey="admin:billing.paymentMethod.card.expires"
        defaults="Expires {{month}}/{{year}}"
        values={{
          month: cardInformation.expirationMonth,
          year: cardInformation.expirationYear,
        }}
      />
      {' · '}
      <Trans
        i18nKey="admin:billing.paymentMethod.card.lastUpdated"
        defaults="Last updated {{lastUpdated}}"
        values={{
          lastUpdated: dayjs(cardInformation.updatedAt).format('MMMM D, YYYY'),
        }}
      />
    </Text>
  </VStack>
)
