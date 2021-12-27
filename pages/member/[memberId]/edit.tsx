import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'
import Router, { useRouter } from 'next/router'

import { GET_MEMBER_BY_ID } from 'tribe-api/graphql'
import { Member, RoleType } from 'tribe-api/interfaces'

import EditMemberContainer from 'containers/Member/EditMemberContainer'

import { memberSeo } from 'utils/seo.utils'

import Error from '../../../containers/Error'

const EditMemberPage = () => {
  const router = useRouter()
  const { memberId } = router.query

  if (typeof memberId === 'string') {
    return <EditMemberContainer memberId={memberId} />
  }

  return <Error />
}

EditMemberPage.getInitialProps = async (
  context: NextPageContextApp,
  { isServer },
) => {
  const { apolloClient, query, authToken, res } = context || {}
  const { memberId } = query || {}

  const { role } = authToken || {}
  if (role?.type === RoleType.GUEST) {
    if (isServer) {
      res?.writeHead(302, { Location: '/403' }).end()
    } else {
      Router.replace('/403')
    }
    return {}
  }

  const response = await apolloClient?.query({
    query: GET_MEMBER_BY_ID,
    fetchPolicy: isServer ? 'network-only' : 'cache-first',
    variables: {
      memberId,
    },
  })
  const data = response?.data

  const member = data?.getMember as Member
  return {
    namespacesRequired: ['common', 'settings', 'member'],
    sidebarKind: SidebarKind.member,
    seo: memberSeo(member),
  }
}

export default EditMemberPage
