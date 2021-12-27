import React, { useMemo, useState } from 'react'

import { HStack, ModalFooter, VStack } from '@chakra-ui/react'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Divider,
  TextareaInput,
  Button,
  RadioGroup,
  Radio,
  ModalHeader,
  ModalCloseButton,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

export interface UninstallModalProps {
  appName: string
  isVisible?: boolean
  onClose: () => void
  onUninstall: (reason: string) => void
}

const UninstallModal: React.FC<UninstallModalProps> = ({
  appName,
  isVisible = false,
  onClose,
  onUninstall,
}) => {
  const { t } = useTranslation()

  const OPTIONS = useMemo(
    () => [
      t(
        'apps:app.modals.uninstall.reasons.testing',
        'I was just testing it out',
      ),
      t(
        'apps:app.modals.uninstall.reasons.switch',
        'I switched to another similar app',
      ),
      t(
        'apps:app.modals.uninstall.reasons.functionality',
        'Its functionality is limited',
      ),
      t('apps:app.modals.uninstall.reasons.broken', "It doesn't work"),
      t('apps:app.modals.uninstall.reasons.other', 'Other'),
    ],
    [],
  )

  const [reason, setReason] = useState<string>()
  const [otherReason, setOtherReason] = useState('')
  const shouldDisableUninstall = (!otherReason && reason === 'Other') || !reason
  const handleUninstall = () => {
    if (shouldDisableUninstall) return
    onUninstall(otherReason || reason || '')
  }
  return (
    <>
      <Modal
        isOpen={isVisible}
        onClose={onClose}
        isCentered
        size="xl"
        data-testid="app-uninstall-modal"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <VStack spacing={2} alignItems="baseline">
                <HStack>
                  <Text textStyle="semibold/xlarge" color="label.primary">
                    <Trans
                      i18nKey="apps:app.modals.uninstall.uninstall"
                      defaults="Uninstall"
                    />
                  </Text>
                  <Text textStyle="semibold/xlarge" color="label.primary">
                    {`${appName}?`}
                  </Text>
                </HStack>
                <Text textStyle="regular/medium" color="label.primary">
                  <Trans
                    i18nKey="apps:app.modals.uninstall.warning"
                    defaults="Are you sure you want to uninstall this app? This cannot be undone and all of your related data will be removed."
                  />
                </Text>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="6" alignItems="start">
                <Divider />
                <Text textStyle="medium/medium" color="label.primary">
                  <Trans
                    i18nKey="apps:app.modals.uninstall.reason"
                    defaults="Tell us the reason for uninstalling it"
                  />
                </Text>
                <RadioGroup value={reason} onChange={setReason}>
                  <VStack alignItems="baseline">
                    {OPTIONS.map(opt => (
                      <Radio color="danger" key={opt} value={opt}>
                        {opt}
                      </Radio>
                    ))}
                  </VStack>
                </RadioGroup>
                {reason === 'Other' && (
                  <TextareaInput
                    placeholder={t(
                      'apps:app.modals.uninstall.otherPlaceholder',
                      'I was expecting/ I encountered an issue with ...',
                    )}
                    value={otherReason}
                    onChange={e => setOtherReason(e.target.value)}
                  />
                )}
                <Divider />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing="2" alignSelf="flex-end">
                <Button onClick={onClose} buttonType="secondary" size="sm">
                  <Trans
                    i18nKey="apps:app.modals.uninstall.cancel"
                    defaults="Cancel"
                  />
                </Button>
                <Button
                  data-testid="app-uninstall-btn"
                  onClick={handleUninstall}
                  isDisabled={shouldDisableUninstall}
                  buttonType="danger"
                  size="sm"
                >
                  <Trans
                    i18nKey="apps:app.modals.uninstall.uninstall"
                    defaults="Uninstall"
                  />
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default UninstallModal
