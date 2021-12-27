import React, { useEffect } from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { Media } from 'tribe-api/interfaces'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  ImageUpload,
  Link,
  TextInput,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useCreateImages from 'hooks/useCreateImages'

import useGetNetwork from '../../Network/useGetNetwork'

export interface EditMemberFormInput {
  profilePictureId: string | null
  name: string | null
  tagline: string | null
  email: string | null
}

const imageUploadProps = {
  skeletonProps: {
    w: 'full',
    h: 'full',
  },
}

interface DefaultValuesType extends Partial<EditMemberFormInput> {
  profilePicture?: Media | null
}
export interface EditMemberFormProps {
  defaultValues?: DefaultValuesType
  onSubmit: (data: EditMemberFormInput) => Promise<void>
  loading?: boolean
}

export const EditMemberForm = ({
  defaultValues,
  onSubmit,
  loading = false,
}: EditMemberFormProps) => {
  const { t } = useTranslation()

  const { network } = useGetNetwork()
  const settingsUrl = network?.activeSso?.settingsUrl
  const { upload, isUploading } = useCreateImages()
  const { register, handleSubmit, errors, setValue } = useForm<
    Partial<EditMemberFormInput>
  >({
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (!loading && defaultValues?.name) {
      ;['name', 'email', 'role', 'tagline', 'profilePicture'].forEach(key => {
        setValue(key, defaultValues[key])
      })
    }
  }, [defaultValues, loading, setValue])

  const onFileChange = async (files: FileList) => {
    const result = await upload(Array.from(files).map(f => ({ imageFile: f })))
    const { mediaId } = (result && result[0]) || {}

    setValue('profilePictureId', mediaId)
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" align="start">
        <FormControl>
          <input
            type="hidden"
            ref={register()}
            name="profilePictureId"
            value={defaultValues?.profilePicture?.id}
          />
          <FormLabel>
            <Trans
              i18nKey="member:edit.form.profileImage"
              defaults="Profile Image"
            />
          </FormLabel>
        </FormControl>

        <ImageUpload
          src={defaultValues?.profilePicture || ''}
          name=""
          size="full"
          onFileChange={onFileChange}
          variant="avatar"
          {...imageUploadProps}
        />

        <FormControl>
          <FormHelperText>
            <Trans
              i18nKey="member:edit.form.image.helper"
              defaults="Recommended size of at least 400x400 px."
            />
          </FormHelperText>
        </FormControl>

        <TextInput
          name="name"
          data-testid="name"
          label={t('settings:general.member.name', 'Name')}
          ref={register({
            required: {
              value: true,
              message: t(
                'common:validation.empty',
                "This field can't be empty",
              ),
            },
          })}
          error={errors?.name?.message}
        />

        <TextInput
          name="tagline"
          label={t('settings:general.member.tagline', 'Tagline')}
          ref={register()}
          error={errors?.tagline?.message}
        />

        <TextInput
          name="email"
          isDisabled={true || settingsUrl}
          label={
            <>
              <span>Email</span>
              {settingsUrl && (
                <Link
                  variant="primary"
                  color="accent.base"
                  isExternal
                  href={settingsUrl}
                >
                  Edit email
                </Link>
              )}
            </>
          }
          labelProps={{
            mx: 0,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: settingsUrl ? '1 !important' : '1',
          }}
          ref={register({
            required: {
              value: true,
              message: t(
                'common:validation.empty',
                "This field can't be empty",
              ),
            },
          })}
          error={errors?.email?.message}
        />

        <HStack>
          <Button disabled={isUploading} type="submit" buttonType="primary">
            <Trans i18nKey="common:save" defaults="Save" />
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
