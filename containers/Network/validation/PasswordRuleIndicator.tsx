import React from 'react'

import CheckIcon from 'remixicon-react/CheckLineIcon'
import CloseIcon from 'remixicon-react/CloseLineIcon'

import { FormHelperText, Icon } from 'tribe-components'

const PasswordRuleIndicator = (props: {
  isTouched: boolean
  isValid: boolean
  errorCode: string
  type: string
}) => {
  const { isTouched, isValid, errorCode, type } = props
  return (
    <FormHelperText
      style={{
        color: (isTouched && (isValid ? 'green' : 'red')) || 'inherit',
      }}
      data-testid={`${type}`}
    >
      <Icon
        mr={1}
        as={isValid && isTouched ? CheckIcon : CloseIcon}
        data-testid={`icon-${!!isValid}`}
      />
      {errorCode}
    </FormHelperText>
  )
}

export default PasswordRuleIndicator
