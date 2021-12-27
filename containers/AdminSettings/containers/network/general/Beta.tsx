import React, { RefObject, useCallback, useRef } from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { NetworkReleaseChannelType } from 'tribe-api/interfaces'
import {
  Skeleton,
  Switch,
  UserBar,
  FormControl,
  Link,
  useToast,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useAnalytics from 'hooks/useAnalytics'
import useUpdateNetwork from 'hooks/useUpdateNetwork'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'

type NetworkReleaseChannelFormValues = {
  betaEnabled: boolean
}

const BetaSettings = () => {
  const { network } = useGetNetwork()
  const toast = useToast()
  const { updateNetwork, loading } = useUpdateNetwork()
  const tracker = useAnalytics()
  const betaEnabled = network.releaseChannel === NetworkReleaseChannelType.EDGE

  const onSubmit = useCallback(
    async (data: NetworkReleaseChannelFormValues) => {
      const { betaEnabled } = data
      const releaseChannel = betaEnabled
        ? NetworkReleaseChannelType.EDGE
        : NetworkReleaseChannelType.STABLE
      await updateNetwork({
        releaseChannel,
      })
      tracker.track('Release Channel Changed', {
        status: releaseChannel,
      })
      if (betaEnabled) {
        tracker.flush()
        toast({
          title: 'Beta Enabled!',
          description: 'You will be redirected to the beta version shortly...',
          status: 'success',
          isClosable: false,
          position: 'top-right',
        })
        setTimeout(() => {
          window.location.href = '/'
        }, 5000)
      }
    },
    [updateNetwork, toast],
  )

  const { handleSubmit, control } = useForm<NetworkReleaseChannelFormValues>({
    defaultValues: {
      betaEnabled,
    },
  })

  const formRef = useRef(null)

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
      <SettingsGroupHeader>
        <Trans i18nKey="admin:beta.title" defaults="Beta" />
      </SettingsGroupHeader>
      <Box bg="bg.base" boxShadow="lowLight" p="20px" borderRadius="base">
        <Skeleton>
          <VStack spacing={6}>
            <FormControl>
              <HStack justify="space-between">
                <UserBar
                  withPicture={false}
                  title={
                    <Trans i18nKey="admin:beta.enable" defaults="Enable Beta" />
                  }
                  subtitle={
                    <>
                      <Trans
                        i18nKey="admin:beta.description"
                        defaults="Enable beta version of tribe for your community"
                      />{' '}
                      <Link href="https://tribe.so/beta" target="_blank">
                        Learn More
                      </Link>
                    </>
                  }
                />
                <Controller
                  id="beta-toggle"
                  name="betaEnabled"
                  render={({ onChange, value }) => (
                    <Switch
                      isChecked={value}
                      isDisabled={loading}
                      onChange={() => {
                        onChange(!value)
                        ;(formRef as RefObject<
                          HTMLFormElement
                        >).current?.dispatchEvent(
                          new Event('submit', { cancelable: true }),
                        )
                      }}
                    />
                  )}
                  control={control}
                />
              </HStack>
            </FormControl>
          </VStack>
        </Skeleton>
      </Box>
    </Box>
  )
}

export default BetaSettings
