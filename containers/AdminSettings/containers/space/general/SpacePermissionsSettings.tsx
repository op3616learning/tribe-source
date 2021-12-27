import React, { useCallback } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { Controller, useForm } from 'react-hook-form'

import { SpaceQuery } from 'tribe-api/graphql'
import { SpaceRoleType } from 'tribe-api/interfaces'
import {
  FormControl,
  Button,
  Select,
  FormLabel,
  Accordion,
  Skeleton,
} from 'tribe-components'

import SettingsGroupHeader from 'containers/AdminSettings/components/SettingsGroupHeader'
import { useUpdateSpace } from 'containers/Space/hooks/useUpdateSpace'

export type SpacePermissionFormValues = {
  whoCanPost: { id: string }
  whoCanReactAndComment: { id: string }
}

const whoCanOptions = {
  everyone: 'Admin and Members',
  admin: 'Admin Only',
}

const options = Object.entries(whoCanOptions).map(([, label]) => ({
  label,
  // the value must be an object otherwise select component does not work :|
  value: { id: label },
}))

const optionParser = (whoCanDo?: string[] | null): { id: string } => {
  if (Array.isArray(whoCanDo)) {
    // we don't need this option for now but it could be added back to the `whoCanOptions`
    // if (whoCanDo?.length === 0) return { id: 'nobody' }
    if (whoCanDo.length > 0) return { id: whoCanOptions.admin }
  }

  // null means everyone
  // default is everyone for the time being
  return { id: whoCanOptions.everyone }
}

const optionRevertParser = (
  id: string,
  adminRole: string,
): Array<string> | null => {
  switch (id) {
    // case 'nobody':
    //   return []
    case whoCanOptions.admin:
      return [adminRole]
    case whoCanOptions.everyone:
    default:
      return null
  }
}

export const SpacePermissionSettings = ({
  space,
}: {
  space: SpaceQuery['space']
}) => {
  const { updateSpace, loading: updatingSpace } = useUpdateSpace({
    spaceId: space?.id,
  })

  const onSubmit = useCallback(
    async (data: SpacePermissionFormValues) => {
      const adminRoleId =
        space?.roles?.find(r => r.type === SpaceRoleType.ADMIN)?.id || ''
      const whoCanPost = optionRevertParser(data.whoCanPost.id, adminRoleId)
      const whoCanReact = optionRevertParser(
        data.whoCanReactAndComment.id,
        adminRoleId,
      )
      const payload = {
        whoCanPost,
        whoCanReact,
        whoCanReply: whoCanReact,
      }

      await updateSpace(payload)
    },
    [updateSpace, space.roles],
  )

  const { handleSubmit, control, errors } = useForm<SpacePermissionFormValues>({
    defaultValues: {
      whoCanPost: optionParser(space?.whoCanPost),
      whoCanReactAndComment: optionParser(space?.whoCanReact),
    },
  })

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <SettingsGroupHeader>Permissions</SettingsGroupHeader>
      <Skeleton>
        <Global
          styles={`
          [data-id=permissions-accordion] + .chakra-collapse {
            overflow: visible !important;
          }
        `}
        />
        <Accordion
          title="Permissions"
          headerProps={{
            'data-id': 'permissions-accordion',
          }}
        >
          <VStack spacing={3}>
            <FormControl id="whoCanPost" isInvalid={!!errors.whoCanPost}>
              <FormLabel htmlFor="whoCanPost">Who can post?</FormLabel>
              <Controller
                control={control}
                name="whoCanPost"
                defaultValue={null}
                render={({ name, onChange, value, onBlur }) => (
                  <Select
                    placement="bottom-end"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    options={options}
                  />
                )}
              />
            </FormControl>
            <FormControl
              id="whoCanReactAndComment"
              isInvalid={Boolean(errors.whoCanReactAndComment)}
            >
              <FormLabel htmlFor="whoCanReactAndComment">
                Who can react and comment?
              </FormLabel>
              <Controller
                control={control}
                name="whoCanReactAndComment"
                render={({ name, onChange, onBlur, value }) => (
                  <Select
                    placement="bottom-end"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    options={options}
                    value={value}
                  />
                )}
              />
            </FormControl>
            <Button
              alignSelf="flex-start"
              isLoading={updatingSpace}
              buttonType="primary"
              isDisabled={updatingSpace}
              type="submit"
            >
              Update
            </Button>
          </VStack>
        </Accordion>
      </Skeleton>
    </Box>
  )
}
