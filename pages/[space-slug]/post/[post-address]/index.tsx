import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'
import Router from 'next/router'

import {
  GET_POST,
  GetPostQuery,
  GetPostQueryVariables,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'

import PostContainer from 'containers/Post/PostContainer'
import { decodePostAddress, getPostLink } from 'containers/Post/utils'

import { postSeo } from 'utils/seo.utils'

const PostPage = () => <PostContainer />

PostPage.getInitialProps = async (
  context: NextPageContextApp,
  { isServer },
) => {
  const { apolloClient, query, req } = context
  const postId = decodePostAddress(String(query?.['post-address']))?.id
  const querySpaceSlug = String(query?.['space-slug'])

  const response = await apolloClient?.query<
    GetPostQuery,
    GetPostQueryVariables
  >({
    query: GET_POST,
    fetchPolicy: isServer ? 'network-only' : 'cache-only',
    variables: {
      postId,
    },
  })

  const post = response?.data?.getPost as Post

  if (
    querySpaceSlug &&
    post?.space?.slug &&
    querySpaceSlug !== post.space.slug
  ) {
    const correctURL = req?.url?.replace(
      `/${querySpaceSlug}/`,
      `/${post?.space?.slug}/`,
    ) as string

    if (isServer) {
      context?.res?.writeHead(302, { Location: correctURL }).end()
    } else {
      Router.replace(correctURL)
    }
    return {}
  }

  if (post?.repliedToIds?.[0]) {
    // do not allow to open children posts as a page
    let destination = `/${getPostLink(
      post?.space?.slug,
      post?.repliedTo?.slug,
      post?.repliedToIds?.[0],
    )}`
    if (query?.from) {
      destination = destination.concat(`?from=${query?.from as string}`)
    }

    if (isServer) {
      context?.res?.writeHead(302, { Location: destination }).end()
    } else {
      Router.replace(destination)
    }
    return {}
  }

  return {
    namespacesRequired: ['common', 'userimport', 'post'],
    sidebarKind: SidebarKind.spaces,
    seo: postSeo(post),
  }
}

PostPage.options = {
  ssr: {
    Component: PostPage,
  },
}

export default PostPage
