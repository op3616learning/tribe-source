import React from 'react'

import { VStack } from '@chakra-ui/react'

import { PlanName } from 'tribe-api'
import {
  Button,
  Emoji,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { enumI18nPlanName } from 'utils/enums'

export interface ThankYouModalProps {
  planName: PlanName
  isOpen: boolean
  onClose: () => void
}

export const ThankYouModal = ({ planName, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay>
        <ModalContent>
          <ModalBody>
            <VStack spacing="5" textAlign="center">
              <Emoji src="tada" size="lg" />
              <Text color="label.primary" textStyle="medium/large">
                <Trans
                  i18nKey="admin:billing.plan.welcome.title"
                  defaults="Welcome to {{plan}}"
                  values={{
                    plan: enumI18nPlanName(planName),
                  }}
                />
              </Text>
              <Text color="label.primary" textStyle="medium/medium">
                <Trans
                  i18nKey="admin:billing.plan.welcome.description"
                  defaults="Congratulations for continuing your journey with Tribe!
                   We’ve sent you an email with everything you need to know to make the best out of the {{plan}} plan. Enjoy!"
                  values={{
                    plan: enumI18nPlanName(planName),
                  }}
                />
              </Text>
              <Button variant="outline" width="full" onClick={onClose}>
                <Trans i18nKey="common:actions.continue" defaults="Continue" />
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
