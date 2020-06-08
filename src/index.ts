import remark  from 'remark'

import remarkMDX from 'remark-mdx'

const remarkLint = require('remark-lint');
const remarkLintRequireBlockQuoteIntendation = require('remark-lint-blockquote-indentation')
const remarkLintCheckboxCharacterStyle = require('remark-lint-checkbox-character-style')
const remarkLintCodeBlockStyle = require('remark-lint-code-block-style')
const remarkLintFencedCodeMarker = require('remark-lint-fenced-code-marker')
const remarkLintEmphasisMarker = require('remark-lint-emphasis-marker')
const remarkLintStrongMarker = require('remark-lint-strong-marker')

import remarkLintRestrictJsx from './remark-lint-restrict-jsx'

export const remarkPresetLintPlayMdx = [
  remarkLint,
  [remarkLintRequireBlockQuoteIntendation, 2],
  [remarkLintCheckboxCharacterStyle, {checked:'x', unchecked:' '}],
  [remarkLintCodeBlockStyle, 'fenced'],
  [remarkLintFencedCodeMarker, '`'],
  [remarkLintEmphasisMarker, '_'],
  [remarkLintStrongMarker, '*'] 
]

export const remarkLintPlayMdx = (accept?:string[]) => remark()
  .use(remarkPresetLintPlayMdx)
  .use(remarkLintRestrictJsx, accept)
  .use(remarkMDX)

