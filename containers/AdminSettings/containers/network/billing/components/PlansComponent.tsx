import React, { useCallback } from 'react'

import { Box, Center, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import {
  PlanName,
  PlanRenewalType,
} from 'tribe-api/interfaces/interface.generated'
import { Link } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import Pricing, { LevelStatus } from 'containers/Billing/Pricing'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanName } from 'utils/enums'
import { capitalize } from 'utils/strings'

import { useContactSales } from '../hooks'
import {
  getDescription,
  getDisplayPrice,
  getDisplayPriceDetails,
  getFeatures,
  isPlanDowngrade,
} from '../utils/plan.utils'

interface ButtonAttributes {
  text: string
  status: LevelStatus
}

const PlansComponent = ({
  activePlanName,
  renewalType,
}: {
  activePlanName: PlanName
  renewalType: PlanRenewalType
}) => {
  const router = useRouter()
  const { openChat, openChatGeneric } = useContactSales()
  const { network } = useGetNetwork()
  const { t } = useTranslation()
  const activeRenewalType = network?.subscriptionPlan?.renewalType

  const handlePlanButtonClick = useCallback(
    (planName, status) => {
      // CORE-1179
      if (
        activePlanName === PlanName.PLUS &&
        planName === PlanName.PREMIUM &&
        activeRenewalType === PlanRenewalType.YEAR &&
        renewalType === PlanRenewalType.MONTH
      ) {
        openChatGeneric(
          'I would like to upgrade my plan to Premium and change the plan term from yearly to monthly',
        )
        return
      }
      // End CORE-1179
      if (planName === activePlanName && status === LevelStatus.DOWNGRADE) {
        openChatGeneric(
          'I would like to change my plan term from yearly to monthly',
        )
      } else if (
        planName === PlanName.ENTERPRISE ||
        status === LevelStatus.DOWNGRADE
      ) {
        openChat(planName)
      } else {
        router.push(
          `/admin/network/billing/purchase?renewal=${renewalType.toLowerCase()}&plan=${planName.toLowerCase()}`,
        )
      }
    },
    [activePlanName, openChat, openChatGeneric, renewalType, router],
  )
  const getButtonAttributes = useCallback(
    (localPlanName: PlanName): ButtonAttributes => {
      // If active plan is basic always show your current plan.
      // If the current plan name is same as network plan name
      if (
        localPlanName === activePlanName &&
        activePlanName === PlanName.BASIC
      ) {
        return {
          text: t(
            'admin:billing.plans.buttonText.current',
            'Your current plan',
          ),
          status: LevelStatus.CURRENT,
        }
      }

      if (localPlanName === activePlanName) {
        // Check the renewal type on the network.
        if (
          (activeRenewalType === PlanRenewalType.YEAR ||
            activeRenewalType === PlanRenewalType.MONTH) &&
          activeRenewalType === renewalType
        ) {
          // Disable.
          return {
            text: t(
              'admin:billing.plans.buttonText.current',
              'Your current plan',
            ),
            status: LevelStatus.CURRENT,
          }
        }

        if (
          activeRenewalType === PlanRenewalType.YEAR &&
          activeRenewalType !== renewalType
        ) {
          return {
            text: t(
              'admin:billing.plans.buttonText.switchMonthly',
              'Switch to monthly billing',
            ),
            status: LevelStatus.DOWNGRADE,
          }
        }

        if (
          activeRenewalType === PlanRenewalType.MONTH &&
          activeRenewalType !== renewalType
        ) {
          // Chance to upgrade
          return {
            text: t(
              'admin:billing.plans.buttonText.switchYearly',
              'Switch to yearly billing',
            ),
            status: LevelStatus.UPGRADE,
          }
        }
      }
      // Plan name is different
      // Handle downgrade cases.
      if (isPlanDowngrade(localPlanName, activePlanName)) {
        return {
          text: t('admin:billing.plans.buttonText.downgrade', 'Contact us'),
          status: LevelStatus.DOWNGRADE,
        }
      }

      // Upgrade is the fallback. Show Get Plan name
      return {
        text:
          t('admin:billing.plans.buttonText.upgrade', {
            defaultValue: 'Get {{ plan }}',
            plan: capitalize(localPlanName),
          }) || `Get ${capitalize(localPlanName)}`,
        status: LevelStatus.UPGRADE,
      }
    },
    [activePlanName, activeRenewalType, renewalType, t],
  )
  return (
    <>
      <Box>
        <SimpleGrid
          columns={{
            base: 1,
            sm: 2,
            lg: 3,
            xl: 4,
          }}
          spacing={4}
        >
          {[
            PlanName.BASIC,
            PlanName.PLUS,
            PlanName.PREMIUM,
            PlanName.ENTERPRISE,
          ].map(planName => {
            const { text, status } = getButtonAttributes(planName)
            return (
              <Pricing
                key={planName}
                name={enumI18nPlanName(planName)}
                description={getDescription(planName)}
                price={getDisplayPrice(planName, renewalType)}
                priceDetails={getDisplayPriceDetails(planName, renewalType)}
                onClick={() => handlePlanButtonClick(planName, status)}
                ctaText={text}
                features={getFeatures(planName)}
                levelStatus={status}
                isPopular={planName === PlanName.PREMIUM}
              />
            )
          })}
        </SimpleGrid>
      </Box>
      <Box>
        <Center>
          <Link href="https://tribe.so/pricing" target="_blank" isExternal>
            <Trans
              i18nKey="admin:billing.compareFeatures"
              defaults="Compare all features"
            />
          </Link>
        </Center>
      </Box>
    </>
  )
}
export default PlansComponent
