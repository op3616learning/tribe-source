import React, { useCallback, useEffect } from 'react'

import { chakra, Box, useBoolean, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'

import { PlanName } from 'tribe-api'
import { Card, CardDivider, Icon, Link, Text, useToast } from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans, useTranslation } from 'tribe-translation'

import {
  BillingCardHeader,
  BillingDetailsOverview,
  PaymentMethodOverview,
  ThankYouModal,
} from 'containers/AdminSettings/containers/network/billing/components'
import { useBillingDetails } from 'containers/AdminSettings/containers/network/billing/hooks'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanName } from 'utils/enums'

import { BillingCheckoutFormInput } from './components/checkout/BillingCheckoutForm'
import { Invoices } from './components/Invoices'
import { BillingDetailsModal } from './components/modal/BillingDetails'
import { CardDetailsModal } from './components/modal/CardDetails'

dayjs.extend(relativeTime)

export const BillingDetailsContainer = () => {
  const router = useRouter()
  const { welcome } = router.query
  const { network } = useGetNetwork()
  const [showSuccessModal, setShowSuccessModal] = useBoolean(
    welcome !== undefined,
  )
  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (
      welcome !== undefined &&
      (network?.subscriptionPlan?.trial ||
        network?.subscriptionPlan?.name === PlanName.BASIC)
    ) {
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

  const [showCardDetailsModal, setShowCardDetailsModal] = useBoolean(false)
  const [showBillingDetailsModal, setShowBillingDetailsModal] = useBoolean(
    false,
  )

  const plan = network?.subscriptionPlan
  const { billingDetails } = useBillingDetails()
  const { isEnabled: isPastPaymentsEnabled } = useTribeFeature(
    Features.PastPayments,
  )

  const handlePlanChange = useCallback(() => {
    router.push('/admin/network/billing/plans')
  }, [router])

  const methods = useForm<BillingCheckoutFormInput>({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      nameOnCard: '',
      email: '',
      streetAddress: '',
      city: '',
      postalCode: '',
    },
  })

  useEffect(() => {
    if (billingDetails && methods) {
      methods.reset({
        email: billingDetails.billingEmail || '',
        streetAddress: billingDetails.address?.streetAddress || '',
        city: billingDetails.address?.city || '',
        postalCode: billingDetails.address?.postalCode || '',
        companyName: billingDetails.companyName || '',
        country: { id: billingDetails.address?.country || '' },
        vatType: {
          id: billingDetails.vat?.vatType,
          name: billingDetails.vat?.text || '',
        },
        vatId: billingDetails.vat?.vatId,
      })
    }
  }, [billingDetails])

  const handleCardChange = useCallback(() => {
    setShowCardDetailsModal.on()
  }, [setShowCardDetailsModal])

  const handleBillingChange = useCallback(() => {
    setShowBillingDetailsModal.on()
  }, [setShowBillingDetailsModal])

  return (
    <>
      <VStack align="stretch" spacing={6}>
        <Box mb={30} pl={[5, 0]}>
          <Text textStyle="bold/2xlarge">
            <Trans i18nKey="admin:billing.header" defaults="Billing" />
          </Text>
        </Box>

        <Card>
          <BillingCardHeader>
            <Trans i18nKey="admin:billing.plan.title" defaults="Plan" />
          </BillingCardHeader>
          <VStack align="stretch">
            <Text color="label.primary">
              <Trans
                i18nKey="admin:billing.plan.description"
                defaults="You are currently on the <b>{{ plan }}</b> plan."
                values={{ plan: enumI18nPlanName(plan?.name) }}
                components={{
                  b: <chakra.span fontWeight="bold" />,
                }}
              />
            </Text>
            {plan?.renewDate && (
              <Text color="label.secondary">
                <Trans
                  i18nKey="admin:billing.plan.renewDate"
                  defaults="Your next billing date is {{date}}."
                  values={{
                    date: dayjs(plan.renewDate).format('MMMM D, YYYY'),
                  }}
                />
              </Text>
            )}
          </VStack>
          <CardDivider my={6} />
          <Link color="accent.base" onClick={handlePlanChange}>
            <Trans
              i18nKey="admin:billing.plan.changePlan"
              defaults="Change plan"
            />{' '}
            <Icon as={ArrowRightLineIcon} />
          </Link>
        </Card>

        <Card>
          <BillingCardHeader
            buttonText={
              <Trans i18nKey="common:actions.change" defaults="Change" />
            }
            onButtonClick={() => {
              router.push(
                '/admin/network/billing/[purchase]',
                '/admin/network/billing/purchase',
              )
            }}
          >
            <Trans i18nKey="admin:billing.seats.title" defaults="Seats" />
          </BillingCardHeader>
          <Text color="label.primary">
            <Trans
              i18nKey="admin:billing.seats.current"
              defaults="You have <b>{{capacity}} seats</b>, {{unused}} of them currently unused."
              values={{
                capacity: network?.seatsCapacity,
                unused: network?.seatsCapacity - network?.seatCapacityDeclared,
              }}
              components={{
                b: <chakra.span fontWeight="bold" />,
              }}
            />{' '}
            <NextLink href="/admin/network/billing/purchase" passHref>
              <Link color="accent.base">
                <Trans
                  i18nKey="admin:billing.seats.manageTeammates"
                  defaults="Manage teammates"
                />
              </Link>
            </NextLink>
          </Text>
        </Card>

        {billingDetails?.card && (
          <Card>
            <BillingCardHeader
              buttonText={
                <Trans i18nKey="common:actions.change" defaults="Change" />
              }
              onButtonClick={handleCardChange}
            >
              <Trans
                i18nKey="admin:billing.paymentMethod.title"
                defaults="Payment method"
              />
            </BillingCardHeader>

            <PaymentMethodOverview cardInformation={billingDetails.card} />
          </Card>
        )}

        {billingDetails?.address && (
          <Card>
            <BillingCardHeader
              buttonText={
                <Trans i18nKey="common:actions.change" defaults="Change" />
              }
              onButtonClick={handleBillingChange}
            >
              <Trans
                i18nKey="admin:billing.billingDetails.title"
                defaults="Billing details"
              />
            </BillingCardHeader>

            <BillingDetailsOverview billingDetails={billingDetails} />
          </Card>
        )}

        {isPastPaymentsEnabled && <Invoices />}
      </VStack>

      <ThankYouModal
        planName={plan?.name}
        isOpen={showSuccessModal}
        onClose={setShowSuccessModal.off}
      />

      <CardDetailsModal
        isOpen={showCardDetailsModal}
        onClose={setShowCardDetailsModal.off}
      />

      <BillingDetailsModal
        isOpen={showBillingDetailsModal}
        onClose={setShowBillingDetailsModal.off}
      />
    </>
  )
}
