import React from 'react'

import { Box, HStack } from '@chakra-ui/react'

import { Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

const OuterAccordionHeader = () => (
  <Box textAlign="left" maxW={['100%', '60%']}>
    <HStack alignItems="center">
      <Text textStyle="regular/medium" mb={2} mr={3}>
        <Trans
          i18nKey="admin.authentication.singleSignon.title"
          defaults="Single sign-on"
        />
      </Text>
    </HStack>
    <Text color="label.secondary" textStyle="regular/small" mt={2}>
      <Trans
        i18nKey="admin.authentication.singleSignon.description"
        defaults="Allow users to register and access the community using their existing credentials on your website or application."
      />

      <Link
        color="label.primary"
        ml={1}
        isExternal
        href="https://community.tribe.so/knowledge-base-2-0/post/oauth2-sso-wsQUqc2rI43ulRi"
      >
        <Trans
          i18nKey="admin:authentication.learnMoreGuide"
          defaults="Learn more"
        />
      </Link>
    </Text>
  </Box>
)

export default OuterAccordionHeader
