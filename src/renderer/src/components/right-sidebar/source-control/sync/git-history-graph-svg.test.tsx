import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { GitHistoryItem } from '../../../../../../shared/git-history'
import { buildGitHistoryViewModels } from '../../../../../../shared/git-history-graph'
import { GitHistoryGraphSvg } from './git-history-graph-svg'

/** Minimal history item whose subject, message and display id all reuse its id. */
function item(id: string, parentIds: string[]): GitHistoryItem {
  return { id, parentIds, subject: id, message: id, displayId: id, references: [] }
}

/** Extracts every SVG path `d` attribute from rendered markup, in document order. */
function pathsOf(markup: string): string[] {
  return [...markup.matchAll(/ d="([^"]+)"/g)].map((match) => match[1]!)
}

describe('GitHistoryGraphSvg', () => {
  it('draws a lane that follows a root commit through the root row', () => {
    const viewModels = buildGitHistoryViewModels([
      item('M', ['V', 'A']),
      item('V', []),
      item('A', ['B']),
      item('B', [])
    ])
    const rootRow = viewModels[1]!
    expect(rootRow.inputSwimlanes.map((lane) => lane.id)).toEqual(['V', 'A'])
    expect(rootRow.outputSwimlanes.map((lane) => lane.id)).toEqual(['A'])

    const paths = pathsOf(
      renderToStaticMarkup(React.createElement(GitHistoryGraphSvg, { viewModel: rootRow }))
    )

    // A enters at lane 1 (x=22) and must shift into output lane 0 (x=11) beside the ended root.
    expect(paths.some((d) => d.startsWith('M 22 0 V 6') && d.endsWith('V 24'))).toBe(true)
  })
})
