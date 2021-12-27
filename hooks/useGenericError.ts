import { useCallback } from 'react'

import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

const useGenericError = () => {
  const { t } = useTranslation()
  const toast = useToast()

  return useCallback(
    () => {
      toast({
        title: t('common.error.title', 'Error'),
        description: t(
          'common.error.description',
          'Something went wrong, please try again.',
        ),
        status: 'error',
      })
    },

    // `t` function is different each time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast],
  )
}

export default useGenericError
