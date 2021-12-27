import React, { useMemo } from 'react'

import { Flex } from '@chakra-ui/layout'
import { useMultiStyleConfig } from '@chakra-ui/system'
import { useRouter } from 'next/router'

import { hasActionPermission, SsoProvider } from 'tribe-api'
import { hasInputPermission, hasValuePermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownBox,
  DropdownList,
  DropdownItem,
  PlanBadge,
  Text,
  SelectTriggerBox,
} from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { SSO_PROVIDERS_NAME_DICT } from '../utils/sso.config'

const SsoProviderSelect = ({ value: formValue, onChange, name }) => {
  const { network } = useGetNetwork()

  const styles = useMultiStyleConfig('Select', { size: undefined })
  const router = useRouter()
  const { t } = useTranslation()
  const { actionPermission } = hasActionPermission(
    network.authMemberProps?.permissions || [],
    'updateCustomSso',
  )
  const { values } = hasInputPermission(
    actionPermission?.inputPermissions || [],
    'provider',
  )
  const options = useMemo(
    () => [
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.OUTSETA],
        value: SsoProvider.OUTSETA,
        permission: hasValuePermission(values, SsoProvider.OUTSETA),
      },
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.MEMBERFUL],
        value: SsoProvider.MEMBERFUL,
        permission: hasValuePermission(values, SsoProvider.MEMBERFUL),
      },
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.AUTH0],
        value: SsoProvider.AUTH0,
        permission: hasValuePermission(values, SsoProvider.AUTH0),
      },
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.OKTA],
        value: SsoProvider.OKTA,
        permission: hasValuePermission(values, SsoProvider.OKTA),
      },
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.WORDPRESS],
        value: SsoProvider.WORDPRESS,
        permission: hasValuePermission(values, SsoProvider.WORDPRESS),
      },
      {
        label: SSO_PROVIDERS_NAME_DICT[SsoProvider.CUSTOM],
        value: SsoProvider.CUSTOM,
        permission: hasValuePermission(values, SsoProvider.CUSTOM),
      },
    ],
    [values],
  )

  const selectedValue = formValue && {
    value: formValue,
    label: SSO_PROVIDERS_NAME_DICT[formValue],
  }
  return (
    <Dropdown defaultIsOpen={false}>
      <DropdownBox name={name} w="100%">
        <SelectTriggerBox
          selectedItem={selectedValue}
          placeholder={t(
            'admin.authentication.singleSignon.form.placeholder.selectProvider',
            'Select a provider',
          )}
        />
      </DropdownBox>
      <DropdownList>
        {options.map(item => (
          <DropdownItem
            d="flex"
            key={item.value}
            onClick={() => {
              if (item.permission.requiredPlan && !item.permission.authorized) {
                router.push('/admin/network/billing')
              } else {
                onChange(item.value)
              }
            }}
            sx={styles.item}
            isActive={formValue === item.value}
            w="full"
            justifyContent="flex-start"
            style={{ padding: '4px', boxShadow: 'none' }}
          >
            <Flex justifyContent="space-between" flex="1">
              <Text textStyle="medium/regular" fontSize="sm">
                {item.label}
              </Text>
              {item.permission?.requiredPlan && (
                <PlanBadge
                  plan={item.permission.requiredPlan}
                  isAuthorized={item.permission.authorized}
                />
              )}
            </Flex>
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  )
}

export default SsoProviderSelect
