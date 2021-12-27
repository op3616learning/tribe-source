import React, { useState } from 'react'

import { chakra, HStack, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { PlanName, PlanRenewalType } from 'tribe-api'
import { Card, Icon, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanName, enumI18nPlanRenewalType } from 'utils/enums'

import { BillingCardHeader } from './components/BillingCardHeader'
import PlansComponent from './components/PlansComponent'
import { BillingPeriodToggle } from './components/Toggle'

dayjs.extend(relativeTime)

export const PlansContainer = () => {
  const { network } = useGetNetwork()
  const plan = network?.subscriptionPlan
  const planName = plan?.name || PlanName.BASIC
  const [renewalType, setRenewalType] = useState<PlanRenewalType>(
    plan?.renewalType || PlanRenewalType.YEAR,
  )
  return (
    <VStack align="stretch" spacing={6}>
      <HStack px={{ base: 2, md: 0 }} color="label.secondary" mb={8}>
        <Icon as={ArrowLeftLineIcon} />

        <NextLink href="/admin/network/billing" passHref>
          <Link color="inherit">
            <Trans
              i18nKey="admin:billing.purchase.backToBilling"
              defaults="Back to billing"
            />
          </Link>
        </NextLink>
      </HStack>

      <Text px={{ base: 2, md: 0 }} textStyle="bold/2xlarge">
        <Trans
          i18nKey="admin:billing.plans.header"
          defaults="Customize or change your plan"
        />
      </Text>

      <Card>
        <BillingCardHeader>
          <Trans i18nKey="admin:billing.plan.title" defaults="Plan" />
        </BillingCardHeader>
        <VStack align="stretch">
          <Text color="label.primary">
            <Trans
              i18nKey="admin:billing.plans.description"
              defaults="You are currently on the <b>{{ plan }}</b> plan billed {{period}}."
              values={{
                plan: enumI18nPlanName(plan?.name),
                period: enumI18nPlanRenewalType(
                  plan?.renewalType as PlanRenewalType,
                )?.toLowerCase?.(),
              }}
              components={{
                b: <chakra.span fontWeight="bold" />,
              }}
            />
          </Text>
          {plan?.endDate && (
            <Text color="label.secondary">
              <Trans
                i18nKey="admin:billing.plan.finishDate"
                defaults="Your plan finishes on {{date}}."
                values={{
                  date: dayjs(plan?.endDate).format('MMMM D, YYYY'),
                }}
              />
            </Text>
          )}
        </VStack>
      </Card>

      <BillingPeriodToggle
        renewalType={renewalType}
        handleClick={() =>
          setRenewalType(
            renewalType === PlanRenewalType.MONTH
              ? PlanRenewalType.YEAR
              : PlanRenewalType.MONTH,
          )
        }
      />

      <PlansComponent activePlanName={planName} renewalType={renewalType} />
    </VStack>
  )
}
