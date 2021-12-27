import { useCallback, useState } from 'react'

import { Box, Flex } from '@chakra-ui/layout'

import { GET_NETWORK_INFO } from 'tribe-api/graphql'
import { hasActionPermission, hasInputPermission } from 'tribe-api/permissions'
import { Accordion, Switch, UserBar } from 'tribe-components'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { useNeo } from 'hooks/useNeo'
import useUpdateNetwork from 'hooks/useUpdateNetwork'

export const NeoCommunityWhiteLabel = () => {
  const { isNeo } = useNeo()
  const { network } = useGetNetwork()
  const [tribeBranding, setTribeBranding] = useState(network?.tribeBranding)

  const { actionPermission: updateNetworkPermissions } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateNetwork',
  )

  const { authorized: canChangeWhiteLabel } = hasInputPermission(
    updateNetworkPermissions?.inputPermissions || [],
    'input.tribeBranding',
  )

  const { updateNetwork, loading: updateNetworkLoading } = useUpdateNetwork({
    mutationOptions: {
      onCompleted: data => {
        setTribeBranding(data?.updateNetwork?.tribeBranding)
      },
      refetchQueries: [
        {
          query: GET_NETWORK_INFO,
        },
      ],
    },
  })

  const handleToggle = useCallback(() => {
    const newValue = !tribeBranding
    setTribeBranding(newValue)
    updateNetwork({
      tribeBranding: newValue,
    })
  }, [updateNetwork, tribeBranding, setTribeBranding])

  if (isNeo !== true || !canChangeWhiteLabel) return null

  return (
    <Box>
      <Accordion title="White Label" defaultIndex={0}>
        <Box pb={4}>
          <Flex>
            <UserBar
              withPicture={false}
              title="Display Tribe branding"
              subtitle="Display a “Powered by Tribe” badge on the community navigation and email footers"
            />
            <Switch
              isDisabled={updateNetworkLoading}
              isChecked={tribeBranding}
              onChange={handleToggle}
            />
          </Flex>
        </Box>
      </Accordion>
    </Box>
  )
}
