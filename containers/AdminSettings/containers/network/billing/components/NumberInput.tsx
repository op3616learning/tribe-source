import React from 'react'

import { HStack } from '@chakra-ui/layout'
import { Input, useNumberInput } from '@chakra-ui/react'
import AddLineIcon from 'remixicon-react/AddLineIcon'
import SubtractLineIcon from 'remixicon-react/SubtractLineIcon'

import { Icon, IconButton, InputProps } from 'tribe-components'

export type NumberInputProps = Omit<InputProps, 'onChange'> & {
  value: number
  min: number
  max: number
  step?: number
  onChange?: (valueAsString: string, valueAsNumber: number) => void
}
export const NumberInput = ({
  min,
  max,
  value,
  step = 1,
  onChange,
  ...rest
}: NumberInputProps) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    defaultValue: value,
    step,
    min,
    max,
    onChange,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps(rest)

  const length = input?.['aria-valuenow']?.toPrecision().length || 1
  // 7px is a reasonable addition in width for every character increase.(9 to 11)
  const inputWidth = length > 1 ? `${36 + (length - 1) * 7}px` : '36px'

  return (
    <HStack bg="bg.secondary" borderRadius="md" p={1} spacing={0}>
      <IconButton
        data-testid="decrease-button"
        icon={<Icon as={SubtractLineIcon} />}
        aria-label="-"
        variant="ghost"
        size="sm"
        {...dec}
      />
      <Input {...input} width={inputWidth} bg="bg.base" transition="none" />
      <IconButton
        data-testid="increase-button"
        icon={<Icon as={AddLineIcon} />}
        aria-label="+"
        variant="ghost"
        size="sm"
        {...inc}
      />
    </HStack>
  )
}
