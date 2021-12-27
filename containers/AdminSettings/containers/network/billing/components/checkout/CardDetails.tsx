import React from 'react'

import { Box, Flex } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

export const CardCheckoutDetails = () => {
  const { t } = useTranslation()
  const { register, errors, control } = useFormContext()
  const {
    meta,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
  } = usePaymentInputs()
  const required = {
    required: {
      value: true,
      message: t('common:validation.empty', {
        defaultValue: "This field can't be empty",
      }),
    },
  }
  return (
    <>
      <FormControl id="card" isInvalid={!!errors?.card?.message}>
        <FormLabel htmlFor="card">
          <Trans
            i18nKey="admin:billing.purchase.card.label"
            defaults="Credit card number"
          />
        </FormLabel>
        <input
          type="hidden"
          ref={register({
            validate: () => meta.error,
          })}
          name="card"
        />
        <Flex
          border="1px"
          borderColor={errors?.card?.message ? 'danger.base' : 'border.base'}
          bgColor={errors?.card?.message ? 'danger.lite' : undefined}
          p={3}
          borderRadius="base"
          alignItems="center"
        >
          <Box width={6} mr={2}>
            <svg {...getCardImageProps({ images })} />
          </Box>
          <Flex width="11rem" grow={1} mr={2}>
            <Controller
              control={control}
              name="cardNumber"
              rules={required}
              render={({ value, onChange, onBlur }) => (
                <Input
                  variant="unstyled"
                  {...getCardNumberProps({ value, onChange, onBlur })}
                />
              )}
            />
          </Flex>
          <Box width="4rem" mr={2}>
            <Controller
              control={control}
              name="expiryDate"
              rules={required}
              render={({ value, onChange, onBlur }) => (
                <Input
                  variant="unstyled"
                  {...getExpiryDateProps({ value, onChange, onBlur })}
                />
              )}
            />
          </Box>
          <Box width="2.5rem">
            <Controller
              control={control}
              name="cvc"
              rules={required}
              render={({ value, onChange, onBlur }) => (
                <Input
                  variant="unstyled"
                  {...getCVCProps({
                    value,
                    onChange,
                    onBlur,
                    type: 'password',
                  })}
                />
              )}
            />
          </Box>
        </Flex>
        <FormErrorMessage>{errors?.card?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="nameOnCard" isInvalid={!!errors?.nameOnCard?.message}>
        <FormLabel htmlFor="nameOnCard">
          <Trans
            i18nKey="admin:billing.purchase.nameOnCard.label"
            defaults="Name on card"
          />
        </FormLabel>
        <Input
          name="nameOnCard"
          ref={register(required)}
          autocomplete="cc-name"
        />
        <FormErrorMessage>{errors?.nameOnCard?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}
