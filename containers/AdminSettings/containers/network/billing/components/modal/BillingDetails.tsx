import React, { useCallback, useEffect, useState } from 'react'

import { Flex, ModalFooter, VStack } from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'

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

import { BillingCheckoutFormInput } from '..'
import { useBillingDetails } from '../../hooks'
import { useUpdateBillingDetails } from '../../hooks/useUpdateBillingDetails'
import { BillingCheckoutDetails } from '../checkout/BillingDetails'

type BillingModalFormInput = Omit<
  BillingCheckoutFormInput,
  'cardNumber, expiryDate,cvc, nameOnCard'
>

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
        md: 800,
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

export const BillingDetailsModal = ({ isOpen, onClose }) => {
  const toast = useToast()
  const { billingDetails } = useBillingDetails()
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<BillingModalFormInput>({
    defaultValues: {
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
    async (data: BillingModalFormInput) => {
      setLoading(true)
      try {
        const address = {
          city: data.city,
          country: `${data.country?.id}`.toLowerCase(),
          postalCode: data.postalCode,
          state: ['US', 'CA']?.includes(data.country?.id)
            ? data.state?.id
            : undefined,
          streetAddress: data.streetAddress,
        }

        const { errors } = await updateBillingDetails({
          address,
          companyName: data.companyName || undefined,
          billingEmail: data?.email,
          vat:
            data?.vatType && data?.vatId
              ? {
                  vatType: data.vatType.id,
                  vatId: data.vatId,
                }
              : undefined,
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
        logger.error('Error while updating billing details in modal', e)
      }
    },
    [onClose, toast, updateBillingDetails],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
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
                    i18nKey="admin:billing.modal.changeBilling.heading"
                    defaults="Update Billing Details"
                  />
                </Flex>
              </ModalHeader>
              <ModalCloseButton color="label.primary" />

              <ModalBody overflowY="auto" overflowX="hidden" pt={2}>
                <VStack align="stretch" spacing="4">
                  <BillingCheckoutDetails />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Flex justifyItems="flex-end">
                  <Button
                    isLoading={loading}
                    disabled={loading}
                    type="submit"
                    buttonType="primary"
                    data-testid="update-billing-button"
                  >
                    <Trans
                      i18nKey="admin:billing.modal.changeBulling.button"
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
