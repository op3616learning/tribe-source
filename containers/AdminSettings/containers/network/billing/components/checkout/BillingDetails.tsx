import React from 'react'

import { countries } from 'countries-list'
import { Controller, useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SearchableSelect,
  Select,
  Text,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { EMAIL_PATTERN } from 'utils/validator.utils'

import States from '../../data/states'
import VatSelectFormControl from '../VatSelectFormControl'

const COUNTRIES_OPTIONS = Object.entries(countries).map(([code, country]) => ({
  label: country.name,
  value: {
    id: code,
    name: country.name,
  },
  icon: <Text mr={1}>{country.emoji}</Text>,
}))

const CountrySelectRenderer = ({ name, onChange, value, onBlur }) => {
  const { t } = useTranslation()

  return (
    <SearchableSelect
      name={name}
      value={value}
      placeholder={t(
        'admin:billing.purchase.country.placeholder',
        'Select an option',
      )}
      onChange={onChange}
      onBlur={onBlur}
      options={COUNTRIES_OPTIONS}
      isLazy
    />
  )
}

export const BillingCheckoutDetails = () => {
  const { t } = useTranslation()
  const { register, errors, control, watch } = useFormContext()
  const watchCountry = watch('country')

  const getStateOptions = () => {
    const country = watchCountry?.id
    return States(country).map(country => ({
      label: country,
      value: {
        id: country,
        name: country,
      },
    }))
  }

  const StateSelectRenderer = ({ name, onChange, value, onBlur }) => {
    return (
      <Select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        options={getStateOptions()}
        isLazy
      />
    )
  }

  const required = {
    required: {
      value: true,
      message: "This field can't be empty",
    },
  }
  return (
    <>
      <FormControl id="companyName" isInvalid={!!errors?.companyName?.message}>
        <FormLabel htmlFor="companyName">
          <Trans
            i18nKey="admin:billing.purchase.companyName.label"
            defaults="Company name"
          />
        </FormLabel>
        <Input
          name="companyName"
          ref={register}
          placeholder={t('common:validation.optional', 'Optional')}
        />
        <FormErrorMessage>{errors?.companyName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="email" isInvalid={!!errors?.email?.message}>
        <FormLabel htmlFor="email">
          <Trans
            i18nKey="admin:billing.purchase.email.label"
            defaults="Billing email"
          />
        </FormLabel>
        <Controller
          as={<Input autocomplete="email" />}
          name="email"
          control={control}
          autoCapitalize="none"
          rules={{
            required: t('admin:billing.purchase.email.validation.required', {
              defaultValue: 'Email is required',
            }) as string,
            pattern: {
              value: EMAIL_PATTERN,
              message: t('admin:billing.purchase.email.validation.format', {
                defaultValue: 'Invalid email address',
              }),
            },
          }}
        />
        <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        zIndex="second"
        id="country"
        isInvalid={!!errors?.country?.message}
      >
        <FormLabel htmlFor="country">
          <Trans
            i18nKey="admin:billing.purchase.country.label"
            defaults="Country or region"
          />
        </FormLabel>
        <Controller
          control={control}
          name="country"
          rules={{
            validate: value => {
              if (!value?.id?.length) {
                return required.required.message
              }
            },
          }}
          defaultValue={null}
          render={CountrySelectRenderer}
        />
        <FormErrorMessage>{errors?.country?.message}</FormErrorMessage>
      </FormControl>

      {['CA', 'US'].includes(watchCountry?.id) && (
        <FormControl id="state" isInvalid={!!errors?.state?.message}>
          <FormLabel htmlFor="state">
            <Trans
              i18nKey="admin:billing.purchase.state.label"
              defaults="State or province"
            />
          </FormLabel>
          <Controller
            control={control}
            name="state"
            rules={{
              validate: value => {
                if (!value?.id?.length) {
                  return required.required.message
                }
              },
            }}
            defaultValue={null}
            render={StateSelectRenderer}
          />
          <FormErrorMessage>{errors?.state?.message}</FormErrorMessage>
        </FormControl>
      )}

      <FormControl
        id="streetAddress"
        isInvalid={!!errors?.streetAddress?.message}
      >
        <FormLabel htmlFor="streetAddress">
          <Trans
            i18nKey="admin:billing.purchase.streetAddress.label"
            defaults="Street address"
          />
        </FormLabel>
        <Input
          name="streetAddress"
          ref={register(required)}
          autocomplete="shipping street-address"
        />
        <FormErrorMessage>{errors?.streetAddress?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="city" isInvalid={!!errors?.city?.message}>
        <FormLabel htmlFor="city">
          <Trans i18nKey="admin:billing.purchase.city.label" defaults="City" />
        </FormLabel>
        <Input name="city" ref={register(required)} autocomplete="shipping" />
        <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="postalCode" isInvalid={!!errors?.postalCode?.message}>
        <FormLabel htmlFor="postalCode">
          <Trans
            i18nKey="admin:billing.purchase.postalCode.label"
            defaults="Postal code"
          />
        </FormLabel>
        <Input
          name="postalCode"
          ref={register}
          autocomplete="shipping postal-code"
          placeholder={t('common:validation.optional', 'Optional')}
        />
        <FormErrorMessage>{errors?.postalCode?.message}</FormErrorMessage>
      </FormControl>

      <VatSelectFormControl />
    </>
  )
}
