import React from 'react'

import {
  TribeComposerReadonly,
  TribeComposerReadonlyProps,
} from 'containers/Post/TribeComposerReadonly'

export const QuestionPostContent = (props: TribeComposerReadonlyProps) => {
  return <TribeComposerReadonly {...props} fieldValue="description" />
}
