import React from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { useToken } from '@chakra-ui/system'
import NextLink from 'next/link'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartsTooltip,
} from 'recharts'
import ArrowDownLineIcon from 'remixicon-react/ArrowDownLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'
import ArrowUpLineIcon from 'remixicon-react/ArrowUpLineIcon'
import SubtractLineIcon from 'remixicon-react/SubtractLineIcon'

import {
  Emoji as EmojiType,
  Media,
  PaginatedSpace,
  Post,
  Space,
  SpaceMember,
} from 'tribe-api/interfaces'
import { Avatar, Icon } from 'tribe-components'
import { formatCount, Trans } from 'tribe-translation'

import { stripHtml } from 'containers/AdminSettings/utils/strip'
import { getPostFieldValue } from 'containers/Post/utils'

import { getPostUserInfo } from 'utils/user'

export interface SpaceTableData {
  entity: {
    id: string
    slug: string
    name: string
    image: EmojiType
  }
  trend: {
    name: string
    members: number
    xAxis: number
  }[]
  members: number
  posts: number
  reactions: number
  previousReactions: number
  previousPosts: number
  previousMembers: number
}

const getChangeColor = (firstValue: number, secondValue: number) => {
  if (firstValue > secondValue) {
    return 'success.base'
  }
  return firstValue === secondValue ? 'placeholder' : 'danger.base'
}

const TrendTooltip = ({ payload, active }) => {
  if (active && payload && payload.length) {
    const { color, value, payload: detailedPayload = {} } = payload[0]
    return (
      <Box bg="bg.base" p="2" boxShadow="md" borderRadius="md">
        <Text textStyle="medium/small">{detailedPayload.name}</Text>
        <Box mt="1">
          <Flex align="center">
            <Text marginLeft={2} color="label.secondary">
              <Trans i18nKey="analytics:trend" defaults="Trend" />
            </Text>
            <Text marginLeft={1} color={color}>
              {value}
            </Text>
          </Flex>
        </Box>
      </Box>
    )
  }

  return null
}

const TrendColumn = ({ trend, withToolTip = false }) => {
  const firstValue = trend[0]?.trend
  const secondValue = trend.length > 0 ? trend[trend.length - 1]?.trend : 0
  const [lineColor] = useToken('colors', [
    getChangeColor(secondValue || 0, firstValue || 0),
  ])

  return (
    <Flex alignItems="center">
      <ResponsiveContainer width="90%" height={30}>
        <LineChart
          data={trend}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          {withToolTip ? (
            <ChartsTooltip
              content={TrendTooltip}
              cursor={{
                stroke: '#C6C6D2',
                strokeDasharray: '5 5',
              }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="trend"
            name="Trend"
            dot={false}
            activeDot={false}
            strokeWidth={2}
            stroke={lineColor}
          />
        </LineChart>
      </ResponsiveContainer>
    </Flex>
  )
}

export const topSpacesColumns = [
  {
    id: 'name',
    title: <Trans i18nKey="analytics:name" defaults="Name" />,
    getColumnProps: () => ({
      flexGrow: 1,
      flexBasis: '25%',
      overflow: 'hidden',
    }),
    customCell: ({ original }: { original: SpaceTableData }) => {
      const { entity } = original
      if (!entity) return null

      const space = entity as Space
      return (
        <Flex alignItems="center">
          <Box mr="3">
            <Avatar src={space?.image} size="lg" name={space?.name} />
          </Box>
          <NextLink href={`/${space.slug}/posts`} passHref>
            <Link>
              <Text textStyle="medium/medium" color="label.primary">
                {space.name}
              </Text>
            </Link>
          </NextLink>
        </Flex>
      )
    },
  },
  {
    title: <Trans i18nKey="analytics:trend" defaults="Trend" />,
    id: 'trend',
    customCell: ({ original }: { original: SpaceTableData }) => {
      const { trend = [] } = original
      if ((trend || []).length === 0) return null
      return <TrendColumn trend={trend} />
    },
  },
  {
    id: 'members',
    title: <Trans i18nKey="analytics:members" defaults="Members" />,
    customCell: ({ original }: { original: SpaceTableData }) => (
      <ChangeValue
        value={original.members}
        previousValue={original.previousMembers}
      />
    ),
  },
  {
    id: 'posts',
    title: <Trans i18nKey="analytics:posts" defaults="Posts" />,
    customCell: ({ original }: { original: SpaceTableData }) => (
      <ChangeValue
        value={original.posts}
        previousValue={original.previousPosts}
      />
    ),
  },
  {
    id: 'reactions',
    title: <Trans i18nKey="analytics:reactions" defaults="Reactions" />,
    customCell: ({ original }: { original: SpaceTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.reactions}
          previousValue={original.previousReactions}
        />
        {original.entity && (
          <NextLink href={`/${original.entity.slug}/posts`} passHref>
            <Link textStyle="regular/small" color="label.primary" mr={1} ml={1}>
              <Icon
                as={ArrowRightSLineIcon}
                h="4"
                w="4"
                color="label.secondary"
              />
            </Link>
          </NextLink>
        )}
      </Flex>
    ),
  },
]

export interface PostTableData {
  entity: {
    shortContent: string
    postTitle?: string
    owner: SpaceMember
    space: Space
    id: string
    isAnonymous: boolean
  }
  previousReactions: number
  previousReplies: number
  previousViews: number
  reactions: number
  replies: number
  views: number
}

export const topPostsColumns = [
  {
    id: 'post',
    title: <Trans i18nKey="analytics:post" defaults="Post" />,
    getColumnProps: () => ({
      flexGrow: 1,
      flexBasis: '25%',
      overflow: 'hidden',
    }),
    customCell: ({ original }: { original: PostTableData }) => {
      const { entity } = original
      if (!entity) return null
      const { space, owner, isAnonymous } = entity
      const userInfo = getPostUserInfo(owner.member, isAnonymous)
      const title = getPostFieldValue(entity as Post, 'title')
      return (
        <Box>
          <Flex alignItems="center">
            <Avatar
              name={userInfo.name}
              src={userInfo.profilePicture}
              size="lg"
            />
            <Box ml={2} maxWidth="90%">
              <NextLink
                href={`/${space?.slug || ''}/post/${original.entity.id}`}
                passHref
              >
                <Link>
                  <Text
                    textStyle="medium/medium"
                    color="label.primary"
                    isTruncated
                  >
                    {stripHtml(title) || '-'}
                  </Text>
                </Link>
              </NextLink>

              <Text
                d="inline-flex"
                mt="1"
                textStyle="regular/small"
                color="label.secondary"
              >
                <Trans i18nKey="analytics:postedBy" defaults="Posted by" />
                <NextLink href={`/member/${owner?.member?.id || ''}`} passHref>
                  <Link
                    mx="2px"
                    textStyle="regular/small"
                    color="label.primary"
                    mr={1}
                    ml={1}
                  >
                    {userInfo.name || ''}
                  </Link>
                </NextLink>
                <Trans i18nKey="analytics:in" defaults="in" />
                {space && (
                  <NextLink href={`/${space.slug}/posts`} passHref>
                    <Link
                      textStyle="regular/small"
                      color="label.primary"
                      mr={1}
                      ml={1}
                    >
                      {space?.name || ''}
                    </Link>
                  </NextLink>
                )}
              </Text>
            </Box>
          </Flex>
        </Box>
      )
    },
  },
  {
    title: <Trans i18nKey="analytics:views" defaults="Views" />,
    accessor: 'views',
    customCell: ({ original }: { original: PostTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.views}
          previousValue={original.previousViews}
        />
      </Flex>
    ),
  },
  {
    title: <Trans i18nKey="analytics:replies" defaults="Replies" />,
    accessor: 'replies',
    customCell: ({ original }: { original: PostTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.replies}
          previousValue={original.previousReplies}
        />
      </Flex>
    ),
  },
  {
    id: 'reactions',
    title: <Trans i18nKey="analytics:reactions" defaults="Reactions" />,
    customCell: ({ original }: { original: PostTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.reactions}
          previousValue={original.previousReactions}
        />
        {original.entity && original.entity.space && (
          <NextLink
            href={`/${original.entity.space.slug || ''}/post/${
              original.entity.id
            }`}
            passHref
          >
            <Link textStyle="regular/small" color="label.primary" mr={1} ml={1}>
              <Icon
                as={ArrowRightSLineIcon}
                h="4"
                w="4"
                color="label.secondary"
              />
            </Link>
          </NextLink>
        )}
      </Flex>
    ),
  },
]

export interface MemberTableData {
  entity: {
    displayName: string
    memberName: string
    id: string
    profilePicture: Media
    spaces: PaginatedSpace
  }
  previousReactions: number
  previousPosts: number
  previousReplies: number
  posts: number
  replies: number
  reactions: number
}
export const topMembersColumns = [
  {
    id: 'member',
    title: <Trans i18nKey="analytics:member" defaults="Member" />,
    getColumnProps: () => ({
      flexGrow: 1,
      flexBasis: '25%',
      overflow: 'hidden',
    }),
    customCell: ({ original }: { original: MemberTableData }) => {
      const { entity } = original
      if (!entity) {
        return null
      }
      const { displayName, memberName, profilePicture, spaces, id } = entity
      const { totalCount = 0, nodes = [] } = spaces || {}
      return (
        <Box>
          <Flex alignItems="center">
            <Avatar name={memberName} src={profilePicture} size="lg" />
            <Box ml={2}>
              <NextLink href={`/member/${id}`} passHref>
                <Link>
                  <Text
                    textStyle="medium/medium"
                    color="label.primary"
                    isTruncated
                  >
                    {memberName || displayName || (
                      <Trans i18nKey="analytics:noName" defaults="No Name" />
                    )}
                  </Text>
                </Link>
              </NextLink>

              <Text
                d="inline-flex"
                mt="1"
                textStyle="regular/small"
                color="label.secondary"
              >
                <Trans i18nKey="analytics:memberOf" defaults="Member of" />
                {totalCount > 0 && nodes?.[0] && (
                  <NextLink href={`/${nodes[0].slug}/posts`} passHref>
                    <Link
                      textStyle="regular/small"
                      color="label.primary"
                      mr={1}
                      ml={1}
                      isTruncated
                      maxW={200}
                    >
                      {nodes[0].name}
                    </Link>
                  </NextLink>
                )}
                {totalCount > 1 && (
                  <Trans i18nKey="analytics:and" defaults="and" />
                )}
                {totalCount === 2 && nodes?.[1] && (
                  <NextLink href={`/${nodes[1].slug}/posts`} passHref>
                    <Link
                      textStyle="regular/small"
                      color="label.primary"
                      mr={1}
                      ml={1}
                    >
                      {nodes[1].name}
                    </Link>
                  </NextLink>
                )}
                {totalCount > 2 && (
                  <Text textStyle="regular/small" color="label.primary" ml={1}>
                    <Trans
                      i18nKey="analytics:otherSpaces"
                      values={{ spaceCount: totalCount - 1 }}
                      defaults="{{spaceCount}} more"
                    />
                  </Text>
                )}
              </Text>
            </Box>
          </Flex>
        </Box>
      )
    },
  },
  {
    title: <Trans i18nKey="analytics:posts" defaults="Posts" />,
    accessor: 'posts',
    customCell: ({ original }: { original: MemberTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.posts}
          previousValue={original.previousPosts}
        />
      </Flex>
    ),
  },
  {
    title: <Trans i18nKey="analytics:replies" defaults="Replies" />,
    accessor: 'replies',
    customCell: ({ original }: { original: MemberTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.replies}
          previousValue={original.previousReplies}
        />
      </Flex>
    ),
  },
  {
    id: 'reactions',
    title: <Trans i18nKey="analytics:reactions" defaults="Reactions" />,
    customCell: ({ original }: { original: MemberTableData }) => (
      <Flex justify="space-between">
        <ChangeValue
          value={original.reactions}
          previousValue={original.previousReactions}
        />
        {original.entity && (
          <NextLink href={`/member/${original.entity.id}`} passHref>
            <Link textStyle="regular/small" color="label.primary" mr={1} ml={1}>
              <Icon
                as={ArrowRightSLineIcon}
                h="4"
                w="4"
                color="label.secondary"
              />
            </Link>
          </NextLink>
        )}
      </Flex>
    ),
  },
]

export const highlightsColumns = [
  {
    id: 'highlight',
    title: <Trans i18nKey="analytics:highlight" defaults="Highlight" />,
    customCell: ({ original }) => (
      <Text color="label.primary" textStyle="regular/medium">
        {original.highlights}
      </Text>
    ),
  },
  {
    id: 'value',
    title: <Trans i18nKey="analytics:value" defaults="Value" />,
    customCell: ({ original }) => (
      <Text
        textAlign="right"
        color="label.secondary"
        textStyle="regular/medium"
      >
        {original.value}
      </Text>
    ),
  },
]

export interface TrendingTopicsData {
  total: number
  previousTotal: number
  entity: {
    title: string
    description?: string
    id: string
    slug: string
  }
}
export const trendingTopicsColumns = [
  {
    id: 'trend',
    title: <Trans i18nKey="analytics:trend" defaults="Trend" />,
    customCell: ({ original }: { original: TrendingTopicsData }) => {
      const { entity, total, previousTotal } = original
      const trend = total >= previousTotal
      return (
        <Flex align="left" alignItems="center">
          <Icon
            as={trend ? ArrowUpLineIcon : ArrowDownLineIcon}
            h="3"
            w="3"
            mr="1"
            color={getChangeColor(total, previousTotal)}
          />
          {entity && (
            <Text color="label.primary" textStyle="regular/medium">
              {stripHtml(entity.title)}
            </Text>
          )}
        </Flex>
      )
    },
  },
  {
    id: 'value',
    title: <Trans i18nKey="analytics:value" defaults="Value" />,
    customCell: ({ original }: { original: TrendingTopicsData }) => (
      <Text
        textAlign="right"
        color="label.secondary"
        textStyle="regular/medium"
      >
        {original.total}
      </Text>
    ),
  },
]

interface ChangeValueProps {
  value: number
  previousValue: number
}

const ChangeValue = ({ value, previousValue }: ChangeValueProps) => {
  const cleanValue = parseInt((value as any) as string, 10) || 0
  const cleanPreValue = parseInt((previousValue as any) as string, 10) || 0

  let icon
  if (cleanValue > cleanPreValue) {
    icon = ArrowUpLineIcon
  } else if (cleanValue < cleanPreValue) {
    icon = ArrowDownLineIcon
  } else {
    icon = SubtractLineIcon
  }
  return (
    <Flex align="center">
      <Text mr="2">{formatCount(cleanValue)}</Text>
      <Icon
        as={icon}
        h="3"
        w="3"
        mr="1"
        color={getChangeColor(cleanValue, cleanPreValue)}
      />
      <Text color={getChangeColor(cleanValue, cleanPreValue)}>
        {formatCount(Math.abs(cleanValue - cleanPreValue))}
      </Text>
    </Flex>
  )
}
