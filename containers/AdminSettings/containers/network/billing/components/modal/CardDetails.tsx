import React, { useCallback, useEffect, useState } from 'react'

import { Flex, ModalFooter, VStack } from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'

import { CardInput } from 'tribe-api'
import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useResponsive,
  useToast,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { logger } from 'lib/logger'

import { useBillingDetails } from '../../hooks'
import { useUpdateBillingDetails } from '../../hooks/useUpdateBillingDetails'
import { CardCheckoutDetails } from '../checkout/CardDetails'

export interface CardModalFormInput {
  cardNumber: string
  expiryDate: string
  cvc: string
  nameOnCard: string
}

const staticProps = {
  modalContent: {
    common: {
      bg: 'bg.base',
      maxW: {
        base: 'full',
        sm: '90vw',
        md: 'md',
      },
      h: {
        base: 'full',
        md: 400,
      },
    },
    mobile: {
      maxH: 'auto',
      borderRadius: 0,
      fullSizeOniPhone: true,
      alignSelf: 'flex-start',
    },
  },
}

export const CardDetailsModal = ({ isOpen, onClose }) => {
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const { billingDetails } = useBillingDetails()
  const methods = useForm<CardModalFormInput>({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      nameOnCard: '',
    },
  })
  const { isPhone, mobileHeader } = useResponsive()
  useEffect(() => {
    if (isOpen) {
      mobileHeader.setLeft(
        <CloseButton
          size="sm"
          w={10}
          h={10}
          onClick={onClose}
          background="bg.secondary"
          borderRadius="base"
        />,
      )

      mobileHeader.setRight(null)
    }
  }, [isOpen])

  const { updateBillingDetails } = useUpdateBillingDetails()

  const handleSubmit = useCallback(
    async (data: CardModalFormInput) => {
      setLoading(true)
      try {
        const [expirationMonth, expirationYear] = data.expiryDate?.split('/')

        const card = {
          cardNumber: `${data.cardNumber}`.split(' ').join(''),
          cvc: data.cvc,
          expirationMonth: parseInt(expirationMonth?.trim(), 10),
          expirationYear: parseInt(expirationYear?.trim(), 10),
          nameOnCard: data.nameOnCard,
        } as CardInput

        const { errors } = await updateBillingDetails({
          card,
          // We need to pass all the inputs for stripe to save it. (Not just the card)
          billingEmail: billingDetails?.billingEmail,
          address: {
            city: billingDetails?.address?.city,
            country: billingDetails?.address?.country || '',
            state: billingDetails?.address?.state,
            streetAddress: billingDetails?.address?.streetAddress,
            postalCode: billingDetails?.address?.postalCode,
          },
          companyName: billingDetails?.companyName,
        })
        setLoading(false)
        if (errors) {
          toast({
            title: errors[0]?.message,
            status: 'error',
          })
        } else {
          onClose()
        }
      } catch (e) {
        toast({
          title: e?.message,
          status: 'error',
        })
        setLoading(false)
        logger.error('Error while updating card details in modal', e)
      }
    },
    [onClose, toast, updateBillingDetails, billingDetails],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <ModalContent
              {...staticProps.modalContent.common}
              {...(isPhone && staticProps.modalContent.mobile)}
              fullSizeOniPhone
            >
              <ModalHeader color="label.primary" pt={6}>
                <Flex justify="center">
                  <Trans
                    i18nKey="admin:billing.modal.changeCard.heading"
                    defaults="Update Card Details"
                  />
                </Flex>
              </ModalHeader>
              <ModalCloseButton color="label.primary" />

              <ModalBody overflowX="hidden" pt={2}>
                <VStack align="stretch" spacing="4">
                  <CardCheckoutDetails />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Flex justifyItems="flex-end">
                  <Button
                    isLoading={loading}
                    disabled={loading}
                    type="submit"
                    buttonType="primary"
                    data-testid="add-button"
                  >
                    <Trans
                      i18nKey="admin:billing.modal.changeCard.button"
                      defaults="Update"
                    />
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </form>
        </FormProvider>
      </ModalOverlay>
    </Modal>
  )
}
