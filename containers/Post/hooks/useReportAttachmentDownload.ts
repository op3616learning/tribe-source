import { useCallback } from 'react'

import { Post } from 'tribe-api/interfaces'

import useGetNetwork from 'containers/Network/useGetNetwork'

import tracker from 'lib/snowplow'

export const useReportAttachmentDownload = (post: Post | null) => {
  const { network } = useGetNetwork()

  const onAttachmentDownload = useCallback(() => {
    if (!post?.id || !network?.id) return

    tracker.track(
      'Download Post Attachment',
      {},
      {
        networkId: network?.id,
        postId: post.id,
        spaceId: post.spaceId,
      },
    )
  }, [network, post])

  return onAttachmentDownload
}
