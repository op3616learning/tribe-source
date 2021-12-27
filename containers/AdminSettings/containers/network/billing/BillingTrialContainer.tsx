import React, { useEffect, useState } from 'react'

import { Box, chakra, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'

import { PlanRenewalType, PlanName } from 'tribe-api'
import { Card, NonIdealState, Text, useToast } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { BillingCardHeader } from 'containers/AdminSettings/containers/network/billing/components'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanName } from 'utils/enums'

import { Invoices } from './components/Invoices'
import PlansComponent from './components/PlansComponent'
import { BillingPeriodToggle } from './components/Toggle'

dayjs.extend(relativeTime)

export const BillingTrialContainer = () => {
  const router = useRouter()
  const { network } = useGetNetwork()
  const { t } = useTranslation()
  const { welcome } = router.query

  const [renewalType, setRenewalType] = useState<PlanRenewalType>(
    PlanRenewalType.YEAR,
  )
  const toast = useToast()

  useEffect(() => {
    if (welcome !== undefined) {
      toast({
        title: t('admin:billing.postPurchaseStatus.networkPending', {
          defaultValue:
            'Your plan was updated successfully, but we need a little bit more time to finalize all the changes. Please refresh this page in a few minutes',
        }),
        status: 'warning',
        duration: null,
      })
    }
  }, [])
  const plan = network?.subscriptionPlan
  const downgradePlanName = PlanName.BASIC
  const isTrialActive = plan?.trial
  const planName = plan?.name || PlanName.BASIC

  const activePlanName = isTrialActive ? PlanName.BASIC : planName

  return (
    <VStack align="stretch" spacing={6}>
      {isTrialActive ? (
        <>
          <Text textStyle="bold/2xlarge">
            <Trans i18nKey="admin:billing.header" defaults="Billing" />
          </Text>

          <Card>
            <BillingCardHeader>
              <Trans i18nKey="admin:billing.plan.title" defaults="Plan" />
            </BillingCardHeader>
            <Text pb={2}>
              <Trans
                i18nKey="admin:billing.plan.trial.description"
                defaults="You are currently on a <b>{{plan}} plan trial</b>, with {{daysLeft}} left."
                values={{
                  plan: enumI18nPlanName(plan?.name),
                  daysLeft: dayjs(plan?.endDate || new Date()).fromNow(true),
                }}
                components={{
                  b: <chakra.span fontWeight="bold" />,
                }}
              />
            </Text>
            {downgradePlanName && (
              <Text color="label.secondary">
                <Trans
                  i18nKey="admin:billing.plan.trial.willDowngrade"
                  defaults="You will be automatically downgraded to the {{plan}} plan on {{downgradeDate}}"
                  values={{
                    plan: enumI18nPlanName(downgradePlanName),
                    downgradeDate: dayjs(plan?.endDate || new Date()).format(
                      'MMMM D, YYYY',
                    ),
                  }}
                />
              </Text>
            )}
          </Card>
        </>
      ) : (
        <NonIdealState
          title={t('admin:billing.plan.trial.expired.title', {
            defaultValue: 'Your trial has expired',
          })}
          description={t('admin:billing.plan.trial.expired.description', {
            defaultValue:
              'Your account has been reverted to the {{plan}} plan. To continue to enjoy additional features, please choose a plan.',
            plan: enumI18nPlanName(downgradePlanName),
          })}
        />
      )}

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

      <PlansComponent
        activePlanName={activePlanName}
        renewalType={renewalType}
      />

      <Box pt={12}>
        <Invoices />
      </Box>
    </VStack>
  )
}
