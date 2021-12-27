import { useEffect, useState } from 'react'

import { singletonHook } from 'react-singleton-hook'

const useNeoImpl = () => {
  const [isNeo, setIsNeo] = useState<boolean>()

  useEffect(() => {
    fetch('/.well-known/is-neo')
      .then(res => res.text())
      .then(status => {
        setIsNeo(status === 'true')
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log({ e })
        setIsNeo(false)
      })
  }, [])

  return {
    isNeo,
  }
}

export const useNeo = singletonHook({ isNeo: undefined }, useNeoImpl)
