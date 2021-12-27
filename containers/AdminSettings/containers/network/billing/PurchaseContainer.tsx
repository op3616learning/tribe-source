import React, { useCallback, useEffect, useState } from 'react'

import { Flex, HStack, Spacer, useBoolean, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'
import CheckIcon from 'remixicon-react/CheckLineIcon'
import LockFillIcon from 'remixicon-react/LockFillIcon'

import {
  PlanRenewalType,
  PlanName,
  PurchaseInput,
  SubscriptionStatus,
  CardInput,
} from 'tribe-api'
import {
  Button,
  Card,
  CardDivider,
  Icon,
  Link,
  Text,
  useToast,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import {
  StickySidebarLayout,
  StickySidebarLayoutMain,
  StickySidebarLayoutSidebar,
} from 'components/Layout'

import {
  BasketSummary,
  BillingCardHeader,
  BillingCheckoutForm,
  BillingCheckoutFormDisplayType,
  BillingCheckoutFormInput,
  BillingDetailsOverview,
  NumberInput,
  PaymentMethodOverview,
} from 'containers/AdminSettings/containers/network/billing/components'
import {
  useBillingDetails,
  usePurchase,
} from 'containers/AdminSettings/containers/network/billing/hooks'
import { useContactSales } from 'containers/AdminSettings/containers/network/billing/hooks/useContactSales'
import {
  calculateUpgradePlan,
  getCapacity,
  getDescription,
  getDisplayPrice,
  getDisplayPriceDetails,
  getFeatures,
  getSeatsCapacity,
} from 'containers/AdminSettings/containers/network/billing/utils/plan.utils'
import { PricingPrice } from 'containers/Billing/Pricing'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanRenewalType, enumI18nPlanName } from 'utils/enums'

dayjs.extend(relativeTime)

const planRenewalTypeFromQuery = (
  queryRenewal: string,
): PlanRenewalType | null => {
  switch (queryRenewal as string) {
    case 'month':
      return PlanRenewalType.MONTH
    case 'year':
      return PlanRenewalType.YEAR
    default:
      return null
  }
}
const planNameFromQuery = (queryPlan: string): PlanName | null => {
  switch (queryPlan as string) {
    case 'basic':
      return PlanName.BASIC
    case 'plus':
      return PlanName.PLUS
    case 'premium':
      return PlanName.PREMIUM
    default:
      return null
  }
}

export const PurchaseContainer = () => {
  const router = useRouter()
  const { renewal: queryRenewal, plan: queryPlan } = router.query
  const { network } = useGetNetwork()

  const { billingDetails } = useBillingDetails()

  const [changeCard, setChangeCard] = useBoolean(false)
  const [changeBilling, setChangeBilling] = useBoolean(false)
  const { openChat } = useContactSales()
  const toast = useToast()

  const plan = network?.subscriptionPlan

  const initialPlanName =
    planNameFromQuery(queryPlan as string) || plan?.name || PlanName.BASIC
  const [planName, setPlanName] = useState<PlanName>(initialPlanName)

  const initialRenewalType =
    planRenewalTypeFromQuery(queryRenewal as string) ||
    plan?.renewalType ||
    PlanRenewalType.MONTH
  const [renewalType, setRenewalType] = useState<PlanRenewalType>(
    initialRenewalType,
  )

  const [seats, setSeats] = useState<number>(
    plan?.trial
      ? getCapacity(planName)
      : getSeatsCapacity(network?.seatsCapacity, planName),
  )

  const isTouched =
    plan?.name !== initialPlanName ||
    plan?.renewalType !== initialRenewalType ||
    seats !== getCapacity(planName) ||
    plan?.trial

  useEffect(() => {
    const type = planRenewalTypeFromQuery(queryRenewal as string)
    if (type) {
      setRenewalType(type)
    }
  }, [queryRenewal])

  useEffect(() => {
    const name = planNameFromQuery(queryPlan as string)
    if (name) {
      setPlanName(name)
    }
  }, [queryPlan])

  const upgradePlanName = calculateUpgradePlan(planName)

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
        state: { id: billingDetails.address?.state || '' },
        vatType: {
          id: billingDetails.vat?.vatType,
          name: billingDetails.vat?.text || '',
        },
        vatId: billingDetails.vat?.vatId,
      })
    }
  }, [billingDetails])

  const { purchase } = usePurchase()

  const handleSubmit = async (data: BillingCheckoutFormInput) => {
    const input: PurchaseInput = {
      planName,
      renewalType,
      seats,
    }

    const billingDetails: PurchaseInput['billingDetails'] = {}
    if (data.cardNumber && data.expiryDate) {
      const [expirationMonth, expirationYear] = data.expiryDate?.split('/')

      billingDetails.card = {
        cardNumber: `${data.cardNumber}`.split(' ').join(''),
        cvc: data.cvc,
        expirationMonth: parseInt(expirationMonth?.trim(), 10),
        expirationYear: parseInt(expirationYear?.trim(), 10),
        nameOnCard: data.nameOnCard,
      } as CardInput
    }

    if (
      data.email ||
      data.companyName ||
      data.country ||
      data.city ||
      data.streetAddress ||
      data.vatId
    ) {
      billingDetails.address = {
        city: data.city,
        country: `${data.country?.id}`.toLowerCase(),
        postalCode: data.postalCode,
        state: ['US', 'CA']?.includes(data.country?.id)
          ? data.state?.id
          : undefined,
        streetAddress: data.streetAddress,
      }

      billingDetails.billingEmail = data?.email
      billingDetails.companyName = data?.companyName
      billingDetails.vat =
        data?.vatType && data?.vatId
          ? {
              vatType: data.vatType.id,
              vatId: data.vatId,
            }
          : undefined
    }

    if (Object.keys(billingDetails).length > 0) {
      input.billingDetails = billingDetails
    }

    const result = await purchase(input)
    const status = result?.data?.purchase?.status
    if (result.errors && result.errors?.length > 0) {
      toast({
        title:
          result.errors[0]?.message ||
          'We were not able to process your payment, please make sure that the billing information you provided is valid, and try again.',
        status: 'error',
      })
    }
    if (status === SubscriptionStatus.ACTIVE && typeof window !== 'undefined') {
      window.location.href = '/admin/network/billing?welcome'
    } else if (status === SubscriptionStatus.FAILED) {
      toast({
        title:
          'We were not able to process your payment, please make sure that the billing information you provided is valid, and try again.',
        status: 'error',
      })
    } else if (!result.errors) {
      toast({
        title:
          'We were not able to process your payment, please make sure that the billing information you provided is valid, and try again.',
        status: 'info',
      })
    }
  }

  const changeCardInformation = useCallback(() => {
    setChangeCard.on()
  }, [setChangeCard])

  const changeBillingInformation = useCallback(() => {
    setChangeBilling.on()
  }, [setChangeBilling])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <HStack px={2} color="label.secondary" mb={8}>
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

        <Text px={2} textStyle="bold/2xlarge">
          <Trans
            i18nKey="admin:billing.purchase.header"
            defaults="Customize your plan"
          />
        </Text>

        <StickySidebarLayout>
          <StickySidebarLayoutMain py={8}>
            <VStack align="stretch" spacing={6}>
              <Card>
                <BillingCardHeader>
                  <Trans i18nKey="admin:billing.plan.title" defaults="Plan" />
                </BillingCardHeader>

                <VStack align="start" spacing="5">
                  <Text textStyle="bold/2xlarge" color="label.primary">
                    {enumI18nPlanName(planName)} (
                    {enumI18nPlanRenewalType(renewalType)})
                  </Text>
                  <VStack align="start" spacing="2">
                    <PricingPrice
                      price={getDisplayPrice(planName, renewalType)}
                    />
                    <Text textStyle="medium/small" color="label.secondary">
                      {getDisplayPriceDetails(planName, renewalType)}
                    </Text>
                  </VStack>
                  <Text textStyle="medium/small" color="label.primary">
                    {getDescription(planName)}
                  </Text>
                  <VStack align="start" spacing="5">
                    {getFeatures(planName).map(feature => (
                      <HStack spacing="2" key={feature}>
                        <Icon as={CheckIcon} />
                        <Text textStyle="medium/small" color="label.primary">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Card>

              {false && upgradePlanName && (
                <Card>
                  <BillingCardHeader>
                    <Trans
                      i18nKey="admin:billing.purchase.upgrade.title"
                      defaults="Not included in {{currentPlan}}"
                      values={{
                        currentPlan: enumI18nPlanName(planName),
                      }}
                    />
                  </BillingCardHeader>

                  <VStack align="start" spacing="5">
                    <Text color="label.primary">
                      <Trans
                        i18nKey="admin:billing.purchase.upgrade.description"
                        defaults="Here’s what’s not included in {{currentPlan}} that you’re getting at the moment with {{upgradePlan}}."
                        values={{
                          currentPlan: enumI18nPlanName(planName),
                          upgradePlan: enumI18nPlanName(upgradePlanName),
                        }}
                      />
                    </Text>

                    <VStack align="start" spacing="5">
                      {getFeatures(upgradePlanName)?.map(feature => (
                        <HStack spacing="2" key={feature}>
                          <Icon as={LockFillIcon} />
                          <Text textStyle="medium/small" color="label.primary">
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>

                  <CardDivider my={6} />

                  <Link
                    color="accent.base"
                    href="#"
                    onClick={() => {
                      if (upgradePlanName === PlanName.ENTERPRISE) {
                        openChat(upgradePlanName)
                      } else {
                        router.push(
                          `/admin/network/billing/purchase?renewal=${renewalType.toLowerCase()}&plan=${upgradePlanName?.toLowerCase()}`,
                        )
                      }
                    }}
                  >
                    <Trans
                      i18nKey="admin:billing.purchase.upgrade.teaser"
                      defaults="Can’t live without them? Get {{upgradePlan}}"
                      values={{
                        upgradePlan: enumI18nPlanName(upgradePlanName),
                      }}
                    />{' '}
                    <Icon as={ArrowRightLineIcon} />
                  </Link>
                </Card>
              )}

              <Card>
                <BillingCardHeader>
                  <Trans
                    i18nKey="admin:billing.purchase.seats.title"
                    defaults="Manage seats"
                  />
                </BillingCardHeader>
                <VStack align="start" spacing="4">
                  <Text color="label.primary">
                    <Trans
                      i18nKey="admin:billing.purchase.seats.description"
                      defaults="This plan includes {{capacity}} staff seats. Add more seats for members
                  that need admin or moderation permissions."
                      values={{
                        capacity: getCapacity(planName),
                      }}
                    />
                  </Text>
                  <NumberInput
                    value={seats}
                    onChange={(_, value) => {
                      setSeats(value)
                    }}
                    min={getCapacity(planName)}
                    max={200}
                  />
                </VStack>
              </Card>

              {changeCard || !billingDetails?.card ? (
                <Card>
                  <BillingCardHeader>
                    <Trans
                      i18nKey="admin:billing.purchase.cardDetails.title"
                      defaults="Card details"
                    />
                  </BillingCardHeader>

                  <BillingCheckoutForm
                    displayType={BillingCheckoutFormDisplayType.card}
                  />
                </Card>
              ) : (
                <Card>
                  <Flex>
                    <BillingCardHeader>
                      <Trans
                        i18nKey="admin:billing.paymentMethod.title"
                        defaults="Payment method"
                      />
                    </BillingCardHeader>
                    <Spacer />
                    <Button
                      onClick={changeCardInformation}
                      data-testid="change-card-payment-method"
                    >
                      <Trans
                        i18nKey="common:actions.change"
                        defaults="Change"
                      />
                    </Button>
                  </Flex>

                  {billingDetails?.card && (
                    <PaymentMethodOverview
                      cardInformation={billingDetails.card}
                    />
                  )}
                </Card>
              )}

              {changeBilling ||
              !(
                billingDetails?.address?.city &&
                billingDetails?.address?.streetAddress &&
                billingDetails?.companyName &&
                billingDetails?.billingEmail
              ) ? (
                <Card>
                  <BillingCardHeader>
                    <Trans
                      i18nKey="admin:billing.purchase.billingDetails.title"
                      defaults="Billing details"
                    />
                  </BillingCardHeader>

                  <BillingCheckoutForm
                    displayType={BillingCheckoutFormDisplayType.billing}
                  />
                </Card>
              ) : (
                <Card>
                  <Flex>
                    <BillingCardHeader>
                      <Trans
                        i18nKey="admin:billing.billingDetails.title"
                        defaults="Billing details"
                      />
                    </BillingCardHeader>
                    <Spacer />
                    <Button
                      data-testid="change-billing-payment-method"
                      onClick={changeBillingInformation}
                    >
                      <Trans
                        i18nKey="common:actions.change"
                        defaults="Change"
                      />
                    </Button>
                  </Flex>

                  {billingDetails && (
                    <BillingDetailsOverview billingDetails={billingDetails} />
                  )}
                </Card>
              )}
            </VStack>
          </StickySidebarLayoutMain>
          <StickySidebarLayoutSidebar py={8}>
            <BasketSummary
              isBasketDisabled={!isTouched}
              isFormPresent={!billingDetails?.card || changeCard}
              planName={planName}
              onRenewalTypeChange={setRenewalType}
              renewalType={renewalType}
              seats={seats}
            />
          </StickySidebarLayoutSidebar>
        </StickySidebarLayout>
      </form>
    </FormProvider>
  )
}
