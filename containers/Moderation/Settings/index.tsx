import React, { useEffect } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Link,
  Skeleton,
  SkeletonProvider,
  Switch,
  Text,
  Textarea,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { CenterLayout, LayoutHeader } from 'components/Layout'

import { useResponsive } from 'hooks/useResponsive'

import { ModerationSettingsForm } from './@types'
import useGetModerationSettings from './hooks/useGetModerationSettings'
import useUpdateModerationSettings from './hooks/useUpdateModerationSettings'
import { reduceCustomBlackList } from './utils'

const blacklistComponents = {
  'inline-link': (
    <Link
      href="https://github.com/web-mech/badwords/blob/master/lib/lang.json"
      variant="unstyled"
      color="accent.base"
      target="_blank"
    />
  ),
}

const ModerationSwitch = ({ value, onChange }) => (
  <Switch isChecked={value} onChange={() => onChange(!value)} />
)

const ModerationSettings = () => {
  const { isMobile } = useResponsive()
  const { settings, initialLoading } = useGetModerationSettings()
  const { updateSettings, loading } = useUpdateModerationSettings()
  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isDirty },
  } = useForm<ModerationSettingsForm>({
    defaultValues: {
      customBlacklist: settings?.customBlacklist?.join(',') || '',
      enableBlacklisting: settings?.enableBlacklisting || false,
      useDefaultBlacklisting: settings?.useDefaultBlacklisting || false,
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        customBlacklist: settings.customBlacklist?.join(',') || '',
        enableBlacklisting: settings.enableBlacklisting,
        useDefaultBlacklisting: settings.useDefaultBlacklisting,
      })
    }
  }, [settings, setValue, reset])

  const onSubmit = (data: ModerationSettingsForm) => {
    const newState = {
      customBlacklist: reduceCustomBlackList(data.customBlacklist),
      enableBlacklisting: data.enableBlacklisting,
      useDefaultBlacklisting: data.useDefaultBlacklisting,
    }

    updateSettings(newState)

    // Reset again to clean the dirty state
    reset({
      ...newState,
      customBlacklist: data.customBlacklist || '',
    })
  }

  const isSubmitDisabled = loading || !isDirty

  return (
    <CenterLayout maxW="2xl" px={[0, 8]}>
      {!isMobile && (
        <LayoutHeader h="auto" pb={0}>
          <Text textStyle="bold/2xlarge">
            <Trans
              i18nKey="admin:moderation.settings.title"
              defaults="Moderation settings"
            />
          </Text>
        </LayoutHeader>
      )}
      <Card mt={8}>
        <Text textStyle="semibold/xlarge">
          <Trans
            i18nKey="admin:moderation.settings.blocklist"
            defaults="Blocklist"
          />
        </Text>
        <SkeletonProvider loading={Boolean(initialLoading)}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Skeleton>
              <FormControl mt={6} display="flex" alignItems="center">
                <Controller
                  control={control}
                  name="enableBlacklisting"
                  data-testid="moderation-settings-enable-blocklist"
                  render={ModerationSwitch}
                />
                <FormLabel
                  fontWeight="regular"
                  htmlFor="enableBlacklisting"
                  mb={1}
                  ml={3}
                >
                  <Trans
                    i18nKey="admin:moderation.settings.enableBlacklist"
                    defaults="Enable blocklist"
                  />
                </FormLabel>
              </FormControl>
            </Skeleton>
            <Skeleton>
              <FormControl mt={4} display="flex" alignItems="center">
                <Controller
                  control={control}
                  data-testid="moderation-settings-use-default-blacklisting"
                  name="useDefaultBlacklisting"
                  render={ModerationSwitch}
                />
                <FormLabel
                  fontWeight="regular"
                  htmlFor="useDefaultBlacklisting"
                  mb={1}
                  ml={3}
                >
                  <Trans
                    i18nKey="admin:moderation.settings.useDefaultBlacklisting"
                    defaults="Include list of <inline-link>common profane words</inline-link>"
                    components={blacklistComponents}
                  />
                </FormLabel>
              </FormControl>
            </Skeleton>
            <Skeleton>
              <FormControl mt={4}>
                <FormLabel htmlFor="customBlacklist">
                  <Trans
                    i18nKey="admin:moderation.settings.customBlacklistLabel"
                    defaults="Additional words to blocklist"
                  />
                </FormLabel>
                <Controller
                  control={control}
                  name="customBlacklist"
                  data-testid="moderation-settings-custom-list"
                  maxWidth="xl"
                  as={<Textarea />}
                />
                <FormHelperText mt={0}>
                  <Trans
                    i18nKey="admin:moderation.settings.customBlacklistCaption"
                    defaults="Separate each word by a new line or comma"
                  />
                </FormHelperText>
              </FormControl>
            </Skeleton>

            <VStack align="stretch">
              <Button
                isLoading={loading}
                isDisabled={isSubmitDisabled}
                mt={6}
                buttonType="primary"
                type="submit"
                data-testid="moderation-settings-update-button"
                alignSelf="flex-end"
              >
                <Trans i18nKey="admin:update" defaults="Update" />
              </Button>
            </VStack>
          </Box>
        </SkeletonProvider>
      </Card>
    </CenterLayout>
  )
}

export default ModerationSettings
