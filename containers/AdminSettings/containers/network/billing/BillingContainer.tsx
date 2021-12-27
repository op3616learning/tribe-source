import React from 'react'

import { Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { PlanName } from 'tribe-api/interfaces/interface.generated'

import { PurchaseContainer } from 'containers/AdminSettings/containers/network/billing/PurchaseContainer'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { BillingDetailsContainer } from './BillingDetailsContainer'
import { BillingTrialContainer } from './BillingTrialContainer'
import { PlansContainer } from './PlansContainer'

export const BillingContainer = () => {
  const { query } = useRouter()
  const { section } = query
  const { network } = useGetNetwork()

  if (section === 'purchase') {
    return (
      <Container maxW="1096px" px={{ base: 0, sm: 8 }} py={8}>
        <PurchaseContainer />
      </Container>
    )
  }

  if (section === 'plans') {
    return (
      <Container maxW="1096px" px={{ base: 0, sm: 8 }} py={8}>
        <PlansContainer />
      </Container>
    )
  }

  if (
    network?.subscriptionPlan?.trial ||
    network?.subscriptionPlan?.name === PlanName.BASIC
  ) {
    return (
      <Container maxW="1096px" px={{ base: 0, sm: 8 }} py={8}>
        <BillingTrialContainer />
      </Container>
    )
  }

  return (
    <Container maxW="1096px" px={{ base: 0, sm: 8 }} py={8}>
      <BillingDetailsContainer />
    </Container>
  )
}
