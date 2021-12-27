import React, { memo, useMemo } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  SearchableSelect,
  Skeleton,
  Text,
  useDeepMemo,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useVatTypes from '../hooks/useVatTypes'

const VatSelectFormControl = () => {
  const { t } = useTranslation()
  const { vatTypes, loading, refetch, error } = useVatTypes()
  const {
    errors,
    watch,
    register,
    control,
    setValue,
    getValues,
  } = useFormContext()
  const watchedVatType = watch('vatType')
  const doesVatAlreadyExist = Boolean(
    watchedVatType?.id || getValues().vatType?.id,
  )

  const vatType = useMemo(
    () =>
      watchedVatType && vatTypes
        ? vatTypes?.find(v => v.key === watchedVatType?.id)
        : undefined,
    [watchedVatType, vatTypes],
  )
  const VAT_OPTIONS = useDeepMemo(
    () =>
      vatTypes?.map(vat => ({
        label: vat?.text,
        value: {
          id: vat?.key,
          name: vat?.text,
        },
      })),
    vatTypes,
  )

  if (error) {
    return (
      <FormControl>
        <FormLabel>
          <Trans
            i18nKey="admin:billing.purchase.vatType.label"
            defaults="VAT Type"
          />
        </FormLabel>
        <Text>
          Please try to <Link onClick={() => refetch()}>reload</Link> this
          component
        </Text>
      </FormControl>
    )
  }

  return (
    <>
      <FormControl
        id="vatType"
        zIndex="second"
        isInvalid={!!errors?.vatType?.message}
      >
        <FormLabel htmlFor="vatType">
          <Trans
            i18nKey="admin:billing.purchase.vatType.label"
            defaults="VAT Type"
          />
        </FormLabel>
        <Skeleton isLoaded={!loading}>
          <Controller
            name="vatType"
            control={control}
            render={({ onBlur, onChange, value, name }) => (
              <SearchableSelect
                name={name}
                value={value}
                data-testid="vattype-field"
                placeholder={t(
                  'admin:billing.purchase.vatType.placeholder',
                  'Select a Vat Type (Optional)',
                )}
                onChange={value => {
                  setValue('vatId', '')
                  onChange(value)
                }}
                onBlur={onBlur}
                options={VAT_OPTIONS || []}
                isLazy
                listViewContentProps={{
                  maxW: 'xl',
                  w: 'max-content',
                }}
              />
            )}
          />
        </Skeleton>
        <FormErrorMessage>{errors?.vatType?.message}</FormErrorMessage>
      </FormControl>

      {doesVatAlreadyExist && (
        <FormControl id="vatId" isInvalid={!!errors?.vatId?.message}>
          <FormLabel htmlFor="vatId">
            <Trans
              i18nKey="admin:billing.purchase.vatId.label"
              defaults="VAT ID"
            />
          </FormLabel>
          <Input
            data-testid="vatid-field"
            name="vatId"
            ref={register({
              required: {
                value: true,
                message: t('common:validation.empty', {
                  defaultValue: "This field can't be empty",
                }),
              },
            })}
            placeholder={t(
              'admin:billing.purchase.vatId.placeholder',
              'ex. {{ example }}',
              { example: vatType?.placeholder || '12345678912' },
            )}
          />
          <FormErrorMessage>{errors?.vatId?.message}</FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default memo(VatSelectFormControl)
