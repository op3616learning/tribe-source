import React, { Fragment, RefObject } from 'react'

import { Link } from 'tribe-components'
import { i18n } from 'tribe-translation'

import { ComposerRefImperativeHandle } from './@types'
import { ComposerMention } from './components/Mention'
import { UNNECESSARY_HTML, UNNECESSARY_HTML_AFTER_EMBED } from './constants'

// @TODO - refactor dom node's type after Quill is properly typed
export const getTextContent = (domNode: any): string => {
  if (!domNode) return ''

  const directTextChild = domNode?.children?.find(({ type }) => type === 'text')

  if (directTextChild) {
    return directTextChild?.data
  }

  return getTextContent(domNode?.children?.[0])
}

// @TODO - refactor dom node's type after Quill is properly typed
export const getDOMContent = (domNode: any): any => {
  if (!domNode) return ''

  // If it's <a> tag
  if (domNode.attribs?.href && domNode.attribs?.rel) {
    return (
      <Link
        color="accent.base"
        href={domNode.attribs?.href}
        rel="norel noopener"
        isExternal
      >
        {getLinkContent(domNode.children[0])}
      </Link>
    )
  }

  if (domNode.attribs?.['data-type'] === 'mention') {
    const mentionId = domNode.attribs['data-id']

    return <ComposerMention id={mentionId} text={getTextContent(domNode)} />
  }

  if (domNode.name === 'li' && domNode.children[0].type === 'text') {
    return <li key={domNode.children[0].data}>{domNode.children[0].data}</li>
  }

  // If it's a text
  if (domNode.type === 'text') {
    return domNode.data
  }

  if (domNode.children?.length) {
    return domNode.children.map((dom, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={index}>{getDOMContent(dom)}</Fragment>
    ))
  }

  return <domNode.name />
}

export const getLinkContent = ({ data, type, name: TagName, ...rest }) => {
  if (type !== 'tag' && type !== 'text') return null

  if (data) return data

  // If it's a nested element (e.g: bolded link - <strong><a></a></strong>)
  return <TagName>{getTextContent(rest)}</TagName>
}

/**
 * Removes Quill's dirt from given HTML content
 * @param {string} inputHTML - Normal HTML
 * @returns {string} HTML without Quill's dirt
 */
export const eliminateUnnecessaryHTML = (inputHTML: string): string => {
  let outputHTML = inputHTML

  // Find a dirt within the content
  const unnecessaryHTML = UNNECESSARY_HTML_AFTER_EMBED.find(html => {
    const htmlIndex = outputHTML.lastIndexOf(html)

    // If found at the end of the given HTML content
    return htmlIndex !== -1 && htmlIndex === outputHTML.length - html.length
  })

  // If found, remove it from end
  if (unnecessaryHTML) {
    outputHTML = inputHTML.slice(0, -unnecessaryHTML.length)
  }

  // Our node version doesn't support `replaceAll`
  if (outputHTML.replaceAll) {
    UNNECESSARY_HTML.forEach(html => {
      outputHTML = outputHTML.replaceAll(html, '')
    })
  }

  return outputHTML
}

/**
 * Callback for document.body clicks.
 * Checks if the clicked element is <a>,
 * navigating out of the page is allowed
 */
export const checkNavigationAllowance = (
  quillRef: RefObject<ComposerRefImperativeHandle>,
) => event => {
  // Get closest link's href attribute
  const closestHref = event.target.closest('a')?.href

  if (
    // If this is a real link
    closestHref &&
    closestHref !== '#' &&
    // And the editor has changes
    quillRef.current?.isTouched() &&
    // If user declines leaving the page
    // eslint-disable-next-line no-alert
    !window.confirm(
      i18n.t('common:unsavedChanges', 'Changes you made may not be saved.'),
    )
  ) {
    event.preventDefault()
  }
}
