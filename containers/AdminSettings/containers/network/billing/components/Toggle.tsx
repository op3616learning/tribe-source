import React from 'react'

import { HStack } from '@chakra-ui/react'

import { PlanRenewalType } from 'tribe-api'
import { Text, Switch, Badge } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface BillingPeriodToggleProps {
  renewalType: PlanRenewalType
  handleClick: () => void
}
export const BillingPeriodToggle = ({
  renewalType,
  handleClick,
}: BillingPeriodToggleProps) => {
  return (
    <HStack px={{ base: 2, md: 0 }}>
      <Text>
        <Trans i18nKey="admin:billing.plan.monthly" defaults="Monthly" />
      </Text>
      <Switch
        isChecked={renewalType === PlanRenewalType.YEAR}
        onChange={handleClick}
      />
      <Text>
        <Trans i18nKey="admin:billing.plan.yearly" defaults="Yearly" />
      </Text>

      <Badge>
        <Trans
          i18nKey="admin:billing.plan.2MonthsFree"
          defaults="2 MONTHS FREE"
        />
      </Badge>
    </HStack>
  )
}
