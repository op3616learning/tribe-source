import React, { useCallback } from 'react'

import { VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormlabelSecondary,
  Input,
  Text,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import ErrorForbidden from 'containers/Error/ErrorForbidden'
import useGetMember from 'containers/Member/hooks/useGetMember'
import useUpdateMember from 'containers/Member/hooks/useUpdateMember'

import { ResetPasswordSettingsFormValues } from '../@types'
import PasswordRuleIndicator from '../validation/PasswordRuleIndicator'
import { passwordRules, ruleErrorCodes } from '../validation/passwordRules'

export interface ResetPasswordSettingsProps {
  memberId: string
}

const ResetPasswordSettings = ({ memberId }: ResetPasswordSettingsProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { handleSubmit, control, errors, getValues, formState } = useForm<
    ResetPasswordSettingsFormValues
  >({
    defaultValues: {
      password: '',
      oldPassword: '',
      confirmPassword: '',
    },
    criteriaMode: 'all',
    mode: 'onChange',
  })

  const { member, loading: loadingMember } = useGetMember(memberId)
  const {
    errors: { password: passwordErrors },
    dirtyFields: { password: isPasswordTouched },
  } = formState

  const { loading, updateMember, error: serverError } = useUpdateMember()

  const { actionPermission: canResetPassword } = hasActionPermission(
    member?.authMemberProps?.permissions || [],
    'updateMember',
  )

  const onSubmit = useCallback(
    async (variables: ResetPasswordSettingsFormValues) => {
      const result = await updateMember(
        {
          currentPassword: variables.oldPassword,
          newPassword: variables.password,
        },
        memberId,
      )
      if (result.data) {
        toast({
          title: t('settings:password.title', {
            defaultValue: 'Password updated.',
          }),
          description: t('settings:password.description', {
            defaultValue: "We've changed your password.",
          }),
          status: 'success',
        })
      }
    },
    [updateMember, memberId, toast, t],
  )

  if (!canResetPassword && !loadingMember) {
    return <ErrorForbidden />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack width="100%" spacing={4}>
        <FormControl
          id="network-old-password"
          isInvalid={Boolean(errors.oldPassword)}
        >
          <FormlabelSecondary>
            <Trans
              i18nKey="network:auth.signinSettings.resetPassword.fields.oldPassword"
              defaults="Old password"
            />
          </FormlabelSecondary>

          <Controller
            as={<Input isInvalid={Boolean(errors.oldPassword)} />}
            name="oldPassword"
            control={control}
            autoCapitalize="none"
            placeholder={
              t(
                'network:auth.signinSettings.resetPassword.placeholders.oldPassword',
                {
                  defaultValue: 'Enter old password...',
                },
              ) as string
            }
            type="password"
            rules={{
              required: t(
                'network:auth.signinSettings.resetPassword.formError.oldPassword',
                {
                  defaultValue: 'Old password is required',
                },
              ) as string,
            }}
          />
          <FormErrorMessage>{errors?.oldPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl id="network-password" isInvalid={Boolean(errors.password)}>
          <FormlabelSecondary>
            <Trans
              i18nKey="network:auth.signinSettings.resetPassword.fields.password"
              defaults="New password"
            />
          </FormlabelSecondary>

          <Controller
            as={<Input isInvalid={Boolean(errors.password)} />}
            name="password"
            control={control}
            type="password"
            autoCapitalize="none"
            placeholder={
              t(
                'network:auth.signinSettings.resetPassword.placeholders.newPassword',
                {
                  defaultValue: 'Enter new password...',
                },
              ) as string
            }
            rules={{
              required: t('network:auth.errors.password', {
                defaultValue: 'Password is required',
              }) as string,
              validate: passwordRules,
            }}
          />
          {errors?.password?.type === 'required' && (
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          )}
          {isPasswordTouched &&
            Object.keys(ruleErrorCodes).map(type => (
              <PasswordRuleIndicator
                key={type}
                type={type}
                isValid={!passwordErrors?.types?.[type]}
                errorCode={t(ruleErrorCodes[type].i18nKey, {
                  defaultValue: ruleErrorCodes[type].default,
                })}
                isTouched={isPasswordTouched}
              />
            ))}
        </FormControl>

        <FormControl
          id="network-confirm-password"
          isInvalid={Boolean(errors?.confirmPassword)}
        >
          <FormlabelSecondary>
            <Trans
              i18nKey="network:auth.signinSettings.resetPassword.fields.confirmPassword"
              defaults="Repeat password"
            />
          </FormlabelSecondary>

          <Controller
            as={<Input isInvalid={Boolean(errors.confirmPassword)} />}
            name="confirmPassword"
            control={control}
            type="password"
            autoCapitalize="none"
            placeholder={
              t(
                'network:auth.signinSettings.resetPassword.placeholders.confirmPassword',
                {
                  defaultValue: 'Repeat new password...',
                },
              ) as string
            }
            rules={{
              required: t(
                'network:auth.signinSettings.resetPassword.formError.confirmPassword',
                {
                  defaultValue: 'Repeat password is required',
                },
              ) as string,
              validate: {
                equal: value => value === getValues('password'),
              },
            }}
          />
          <FormErrorMessage>
            {errors?.confirmPassword?.type === 'required' &&
              errors.confirmPassword.message}

            {errors?.confirmPassword?.type === 'equal' && (
              <Trans
                i18nKey="network:resetPassword.formError.confirm"
                defaults="The passwords do not match."
              />
            )}
          </FormErrorMessage>
        </FormControl>
      </VStack>

      <VStack align="start" mt={5} spacing={5}>
        {serverError && (
          <Text color="danger.base">
            {serverError.message || (
              <Trans
                i18nKey="network:auth.errors.commonError"
                defaults="Something Went wrong, please try again."
              />
            )}
          </Text>
        )}

        <Button
          isLoading={loading}
          disabled={loading}
          buttonType="primary"
          type="submit"
          mb={2}
        >
          <Trans
            i18nKey="network:auth.signinSettings.resetPassword.ctaText"
            defaults="Update"
          />
        </Button>
      </VStack>
    </form>
  )
}

export default ResetPasswordSettings
