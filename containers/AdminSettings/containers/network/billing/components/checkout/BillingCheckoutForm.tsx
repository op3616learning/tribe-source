import React from 'react'

import { VStack } from '@chakra-ui/react'
import { Country } from 'countries-list'

import { VatInput, VatType } from 'tribe-api'

import { BillingCheckoutDetails } from './BillingDetails'
import { CardCheckoutDetails } from './CardDetails'

export interface VatTypeFormInput {
  id: VatType
  name: string
}

export interface BillingCheckoutFormInput {
  cardNumber: string
  expiryDate: string
  cvc: string
  nameOnCard: string
  email: string
  country: Country & { id: string }
  streetAddress: string
  city: string
  state?: { id: string } | null
  postalCode: string
  companyName?: string
  vatType?: VatTypeFormInput
  vatId?: VatInput['vatId']
}

export enum BillingCheckoutFormDisplayType {
  card = 'CARD',
  billing = 'BILLING',
}

interface BillingCheckoutFormProps {
  displayType: BillingCheckoutFormDisplayType
}

export const BillingCheckoutForm = ({
  displayType,
}: BillingCheckoutFormProps) => {
  return (
    <>
      <VStack align="stretch" spacing="4">
        {displayType === BillingCheckoutFormDisplayType.card && (
          <CardCheckoutDetails />
        )}

        {displayType === BillingCheckoutFormDisplayType.billing && (
          <BillingCheckoutDetails />
        )}
      </VStack>
    </>
  )
}
