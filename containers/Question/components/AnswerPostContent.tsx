import React from 'react'

import {
  TribeComposerReadonly,
  TribeComposerReadonlyProps,
} from 'containers/Post/TribeComposerReadonly'

export const AnswerPostContent = (props: TribeComposerReadonlyProps) => {
  return <TribeComposerReadonly {...props} fieldValue="answer" />
}
