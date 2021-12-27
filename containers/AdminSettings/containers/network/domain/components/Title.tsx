import React, { ReactNode } from 'react'

import { HStack } from '@chakra-ui/react'

import { Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface TitleProps {
  children: ReactNode
  subdomain: string
}

const Title: React.FC<TitleProps> = ({ children, subdomain }) => (
  <>
    <Text mb={1} textStyle="regular/medium">
      {children}
    </Text>

    <HStack>
      <Text color="label.secondary" mb={7} textStyle="regular/small">
        {subdomain}.
        <Link
          color="label.primary"
          ml={1}
          isExternal
          href="https://community.tribe.so/knowledge-base-2-0/post/GN59yUKKHrgKdBX"
        >
          <Trans
            i18nKey="admin:domain.changeDomainGuide"
            defaults="Learn how to change your domain"
          />
        </Link>
      </Text>
    </HStack>
  </>
)

export default Title
