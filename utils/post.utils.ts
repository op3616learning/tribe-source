import { Post } from 'tribe-api'

export const getPostAttachments = (post?: Post) =>
  post?.attachments?.map(
    ({ id, size, extension = 'jpg', name, url, downloadUrl }) => ({
      id,
      name: name || '',
      url,
      downloadUrl: downloadUrl || url,
      size: size || 0,
      extension,
    }),
  ) || []
