import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'

import { PlanName, PlanRenewalType } from 'tribe-api'
import {
  Button,
  ButtonSwitch,
  ButtonSwitchOff,
  ButtonSwitchOn,
  Card,
  Link,
  Skeleton,
  SkeletonProvider,
  SkeletonText,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { BillingCardHeader } from 'containers/AdminSettings/containers/network/billing/components'
import {
  useBaskets,
  useContactSales,
} from 'containers/AdminSettings/containers/network/billing/hooks'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { formatPrice } from 'utils/formatters'

type BasketSummaryProps = {
  isBasketDisabled?: boolean
  isFormPresent: boolean
  planName: PlanName
  onRenewalTypeChange: (newType: PlanRenewalType) => void
  renewalType: PlanRenewalType
  seats: number
}

export const BasketSummary: React.FC<BasketSummaryProps> = ({
  isBasketDisabled = false,
  isFormPresent,
  planName,
  onRenewalTypeChange,
  renewalType,
  seats,
}) => {
  const { openChatGeneric } = useContactSales()
  const { network } = useGetNetwork()
  const { basket, loading } = useBaskets({
    name: planName,
    seats,
  })
  const { formState } = useFormContext()
  const activeRenewalType = network?.subscriptionPlan?.renewalType
  const activePlanName = network?.subscriptionPlan?.name
  const basketInfo = basket?.find(it => it.renewalType === renewalType)

  return (
    <Card>
      <VStack align="stretch" spacing="6">
        <BillingCardHeader pb={0}>
          <Trans
            i18nKey="admin:billing.purchase.summary.title"
            defaults="Billing summary"
          />
        </BillingCardHeader>

        {!isBasketDisabled && (
          <HStack>
            <ButtonSwitch
              isChecked={renewalType === PlanRenewalType.YEAR}
              onChange={() => {
                const nextRenewalType =
                  renewalType === PlanRenewalType.MONTH
                    ? PlanRenewalType.YEAR
                    : PlanRenewalType.MONTH
                const nextBasketInfo = basket?.find(
                  b => b?.renewalType === nextRenewalType,
                )

                // CORE-1179
                if (
                  activePlanName === PlanName.PLUS &&
                  planName === PlanName.PREMIUM &&
                  activeRenewalType === PlanRenewalType.YEAR &&
                  nextRenewalType === PlanRenewalType.MONTH
                ) {
                  openChatGeneric(
                    'I would like to upgrade my plan to Premium and change the plan term from yearly to monthly',
                  )
                  return
                }
                // End CORE-1179

                if (nextBasketInfo?.items === null) {
                  const dict = {
                    [PlanRenewalType.MONTH]: 'monthly',
                    [PlanRenewalType.YEAR]: 'yearly',
                  }
                  openChatGeneric(
                    `I would like to change my plan term from ${dict[renewalType]} to ${dict[nextRenewalType]}`,
                  )
                  return
                }
                onRenewalTypeChange(nextRenewalType)
              }}
              width="100%"
            >
              <ButtonSwitchOff>
                <Trans
                  i18nKey="admin:billing.plan.monthly"
                  defaults="Monthly"
                />
              </ButtonSwitchOff>
              <ButtonSwitchOn>
                <Trans i18nKey="admin:billing.plan.yearly" defaults="Yearly" />
              </ButtonSwitchOn>
            </ButtonSwitch>
          </HStack>
        )}

        <SkeletonProvider loading={loading}>
          <VStack align="stretch" spacing="4">
            {!isBasketDisabled &&
              basketInfo?.items?.map(row => (
                <HStack justify="space-between" key={row.title}>
                  <Text textStyle="medium/medium" color="label.primary">
                    {row.title}
                  </Text>
                  <Text textStyle="medium/medium" color="label.primary">
                    {formatPrice(row.value)}
                  </Text>
                </HStack>
              ))}
            <Skeleton fallback={<SkeletonText noOfLines={3} spacing="4" />}>
              {!isBasketDisabled ? (
                <HStack justify="space-between">
                  <Text textStyle="semibold/medium" color="label.primary">
                    <Trans
                      i18nKey="admin:billing.purchase.summary.total"
                      defaults="Total"
                    />
                  </Text>
                  <Text textStyle="semibold/medium" color="label.primary">
                    {formatPrice(basketInfo?.total)}
                  </Text>
                </HStack>
              ) : (
                <Text textStyle="regular/medium" color="label.primary">
                  <Trans
                    i18nKey="admin:billing.purchase.summary.makeSomeChangesToProceed"
                    defaults="Make some changes to your plan in order to proceed with the payment."
                  />
                </Text>
              )}
            </Skeleton>
          </VStack>
        </SkeletonProvider>

        <VStack align="stretch" spacing="4">
          <Button
            buttonType="primary"
            type="submit"
            disabled={
              (isFormPresent &&
                (formState.isSubmitting || !formState.isDirty)) ||
              isBasketDisabled
            }
            isLoading={formState.isSubmitting}
          >
            <Trans i18nKey="common:actions.confirm" defaults="Confirm" />
          </Button>

          <Text color="label.secondary" textStyle="medium/small">
            <Trans
              i18nKey="admin:billing.purchase.summary.terms"
              defaults="By confirming, you agree to the plan’s <termLink>Terms & Conditions</termLink> and <privacyLink>Privacy Policy</privacyLink>. You understand that your subscription starts today."
              components={{
                termLink: (
                  <Link
                    color="accent.base"
                    isExternal
                    href="https://tribe.so/terms-of-service"
                  />
                ),
                privacyLink: (
                  <Link
                    color="accent.base"
                    isExternal
                    href="https://tribe.so/privacy-policy"
                  />
                ),
              }}
            />
          </Text>
        </VStack>
      </VStack>
    </Card>
  )
}
